import { SandboxService } from './../sandbox/sandbox.service';
import { Observable } from 'rxjs/Observable';
import { AngularFireAuth } from 'angularfire2/auth';
import { PlayerService } from './../player/player.service';
import { Player } from './../player/player';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { GameState, GameOverState, BoardSpace } from './../game-state/game-state';
import { Injectable } from '@angular/core';
import 'rxjs/add/operator/take';

@Injectable()
export class ConnectFourService {
  // initialized: BehaviorSubject<boolean> = new BehaviorSubject(false);
  piecePlayed: BehaviorSubject<[number, number, number]> = new BehaviorSubject(null);
  gameState: BehaviorSubject<GameState> = new BehaviorSubject(new GameState());
  players: BehaviorSubject<Player[]> = new BehaviorSubject([]);
  playerTimers: number[] = [null, null];

  currentPlayer = 1;
  startingPlayer = 1;


  constructor(
    private _playerService: PlayerService,
    private _afAuth: AngularFireAuth,
    private _sandbox: SandboxService
  ) {
    this.players.next([new Player(), new Player()]);
  }

  init(player1Id: string, player2Id: string, startingPlayer: number) {
    this.setStartingPlayer(startingPlayer);
    this.players.getValue()[0] = this._getDefaultPlayer(player1Id);
    this.players.getValue()[1] = this._getDefaultPlayer(player2Id);
    this.players.next(this.players.getValue());

    this._playerService.getPlayer(player1Id).subscribe(
      player => {
        if (player !== null) {
          this.players.getValue()[0].updateFrom(player);
        }
        this.players.next(this.players.getValue());
      }
    );

    this._playerService.getPlayer(player2Id).subscribe(
      player => {
        if (player !== null) {
          this.players.getValue()[1].updateFrom(player);
        }
        this.players.next(this.players.getValue());
      }
    );
  }

  setStartingPlayer(player: number): void {
    this.startingPlayer = player;
    this.currentPlayer = this.startingPlayer;
  }

  private _getDefaultPlayer(id: string): Player {
    const p = new Player();
    p.id = id;
    p.name = 'Unknown';
    p.code = `function getCode(state, isStartingPlayer) {
  var validMoves = this.getValidMoves(state);
  return validMoves[Math.floor(Math.random() * validMoves.length)];
}`;
    return p;
  }

  resetGame(startingPlayer: number): void {
    this.setStartingPlayer(startingPlayer);
    this.gameState.next(new GameState());
  }

  private _updateGameState(state: GameOverState): void {
    if (state !== this.gameState.getValue().gameOverState) {
      this.gameState.getValue().gameOverState = state;
      this.gameState.next(this.gameState.getValue());
    }
  }

  private _playMove(col: number, player: number): number {
    let playedRow = -1;
    const board = this.gameState.getValue().board;

    if (this._sandbox.isValidMove(board, col)) {
      for (let i = board.length - 1; i >= 0; i--) {
        if (board[i][col] === BoardSpace.EMPTY) {
          playedRow = i;
          board[i][col] = player;
          break;
        }
      }
      this._updateGameState(this._sandbox.checkWin(board));
    } else {
      this._updateGameState(player === 1 ? GameOverState.PLAYER_2_WIN : GameOverState.PLAYER_1_WIN);
    }
    return playedRow;
  }

  private _playerTimerExpired(player: number): void {
    console.log(2);
    this._updateGameState(player === 1 ? GameOverState.PLAYER_1_TIMEOUT : GameOverState.PLAYER_2_TIMEOUT);
  }

  private _clearPlayerTimer(player: number): void {
    clearTimeout(this.playerTimers[player]);
  }

  private _startPlayerTimer(player: number): void {
    this.playerTimers[player] = setTimeout(this._playerTimerExpired.bind(this), 1000, player);
  }

  playTurn(callback: () => any): void {
    let playerBoard = this.gameState.getValue().board;
    if (this.gameState.getValue().gameOverState === GameOverState.NOT_OVER) {
      const player = this.players.getValue()[this.currentPlayer - 1];
      if (this.currentPlayer === 2) {
        const normalizedBoard = [];
        for (let i = 0; i < playerBoard.length; i++) {
          normalizedBoard.push([]);
          for (let j = 0; j < playerBoard[0].length; j++) {
            if (this.gameState.getValue().board[i][j] === 0) {
              normalizedBoard[i].push(0);
            } else {
              normalizedBoard[i].push(playerBoard[i][j] === 1 ? 2 : 1);
            }
          }
        }
        playerBoard = normalizedBoard;
      }

      this._startPlayerTimer(this.currentPlayer);
      player.getMove(playerBoard,
        m => {
          if (this.gameState.getValue().gameOverState === GameOverState.NOT_OVER) {
            const row = this._playMove(m, this.currentPlayer);
            this._clearPlayerTimer(this.currentPlayer);
            this.piecePlayed.next([row, m, this.currentPlayer]);
            this.currentPlayer = this.currentPlayer === 1 ? 2 : 1;
          }
          callback();
        }
      );
    }
  }
}

