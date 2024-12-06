import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  loginForm$: FormGroup;

  constructor(private fb: FormBuilder, private router: Router) {
    this.loginForm$ = fb.nonNullable.group({
      username: ['', [Validators.required]],
      password: ['', Validators.required],
    });
  }
  submit() {
    if (this.loginForm$.invalid) {
      return;
    }
    let data = this.loginForm$.value;
    let username = data.username;
    let password = data.password;
    if (username == 'admin' && password == 'admin') {
      this.router.navigate(['/main']);
    }
  }
}
