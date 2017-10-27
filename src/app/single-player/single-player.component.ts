import { GameState } from './../game-state/game-state';
import { UserService } from './../user/user.service';
import { ConnectFourService } from './../connect-four/connect-four.service';
import { PlayerService } from './../player/player.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { GameOverState } from '../game-state/game-state';
import { Player } from '../player/player';
import { ConnectFourBoardComponent } from '../connect-four-board/connect-four-board.component';
import 'rxjs/add/operator/take';

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
  difficulty = 'ai-1';
  prevSum = -1;

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

  private _playNextTurn(): void {
    this.connectFourService.playTurn(() => {
      setTimeout(this._playNextTurn.bind(this), (1 - this.gameSpeed) * 1000);
    });
  }

  startGame(): void {
    this.connectFourService.resetGame(this.selectedPositionNumber());
    this._playNextTurn();
  }

  ngOnInit() {
    this._userService.userObservable.subscribe(
      user => {
        let playerId = null;
        if (user) {
          playerId = user.uid;
        }
        this.initializeGame(playerId);
      }
    );

    this.connectFourService.players.subscribe(
      players => {
        if (!this.player.id) {
          this.player = players[0];
        }
      }
    );
  }

  initializeGame(playerId?: string): void {
    if (!playerId) {
      playerId = this.player.id;
    }
    this.connectFourService.init(playerId, this.difficulty, this.selectedPositionNumber());
  }

}
