import { Component, Input, OnInit } from '@angular/core';
import { User } from '../../../models/driver/Users';
import { faArrowLeft, faBackward } from '@fortawesome/free-solid-svg-icons';
import { AuthService } from '../../../services/auth.service';
import { Observable, of } from 'rxjs';
import { Contacts } from '../../../models/driver/Contacts';

@Component({
  selector: 'app-passenger-layout',
  templateUrl: './passenger-layout.component.html',
  styleUrl: './passenger-layout.component.css',
})
export class PassengerLayoutComponent implements OnInit {
  @Input({ required: true }) user!: User;
  faBack = faArrowLeft;

  contacts$: Observable<Contacts[]> = of([]);
  constructor(private authService: AuthService) {}
  ngOnInit(): void {
    this.contacts$ = this.authService.getPassengerContacts(this.user.id!);
  }
}
