import { AuthService } from './../../auth/auth.service';
import {
  Component,
  OnInit,
  EventEmitter,
  Output,
  OnDestroy,
} from '@angular/core';
import { Subscription } from 'rxjs/Subscription';

/* we need Output for tyhe event to be listened outside */

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit, OnDestroy {
  /* @Output  makes sidenavToggle listenable from outside */
  @Output() sidenavToggle = new EventEmitter<void>();
  isAuth = false;
  authSubscription: Subscription;

  constructor(private authService: AuthService) {}

  /* will execute when object is created */
  ngOnInit(): void {
    /* authService.subscribe will return a new Subscription */
    this.authSubscription = this.authService.authChange.subscribe(
      /* i will receive this emitted data 
      (true or false) whenever we call next  */
      (authStatus) => {
        this.isAuth = authStatus;
      }
    );
  }

  onToggleSidenav() {
    this.sidenavToggle.emit();
  }

  /*  need to emit a custom event in header component 
     which we can listen from the app component, then can toggle 
     on sidenav reference
 */

  onLogout() {
    this.authService.logout;
  }

  ngOnDestroy() {
    this.authSubscription.unsubscribe();
  }
}
