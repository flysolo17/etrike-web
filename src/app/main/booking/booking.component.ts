import { Component, OnInit } from '@angular/core';
import { BookingService } from '../../services/booking.service';
import { FormControl } from '@angular/forms';
import { map } from 'rxjs';

@Component({
  selector: 'app-booking',
  templateUrl: './booking.component.html',
  styleUrl: './booking.component.css',
})
export class BookingComponent implements OnInit {
  searchTerm$ = new FormControl('');
  bookings$ = this.bookingService.getBookingWithDriverAndPassenger();

  filteredBookings$ = this.bookings$;
  constructor(private bookingService: BookingService) {}
  ngOnInit(): void {
    this.searchTerm$.valueChanges.subscribe((term) => {
      this.filteredBookings$ = this.bookings$.pipe(
        map((bookings) =>
          bookings.filter(
            (booking) =>
              booking?.transactionID
                ?.toLowerCase()
                .includes((term ?? '').toLowerCase()) ||
              booking?.driver?.name
                ?.toLowerCase()
                .includes((term ?? '').toLowerCase()) ||
              booking?.passenger?.name
                ?.toLowerCase()
                .includes((term ?? '').toLowerCase())
          )
        )
      );
    });
  }
}
