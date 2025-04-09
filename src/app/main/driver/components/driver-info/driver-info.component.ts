import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-driver-info',
  templateUrl: './driver-info.component.html',
  styleUrl: './driver-info.component.css',
})
export class DriverInfoComponent {
  @Input() title!: string;
  @Input() value!: string;
}
