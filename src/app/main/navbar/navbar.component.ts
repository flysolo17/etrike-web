import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
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
import { AdministratorService } from '../../services/administrator.service';
import { faPaypal } from '@fortawesome/free-brands-svg-icons';
import { Administrator } from '../../models/administrator/Administrator';
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
export class NavbarComponent implements OnInit {
  hamburger = faBars;
  tabs: Tabs[] = [
    {
      label: 'Home',
      route: 'home',
      selectedIcon: faBox,
    },
    {
      label: 'Users',
      route: 'users',
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
      label: 'Payouts',
      route: 'payouts',
      selectedIcon: faPaypal,
    },
  ];

  admin$: Administrator | null = null;
  constructor(
    private cdr: ChangeDetectorRef,
    private router: Router,
    private administratorService: AdministratorService
  ) {}
  ngOnInit(): void {
    let id = localStorage.getItem('id');
    if (id !== null) {
      this.administratorService.getAdministrator(id).subscribe((data) => {
        this.admin$ = data;
      });
    }
  }

  logout() {
    this.administratorService.logout();
  }

  isRouteActive(route: string): boolean {
    return this.router.url.includes(route);
  }
}
