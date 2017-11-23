import { UserService } from './../user/user.service';
import { AngularFireDatabase } from 'angularfire2/database';
import { Player, BasePlayer } from './player';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

const tableName = 'players-openhouse';

@Injectable()
export class PlayerService {
  constructor(
    private _db: AngularFireDatabase,
    private _userService: UserService
  ) { }

  getPlayer(id: string): Observable<BasePlayer> {
    if (id && this._userService.user) {
      return this._db.object(tableName + '/' + id).valueChanges();
    }
    return Observable.of(null);
  }

  getAllPlayers(): Observable<any[]> {
    if (this._userService.user) {
      return this._db.list(tableName).valueChanges();
    }
    return Observable.of(null);
  }

  savePlayer(player: Player): void {
    if (this._userService.user) {
      this._db.object(tableName + '/' + player.id).set(player.toBasePlayer());
    }
  }
}
