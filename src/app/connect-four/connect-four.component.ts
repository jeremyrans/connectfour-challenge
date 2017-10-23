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
  @Input() foo;

  get printFoo(): string {
    return this._connectFourService.foo;
  }

  constructor(private _connectFourService: ConnectFourService) {
  }

  ngOnInit() {
    this._connectFourService.foo = this.foo;
  }

  playTurn(): void {
    this._connectFourService.playTurn();
  }

}
