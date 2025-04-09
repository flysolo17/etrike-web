import { Component, OnInit } from '@angular/core';
import { BookingService } from '../../services/booking.service';
import { FormControl } from '@angular/forms';
import { BehaviorSubject, map, shareReplay } from 'rxjs';
import { PdfGenerationService } from '../../services/pdf-generation.service';
import { BookingsWithPassengerAndDriver } from '../../models/bookings/BookingsWithPassengerAndDriver';
import { TransactionStatus } from '../../models/transactions/Transactions';
import { NgbDate } from '@ng-bootstrap/ng-bootstrap';
import { Administrator } from '../../models/administrator/Administrator';
import { AuthService } from '../../services/auth.service';
import { AdministratorService } from '../../services/administrator.service';

@Component({
  selector: 'app-booking',
  templateUrl: './booking.component.html',
  styleUrl: './booking.component.css',
})
export class BookingComponent implements OnInit {
  selectedFromDate: NgbDate | null = null;
  selectedToDate: NgbDate | null = null;
  active: string = 'ALL';
  tabs$ = ['ALL', ...Object.values(TransactionStatus)];
  sevenDaysAgo = new Date();

  searchTerm$ = new FormControl('');
  bookings$ = this.bookingService
    .getBookingWithDriverAndPassenger()
    .pipe(shareReplay(1));

  pending$ = this.bookings$.pipe(
    map((e) =>
      e.filter((s) => s.transactions?.status === TransactionStatus.PENDING)
    )
  );
  accepted$ = this.bookings$.pipe(
    map((e) =>
      e.filter((s) => s.transactions?.status === TransactionStatus.ACCEPTED)
    )
  );

  completed$ = this.bookings$.pipe(
    map((e) =>
      e.filter(
        (s) =>
          s.transactions?.status === TransactionStatus.COMPLETED &&
          new Date(s.transactions?.updatedAt!!) >= this.sevenDaysAgo
      )
    )
  );

  cancelled$ = this.bookings$.pipe(
    map((e) =>
      e.filter(
        (s) =>
          s.transactions?.status === TransactionStatus.CANCELLED &&
          new Date(s.transactions?.updatedAt!!) >= this.sevenDaysAgo
      )
    )
  );

  otw$ = this.bookings$.pipe(
    map((e) =>
      e.filter(
        (s) =>
          s.transactions?.status === TransactionStatus.OTW &&
          new Date(s.transactions?.updatedAt!!) >= this.sevenDaysAgo
      )
    )
  );

  failed$ = this.bookings$.pipe(
    map((e) =>
      e.filter(
        (s) =>
          s.transactions?.status === TransactionStatus.FAILED &&
          new Date(s.transactions?.updatedAt!!) >= this.sevenDaysAgo
      )
    )
  );
  bookings: BookingsWithPassengerAndDriver[] = [];

  filteredBookings$ = new BehaviorSubject<BookingsWithPassengerAndDriver[]>([]);
  admin$: Administrator | null = null;
  constructor(
    private bookingService: BookingService,
    private administratorService: AdministratorService,
    private pdfGenerationService: PdfGenerationService
  ) {}

  ngOnInit(): void {
    let id = localStorage.getItem('id');
    if (id !== null) {
      this.administratorService.getAdministrator(id).subscribe((data) => {
        this.admin$ = data;
      });
    }

    this.sevenDaysAgo.setDate(this.sevenDaysAgo.getDate() - 7);
    this.updateFilteredBookings();
    this.searchTerm$.valueChanges.subscribe(() => {
      this.updateFilteredBookings();
    });

    this.active = this.tabs$[0];
  }

  updateFilteredBookings(): void {
    const term = this.searchTerm$.value?.toLowerCase() ?? '';
    this.bookings$
      .pipe(
        map((bookings) =>
          bookings.filter((booking) => {
            const isActive =
              this.active === 'ALL' ||
              booking?.transactions?.status === this.active;
            const matchesSearch =
              booking?.transactionID?.toLowerCase().includes(term) ||
              booking?.driver?.name?.toLowerCase().includes(term) ||
              booking?.passenger?.name?.toLowerCase().includes(term);

            // Convert Firestore timestamps to Date objects
            const updatedAt = booking.transactions?.createdAt
              ? new Date(booking.transactions.createdAt)
              : null;

            // Date Range Filtering
            let isWithinDateRange = true;
            if (this.selectedFromDate && this.selectedToDate) {
              const fromDate = new Date(
                this.selectedFromDate.year,
                this.selectedFromDate.month - 1,
                this.selectedFromDate.day
              );
              const toDate = new Date(
                this.selectedToDate.year,
                this.selectedToDate.month - 1,
                this.selectedToDate.day
              );

              isWithinDateRange = updatedAt
                ? updatedAt >= fromDate && updatedAt <= toDate
                : false;
            }

            return isActive && matchesSearch && isWithinDateRange;
          })
        )
      )
      .subscribe((filtered) => this.filteredBookings$.next(filtered));
  }

  handleDateRange(event: { fromDate: NgbDate | null; toDate: NgbDate | null }) {
    this.selectedFromDate = event.fromDate;
    this.selectedToDate = event.toDate;
    console.log(
      'Selected Date Range:',
      this.selectedFromDate,
      this.selectedToDate
    );
    this.updateFilteredBookings(); // Update filter when date changes
  }

  download(): void {
    const dateIssued = new Date().toLocaleDateString();
    const booking = this.filteredBookings$.value;
    this.pdfGenerationService.generatePdf([
      this.pdfGenerationService.generateHeader(
        this.admin$?.name ?? '',
        dateIssued,
        booking.length.toString()
      ),
      { text: '', margin: [0, 10, 0, 10] },
      this.pdfGenerationService.generateBookingTable(booking),
    ]);
  }

  selectTab(select: string): void {
    this.active = select;
    this.updateFilteredBookings();
  }
}
