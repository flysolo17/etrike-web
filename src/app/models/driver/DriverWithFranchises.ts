import { Franchise } from './Franchise';
import { User } from './Users';

export interface DriverWithFranchises {
  driver: User | null;
  franchises: Franchise[];
}
