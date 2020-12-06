import { TrainingService } from './../training/training.service';
import { AuthData } from './auth-data.model';
import { User } from './user.model';
import { Subject } from 'rxjs/Subject';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireAuth } from 'angularfire2/auth';

/* the goal is to fake a user login */

/* redirection by injection service into service
injecting angular router in authService */

@Injectable()
export class AuthService {
  /* whenever we register a user I want to emit an event 
  whether we sign in or not*/
  authChange = new Subject<boolean>();
  /* undefined user ininitially */
  private isAuthenticated = false;

  /* we have access to the router now */
  constructor(
    private router: Router,
    private afAuth: AngularFireAuth,
    private trainingService: TrainingService
  ) {}

  initAuthListener() {
    this.afAuth.authState.subscribe((user) => {
      if (user) {
        this.isAuthenticated = true;
        this.authChange.next(true);
        this.router.navigate(['/training']);
      } else {
        this.trainingService.cancelSubsriptions();
        /* reseting user value */
        this.authChange.next(false);
        this.router.navigate(['/login']);
        this.isAuthenticated = false;
      }
    });
  }

  /* register user should be called 
    when a user signs up and I expect 
    to get authData (email, password)  */
  registerUser(authData: AuthData) {
    /* initialising user */
    this.afAuth.auth
      .createUserWithEmailAndPassword(authData.email, authData.password)
      .then((result) => {})
      .catch((error) => {
        console.log(error);
      });
  }

  login(authData: AuthData) {
    this.afAuth.auth
      .signInWithEmailAndPassword(authData.email, authData.password)
      .then((result) => {
        console.log(result);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  logout() {
    this.afAuth.auth.signout();
  }

  isAuth() {
    /* if user is != null => isAuth returns true, 
    meaning it will get authenticated. If user == null => false */
    return this.isAuthenticated;
  }
}
