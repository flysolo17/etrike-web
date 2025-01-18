import { Component, OnInit } from '@angular/core';

import { User, UserType } from '../../models/driver/Users';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent implements OnInit {
  users$: User[] = [];
  constructor(private authService: AuthService) {}
  ngOnInit(): void {
    this.authService.getAllUSers().subscribe((users: User[]) => {
      this.users$ = users;
    });
  }

  get drivers(): number {
    return this.users$.filter((user) => user.type === UserType.DRIVER).length;
  }

  get passengers(): number {
    return this.users$.filter((user) => user.type === UserType.PASSENGER)
      .length;
  }
}
