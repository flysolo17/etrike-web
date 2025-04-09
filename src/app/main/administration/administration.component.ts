import { Component, OnInit } from '@angular/core';
import { AdministratorService } from '../../services/administrator.service';
import { Administrator } from '../../models/administrator/Administrator';
import { generateRandomString } from '../../utils/Constants';
import { Observable, of } from 'rxjs';

@Component({
  selector: 'app-administration',
  templateUrl: './administration.component.html',
  styleUrl: './administration.component.css',
})
export class AdministrationComponent implements OnInit {
  admin$: Observable<Administrator | null> = of(null);
  constructor(private administratorService: AdministratorService) {}
  ngOnInit(): void {
    let id = localStorage.getItem('id');
    if (id !== null) {
      this.admin$ = this.administratorService.getAdministrator(id);
    }
  }

  createAdmin() {
    let admin: Administrator = {
      id: generateRandomString(),
      profile: '',
      name: 'Admin',
      username: 'admin',
      password: 'admin',
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.administratorService.createAdmin(admin);
  }
  logout() {
    this.administratorService.logout();
  }
}
