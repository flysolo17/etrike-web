import { QueryDocumentSnapshot } from '@angular/fire/firestore';

export interface CashOutRequest {
  id?: string;
  walletID?: string;
  amount: Amount;
  status: CashOutStatus;
  recipientType: RecipientType;
  receiver?: string;
  createdAt: Date;
  updatedAt: Date;
}

export const CashOutRequestCoverter = {
  toFirestore: (data: CashOutRequest) => data,
  fromFirestore: (snap: QueryDocumentSnapshot) => {
    const data = snap.data() as CashOutRequest;
    data.createdAt = (data.createdAt as any).toDate();
    data.updatedAt = (data.updatedAt as any).toDate();
    return data;
  },
};

export interface Amount {
  value: string;
  currency: string;
}

export enum CashOutStatus {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  CANCELLED = 'CANCELLED',
}

enum RecipientType {
  EMAIL = 'EMAIL',
  PHONE = 'PHONE',
  PAYPAL_ID = 'PAYPAL_ID',
}
