import { Injectable } from '@angular/core';
import { Auth, user } from '@angular/fire/auth';
import { collectionData, Firestore } from '@angular/fire/firestore';
import { User, UserConverter, UserType } from '../models/driver/Users';
import { Franchise, FranchiseConverter } from '../models/driver/Franchise';
import { collection, doc, query, where, writeBatch } from '@firebase/firestore';
import { createUserWithEmailAndPassword } from '@firebase/auth';
import {
  ref,
  uploadBytes,
  getDownloadURL,
  Storage,
} from '@angular/fire/storage';
import { combineLatest, map, Observable } from 'rxjs';
import { DriverWithFranchises } from '../models/driver/DriverWithFranchises';

export const USERS_COLLECTION = 'users';
export const FRANCHISE_COLLECTION = 'franchise';
@Injectable({
  providedIn: 'root',
})
export class DriverService {
  constructor(
    private firestore: Firestore,
    private auth: Auth,
    private storage: Storage
  ) {}

  async createDriverAccount(
    user: User,
    franchise: Franchise,
    driverLicense: File | null
  ) {
    const batch = writeBatch(this.firestore);

    try {
      const result = await createUserWithEmailAndPassword(
        this.auth,
        user.email!,
        franchise.franchiseNumber
      );

      const userRef = doc(
        this.firestore,
        USERS_COLLECTION,
        result.user.uid
      ).withConverter(UserConverter);
      user.id = result.user.uid;
      batch.set(userRef, user);

      const franchiseRef = doc(
        this.firestore,
        FRANCHISE_COLLECTION,
        franchise.id
      ).withConverter(FranchiseConverter);
      franchise.driverID = result.user.uid;
      batch.set(franchiseRef, franchise);
      if (driverLicense != null) {
        const licensePath = `driver_licenses/${result.user.uid}/${driverLicense.name}`;
        const storageRef = ref(this.storage, licensePath);
        await uploadBytes(storageRef, driverLicense);
        const licenseURL = await getDownloadURL(storageRef);

        batch.update(franchiseRef, { driverLicense: licenseURL });
      }

      await batch.commit();
      return { success: true, message: 'Driver account created successfully.' };
    } catch (error: any) {
      console.error('Error creating driver account:', error);
      return { success: false, message: error['message'] };
    }
  }

  getDriverWithFranchises(): Observable<DriverWithFranchises[]> {
    const usersRef = collection(this.firestore, USERS_COLLECTION).withConverter(
      UserConverter
    );
    const franchisesRef = query(
      collection(this.firestore, FRANCHISE_COLLECTION)
    ).withConverter(FranchiseConverter);

    const users = collectionData(
      query(usersRef, where('type', '==', UserType.DRIVER))
    );
    const franchises = collectionData(franchisesRef);

    return combineLatest([users, franchises]).pipe(
      map(([usersList, franchisesList]) => {
        return usersList.map((driver) => {
          const driverFranchises = franchisesList.filter(
            (franchise) => franchise.driverID == driver.id
          );
          return {
            driver,
            franchises: driverFranchises,
          };
        });
      })
    );
  }
}
