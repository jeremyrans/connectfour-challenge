import { ConnectFourService } from './connect-four.service';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { GameState } from './../game-state/game-state';
import { Component, OnInit, Inject, Input } from '@angular/core';

@Component({
  selector: 'app-connect-four',
  templateUrl: './connect-four.component.html',
  styleUrls: ['./connect-four.component.css']
})
export class ConnectFourComponent implements OnInit {
  @Input() player1Code = '';

  constructor(private _connectFourService: ConnectFourService) {
  }

  ngOnInit() {
    // this._connectFourService.startGame();
  }

}
