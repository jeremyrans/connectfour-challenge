import { UserService } from './../user/user.service';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Router } from '@angular/router';
import { Component, OnInit, Input } from '@angular/core';
import * as firebase from 'firebase/app';
import { AngularFireAuth } from 'angularfire2/auth';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {
  @Input() navItems: NavItem[];
  activeUrl = '';

  constructor(private _router: Router, public userService: UserService) { }

  ngOnInit() {
    this._router.events.subscribe(
      () => {
        this.activeUrl = this._router.url;
      }
    );
  }
}

interface NavItem {
  label: string;
  href: string;
}
