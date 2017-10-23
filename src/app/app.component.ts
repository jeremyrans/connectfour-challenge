import { PlayerService } from './player/player.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'app';

  constructor(private _playerService: PlayerService) { }

  ngOnInit(): void {
    // console.log('Move:' + this._playerService.getMove());
  }
}
