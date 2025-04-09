import { Component, Input, OnInit } from '@angular/core';
import { Ratings } from '../../../../models/ratings/ratings';
import { Observable, of } from 'rxjs';
import { User } from '../../../../models/driver/Users';
import { PassengerService } from '../../../../services/passenger.service';

import { faStar, faStarHalfAlt } from '@fortawesome/free-solid-svg-icons';
import {
  faStar as faStarRegular,
  faStarHalf,
} from '@fortawesome/free-regular-svg-icons';
@Component({
  selector: 'app-rating-card',
  templateUrl: './rating-card.component.html',
  styleUrl: './rating-card.component.css',
})
export class RatingCardComponent implements OnInit {
  @Input() rating!: Ratings;
  passenger$: Observable<User | null> = of(null);

  star = faStar;
  empty = faStarRegular;
  starHalf = faStarHalfAlt;
  constructor(private passengerService: PassengerService) {}
  ngOnInit(): void {
    let passengerID = this.rating.userID;
    if (passengerID !== null && passengerID !== undefined) {
      this.passenger$ = this.passengerService.getPassengerByID(passengerID);
    }
  }

  getStars(rating: Ratings): any[] {
    const average = rating.stars;
    const fullStars = Math.floor(average);
    const hasHalfStar = average % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

    return [
      ...Array(fullStars).fill(this.star), // Full stars
      ...(hasHalfStar ? [this.starHalf] : []), // Half star
      ...Array(emptyStars).fill(this.empty), // Empty stars (should be muted)
    ];
  }
}
