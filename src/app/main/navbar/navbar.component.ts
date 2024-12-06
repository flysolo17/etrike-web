import { Component } from '@angular/core';

interface Tabs {
  label: string;
  route: string;
}
@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent {
  tabs: Tabs[] = [
    {
      label: 'Home',
      route: 'home',
    },
    {
      label: 'Drivers',
      route: 'drivers',
    },
    {
      label: 'Passengers',
      route: 'users',
    },
    {
      label: 'Booking',
      route: 'users',
    },
  ];
  activeTab = 'home';
}
