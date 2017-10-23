import { PlayerService } from './../player/player.service';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { GameState, GameOverState } from './../game-state/game-state';
import { Injectable } from '@angular/core';

@Injectable()
export class ConnectFourService {
  gameState: BehaviorSubject<GameState> = new BehaviorSubject(new GameState());

  constructor(private _playerService: PlayerService) { }

  startGame() {
    let currentPlayer = 1;
    while (this.gameState.getValue().gameOverState === GameOverState.NOT_OVER) {
      const playerMove = this._playerService.getMove(currentPlayer, this.gameState.getValue().board);
      this.gameState.getValue().playMove(playerMove, currentPlayer);
      currentPlayer = currentPlayer === 1 ? 2 : 1;
      this.gameState.next(this.gameState.getValue());
    }
  }
}
