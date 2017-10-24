import { Component, OnInit, ViewChildren, QueryList } from '@angular/core';
import { ConnectFourService } from '../connect-four/connect-four.service';
import { ConnectFourBoardComponent } from '../connect-four-board/connect-four-board.component';
import { GameOverState } from '../game-state/game-state';
import { PlayerService } from '../player/player.service';
import { UserService } from '../user/user.service';

@Component({
  selector: 'app-multi-player',
  templateUrl: './multi-player.component.html',
  styleUrls: ['./multi-player.component.css']
})
export class MultiPlayerComponent implements OnInit {
  numGames = 5;
  games = [];
  gameSpeed = 0.5;
  intervalTimer;
  playerList = [];
  player1 = '';
  player2 = '';

  @ViewChildren('board') connectFourBoards: QueryList<ConnectFourBoardComponent>;

  constructor(private _playerService: PlayerService, private _userService: UserService) { }

  ngOnInit() {
    this.games = new Array(this.numGames);

    this._userService.userObservable.subscribe(
      user => {
        if (user) {
          this._playerService.getAllPlayers().subscribe(
            players => {
              this.playerList = players.map(player => {
                return {name: player.name, id: player.id};
              });
            }
          );
        }
      }
    );
  }


  startGame(): void {
    this.connectFourBoards.forEach((board) => {
      board.connectFourService.resetGame();
      board.connectFourService.init(this.player1, this.player2);
    });
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
    let allGameOvers = true;
    this.connectFourBoards.forEach((board) => {
      if (board.connectFourService.gameState.getValue().gameOverState === GameOverState.NOT_OVER) {
        allGameOvers = false;
        board.connectFourService.playTurn();
      }
    });

    if (allGameOvers) {
      clearInterval(this.intervalTimer);
    }
  }

}
