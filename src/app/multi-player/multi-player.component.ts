import { Component, OnInit, ViewChildren, QueryList, AfterViewInit } from '@angular/core';
import { ConnectFourService } from '../connect-four/connect-four.service';
import { ConnectFourBoardComponent } from '../connect-four-board/connect-four-board.component';
import { GameOverState } from '../game-state/game-state';
import { PlayerService } from '../player/player.service';
import { UserService } from '../user/user.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-multi-player',
  templateUrl: './multi-player.component.html',
  styleUrls: ['./multi-player.component.css']
})
export class MultiPlayerComponent implements OnInit, AfterViewInit {
  numGames = 5;
  games = [];
  gameSpeed = 0.5;
  intervalTimer;
  playerList = [];
  redPlayer = '';
  redPlayerWins = 0;
  yellowPlayer = '';
  yellowPlayerWins = 0;

  secondColour = 'Yellow';

  @ViewChildren('board') connectFourBoards: QueryList<ConnectFourBoardComponent>;

  constructor(private _playerService: PlayerService, private _userService: UserService, private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.queryParams.subscribe(
      (params: any) => {
        if (params.hasOwnProperty('classic')) {
          this.secondColour = 'Black';
        }
      }
    );

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

  ngAfterViewInit() {
    this.connectFourBoards.forEach((board) => {
      board.connectFourService.gameState.subscribe((state) => {
        if (state.gameOverState === GameOverState.PLAYER_1_WIN) {
          this.redPlayerWins++;
        } else if (state.gameOverState === GameOverState.PLAYER_2_WIN) {
          this.yellowPlayerWins++;
        }
      });
    });
  }


  startGame(): void {
    this.redPlayerWins = 0;
    this.yellowPlayerWins = 0;
    let startPlayer = 1;
    this.connectFourBoards.forEach((board) => {
      board.connectFourService.resetGame(startPlayer);
      board.connectFourService.init(this.redPlayer, this.yellowPlayer, startPlayer);
      startPlayer = startPlayer === 1 ? 2 : 1;
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
