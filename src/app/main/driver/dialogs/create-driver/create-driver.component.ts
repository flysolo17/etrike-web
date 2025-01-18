import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { User, UserType } from '../../../../models/driver/Users';
import { generateRandomString } from '../../../../utils/Constants';
import { DriverService } from '../../../../services/driver.service';
import {
  Franchise,
  FranchiseStatus,
} from '../../../../models/driver/Franchise';

@Component({
  selector: 'app-create-driver',
  templateUrl: './create-driver.component.html',
  styleUrl: './create-driver.component.css',
})
export class CreateDriverComponent {
  activeModal = inject(NgbActiveModal);
  userAndFranchiseForm$: FormGroup;
  // selectedFile$: File | null = null;

  constructor(private fb: FormBuilder, private driverService: DriverService) {
    this.userAndFranchiseForm$ = this.fb.group({
      name: ['', Validators.required],
      phone: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      type: [UserType.DRIVER],

      franchiseNumber: [generateRandomString(8)],
      licenseNumber: ['', Validators.required],
      expiration: ['', Validators.required],
    });
  }

  // onFileSelected(event: any): void {
  //   this.selectedFile$ = event.target.files[0];
  //   if (this.selectedFile$) {
  //     this.userAndFranchiseForm$.patchValue({
  //       driverLicense: this.selectedFile$.name,
  //     });
  //   }
  // }
  async submit() {
    if (this.userAndFranchiseForm$.valid) {
      const formValues = this.userAndFranchiseForm$.value;

      const user: User = {
        email: formValues.email,
        name: formValues.name,
        phone: formValues.phone,
        type: formValues.type,
        active: false,
        createdAt: new Date(),
        location: {
          lastUpdated: new Date(),
          enableTracking: false,
        },
        pin: {
          biometricEnabled: false,
        },
      };

      const franchise: Franchise = {
        id: formValues.franchiseNumber,
        driverID: '',
        franchiseNumber: formValues.franchiseNumber,
        driverLicense: '',
        licenseNumber: formValues.licenseNumber,
        expiration: formValues.expiration,
        createdAt: new Date(),
        updatedAt: new Date(),
        status: FranchiseStatus.ACTIVE,
      };

      const response = await this.driverService.createDriverAccount(
        user,
        franchise,
        null
      );

      if (response.success) {
        alert('Driver account created successfully.');
        console.log('Driver account created successfully.');
      } else {
        alert(`Error:${response.message}`);
        console.error('Error:', response.message);
      }
    } else {
      console.error('Form is invalid');
    }
  }
}
