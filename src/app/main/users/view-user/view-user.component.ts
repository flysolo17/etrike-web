import { Component, Injector, OnInit } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { ActivatedRoute } from '@angular/router';
import { Observable, of } from 'rxjs';
import { map, filter, switchMap } from 'rxjs/operators';
import { User } from '../../../models/driver/Users';
import { DriverLayoutComponent } from '../driver-layout/driver-layout.component';
import { PassengerLayoutComponent } from '../passenger-layout/passenger-layout.component';

@Component({
  selector: 'app-view-user',
  templateUrl: './view-user.component.html',
  styleUrl: './view-user.component.css',
})
export class ViewUserComponent implements OnInit {
  user$: Observable<User | null> = of(null);
  constructor(
    private authService: AuthService,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.user$ = this.activatedRoute.paramMap.pipe(
      map((params) => params.get('id')),
      filter((id) => id !== null),
      switchMap((id) => this.authService.getUserByID(id!))
    );
  }
}
