import { Injectable } from '@angular/core';
import { combineLatest, map, Observable, of, switchMap } from 'rxjs';
import { BookingsWithPassengerAndDriver } from '../models/bookings/BookingsWithPassengerAndDriver';

import {
  collection,
  collectionData,
  doc,
  docData,
  Firestore,
  orderBy,
  query,
} from '@angular/fire/firestore';
import {
  Transactions,
  TransactionsConverter,
} from '../models/transactions/Transactions';
import { PASSENGER_COLLECTION } from './passenger.service';
import { UserConverter } from '../models/driver/Users';
import { USERS_COLLECTION } from './driver.service';

export const BOOKING_COLLECTION = 'transactions';
@Injectable({
  providedIn: 'root',
})
export class BookingService {
  constructor(private firestore: Firestore) {}
  getAllBookings(): Observable<Transactions[]> {
    const q = query(
      collection(this.firestore, BOOKING_COLLECTION).withConverter(
        TransactionsConverter
      ),
      orderBy('updatedAt', 'desc'),
      orderBy('createdAt', 'desc')
    );
    return collectionData(q);
  }
  getBookingWithDriverAndPassenger(): Observable<
    BookingsWithPassengerAndDriver[]
  > {
    const q = query(
      collection(this.firestore, BOOKING_COLLECTION).withConverter(
        TransactionsConverter
      ),
      orderBy('updatedAt', 'desc'),
      orderBy('createdAt', 'desc')
    );

    return collectionData(q, { idField: 'id' }).pipe(
      switchMap((transactions: Transactions[]) =>
        combineLatest(
          transactions.map((transaction) => {
            const passenger$ = transaction.passengerID
              ? docData(
                  doc(
                    this.firestore,
                    PASSENGER_COLLECTION,
                    transaction.passengerID
                  ).withConverter(UserConverter),
                  { idField: 'id' }
                )
              : of(null);

            const driver$ = transaction.driverID
              ? docData(
                  doc(
                    this.firestore,
                    USERS_COLLECTION,
                    transaction.driverID
                  ).withConverter(UserConverter),
                  { idField: 'id' }
                )
              : of(null);

            return combineLatest([passenger$, driver$]).pipe(
              map(([passenger, driver]) => ({
                transactionID: transaction.id,
                transactions: transaction,
                passenger: passenger,
                driver: driver,
              }))
            );
          })
        )
      )
    );
  }
}
