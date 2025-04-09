import { Transactions } from '../transactions/Transactions';
import { User } from './Users';

export interface MostActiveUsers {
  id: string;
  user: User | null;
  totalBookings: number;
  transactions: Transactions[];
}
