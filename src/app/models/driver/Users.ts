import { QueryDocumentSnapshot } from '@angular/fire/firestore';

export interface User {
  id?: string;
  name?: string;
  phone?: string;
  email?: string;
  profile?: string;
  active: boolean;
  type?: UserType;
  createdAt: Date;
}

export enum UserType {
  PASSENGER = 'PASSENGER',
  DRIVER = 'DRIVER',
}

export const UserConverter = {
  toFirestore: (data: User) => data,
  fromFirestore: (snap: QueryDocumentSnapshot) => {
    const admin = snap.data() as User;
    admin.createdAt = (admin.createdAt as any).toDate();
    return admin;
  },
};
