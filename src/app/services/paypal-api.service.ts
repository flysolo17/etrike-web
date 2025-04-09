import { Injectable } from '@angular/core';
import {
  environment,
  paypalAPI,
} from '../../environments/environment.development';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { catchError, Observable, switchMap } from 'rxjs';
import { AccessTokenResponse } from '../remote/AccessTokenResponse';
import { CashOutRequest } from '../models/wallet/CashOutRequest';
import { PayPalBatchPayoutRequest } from '../models/wallet/PaypalBatchPayoutRequest';

@Injectable({
  providedIn: 'root',
})
export class PaypalApiService {
  private readonly API_FUNCTION_URL =
    'https://us-central1-etrike-752af.cloudfunctions.net/api/payment';
  private readonly LOCAL_URL =
    'http://127.0.0.1:5001/etrike-752af/us-central1/api/payment';
  constructor(private http: HttpClient) {}
  captureOrder(orderId: string, walletID: string): Observable<any> {
    return this.http.post<any>(`${this.API_FUNCTION_URL}/capture-order`, {
      orderID: orderId,
      walletID: walletID,
    });
  }

  batchPayout(selected: CashOutRequest[]): Observable<any> {
    let payload: PayPalBatchPayoutRequest = {
      sender_batch_header: {
        sender_batch_id: `batch_${new Date().getTime()}`, // Unique ID
        email_subject: 'You have received a payout!',
        email_message: 'You have received a payout from E-Trike.',
        recipient_type: 'EMAIL',
      },
      items: selected
        .filter((cashOut) => cashOut.receiver !== undefined)
        .map((cashOut, index) => ({
          recipient_type: cashOut.recipientType,
          amount: cashOut.amount,
          note: `Payout for ${cashOut.walletID}`,
          sender_item_id: `item_${index + 1}`,
          receiver: cashOut.receiver as string,
        })),
    };

    return this.http.post<any>(
      `${this.API_FUNCTION_URL}/batch-payout`,
      payload
    );
  }
}
