import { Component, Input } from '@angular/core';
import { User } from '../../models/driver/Users';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.css',
})
export class UserProfileComponent {
  @Input() user?: User | null;
}
