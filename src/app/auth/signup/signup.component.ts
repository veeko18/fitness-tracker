import { AuthService } from './../auth.service';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
})
export class SignupComponent implements OnInit {
  maxDate;

  /* injecting service in signup.component */
  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.maxDate = new Date();
    /* setting full year to today's year minus 18 */
    this.maxDate.setFullYear(this.maxDate.getFullYear() - 18);
  }

  /* we will reach out to authservice and 
  call registerUser() */
  onSubmit(form: NgForm) {
    this.authService.registerUser({
      /* email property is extracted by submitted form */
      email:
        form.value
          .email /* in signup.component.html 
      we have assigned name="email" 
      and name="password" */,
      password: form.value.password,
    });
  }
}
