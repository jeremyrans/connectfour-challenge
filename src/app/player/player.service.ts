import { UserService } from './../user/user.service';
import { AngularFireDatabase } from 'angularfire2/database';
import { Player, BasePlayer } from './player';
import { Injectable } from '@angular/core';
import { BoardSpace } from '../game-state/game-state';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class PlayerService {
  constructor(
    private _db: AngularFireDatabase,
    private _userService: UserService
  ) { }

  getPlayer(id: string): Observable<BasePlayer> {
    if (id && this._userService.user) {
      return this._db.object(id).valueChanges();
    }
    return Observable.of(null);
  }

  savePlayer(player: Player): void {
    if (this._userService.user) {
      this._db.object(player.id).set(player.toBasePlayer());
    }
  }
}
