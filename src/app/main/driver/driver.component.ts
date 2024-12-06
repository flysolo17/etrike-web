import { Component, inject } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CreateDriverComponent } from './dialogs/create-driver/create-driver.component';
import { DriverService } from '../../services/driver.service';
import {
  countActiveFranchise,
  Franchise,
  getActiveFranchise,
} from '../../models/driver/Franchise';

@Component({
  selector: 'app-driver',
  templateUrl: './driver.component.html',
  styleUrl: './driver.component.css',
})
export class DriverComponent {
  modalService = inject(NgbModal);
  drivers$ = this.driverService.getDriverWithFranchises();

  createDriver() {
    const modal = this.modalService.open(CreateDriverComponent, {
      size: 'xl',
    });
  }
  constructor(private driverService: DriverService) {}

  countActiveFranchise(franchises: Franchise[]): number {
    return countActiveFranchise(franchises);
  }
  getActiveFranchise(franchise: Franchise[]): string[] {
    return getActiveFranchise(franchise);
  }
}
