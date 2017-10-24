import { SandboxService } from './../sandbox/sandbox.service';
import { Observable } from 'rxjs/Observable';
import { AngularFireAuth } from 'angularfire2/auth';
import { PlayerService } from './../player/player.service';
import { Player } from './../player/player';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { GameState, GameOverState, BoardSpace } from './../game-state/game-state';
import { Injectable } from '@angular/core';

@Injectable()
export class ConnectFourService {
  // initialized: BehaviorSubject<boolean> = new BehaviorSubject(false);
  piecePlayed: BehaviorSubject<[number, number, number]> = new BehaviorSubject(null);
  gameState: BehaviorSubject<GameState> = new BehaviorSubject(new GameState());
  players: BehaviorSubject<Player[]> = new BehaviorSubject([]);
  currentPlayer = 1;


  constructor(
    private _playerService: PlayerService,
    private _afAuth: AngularFireAuth,
    private _sandbox: SandboxService
  ) {
    this.players.next([new Player(), new Player()]);
  }

  init(player1Id: string, player2Id: string) {
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

  private _getDefaultPlayer(id: string): Player {
    const p = new Player();
    p.id = id;
    p.name = 'Unknown';
    p.code = `
function(state) {
  let topRow = state[0];
  let validMoves = [];
  topRow.forEach(function (v, i) {
    if (v === 0) {
      validMoves.push(i);
    }
  });
  return validMoves[Math.floor(Math.random() * validMoves.length)];
}`;
    return p;
  }

  resetGame(): void {
    this.currentPlayer = 1;
    this.gameState.next(new GameState());
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
      this.gameState.getValue().gameOverState = this._sandbox.checkWin(board);
    } else {
      this.gameState.getValue().gameOverState = player === 1 ? GameOverState.PLAYER_2_WIN : GameOverState.PLAYER_1_WIN;
    }
    return playedRow;
  }

  playTurn(): void {
    if (this.gameState.getValue().gameOverState === GameOverState.NOT_OVER) {
      const apiCopy = JSON.parse(JSON.stringify(this._sandbox.api));
      console.log(apiCopy);
      const playerMove = this.players.getValue()[this.currentPlayer - 1].getMove(this.gameState.getValue().board, apiCopy);
      const row = this._playMove(playerMove, this.currentPlayer);
      this.piecePlayed.next([row, playerMove, this.currentPlayer]);
      this.currentPlayer = this.currentPlayer === 1 ? 2 : 1;
      this.gameState.next(this.gameState.getValue());
    }
  }
}

