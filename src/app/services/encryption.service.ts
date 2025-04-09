import { Injectable } from '@angular/core';
import CryptoJS from 'crypto-js';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class EncryptionService {
  constructor() {}

  /**
   * Compares a plain text password with an encrypted password.
   * @param plainPassword - The plain text password.
   * @param encryptedPassword - The encrypted password.
   * @returns A boolean indicating whether the passwords match.
   */
  compare(plainPassword: string, encryptedPassword: string): boolean {
    try {
      const decryptedPassword = this.decrypt(encryptedPassword);
      return plainPassword === decryptedPassword;
    } catch (error) {
      console.error('Error comparing passwords:', error);
      return false;
    }
  }
  encrypt(password: string): string {
    return CryptoJS.AES.encrypt(password, environment.projectId).toString();
  }

  decrypt(encryptedPassword: string): string {
    const bytes = CryptoJS.AES.decrypt(
      encryptedPassword,
      environment.projectId
    );
    return bytes.toString(CryptoJS.enc.Utf8);
  }
}
