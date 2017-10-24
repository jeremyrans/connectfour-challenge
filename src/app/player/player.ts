import { BoardSpace } from '../game-state/game-state';

export class BasePlayer {
  id: string;
  code: string;
  name: string;
  email: string;
  photoURL: string;
}

export class Player extends BasePlayer {
  private _getMove(state: BoardSpace[][]): number {
    return 0;
  }

  private _setGetMoveFunction(code: string): void {
    eval('this._getMove = ' + code + ';');
  }

  updateFrom(player: BasePlayer): void {
    this.code = player.code;
    this.name = player.name;
    this.email = player.email;
    this.photoURL = player.photoURL;
  }

  getMove(state: BoardSpace[][], sandbox: any, normalize: boolean): number {
    this._setGetMoveFunction(this.code);
    let stateCopy = JSON.parse(JSON.stringify(state));
    if (normalize) {
      const normalizedState = [];
      for (let i = 0; i < stateCopy.length; i++) {
        normalizedState.push([]);
        for (let j = 0; j < stateCopy[0].length; j++) {
          if (stateCopy[i][j] === 0) {
            normalizedState[i].push(0);
          } else {
            normalizedState[i].push(state[i][j] === 1 ? 2 : 1)
          }
        }
      }
      stateCopy = normalizedState;
    }
    return this._getMove.call(sandbox, stateCopy);
  }

  // because we can't save methods to firebase
  toBasePlayer(): BasePlayer {
    const bp = new BasePlayer();
    bp.id = this.id;
    bp.code = this.code;
    bp.name = this.name;
    bp.email = this.email;
    bp.photoURL = this.photoURL;
    return bp;
  }
}
