import { Injectable } from '@angular/core';
import { Auth, user } from '@angular/fire/auth';
import {
  collectionData,
  docData,
  Firestore,
  getDocs,
} from '@angular/fire/firestore';
import { User, UserConverter, UserType } from '../models/driver/Users';
import {
  Franchise,
  FranchiseConverter,
  FranchiseStatus,
} from '../models/driver/Franchise';
import {
  collection,
  doc,
  getDoc,
  orderBy,
  query,
  updateDoc,
  where,
  writeBatch,
} from '@firebase/firestore';
import { createUserWithEmailAndPassword } from '@firebase/auth';
import {
  ref,
  uploadBytes,
  getDownloadURL,
  Storage,
} from '@angular/fire/storage';
import {
  catchError,
  combineLatest,
  map,
  Observable,
  of,
  switchMap,
} from 'rxjs';
import { DriverWithFranchises } from '../models/driver/DriverWithFranchises';
import {
  Ratings,
  RATINGS_COLLECTION,
  RatingsConverter,
} from '../models/ratings/ratings';
import {
  EMERGENCY_COLLECTION,
  EmergencyConverter,
} from '../models/emergency/emergency';
import { REPORTS_COLLECTION, ReportsConverter } from '../models/report/report';
import {
  Transactions,
  TransactionsConverter,
} from '../models/transactions/Transactions';
import { BOOKING_COLLECTION } from './booking.service';
import { TopFiveDrivers } from '../models/ratings/TopFiveDrivers';

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

  getDriverWithFranchices(driverID: string): Observable<DriverWithFranchises> {
    const franchisesRef = collection(
      this.firestore,
      FRANCHISE_COLLECTION
    ).withConverter(FranchiseConverter);

    const driver$ = docData(
      doc(this.firestore, USERS_COLLECTION, driverID).withConverter(
        UserConverter
      )
    ).pipe(catchError(() => of(null)));

    const franchises$ = collectionData(
      query(franchisesRef, where('driverID', '==', driverID))
    );

    const ratings$ = collectionData(
      query(
        collection(this.firestore, RATINGS_COLLECTION).withConverter(
          RatingsConverter
        ),
        where('driverID', '==', driverID)
      )
    );

    const emergency$ = collectionData(
      query(
        collection(this.firestore, EMERGENCY_COLLECTION).withConverter(
          EmergencyConverter
        ),
        where('driverInfo.id', '==', driverID)
      )
    );

    const reports$ = collectionData(
      query(
        collection(this.firestore, REPORTS_COLLECTION).withConverter(
          ReportsConverter
        ),
        where('driver.id', '==', driverID)
      )
    );

    return combineLatest([
      driver$,
      franchises$,
      ratings$,
      emergency$,
      reports$,
    ]).pipe(
      map(([driver, franchises, ratings, emergency, reports]) => ({
        driver: driver ?? null,
        franchises,
        ratings,
        emergency,
        report: reports,
      }))
    );
  }

  getDriverWithFranchises(): Observable<DriverWithFranchises[]> {
    const usersRef = collection(this.firestore, USERS_COLLECTION).withConverter(
      UserConverter
    );
    const franchisesRef = collection(
      this.firestore,
      FRANCHISE_COLLECTION
    ).withConverter(FranchiseConverter);

    const users$ = collectionData(
      query(usersRef, where('type', '==', UserType.DRIVER))
    );
    const franchises$ = collectionData(franchisesRef);

    return combineLatest([users$, franchises$]).pipe(
      switchMap(([usersList, franchisesList]) => {
        return combineLatest(
          usersList.map((driver) => {
            const driverFranchises = franchisesList.filter(
              (franchise) => franchise.driverID === driver.id
            );

            const ratings$ = collectionData(
              query(
                collection(this.firestore, RATINGS_COLLECTION).withConverter(
                  RatingsConverter
                ),
                where('driverID', '==', driver.id)
              )
            );

            const emergency$ = collectionData(
              query(
                collection(this.firestore, EMERGENCY_COLLECTION).withConverter(
                  EmergencyConverter
                ),
                where('driverInfo.id', '==', driver.id)
              )
            );

            const reports$ = collectionData(
              query(
                collection(this.firestore, REPORTS_COLLECTION).withConverter(
                  ReportsConverter
                ),
                where('driver.id', '==', driver.id)
              )
            );

            return combineLatest([ratings$, emergency$, reports$]).pipe(
              map(([ratings, emergency, reports]) => ({
                driver,
                franchises: driverFranchises,
                ratings,
                emergency,
                report: reports,
              }))
            );
          })
        );
      }),

      map((driversWithData) => driversWithData.flat())
    );
  }

  getMyTransactions(driverID: string): Observable<Transactions[]> {
    const q = query(
      collection(this.firestore, BOOKING_COLLECTION).withConverter(
        TransactionsConverter
      ),
      where('driverID', '==', driverID),
      orderBy('updatedAt', 'desc')
    );
    return collectionData(q);
  }
  updateFranchiseStatus(id: string, status: FranchiseStatus) {
    return updateDoc(
      doc(this.firestore, FRANCHISE_COLLECTION, id).withConverter(
        FranchiseConverter
      ),
      {
        status: status,
        updatedAt: new Date(),
      }
    );
  }

  async getTopFiveDrivers(): Promise<TopFiveDrivers[]> {
    const getAllRatings = collection(
      this.firestore,
      RATINGS_COLLECTION
    ).withConverter(RatingsConverter);
    const result = await getDocs(getAllRatings);

    const ratingsMap = new Map<string, Ratings[]>();

    result.docs.forEach((doc) => {
      const data = doc.data();
      const driverID = data.driverID as string;

      if (driverID) {
        if (!ratingsMap.has(driverID)) {
          ratingsMap.set(driverID, []);
        }
        ratingsMap.get(driverID)?.push(data);
      }
    });

    const topDrivers: TopFiveDrivers[] = await Promise.all(
      Array.from(ratingsMap.entries()).map(async ([driverID, ratings]) => {
        const driverDoc = await getDoc(
          doc(this.firestore, USERS_COLLECTION, driverID)
        );
        const driver = driverDoc.exists() ? (driverDoc.data() as User) : null;
        // Calculate total stars
        const totalStars = ratings.reduce(
          (sum, rating) => sum + (rating.stars || 0),
          0
        );
        return {
          id: driverID,
          driver,
          ratings,
          total: totalStars,
        };
      })
    );

    return topDrivers.sort((a, b) => b.total - a.total).slice(0, 5);
  }
}
