import { Component, OnInit } from '@angular/core';
import { User } from '../../../models/driver/Users';
import { Ratings } from '../../../models/ratings/ratings';
import { Reports } from '../../../models/report/report';
import { DriverService } from '../../../services/driver.service';
import { DriverWithFranchises } from '../../../models/driver/DriverWithFranchises';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { catchError, finalize, Observable, of, tap } from 'rxjs';
import { faStar, faStarHalfAlt } from '@fortawesome/free-solid-svg-icons';
import {
  faStar as faStarRegular,
  faStarHalf,
} from '@fortawesome/free-regular-svg-icons';
import {
  Franchise,
  countActiveFranchise,
  getActiveFranchise,
  getLatestFranchiseStatus,
} from '../../../models/driver/Franchise';
import { Transactions } from '../../../models/transactions/Transactions';

@Component({
  selector: 'app-view-driver',
  templateUrl: './view-driver.component.html',
  styleUrl: './view-driver.component.css',
})
export class ViewDriverComponent implements OnInit {
  id: string | null = null;
  loading: boolean = false;
  driver$: Observable<DriverWithFranchises | null> = of(null);

  star = faStar;
  empty = faStarRegular;
  starHalf = faStarHalfAlt;
  transactions$: Observable<Transactions[]> = of([]);
  constructor(
    private driverService: DriverService,
    private activatedRoute: ActivatedRoute
  ) {}
  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe((params) => {
      this.id = params.get('id') ?? null;
      if (this.id !== null) {
        this.loading = true;
        this.driver$ = this.driverService.getDriverWithFranchices(this.id);
        this.transactions$ = this.driverService.getMyTransactions(this.id);
      }
    });
  }

  countActiveFranchise(franchises: Franchise[]): number {
    return countActiveFranchise(franchises);
  }

  getActiveFranchise(franchise: Franchise[]): string[] {
    return getActiveFranchise(franchise);
  }

  getRatingTotal(ratings: Ratings[]): number {
    let count = 0;
    ratings.forEach((e) => (count += e.stars));
    return count;
  }
  getAverageRating(ratings: Ratings[]): number {
    if (!ratings || ratings.length === 0) return 0; // Handle no ratings
    const total = ratings.reduce((sum, rating) => sum + rating.stars, 0);
    return total / ratings.length;
  }
  getActiveFranchiseStatus(franchises: Franchise[]): string {
    return getLatestFranchiseStatus(franchises);
  }

  getStars(ratings: Ratings[]): any[] {
    const average = this.getAverageRating(ratings);
    const fullStars = Math.floor(average); // Number of full stars
    const hasHalfStar = average % 1 >= 0.5; // Check for half-star
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0); // Remaining empty stars

    return [
      ...Array(fullStars).fill(this.star), // Full stars
      ...(hasHalfStar ? [this.starHalf] : []), // Half star
      ...Array(emptyStars).fill(this.empty), // Empty stars (should be muted)
    ];
  }
}
