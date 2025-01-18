import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { NavbarComponent } from './main/navbar/navbar.component';
import { HomeComponent } from './main/home/home.component';
import { DriverComponent } from './main/driver/driver.component';
import { UsersComponent } from './main/users/users.component';
import { ReportComponent } from './main/report/report.component';
import { AdministrationComponent } from './main/administration/administration.component';
import { DocumentsComponent } from './main/documents/documents.component';
import { HelpComponent } from './main/help/help.component';
import { BookingComponent } from './main/booking/booking.component';

const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'main',
    component: NavbarComponent,
    children: [
      {
        path: '',
        component: HomeComponent,
      },
      {
        path: 'home',
        component: HomeComponent,
      },
      {
        path: 'driver',
        component: DriverComponent,
      },
      {
        path: 'passenger',
        component: UsersComponent,
      },
      {
        path: 'booking',
        component: BookingComponent,
      },
      {
        path: 'report',
        component: ReportComponent,
      },
      {
        path: 'administration',
        component: AdministrationComponent,
      },
      {
        path: 'documents',
        component: DocumentsComponent,
      },
      {
        path: 'help',
        component: HelpComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
