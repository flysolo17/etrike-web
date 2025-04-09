import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AdministratorService } from '../../services/administrator.service';
import { Administrator } from '../../models/administrator/Administrator';
import { ToastrModule, ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent implements OnInit {
  loginForm$: FormGroup;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private administratorService: AdministratorService,
    private toastr: ToastrService
  ) {
    this.loginForm$ = fb.nonNullable.group({
      username: ['', [Validators.required]],
      password: ['', Validators.required],
    });
  }
  ngOnInit(): void {
    let id = localStorage.getItem('id');
    if (id !== null) {
      this.administratorService
        .getAdministrator(id)
        .subscribe((data: Administrator | null) => {
          if (data !== null) {
            this.router.navigate(['/main']);
          }
        });
    }
  }
  submit() {
    if (this.loginForm$.invalid) {
      return;
    }

    const data = this.loginForm$.value;
    const username = data.username;
    const password = data.password;

    this.administratorService.login(username, password).subscribe(
      (isAuthenticated) => {
        if (isAuthenticated) {
          this.router.navigate(['/main']);
          this.toastr.success('Successfully logged in.');
        } else {
          this.toastr.error('Invalid username or password.');
        }
      },
      (error) => {
        console.error('Login error:', error);
        this.toastr.error(
          'An error occurred while logging in. Please try again.'
        );
      }
    );
  }
}
