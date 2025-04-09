import { Injectable } from '@angular/core';
import {
  collection,
  collectionData,
  Firestore,
  orderBy,
  query,
  where,
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Emergency, EmergencyConverter } from '../models/emergency/emergency';
const EMERGENCY_COLLECTION = 'emergencies';
@Injectable({
  providedIn: 'root',
})
export class EmergencyService {
  constructor(private firestore: Firestore) {}
  getEmergencyReports(): Observable<Emergency[]> {
    const q = query(
      collection(this.firestore, EMERGENCY_COLLECTION).withConverter(
        EmergencyConverter
      ),
      orderBy('updatedAt', 'desc')
    );
    return collectionData(q);
  }
}
