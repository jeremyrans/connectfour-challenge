import { UserService } from './../user/user.service';
import { ConnectFourService } from './../connect-four/connect-four.service';
import { PlayerService } from './../player/player.service';
import { Component, OnInit } from '@angular/core';
import { GameOverState } from '../game-state/game-state';
import { Player } from '../player/player';

@Component({
  selector: 'app-single-player',
  templateUrl: './single-player.component.html',
  styleUrls: ['./single-player.component.css']
})
export class SinglePlayerComponent implements OnInit {

  player = new Player();
  intervalTimer;

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
    this.setIntervalTimer();
  }

  setIntervalTimer(): void {
    if (this.intervalTimer) {
      clearInterval(this.intervalTimer);
      this.intervalTimer = undefined;
    }
    this.intervalTimer = setInterval(this._playDelayedTurn.bind(this), 100);
  }

  private _playDelayedTurn(): void {
    if (this._connectFourService.gameState.getValue().gameOverState === GameOverState.NOT_OVER) {
      this._connectFourService.playTurn();
    } else {
      clearInterval(this.intervalTimer);
    }
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
