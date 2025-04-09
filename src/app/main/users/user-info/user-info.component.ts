import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-user-info',
  templateUrl: './user-info.component.html',
  styleUrl: './user-info.component.css',
})
export class UserInfoComponent {
  @Input({ required: true }) data: string = '';
  @Input({ required: true }) value: string = '';
}
