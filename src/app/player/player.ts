import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { BoardSpace } from '../game-state/game-state';

export class BasePlayer {
  id: string;
  code: string;
  name: string;
  email: string;
  photoURL: string;
}

export class Player extends BasePlayer {
  worker: any = new Worker('worker.js');
  moveCallback: (n: number) => void;

  private _setGetMoveFunction(code: string): void {
    this.worker.postMessage({ command: 'code', value: code });

    this.worker.onmessage = function (message) {
      this.moveCallback(message.data);
    }.bind(this);
  }

  updateFrom(player: BasePlayer): void {
    this.code = player.code;
    this.name = player.name;
    this.email = player.email;
    this.photoURL = player.photoURL;
  }

  getMove(state: BoardSpace[][], callback: (m: number) => void): void {
    this._setGetMoveFunction(this.code);
    this.worker.postMessage({ command: 'getMove', value: state });
    this.moveCallback = callback;
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
