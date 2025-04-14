import { Component, inject, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { DocumentService } from '../../../services/document.service';
import { ToastrService } from 'ngx-toastr';
import {
  Document,
  EDocumentType,
} from '../../../models/administrator/Document';

import { User } from '../../../models/driver/Users';

@Component({
  selector: 'app-create-document-modal',
  templateUrl: './create-document-modal.component.html',
  styleUrl: './create-document-modal.component.css',
})
export class CreateDocumentModalComponent {
  @Input({ required: true }) user!: User;
  loading = false;
  activeModal = inject(NgbActiveModal);
  documentTypes = [
    EDocumentType.ID,
    EDocumentType.LICENSE,
    EDocumentType.INSURANCE,
    EDocumentType.VEHICLE_REGISTRATUON,
    EDocumentType.OTHER,
  ];
  selectedFile: File | null = null;
  extension: string = '';

  documentForm$: FormGroup = new FormGroup({});
  constructor(
    private fb: FormBuilder,
    private documentService: DocumentService,
    private toastr: ToastrService
  ) {
    this.documentForm$ = this.fb.group({
      type: [null, [Validators.required]],
      document: [null],
    });
  }
  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0];
    this.extension = this.selectedFile?.name.split('.').pop() || '';
  }

  async submit() {
    if (!this.selectedFile) {
      this.toastr.error('Please select a file', 'Error', {
        timeOut: 3000,
        closeButton: true,
      });
      return;
    }

    if (this.documentForm$.valid) {
      this.loading = true;
      const formValues = this.documentForm$.value;
      const document: Document = {
        id: '',
        url: '',
        userID: this.user.id!,
        type: formValues.type,
        createdAt: new Date(),
        extension: this.extension,
      };

      try {
        await this.documentService.createDocument(document, this.selectedFile);
        this.toastr.success('Document created successfully', 'Success', {
          timeOut: 3000,
          closeButton: true,
        });
        this.activeModal.close(document);
      } catch (error) {
        console.error('Error creating document:', error);
        this.toastr.error('Error creating document', 'Error', {
          timeOut: 3000,
          closeButton: true,
        });
      } finally {
        this.loading = false;
      }
    }
  }
}
