import { Injectable } from '@angular/core';

import { collection, collectionData, Firestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { User, UserConverter } from '../models/driver/Users';
import { USERS_COLLECTION } from './driver.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private firestore: Firestore) {}
  getAllUSers(): Observable<User[]> {
    return collectionData(
      collection(this.firestore, USERS_COLLECTION).withConverter(UserConverter)
    );
  }
}
