import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import * as firebase from 'firebase/app';
import { AngularFireAuth } from 'angularfire2/auth';
import { Injectable } from '@angular/core';

@Injectable()
export class UserService {
  _user: BehaviorSubject<firebase.User> = new BehaviorSubject(null);

  get userObservable(): Observable<firebase.User> {
    return this._user.asObservable();
  }

  get user(): firebase.User {
    return this._user.getValue();
  }

  constructor(private _afAuth: AngularFireAuth) {
    _afAuth.authState.subscribe(
      user => {
        this._user.next(user);
      }
    );
  }

  login(): void {
    this._afAuth.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider());
  }

  logout(): void {
    this._afAuth.auth.signOut();
  }
}
