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
import { ViewDriverComponent } from './main/driver/view-driver/view-driver.component';
import { CompleteOrderComponent } from './payment/complete-order/complete-order.component';
import { CancelOrderComponent } from './payment/cancel-order/cancel-order.component';
import { PayoutsComponent } from './main/payouts/payouts.component';
import { ViewUserComponent } from './main/users/view-user/view-user.component';

const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  {
    path: 'login',
    component: LoginComponent,
  },

  {
    path: 'complete-order/:id',
    component: CompleteOrderComponent,
  },

  {
    path: 'cancel-order/:id',
    component: CancelOrderComponent,
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
        path: 'driver/:id',
        component: ViewDriverComponent,
      },
      {
        path: 'users',
        component: UsersComponent,
      },
      {
        path: 'users/:id',
        component: ViewUserComponent,
      },
      {
        path: 'booking',
        component: BookingComponent,
      },
      {
        path: 'payouts',
        component: PayoutsComponent,
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
