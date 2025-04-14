import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { getStorage, provideStorage } from '@angular/fire/storage';
import { LoginComponent } from './auth/login/login.component';
import { NavbarComponent } from './main/navbar/navbar.component';
import { HomeComponent } from './main/home/home.component';
import { DriverComponent } from './main/driver/driver.component';
import { UsersComponent } from './main/users/users.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CreateDriverComponent } from './main/driver/dialogs/create-driver/create-driver.component';
import { BookingComponent } from './main/booking/booking.component';
import { ReportComponent } from './main/report/report.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AdministrationComponent } from './main/administration/administration.component';
import { DocumentsComponent } from './main/documents/documents.component';
import { HelpComponent } from './main/help/help.component';
import { UserProfileComponent } from './shared/user-profile/user-profile.component';
import { DriverCardComponent } from './main/driver/components/driver-card/driver-card.component';
import { ViewDriverComponent } from './main/driver/view-driver/view-driver.component';
import { DriverInfoComponent } from './main/driver/components/driver-info/driver-info.component';
import { RatingCardComponent } from './main/driver/components/rating-card/rating-card.component';
import { ReportCardComponent } from './main/report/components/report-card/report-card.component';
import { environment } from '../environments/environment.development';
import { ToastrModule } from 'ngx-toastr';
import { CommonModule } from '@angular/common';
import { CompleteOrderComponent } from './payment/complete-order/complete-order.component';
import { CancelOrderComponent } from './payment/cancel-order/cancel-order.component';
import { HttpClientModule } from '@angular/common/http';
import { PayoutsComponent } from './main/payouts/payouts.component';
import { DateRangePickerComponent } from './main/booking/components/date-range-picker/date-range-picker.component';
import { DownloadDialogComponent } from './main/booking/components/download-dialog/download-dialog.component';
import { CanvasJSAngularChartsModule } from '@canvasjs/angular-charts';
import { FormatNumberPipe } from './main/home/format.number.pipe';
import { ViewUserComponent } from './main/users/view-user/view-user.component';
import { PassengerLayoutComponent } from './main/users/passenger-layout/passenger-layout.component';
import { DriverLayoutComponent } from './main/users/driver-layout/driver-layout.component';
import { UserInfoComponent } from './main/users/user-info/user-info.component';
import { CreateDocumentModalComponent } from './main/users/create-document-modal/create-document-modal.component';
import { DocumentCardComponent } from './main/users/document-card/document-card.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    NavbarComponent,
    HomeComponent,
    DriverComponent,
    UsersComponent,
    CreateDriverComponent,
    BookingComponent,
    ReportComponent,
    AdministrationComponent,
    DocumentsComponent,
    HelpComponent,
    UserProfileComponent,
    DriverCardComponent,
    ViewDriverComponent,
    DriverInfoComponent,
    RatingCardComponent,
    ReportCardComponent,
    CompleteOrderComponent,
    CancelOrderComponent,
    PayoutsComponent,
    DateRangePickerComponent,
    DownloadDialogComponent,
    ViewUserComponent,
    PassengerLayoutComponent,
    DriverLayoutComponent,
    UserInfoComponent,
    CreateDocumentModalComponent,
    DocumentCardComponent,
  ],
  imports: [
    BrowserModule,
    FormatNumberPipe,
    AppRoutingModule,
    NgbModule,
    ReactiveFormsModule,
    FormsModule,
    FontAwesomeModule,
    CommonModule,
    BrowserAnimationsModule,
    HttpClientModule,
    CanvasJSAngularChartsModule,
    ToastrModule.forRoot(),
  ],
  providers: [
    provideFirebaseApp(() => initializeApp(environment)),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),
    provideStorage(() => getStorage()),
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
