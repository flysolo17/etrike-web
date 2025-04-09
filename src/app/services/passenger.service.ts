import { Injectable } from '@angular/core';
import {
  collection,
  collectionData,
  doc,
  docData,
  Firestore,
  query,
  where,
} from '@angular/fire/firestore';
import { map, Observable } from 'rxjs';
import { User, UserConverter, UserType } from '../models/driver/Users';
import { USERS_COLLECTION } from './driver.service';

export const PASSENGER_COLLECTION = 'users';
@Injectable({
  providedIn: 'root',
})
export class PassengerService {
  constructor(private firestore: Firestore) {}

  getAllPassengers(): Observable<User[]> {
    const q = query(
      collection(this.firestore, PASSENGER_COLLECTION).withConverter(
        UserConverter
      ),
      where('type', '==', UserType.PASSENGER)
    );
    return collectionData(q);
  }
  getPassengerByID(passengerID: string): Observable<User | null> {
    return docData(
      doc(this.firestore, USERS_COLLECTION, passengerID).withConverter(
        UserConverter
      )
    ).pipe(map((user) => user ?? null));
  }
}
