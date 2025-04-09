import { Component, inject, OnInit } from '@angular/core';
import { PassengerService } from '../../services/passenger.service';
import { FormControl } from '@angular/forms';
import {
  BehaviorSubject,
  combineLatest,
  map,
  Observable,
  of,
  shareReplay,
  startWith,
} from 'rxjs';
import { User, UserType } from '../../models/driver/Users';
import { DriverService } from '../../services/driver.service';
import { DriverWithFranchises } from '../../models/driver/DriverWithFranchises';
import {
  Franchise,
  countActiveFranchise,
  getActiveFranchise,
  FranchiseStatus,
} from '../../models/driver/Franchise';
import { ToastrService } from 'ngx-toastr';
import { CreateDriverComponent } from '../driver/dialogs/create-driver/create-driver.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrl: './users.component.css',
})
export class UsersComponent implements OnInit {
  modalService = inject(NgbModal);

  searrchTerm$ = new FormControl('');
  users$ = this.authService.getAllUSers().pipe(shareReplay(1));

  passengers$ = this.users$.pipe(
    map((e) => e.filter((user) => user.type === UserType.PASSENGER).length)
  );
  driver$ = this.users$.pipe(
    map((e) => e.filter((user) => user.type === UserType.DRIVER).length)
  );

  activerUsers$ = this.users$.pipe(
    map((e) => e.filter((user) => user.active).length)
  );
  inActiveUsers$ = this.users$.pipe(
    map((e) => e.filter((user) => !user.active).length)
  );

  tabs = ['ALL', 'PASSENGER', 'DRIVER'];
  selectedTab$ = 'ALL';
  searchTerm$ = new FormControl('');

  filteredUsers$ = new BehaviorSubject<User[]>([]);

  constructor(
    private authService: AuthService,
    private passengerService: PassengerService,
    private driverService: DriverService,
    private toastr: ToastrService
  ) {}
  ngOnInit() {
    this.selectTab(this.tabs[0]);
    this.searrchTerm$.valueChanges.subscribe((term) => {
      this.updateFilteredUsers();
    });
  }
  selectTab(select: string): void {
    this.selectedTab$ = select;
    this.updateFilteredUsers();
  }
  updateFilteredUsers() {
    const term = this.searchTerm$.value?.toLowerCase() ?? '';
    this.users$
      .pipe(
        map((users) =>
          users.filter((user) => {
            const isAll = this.selectedTab$ === 'ALL';
            const matchesTab = isAll || user.type === this.selectedTab$;
            const matchesSearch =
              (user.name ?? '').toLowerCase().includes(term) ||
              (user.email ?? '').toLowerCase().includes(term);

            return matchesTab && matchesSearch;
          })
        )
      )
      .subscribe((filtered) => this.filteredUsers$.next(filtered));
  }

  createDriver() {
    const modal = this.modalService.open(CreateDriverComponent, {
      size: 'md',
    });
  }
  countActiveFranchise(franchises: Franchise[]): number {
    return countActiveFranchise(franchises);
  }
  getActiveFranchise(franchise: Franchise[]): string[] {
    return getActiveFranchise(franchise);
  }

  updateFranchiseStatus(status: FranchiseStatus, franchise: Franchise[]) {
    if (franchise.length < 1) {
      this.toastr.error('no  franchise yet');
      return;
    }
    const active = franchise[0];
    this.driverService
      .updateFranchiseStatus(active.id, status)
      .then((data) => this.toastr.success('Successfully Updated'))
      .catch((e) => this.toastr.error(e['message']));
  }

  activeUsers(drivers: DriverWithFranchises[], passenger: User[]): number {
    return (
      drivers.filter((e) => e.driver?.active).length +
      passenger.filter((e) => e.active).length
    );
  }
  inActive(drivers: DriverWithFranchises[], passenger: User[]): number {
    return (
      drivers.filter((e) => !e.driver?.active).length +
      passenger.filter((e) => !e.active).length
    );
  }
}
