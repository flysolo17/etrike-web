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
import { Crash, CrashConverter } from '../models/crashes/Crash';
const EMERGENCY_COLLECTION = 'emergencies';
const CRASH_COLLECTION = 'crashes';
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
  getAllCrashes(): Observable<Crash[]> {
    const q = query(
      collection(this.firestore, CRASH_COLLECTION).withConverter(
        CrashConverter
      ),
      orderBy('updatedAt', 'desc')
    );
    return collectionData(q);
  }
}
