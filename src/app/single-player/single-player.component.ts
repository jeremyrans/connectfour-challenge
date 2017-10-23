import { ConnectFourService } from './../connect-four/connect-four.service';
import { PlayerService } from './../player/player.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-single-player',
  templateUrl: './single-player.component.html',
  styleUrls: ['./single-player.component.css']
})
export class SinglePlayerComponent implements OnInit {

  get player1Code(): string {
    return this._playerService.getCode(0);
  }

  constructor(private _playerService: PlayerService, private _connectFourService: ConnectFourService) { }

  setCode(code: string): void {
    this._playerService.saveCode(0, code);
  }

  startGame(): void {
    this._connectFourService.startGame();
  }

  ngOnInit() {
  }

}
