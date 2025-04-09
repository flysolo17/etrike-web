import { QueryDocumentSnapshot } from '@angular/fire/firestore';

export const ADMINISTRATOR_COLLECTION = 'administrator';
export interface Administrator {
  id: string;
  profile: string;
  name: string;
  username: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
}

export const AdministratorConverter = {
  toFirestore: (data: Administrator) => data,
  fromFirestore: (snap: QueryDocumentSnapshot) => {
    const admin = snap.data() as Administrator;
    admin.createdAt = (admin.createdAt as any).toDate();
    admin.updatedAt = (admin.updatedAt as any).toDate();
    return admin;
  },
};
