import { TournamentService, Match } from './tournament.service';
import { Player } from './../player/player';
import { Component, OnInit, ViewChildren, QueryList, AfterViewInit } from '@angular/core';
import { ConnectFourService } from '../connect-four/connect-four.service';
import { ConnectFourBoardComponent } from '../connect-four-board/connect-four-board.component';
import { GameOverState } from '../game-state/game-state';
import { PlayerService } from '../player/player.service';
import { UserService } from '../user/user.service';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-tournament',
  templateUrl: './tournament.component.html',
  styleUrls: ['./tournament.component.css']
})
export class TournamentComponent implements OnInit {
  numGames = 6;
  games = [];
  gameSpeed = 500;
  playerList = [];
  redPlayer: Player;
  redPlayerWins = 0;
  yellowPlayer: Player;
  yellowPlayerWins = 0;
  secondColour = 'Yellow';
  boardSubscriptions: Subscription[] = [];
  tournamentId: string = null;
  matches: Match[] = [];
  matchIndex = -1;

  @ViewChildren('board') connectFourBoards: QueryList<ConnectFourBoardComponent>;

  constructor(
    private _playerService: PlayerService,
    private _userService: UserService,
    private route: ActivatedRoute,
    private _tournamentService: TournamentService
  ) { }

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
                return { name: player.name, id: player.id, photoURL: player.photoURL, email: player.email };
              });
            }
          );
        }
      }
    );
  }

  initializeBoards(): void {
    this.boardSubscriptions.forEach(
      boardSub => {
        boardSub.unsubscribe();
      }
    );
    this.boardSubscriptions = [];
    this.connectFourBoards.forEach((board) => {
      this.boardSubscriptions.push(board.connectFourService.gameState.subscribe((state) => {
        if (state.gameOverState === GameOverState.PLAYER_1_WIN || state.gameOverState === GameOverState.PLAYER_2_TIMEOUT) {
          console.log(1);
          this.redPlayerWins++;
        } else if (state.gameOverState === GameOverState.PLAYER_2_WIN || state.gameOverState === GameOverState.PLAYER_1_TIMEOUT) {
          console.log(1);
          this.yellowPlayerWins++;
        }
      }));
    });
  }

  private _gameOver(): void {
  }

  startTournament(): void {
    if (this.matches.length > 0 && this.matchIndex < this.matches.length) {
      this.nextMatch();
    } else {
      this.matchIndex = -1;
      this._tournamentService.getPlayableMatches(this.tournamentId).subscribe(
        matches => {
          this.matches = matches;
          this.nextMatch();
        }
      );
    }
  }

  private _getPlayerByEmail(email: string): Player {
    return this.playerList.filter(x => x.email === email)[0];
  }

  nextMatch(): void {
    this.matchIndex++;
    this.redPlayer = this._getPlayerByEmail(this.matches[this.matchIndex].player1Email);
    this.yellowPlayer = this._getPlayerByEmail(this.matches[this.matchIndex].player2Email);
  }

  startGame(): void {
    this.initializeBoards();
    this.redPlayerWins = 0;
    this.yellowPlayerWins = 0;
    let startPlayer = 1;
    this.connectFourBoards.forEach((board) => {
      board.connectFourService.resetGame(startPlayer);
      board.connectFourService.init(
        this.redPlayer ? this.redPlayer.id : '',
        this.yellowPlayer ? this.yellowPlayer.id : '', startPlayer
      );
      startPlayer = startPlayer === 1 ? 2 : 1;
    });
    this._playNextTurn();
  }

  private _playNextTurn(): void {
    const playableBoards = this.connectFourBoards.filter(
      b => b.connectFourService.gameState.getValue().gameOverState === GameOverState.NOT_OVER
    );
    let turns = playableBoards.length;

    if (turns === 0) {
      this._gameOver();
    }

    playableBoards.forEach(
      board => {
        board.connectFourService.playTurn(() => {
          turns -= 1;
          if (turns === 0) {
            setTimeout(this._playNextTurn.bind(this), 1000 - this.gameSpeed);
          }
        });
      }
    );
  }
}
