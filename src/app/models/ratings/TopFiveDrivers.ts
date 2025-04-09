import { User } from '../driver/Users';
import { Ratings } from './ratings';

export interface TopFiveDrivers {
  id: string;
  driver: User | null;
  ratings: Ratings[];
  total: number;
}
