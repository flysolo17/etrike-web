import { Injectable } from '@angular/core';
import { EncryptionService } from './encryption.service';
import {
  collection,
  collectionData,
  deleteDoc,
  doc,
  docData,
  Firestore,
  getDocs,
  limit,
  query,
  setDoc,
  updateDoc,
  where,
} from '@angular/fire/firestore';
import { catchError, from, map, Observable, of } from 'rxjs';
import {
  Administrator,
  ADMINISTRATOR_COLLECTION,
  AdministratorConverter,
} from '../models/administrator/Administrator';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AdministratorService {
  constructor(
    private encryptionService: EncryptionService,
    private firestore: Firestore,
    private router: Router
  ) {}

  /**
   * Log in an administrator.
   * @param username - The username of the administrator.
   * @param password - The password of the administrator.
   */
  login(username: string, password: string): Observable<boolean> {
    const adminCollection = collection(
      this.firestore,
      ADMINISTRATOR_COLLECTION
    ).withConverter(AdministratorConverter);

    const q = query(
      adminCollection,
      where('username', '==', username),
      limit(1)
    );

    return from(getDocs(q)).pipe(
      map((querySnapshot) => {
        if (!querySnapshot.empty) {
          const admin = querySnapshot.docs[0].data() as Administrator;
          if (this.encryptionService.compare(password, admin.password)) {
            localStorage.setItem('id', admin.id);
            return true;
          }
        }
        return false;
      }),
      catchError((error) => {
        console.error('Error during login:', error);
        return of(false);
      })
    );
  }

  /**
   * Create a new administrator account.
   * @param administrator - The administrator data.
   */
  createAdmin(administrator: Administrator): Promise<void> {
    const adminCollection = collection(
      this.firestore,
      ADMINISTRATOR_COLLECTION
    ).withConverter(AdministratorConverter);
    administrator.password = this.encryptionService.encrypt(
      administrator.password
    );

    return setDoc(
      doc(
        this.firestore,
        ADMINISTRATOR_COLLECTION,
        administrator.id
      ).withConverter(AdministratorConverter),
      administrator
    );
  }

  /**
   * Log out the currently logged-in administrator.
   */
  logout(): void {
    localStorage.clear();

    this.router.navigate(['/login'], { replaceUrl: true });
  }

  /**
   * Get an administrator by ID.
   * @param id - The ID of the administrator.
   * @returns An observable containing the administrator data or null.
   */
  getAdministrator(id: string): Observable<Administrator | null> {
    const adminCollection = collection(
      this.firestore,
      ADMINISTRATOR_COLLECTION
    ).withConverter(AdministratorConverter);
    return docData(doc(adminCollection, id)).pipe(
      map((admin) => admin ?? null)
    );
  }

  /**
   * Update an administrator's details.
   * @param id - The ID of the administrator.
   * @param data - Partial administrator data to update.
   */
  updateAdministrator(id: string, data: Partial<Administrator>): Promise<void> {
    const adminCollection = collection(
      this.firestore,
      ADMINISTRATOR_COLLECTION
    ).withConverter(AdministratorConverter);
    data.updatedAt = new Date();
    return updateDoc(doc(this.firestore, ADMINISTRATOR_COLLECTION, id), data);
  }

  /**
   * Delete an administrator by ID.
   * @param id - The ID of the administrator.
   */
  deleteAdministrator(id: string): Promise<void> {
    const adminCollection = collection(
      this.firestore,
      ADMINISTRATOR_COLLECTION
    ).withConverter(AdministratorConverter);
    return deleteDoc(doc(this.firestore, ADMINISTRATOR_COLLECTION, id));
  }
}
