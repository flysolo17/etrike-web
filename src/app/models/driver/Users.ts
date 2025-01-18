import { QueryDocumentSnapshot } from '@angular/fire/firestore';

export enum UserType {
  PASSENGER = 'PASSENGER',
  DRIVER = 'DRIVER',
}

export interface LocationSettings {
  latitude?: number;
  longitude?: number;
  lastUpdated: Date;
  enableTracking: boolean;
}

export interface Pin {
  pin?: string | null;
  biometricEnabled: boolean;
}

export interface User {
  id?: string | null;
  name?: string | null;
  phone?: string | null;
  email?: string | null;
  profile?: string | null;
  active: boolean;
  type?: UserType | null;
  location: LocationSettings;
  pin: Pin;
  createdAt: Date;
}

export const UserConverter = {
  toFirestore: (data: User) => data,
  fromFirestore: (snap: QueryDocumentSnapshot) => {
    const admin = snap.data() as User;
    admin.createdAt = (admin.createdAt as any).toDate();
    return admin;
  },
};
