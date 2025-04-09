import { Component, inject, Input } from '@angular/core';
import { BookingsWithPassengerAndDriver } from '../../../../models/bookings/BookingsWithPassengerAndDriver';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-download-dialog',
  templateUrl: './download-dialog.component.html',
  styleUrl: './download-dialog.component.css',
})
export class DownloadDialogComponent {
  activeModal = inject(NgbActiveModal);
  @Input() bookings: BookingsWithPassengerAndDriver[] = [];
}
