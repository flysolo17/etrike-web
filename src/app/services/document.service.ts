import { Injectable } from '@angular/core';
import {
  collection,
  collectionData,
  deleteDoc,
  doc,
  Firestore,
  or,
  orderBy,
  query,
  setDoc,
  where,
} from '@angular/fire/firestore';
import {
  deleteObject,
  getDownloadURL,
  ref,
  Storage,
  uploadBytes,
} from '@angular/fire/storage';

import { Document, DocumentConverter } from '../models/administrator/Document';
import { generateRandomString } from '../utils/Constants';
import { Observable } from 'rxjs';
export const DOCUMENTS_COLLECTION = 'documents';

@Injectable({
  providedIn: 'root',
})
export class DocumentService {
  constructor(private firestore: Firestore, private storage: Storage) {}

  async createDocument(document: Document, file: File) {
    const url = await this.uploadDocument(file);
    if (url === '' || url === undefined || url === null) {
      throw new Error('Error uploading document');
    }
    document.url = url;
    const id = generateRandomString(10);
    document.id = id;
    const documentRef = doc(this.firestore, DOCUMENTS_COLLECTION, id);
    return setDoc(documentRef, document);
  }
  async deleteDocument(id: string, filePath: string) {
    await this.deleteDocumentFromStorage(filePath);
    return deleteDoc(doc(this.firestore, DOCUMENTS_COLLECTION, id));
  }

  async uploadDocument(file: File): Promise<string> {
    const storageRef = ref(
      this.storage,
      `${DOCUMENTS_COLLECTION}/${file.name}`
    );
    const uploadTask = await uploadBytes(storageRef, file);
    return getDownloadURL(uploadTask.ref);
  }
  async deleteDocumentFromStorage(filePath: string) {
    const storageRef = ref(this.storage, filePath);
    return deleteObject(storageRef);
  }

  getDocumentsByUserID(userID: string): Observable<Document[]> {
    const q = query(
      collection(this.firestore, DOCUMENTS_COLLECTION).withConverter(
        DocumentConverter
      ),
      where('userID', '==', userID),
      orderBy('createdAt', 'desc')
    );
    return collectionData(q);
  }
}
