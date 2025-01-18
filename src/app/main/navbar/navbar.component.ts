import { ChangeDetectorRef, Component } from '@angular/core';
import {
  faHouseDamage,
  faUserTie,
  faUsers,
  faCar,
  faFileAlt,
  faCog,
  faFile,
  faQuestionCircle,
  faHouseUser,
  faBars,
  faBox,
} from '@fortawesome/free-solid-svg-icons';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { Router } from '@angular/router';
interface Tabs {
  label: string;
  route: string;
  selectedIcon: IconDefinition;
}
@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent {
  hamburger = faBars;
  tabs: Tabs[] = [
    {
      label: 'Home',
      route: 'home',
      selectedIcon: faBox,
    },
    {
      label: 'Driver',
      route: 'driver',
      selectedIcon: faUserTie,
    },
    {
      label: 'Passenger',
      route: 'passenger',
      selectedIcon: faUsers,
    },
    {
      label: 'Booking',
      route: 'booking',
      selectedIcon: faCar,
    },
    {
      label: 'Report',
      route: 'report',
      selectedIcon: faFileAlt,
    },
    {
      label: 'Administration',
      route: 'administration',
      selectedIcon: faCog,
    },
    {
      label: 'Documents',
      route: 'documents',
      selectedIcon: faFile,
    },
    {
      label: 'Help',
      route: 'help',
      selectedIcon: faQuestionCircle,
    },
  ];

  isCollapsed = false;
  constructor(private cdr: ChangeDetectorRef, private router: Router) {}

  toggleSidebar() {
    this.isCollapsed = !this.isCollapsed;
    this.cdr.detectChanges();
  }
  isRouteActive(route: string): boolean {
    return this.router.url.includes(route);
  }
}
