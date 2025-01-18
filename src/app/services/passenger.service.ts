import { Injectable } from '@angular/core';
import {
  collection,
  collectionData,
  Firestore,
  query,
  where,
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { User, UserConverter, UserType } from '../models/driver/Users';

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
}
