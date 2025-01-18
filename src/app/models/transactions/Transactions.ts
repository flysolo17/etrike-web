import { QueryDocumentSnapshot } from '@angular/fire/firestore';
import { GooglePlacesInfo } from './GooglePlacesInfo';

export interface Transactions {
  id?: string | null;
  passengerID?: string | null;
  driverID?: string | null;
  franchiseID?: string | null;
  status?: TransactionStatus;
  rideDetails?: GooglePlacesInfo | null;
  locationDetails?: LocationDetails;
  payment?: Payment;
  note?: string | null;
  scheduleDate?: Date | null;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface LocationData {
  name?: string | null;
  latitude?: number;
  longitude?: number;
}

export interface LocationDetails {
  pickup?: LocationData | null;
  dropOff?: LocationData | null;
}

export interface Payment {
  id?: string | null;
  amount?: number;
  method?: PaymentMethod | null;
  status?: PaymentStatus;
  createdAt?: Date;
  updatedAt?: Date;
}

export enum PaymentStatus {
  UNPAID = 'UNPAID',
  PAID = 'PAID',
}

export enum PaymentMethod {
  WALLET = 'WALLET',
  CASH = 'CASH',
}

export interface Location {
  latitude: number;
  longitude: number;
}

export enum TransactionStatus {
  PENDING = 'PENDING',
  ACCEPTED = 'ACCEPTED',
  CONFIRMED = 'CONFIRMED',
  OTW = 'OTW',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
  FAILED = 'FAILED',
}

export const TransactionsConverter = {
  toFirestore: (data: Transactions) => data,
  fromFirestore: (snap: QueryDocumentSnapshot) => {
    const transaction = snap.data() as Transactions;
    transaction.createdAt = (transaction.createdAt as any).toDate();
    transaction.updatedAt = (transaction.updatedAt as any).toDate();
    transaction.scheduleDate = (
      (transaction.scheduleDate as any) ?? null
    )?.toDate();
    if (transaction.payment) {
      transaction.payment.createdAt = (
        transaction.payment.createdAt as any
      ).toDate();
      transaction.payment.updatedAt = (
        transaction.payment.updatedAt as any
      ).toDate();
    }
    return transaction;
  },
};
