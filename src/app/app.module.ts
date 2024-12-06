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
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    ReactiveFormsModule,
    FormsModule,
  ],
  providers: [
    provideFirebaseApp(() =>
      initializeApp({
        projectId: 'etrike-752af',
        appId: '1:355257698538:web:ef87e4c9f266040789af93',
        storageBucket: 'etrike-752af.firebasestorage.app',
        apiKey: 'AIzaSyAin-8yJMgArDBW61iHEzVxHaFVDtyb6hA',
        authDomain: 'etrike-752af.firebaseapp.com',
        messagingSenderId: '355257698538',
        measurementId: 'G-FCJ3DKETV0',
      })
    ),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),
    provideStorage(() => getStorage()),
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
