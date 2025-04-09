import { Injectable } from '@angular/core';

import {
  collection,
  collectionData,
  doc,
  docData,
  Firestore,
  getDoc,
  getDocs,
  orderBy,
  query,
} from '@angular/fire/firestore';
import { map, Observable } from 'rxjs';
import { User, UserConverter } from '../models/driver/Users';
import { USERS_COLLECTION } from './driver.service';
import { BOOKING_COLLECTION } from './booking.service';
import {
  Transactions,
  TransactionsConverter,
} from '../models/transactions/Transactions';
import { MostActiveUsers } from '../models/driver/MostActiveUsers';
import { AUTH_PROVIDER_NAME } from '@angular/fire/auth/auth';
import { PASSENGER_COLLECTION } from './passenger.service';
import { Contacts } from '../models/driver/Contacts';

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

  async getMostActiveUsers(): Promise<MostActiveUsers[]> {
    const bookingQuery = query(
      collection(this.firestore, BOOKING_COLLECTION).withConverter(
        TransactionsConverter
      )
    );

    const bookingsSnapshot = await getDocs(bookingQuery);

    const userTransactions: Record<string, Transactions[]> = {};

    bookingsSnapshot.forEach((doc) => {
      const transaction = doc.data();
      const passengerID = transaction.passengerID;

      if (passengerID) {
        if (!userTransactions[passengerID]) {
          userTransactions[passengerID] = [];
        }
        userTransactions[passengerID].push(transaction);
      }
    });

    const topUsers = Object.entries(userTransactions)
      .sort((a, b) => b[1].length - a[1].length)
      .slice(0, 5)
      .map(([passengerID, transactions]) => ({
        id: passengerID,
        totalBookings: transactions.length,
        transactions,
      }));

    const topUsersWithDetails: MostActiveUsers[] = await Promise.all(
      topUsers.map(async (user) => {
        const userDoc = await getDoc(
          doc(this.firestore, USERS_COLLECTION, user.id).withConverter(
            UserConverter
          )
        );

        return {
          ...user,
          user: userDoc.exists() ? userDoc.data() : null,
        };
      })
    );

    return topUsersWithDetails;
  }

  getUserByID(id: string): Observable<User | null> {
    return docData(
      doc(this.firestore, USERS_COLLECTION, id).withConverter(UserConverter)
    ).pipe(map((user) => user ?? null));
  }

  getPassengerContacts(id: string): Observable<Contacts[]> {
    const path = `users/${id}/contacts`;
    const ref = collection(this.firestore, path);

    return collectionData(ref, { idField: 'id' }) as Observable<Contacts[]>;
  }
}
