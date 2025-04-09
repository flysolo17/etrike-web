export interface PayPalBatchPayoutRequest {
  sender_batch_header: {
    sender_batch_id: string;
    email_subject?: string;
    email_message?: string;
    recipient_type?: 'EMAIL' | 'PHONE' | 'PAYPAL_ID';
  };
  items: {
    recipient_type: 'EMAIL' | 'PHONE' | 'PAYPAL_ID';
    amount: {
      value: string;
      currency: string;
    };
    note?: string;
    sender_item_id: string;
    receiver: string;
  }[];
}
