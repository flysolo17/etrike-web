import { Component, Input } from '@angular/core';
import { User } from '../../../models/driver/Users';

@Component({
  selector: 'app-driver-layout',
  templateUrl: './driver-layout.component.html',
  styleUrl: './driver-layout.component.css',
})
export class DriverLayoutComponent {
  @Input({ required: true }) user!: User;
}
