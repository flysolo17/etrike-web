import { Component, OnInit } from '@angular/core';
import { PassengerService } from '../../services/passenger.service';
import { FormControl } from '@angular/forms';
import { map, Observable, of } from 'rxjs';
import { User } from '../../models/driver/Users';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrl: './users.component.css',
})
export class UsersComponent implements OnInit {
  searrchTerm$ = new FormControl('');
  passengers$ = this.passengerService.getAllPassengers();
  filteredPassengers$: Observable<User[]> = this.passengers$;
  constructor(private passengerService: PassengerService) {}
  ngOnInit() {
    this.searrchTerm$.valueChanges.subscribe((term) => {
      this.filteredPassengers$ = this.passengers$.pipe(
        map((passengers) =>
          passengers.filter((passenger) =>
            passenger?.name?.toLowerCase().includes((term ?? '').toLowerCase())
          )
        )
      );
    });
  }
}
