import { Player } from './player';
import { Injectable } from '@angular/core';
import { BoardSpace } from '../game-state/game-state';

@Injectable()
export class PlayerService {

  players: Player[];

  constructor() {
    this.players = [new Player(), new Player()];  // TODO: query firebase
    this.saveCode(0, `function(state) {
      var topRow = state[0];
      var validMoves = [];
      topRow.forEach(function(v, i) {
        if (v === 0) {
          validMoves.push(i);
        }
      });
      return validMoves[Math.floor(Math.random() * validMoves.length)];
     }`);
    this.saveCode(1, `function(state) {
      var topRow = state[0];
      var validMoves = [];
      topRow.forEach(function(v, i) {
        if (v === 0) {
          validMoves.push(i);
        }
      });
      return validMoves[Math.floor(Math.random() * validMoves.length)];
     }`);
  }

  getMove(player: number, state: BoardSpace[][]): number {
    const stateCopy = JSON.parse(JSON.stringify(state));
    switch (player) {
      case 1:
        return this.getPlayer1Move(state);
      case 2:
        return this.getPlayer2Move(state);
    }
  }

  getPlayer1Move(state): number {
    return 0;
  }

  getPlayer2Move(state): number {
    return 0;
  }

  private _setGetMoveFunction(player: number, code: string): void {
    eval('this.getPlayer' + (player + 1) + 'Move = ' + code + ';');
  }

  saveCode(player: number, code: string): void {
    this.players[player].code = code;
    this._setGetMoveFunction(player, code);
  }

  getCode(player: number): string {
    return this.players[player].code;
  }
}
