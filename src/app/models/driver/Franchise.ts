import { QueryDocumentSnapshot, Timestamp } from '@angular/fire/firestore';

export interface Franchise {
  id: string;
  driverID: string;
  franchiseNumber: string;
  driverLicense: string;
  licenseNumber: string;
  status: FranchiseStatus;
  expiration: string;
  createdAt: Date;
  updatedAt: Date;
}
export enum FranchiseStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  SUSPENDED = 'SUSPENDED',
  PENDING = 'PENDING',
}

export function countActiveFranchise(franchises: Franchise[]): number {
  let count = 0;
  franchises.forEach((e) => {
    if (e.status == FranchiseStatus.ACTIVE) {
      count += 1;
    }
  });
  return count;
}
export function getActiveFranchise(franchise: Franchise[]): string[] {
  let data = franchise
    .filter((e) => e.status == FranchiseStatus.ACTIVE)
    .map((e) => e.franchiseNumber);
  return data;
}

export const FranchiseConverter = {
  toFirestore: (data: Franchise) => data,
  fromFirestore: (snap: QueryDocumentSnapshot) => {
    const data = snap.data() as Franchise;
    data.createdAt = (data.createdAt as any).toDate();
    data.updatedAt = (data.updatedAt as any).toDate();

    return data;
  },
};
