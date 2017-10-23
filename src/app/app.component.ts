import { PlayerService } from './player/player.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  navItems = [
    { label: 'Single Player', href: '/single-player' },
    { label: 'Multi Player', href: '/multi-player' }
  ];

  constructor() { }

  ngOnInit(): void {
    // console.log('Move:' + this._playerService.getMove());
  }
}
