import { Injectable } from '@angular/core';
import {
  collection,
  collectionData,
  doc,
  Firestore,
  increment,
  orderBy,
  query,
  updateDoc,
  writeBatch,
} from '@angular/fire/firestore';
import { WalletConverter } from '../models/wallet/Wallet';
import { Observable } from 'rxjs';
import {
  CashOutRequest,
  CashOutRequestCoverter,
  CashOutStatus,
} from '../models/wallet/CashOutRequest';
import { WalletActivity } from '../models/wallet/Activity';

export const WALLET_COLLECTION = 'wallets';
export const WALLET_ACTIVITY_COLLECTION = 'activity';
export const PAYOUT_COLLECTION = 'payouts';
@Injectable({
  providedIn: 'root',
})
export class WalletService {
  constructor(private firestore: Firestore) {}
  addCashByWalletId(id: string, amount: number) {
    return updateDoc(
      doc(this.firestore, WALLET_COLLECTION, id).withConverter(WalletConverter),
      {
        amount: increment(amount),
      }
    );
  }

  getAllPayouts(): Observable<CashOutRequest[]> {
    const q = query(
      collection(this.firestore, PAYOUT_COLLECTION).withConverter(
        CashOutRequestCoverter
      ),
      orderBy('updatedAt', 'desc')
    );
    return collectionData(q);
  }

  payoutSuccess(selected: CashOutRequest[]) {
    const batch = writeBatch(this.firestore);

    selected.forEach((e) => {
      if (e.id !== undefined) {
        const cashoutRef = doc(this.firestore, PAYOUT_COLLECTION, e.id);
        const activityRef = doc(
          this.firestore,
          WALLET_ACTIVITY_COLLECTION,
          e.id
        );

        const activity: WalletActivity = {
          totalAmount: Number(e.amount.value),
          capturedTime: new Date(),
          id: e.id,
          walletID: e.walletID ?? '',
          type: 'PAYOUT_COMPLETED',
        };

        batch.set(activityRef, activity); // Add new wallet activity
        batch.update(cashoutRef, { status: CashOutStatus.COMPLETED }); // Update cashout request status
      }
    });

    batch
      .commit()
      .then(() => {
        console.log('Batch payout recorded successfully.');
      })
      .catch((error) => {
        console.error('Batch Payout Failed:', error);
      });
  }
}
