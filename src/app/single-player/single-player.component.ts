import { UserService } from './../user/user.service';
import { ConnectFourService } from './../connect-four/connect-four.service';
import { PlayerService } from './../player/player.service';
import { Component, OnInit } from '@angular/core';
import { Player } from '../player/player';

@Component({
  selector: 'app-single-player',
  templateUrl: './single-player.component.html',
  styleUrls: ['./single-player.component.css']
})
export class SinglePlayerComponent implements OnInit {

  player = new Player();

  constructor(
    private _playerService: PlayerService,
    private _connectFourService: ConnectFourService,
    private _userService: UserService
  ) { }

  save(code: string): void {
    const user = this._userService.user;
    this.player.code = code;
    if (user) {
      this.player.email = user.email;
      this.player.name = user.displayName;
      this.player.photoURL = user.photoURL;
      this._playerService.savePlayer(this.player);
    }
  }

  startGame(): void {
    this._connectFourService.resetGame();
    this._connectFourService.startGame();
  }

  ngOnInit() {
    this._userService.userObservable.subscribe(
      user => {
        console.log('hi');
        let playerId = null;
        if (user) {
          playerId = user.uid;
        }
        this._connectFourService.init(playerId, 'ai-1');
      }
    );

    this._connectFourService.players.subscribe(
      players => {
        this.player = players[0];
      }
    );
  }

}
