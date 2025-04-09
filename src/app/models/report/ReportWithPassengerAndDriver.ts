import { User } from '../driver/Users';
import { Reports } from './report';

export interface ReportPassengerAndDriver {
  report: Reports | null;
  passenger: User | null;
  driver: User | null;
}
