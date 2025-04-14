import { QueryDocumentSnapshot } from '@angular/fire/firestore';
import { Administrator } from './Administrator';

export interface Document {
  id: string;
  extension: string;
  url: string;
  userID: string;
  type: EDocumentType;
  createdAt: Date;
}

export const DocumentConverter = {
  toFirestore: (data: Document) => data,
  fromFirestore: (snap: QueryDocumentSnapshot) => {
    const document = snap.data() as Document;
    document.createdAt = (document.createdAt as any).toDate();
    return document;
  },
};

export enum EDocumentType {
  ID = 'ID',
  LICENSE = 'LICENSE',
  INSURANCE = 'INSURANCE',
  VEHICLE_REGISTRATUON = 'VEHICLE_REGISTRATUON',
  OTHER = 'OTHER',
}
