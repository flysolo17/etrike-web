import { Component, Input } from '@angular/core';
import { DriverWithFranchises } from '../../../../models/driver/DriverWithFranchises';
import {
  countActiveFranchise,
  Franchise,
  getActiveFranchise,
} from '../../../../models/driver/Franchise';
import { Ratings } from '../../../../models/ratings/ratings';
import { faStar, faStarHalfAlt } from '@fortawesome/free-solid-svg-icons';
import {
  faStar as faStarRegular,
  faStarHalf,
} from '@fortawesome/free-regular-svg-icons';

@Component({
  selector: 'app-driver-card',
  templateUrl: './driver-card.component.html',
  styleUrl: './driver-card.component.css',
})
export class DriverCardComponent {
  star = faStar;
  empty = faStarRegular;
  starHalf = faStarHalfAlt;

  @Input() driver!: DriverWithFranchises;

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
