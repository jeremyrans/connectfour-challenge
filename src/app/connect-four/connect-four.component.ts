import { ConnectFourService } from './connect-four.service';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-connect-four',
  templateUrl: './connect-four.component.html',
  styleUrls: ['./connect-four.component.css']
})
export class ConnectFourComponent {
  @Input() player1Code = '';

  constructor(private _connectFourService: ConnectFourService) {
  }

  playTurn(): void {
    this._connectFourService.playTurn();
  }

}
