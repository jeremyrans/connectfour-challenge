import { AngularFireAuth } from 'angularfire2/auth';
import { PlayerService } from './../player/player.service';
import { Player } from './../player/player';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { GameState, GameOverState } from './../game-state/game-state';
import { Injectable } from '@angular/core';

@Injectable()
export class ConnectFourService {
  // initialized: BehaviorSubject<boolean> = new BehaviorSubject(false);
  gameState: BehaviorSubject<GameState> = new BehaviorSubject(new GameState());
  players: BehaviorSubject<Player[]> = new BehaviorSubject([]);


  constructor(
    private _playerService: PlayerService,
    private _afAuth: AngularFireAuth
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
    this.gameState.next(new GameState());
  }

  startGame(): void {
    let currentPlayer = 1;
    while (this.gameState.getValue().gameOverState === GameOverState.NOT_OVER) {
      const playerMove = this.players.getValue()[currentPlayer - 1].getMove(this.gameState.getValue().board);
      this.gameState.getValue().playMove(playerMove, currentPlayer);
      currentPlayer = currentPlayer === 1 ? 2 : 1;
      this.gameState.next(this.gameState.getValue());
    }
  }
}

