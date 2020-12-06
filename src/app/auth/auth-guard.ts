import { AuthService } from './auth.service';
import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router /* redirects to another page */,
  RouterStateSnapshot,
} from '@angular/router';

/* adding route protection
for example: localhost:4600/training will redirect us to 
login page */

/* to check whether user is authenticated */
@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    /* only return true and grant access if isAuth() is true */
    if (this.authService.isAuth()) {
      return true;
    } else {
      /* if not we want to redirect the user to login page */
      this.router.navigate(['/login']);
    }
  }
}
