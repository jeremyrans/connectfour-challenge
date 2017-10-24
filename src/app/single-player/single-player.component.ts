import { UserService } from './../user/user.service';
import { ConnectFourService } from './../connect-four/connect-four.service';
import { PlayerService } from './../player/player.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { GameOverState } from '../game-state/game-state';
import { Player } from '../player/player';
import { ConnectFourBoardComponent } from '../connect-four-board/connect-four-board.component';

@Component({
  selector: 'app-single-player',
  templateUrl: './single-player.component.html',
  styleUrls: ['./single-player.component.css']
})
export class SinglePlayerComponent implements OnInit {

  player = new Player();
  selectedPosition = 'first';
  intervalTimer;
  gameSpeed = 0.5;
  @ViewChild(ConnectFourService) connectFourService: ConnectFourService;

  constructor(
    private _playerService: PlayerService,
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

  selectedPositionNumber() {
    return this.selectedPosition === 'first' ? 1 : 2;
  }

  startGame(): void {
    this.connectFourService.resetGame(this.selectedPositionNumber());
    this.setIntervalTimer(true);
  }

  setIntervalTimer(startGame: boolean): void {
    if (this.intervalTimer) {
      clearInterval(this.intervalTimer);
      this.intervalTimer = undefined;
      startGame = true;
    }

    if (startGame) {
      this.intervalTimer = setInterval(this._playDelayedTurn.bind(this), (1 - this.gameSpeed) * 1000);
    }
  }

  private _playDelayedTurn(): void {
    if (this.connectFourService.gameState.getValue().gameOverState === GameOverState.NOT_OVER) {
      this.connectFourService.playTurn();
    } else {
      clearInterval(this.intervalTimer);
    }
  }

  ngOnInit() {
    this._userService.userObservable.subscribe(
      user => {
        let playerId = null;
        if (user) {
          playerId = user.uid;
        }
        this.connectFourService.init(playerId, 'ai-1', this.selectedPositionNumber());
      }
    );

    this.connectFourService.players.subscribe(
      players => {
        this.player = players[0];
      }
    );
  }

}
