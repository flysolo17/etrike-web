import { User } from '../driver/Users';
import { Transactions } from '../transactions/Transactions';

export interface BookingsWithPassengerAndDriver {
  transactionID?: string | null;
  transactions?: Transactions | null;
  passenger?: User | null;
  driver?: User | null;
}
