import { Injectable } from '@angular/core';
import {
  collection,
  collectionData,
  Firestore,
  query,
} from '@angular/fire/firestore';
import { Crash, CrashConverter } from '../models/crashes/Crash';
import { Observable } from 'rxjs';

const CRASH_COLLECTION = 'crashes';
@Injectable({
  providedIn: 'root',
})
export class CrashesService {
  constructor(private firestore: Firestore) {}

  getAllCrashes(): Observable<Crash[]> {
    const q = query(
      collection(this.firestore, CRASH_COLLECTION).withConverter(CrashConverter)
    );
    return collectionData(q);
  }
}
