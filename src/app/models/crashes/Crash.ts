import { QueryDocumentSnapshot } from '@angular/fire/firestore';
import { User } from '../driver/Users';

export interface CrashWithUsers {
  id: string;
  crash: Crash;
  driver?: User | null;
  user?: User | null;
}
export interface Crash {
  driverID?: string;
  passengerID?: string;
  impact?: string;
  status: CrashStatus;
  location?: string;
  createdAt: Date;
  updatedAt: Date;
}

export enum CrashStatus {
  PENDING = 'PENDING',
  SUSPENDED = 'SUSPENDED',
  RESOLVED = 'RESOLVED',
}

export const CrashConverter = {
  toFirestore: (data: Crash) => data,
  fromFirestore: (snap: QueryDocumentSnapshot) => {
    const data = snap.data() as Crash;
    data.createdAt = (data.createdAt as any).toDate();
    data.updatedAt = (data.updatedAt as any).toDate();
    return data;
  },
};
