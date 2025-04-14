import { Injectable } from '@angular/core';
import {
  collection,
  collectionData,
  doc,
  docData,
  Firestore,
  query,
} from '@angular/fire/firestore';
import { Crash, CrashConverter, CrashWithUsers } from '../models/crashes/Crash';
import { combineLatest, from, map, Observable, of, switchMap } from 'rxjs';
import { PASSENGER_COLLECTION } from './passenger.service';
import { UserConverter } from '../models/driver/Users';
import { user } from '@angular/fire/auth';

const CRASH_COLLECTION = 'crashes';
@Injectable({
  providedIn: 'root',
})
export class CrashesService {
  constructor(private firestore: Firestore) {}

  getAllCrashes(): Observable<CrashWithUsers[]> {
    const q = query(collection(this.firestore, CRASH_COLLECTION)).withConverter(
      CrashConverter
    );

    const crashes$ = collectionData(q) as Observable<
      (Crash & { id: string })[]
    >;

    return crashes$.pipe(
      switchMap((crashes) => {
        const crashWithUsers$ = crashes.map((crash) => {
          const passenger$ = docData(
            doc(
              this.firestore,
              PASSENGER_COLLECTION,
              crash.passengerID + ''
            ).withConverter(UserConverter)
          );
          const driver$ = docData(
            doc(
              this.firestore,
              PASSENGER_COLLECTION,
              crash.driverID + ''
            ).withConverter(UserConverter)
          );

          return combineLatest([passenger$, driver$]).pipe(
            map(([passenger, driver]) => ({
              id: crash.id, // Firestore doc ID
              crash,
              user: passenger,
              driver,
            }))
          );
        });

        return crashWithUsers$.length ? combineLatest(crashWithUsers$) : of([]);
      })
    );
  }
}
