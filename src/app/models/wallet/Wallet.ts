import { QueryDocumentSnapshot } from '@angular/fire/firestore';

export interface Wallet {
  id?: string;
  amount: number;
  phone?: string;
  email?: string;
  createdAt: Date;
  updatedAt: Date;
}

export const WalletConverter = {
  toFirestore: (data: Wallet) => data,
  fromFirestore: (snap: QueryDocumentSnapshot) => {
    const data = snap.data() as Wallet;
    data.createdAt = (data.createdAt as any).toDate();
    data.updatedAt = (data.updatedAt as any).toDate();
    return data;
  },
};
