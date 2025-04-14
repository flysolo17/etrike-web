import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { faImage } from '@fortawesome/free-regular-svg-icons';
import {
  faFile,
  faFilePdf,
  faTrash,
  IconDefinition,
} from '@fortawesome/free-solid-svg-icons';
import { Document } from '../../../models/administrator/Document';

@Component({
  selector: 'app-document-card',
  templateUrl: './document-card.component.html',
  styleUrl: './document-card.component.css',
})
export class DocumentCardComponent implements OnInit {
  @Input({ required: true }) document!: Document;
  @Output() onDelete = new EventEmitter<Document>();
  @Output() onClick = new EventEmitter<String>();
  faPdf = faFilePdf;
  faFile = faFile;
  faDelete = faTrash;

  ngOnInit(): void {}
  getDocumentIcon(document: Document) {
    const fileExtension = document.url.split('.').pop()?.toLowerCase();
    if (fileExtension === 'pdf') {
      return this.faPdf;
    } else if (['jpg', 'jpeg', 'png'].includes(fileExtension || '')) {
      return faImage;
    } else {
      return this.faFile;
    }
  }
  isImage(extension: string): boolean {
    return ['jpg', 'jpeg', 'png'].includes(extension.toLowerCase());
  }
  getFileName(url: string): string {
    const parts = url.split('/');
    return parts[parts.length - 1];
  }

  deleteDocumentHandler() {
    this.onDelete.emit(this.document);
  }
  openDocumentNewTab() {
    this.onClick.emit(this.document.url);
  }
}
