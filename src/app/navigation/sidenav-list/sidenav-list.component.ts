import { Subscription } from 'rxjs/Subscription';
import {
  Component,
  OnInit,
  EventEmitter,
  Output,
  OnDestroy,
} from '@angular/core';
import { AuthService } from './../../auth/auth.service';

@Component({
  selector: 'app-sidenav-list',
  templateUrl: './sidenav-list.component.html',
  styleUrls: ['./sidenav-list.component.css'],
})
export class SidenavListComponent implements OnInit {
  @Output() closeSidenav = new EventEmitter<void>();
  isAuth = false;
  authSubscription: Subscription;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    /* authService.subscribe will return a new Subscription */
    this.authSubscription = this.authService.authChange.subscribe(
      /* i will recieve this emitted data 
      (true or false) whenever we call next  */
      (authStatus) => {
        this.isAuth = authStatus;
      }
    );
  }

  onClose() {
    this.closeSidenav.emit();
  }

  onLogout() {
    this.onClose();
    this.authService.logout;
  }

  ngOnDestroy() {
    this.authSubscription.unsubscribe();
  }
}
