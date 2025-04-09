import { Component, OnInit } from '@angular/core';

import { User, UserType } from '../../models/driver/Users';
import { AuthService } from '../../services/auth.service';
import { BookingService } from '../../services/booking.service';
import { Transactions } from '../../models/transactions/Transactions';
import { map, Observable, of } from 'rxjs';
import { DriverService } from '../../services/driver.service';
import { TopFiveDrivers } from '../../models/ratings/TopFiveDrivers';
import { MostActiveUsers } from '../../models/driver/MostActiveUsers';
import { ReportService } from '../../services/report.service';

export interface DailyBooking {
  day: string; //sample Jul 13
  total: number;
  bookings: Transactions[];
}
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent implements OnInit {
  users$: User[] = [];
  allBookings$ = this.bookingService.getAllBookings();

  dailyBookingData: any[] = [];

  dailyBooking$: Observable<any> = this.allBookings$.pipe(
    map((transactions: Transactions[]) => {
      const groupedBookings = this.groupBookingsByDay(transactions);
      const daily = this.transformToChartData(groupedBookings).reverse();
      console.log(daily);
      return {
        animationEnabled: true,
        title: {
          text: 'Daily Bookings',
        },
        data: [
          {
            dataPoints: daily,
          },
        ],
      };
    })
  );

  topFiveDrivers$: TopFiveDrivers[] = [];
  mostActiveUsers$: MostActiveUsers[] = [];
  reports$ = this.reportService.getAllReports();
  constructor(
    private authService: AuthService,
    private bookingService: BookingService,
    private driverService: DriverService,
    private reportService: ReportService
  ) {}

  ngOnInit(): void {
    this.authService.getAllUSers().subscribe((users: User[]) => {
      this.users$ = users;
    });
    this.authService.getMostActiveUsers().then((data) => {
      this.mostActiveUsers$ = data;
    });
    this.driverService.getTopFiveDrivers().then((data) => {
      this.topFiveDrivers$ = data;
    });
  }

  get drivers(): number {
    return this.users$.filter((user) => user.type === UserType.DRIVER).length;
  }

  get passengers(): number {
    return this.users$.filter((user) => user.type === UserType.PASSENGER)
      .length;
  }

  private groupBookingsByDay(transactions: Transactions[]): DailyBooking[] {
    const grouped: { [key: string]: DailyBooking } = {};

    transactions.forEach((transaction) => {
      const createdAt = transaction.createdAt
        ? new Date(transaction.createdAt)
        : new Date();
      const day = createdAt.toLocaleDateString('en-US', {
        month: 'short',
        day: '2-digit',
      });

      if (!grouped[day]) {
        grouped[day] = { day, total: 0, bookings: [] };
      }

      grouped[day].total++;
      grouped[day].bookings.push(transaction);
    });

    return Object.values(grouped);
  }

  private transformToChartData(dailyBookings: DailyBooking[]): any[] {
    return dailyBookings.map((booking) => ({
      label: booking.day,
      y: booking.total,
    }));
  }
}
