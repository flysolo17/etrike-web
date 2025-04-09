import { QueryDocumentSnapshot } from '@angular/fire/firestore';

export interface WalletActivity {
  id: string;
  walletID: string;
  totalAmount: number;
  type: string;
  capturedTime: Date;
}

export const WalletActvityConverter = {
  toFirestore: (data: WalletActivity) => data,
  fromFirestore: (snap: QueryDocumentSnapshot) => {
    const data = snap.data() as WalletActivity;
    data.capturedTime = (data.capturedTime as any).toDate();
    return data;
  },
};
