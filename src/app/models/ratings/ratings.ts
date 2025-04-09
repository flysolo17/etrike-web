import { QueryDocumentSnapshot } from '@angular/fire/firestore';

export interface Ratings {
  id?: string | null;
  transactionID?: string | null;
  userID?: string | null;
  driverID?: string | null;
  stars: number;
  message?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export const RatingsConverter = {
  toFirestore: (data: Ratings) => data,
  fromFirestore: (snap: QueryDocumentSnapshot) => {
    const data = snap.data() as Ratings;
    data.createdAt = (data.createdAt as any).toDate();
    data.updatedAt = (data.updatedAt as any).toDate();
    return data;
  },
};

export const RATINGS_COLLECTION = 'ratings';
