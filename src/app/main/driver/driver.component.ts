import { Component, inject, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CreateDriverComponent } from './dialogs/create-driver/create-driver.component';
import { DriverService } from '../../services/driver.service';
import {
  countActiveFranchise,
  Franchise,
  getActiveFranchise,
} from '../../models/driver/Franchise';
import { FormControl } from '@angular/forms';
import { map } from 'rxjs';

@Component({
  selector: 'app-driver',
  templateUrl: './driver.component.html',
  styleUrl: './driver.component.css',
})
export class DriverComponent implements OnInit {
  modalService = inject(NgbModal);
  searchTem$ = new FormControl('');
  drivers$ = this.driverService.getDriverWithFranchises();
  filterDrivers$ = this.drivers$;
  createDriver() {
    const modal = this.modalService.open(CreateDriverComponent, {
      size: 'xl',
    });
  }
  constructor(private driverService: DriverService) {}
  ngOnInit(): void {
    this.searchTem$.valueChanges.subscribe((searchTem) => {
      if (searchTem === '') {
        this.filterDrivers$ = this.drivers$;
      } else {
        this.filterDrivers$ = this.drivers$.pipe(
          map((drivers) =>
            drivers.filter(
              (driver) =>
                driver.driver?.name
                  ?.toLowerCase()
                  .includes((searchTem ?? '').toLowerCase()) ||
                driver.franchises.some((franchise) =>
                  franchise.franchiseNumber
                    .toLowerCase()
                    .includes((searchTem ?? '').toLowerCase())
                )
            )
          )
        );
      }
    });
  }

  countActiveFranchise(franchises: Franchise[]): number {
    return countActiveFranchise(franchises);
  }

  getActiveFranchise(franchise: Franchise[]): string[] {
    return getActiveFranchise(franchise);
  }
}
