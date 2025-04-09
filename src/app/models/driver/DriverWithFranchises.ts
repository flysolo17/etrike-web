import { Emergency } from '../emergency/emergency';
import { Ratings } from '../ratings/ratings';
import { Reports } from '../report/report';
import { Franchise } from './Franchise';
import { User } from './Users';

export interface DriverWithFranchises {
  driver: User | null;
  franchises: Franchise[];
  report : Reports[];
  ratings : Ratings[];
  emergency : Emergency[];
}
