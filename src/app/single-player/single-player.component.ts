import { Component, OnInit } from '@angular/core';
import { ConnectFourService } from '../connect-four/connect-four.service';
import { GameOverState } from '../game-state/game-state';

@Component({
  selector: 'app-single-player',
  templateUrl: './single-player.component.html',
  styleUrls: ['./single-player.component.css']
})
export class SinglePlayerComponent implements OnInit {

  constructor(private _connectFourService: ConnectFourService) { }

  ngOnInit() {
    while (this._connectFourService.gameState.getValue().gameOverState === GameOverState.NOT_OVER) {
      setTimeout(() => this._connectFourService.playTurn(), 500);
    }
  }

}
