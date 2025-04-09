import { Injectable } from '@angular/core';
import {
  collection,
  collectionData,
  Firestore,
  orderBy,
  query,
} from '@angular/fire/firestore';
import { map, Observable } from 'rxjs';
import { ReportPassengerAndDriver } from '../models/report/ReportWithPassengerAndDriver';
import {
  Reports,
  REPORTS_COLLECTION,
  ReportsConverter,
} from '../models/report/report';

@Injectable({
  providedIn: 'root',
})
export class ReportService {
  constructor(private firestore: Firestore) {}

  getAllReports(): Observable<Reports[]> {
    const q = query(
      collection(this.firestore, REPORTS_COLLECTION).withConverter(
        ReportsConverter
      ),
      orderBy('createdAt', 'desc')
    );
    return collectionData(q);
  }
}
