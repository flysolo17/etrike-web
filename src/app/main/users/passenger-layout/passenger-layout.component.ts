import { Component, Input, OnInit } from '@angular/core';
import { User } from '../../../models/driver/Users';
import { faArrowLeft, faBackward } from '@fortawesome/free-solid-svg-icons';
import { AuthService } from '../../../services/auth.service';
import { Observable, of } from 'rxjs';
import { Contacts } from '../../../models/driver/Contacts';
import { Transactions } from '../../../models/transactions/Transactions';
import { BookingService } from '../../../services/booking.service';

@Component({
  selector: 'app-passenger-layout',
  templateUrl: './passenger-layout.component.html',
  styleUrl: './passenger-layout.component.css',
})
export class PassengerLayoutComponent implements OnInit {
  @Input({ required: true }) user!: User;
  faBack = faArrowLeft;

  contacts$: Observable<Contacts[]> = of([]);
  transactions$: Observable<Transactions[]> = of([]);
  constructor(
    private authService: AuthService,
    private bookingService: BookingService
  ) {}

  ngOnInit(): void {
    this.contacts$ = this.authService.getPassengerContacts(this.user.id!);
    this.transactions$ = this.bookingService.getPassengerBookings(
      this.user.id!
    );
  }
}
