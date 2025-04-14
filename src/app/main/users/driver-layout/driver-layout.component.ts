import { Component, inject, Input, OnInit } from '@angular/core';
import { User } from '../../../models/driver/Users';
import { faArrowLeft, faPlusSquare } from '@fortawesome/free-solid-svg-icons';
import { Transactions } from '../../../models/transactions/Transactions';
import { Observable, of } from 'rxjs';
import { BookingService } from '../../../services/booking.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CreateDocumentModalComponent } from '../create-document-modal/create-document-modal.component';
import { DocumentService } from '../../../services/document.service';
import { Document } from '../../../models/administrator/Document';
import { Toast, ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-driver-layout',
  templateUrl: './driver-layout.component.html',
  styleUrl: './driver-layout.component.css',
})
export class DriverLayoutComponent implements OnInit {
  @Input({ required: true }) user!: User;
  modalService = inject(NgbModal);
  faBack = faArrowLeft;
  add = faPlusSquare;

  transactions$: Observable<Transactions[]> = of([]);
  documents$: Observable<Document[]> = of([]);
  constructor(
    private bookingService: BookingService,
    private documentService: DocumentService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.transactions$ = this.bookingService.getDriverBookings(this.user.id!);
    this.documents$ = this.documentService.getDocumentsByUserID(this.user.id!);
  }

  createDocument() {
    const modalRef = this.modalService.open(CreateDocumentModalComponent, {
      size: 'sm',
      backdrop: 'static',
      keyboard: false,
    });
    modalRef.componentInstance.user = this.user;
  }
  onDeleteDocument(document: Document) {
    this.documentService
      .deleteDocument(document.id, document.url)
      .then(() => {
        this.toastr.success('Document deleted successfully', 'Success', {
          timeOut: 3000,
        });
      })
      .catch((error) => {
        this.toastr.error('Error deleting document', 'Error', {
          timeOut: 3000,
        });
      });
  }
  newTab(url: string) {
    window.open(url, '_blank');
  }
}
