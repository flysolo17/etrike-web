import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PaypalApiService } from '../../services/paypal-api.service';
import { WalletService } from '../../services/wallet.service';
import { ToastrService } from 'ngx-toastr';
import { computeCapturedOrderTotal } from '../../remote/CaptureOrderResponse';
import { User } from '../../models/driver/Users';
import { AuthService } from '../../services/auth.service';
import { PassengerService } from '../../services/passenger.service';

@Component({
  selector: 'app-complete-order',
  templateUrl: './complete-order.component.html',
  styleUrl: './complete-order.component.css',
})
export class CompleteOrderComponent implements OnInit {
  data: any = null;
  userID: string = '';
  token: string = '';
  user: User | null = null;
  totalAmount = 0;

  loading: boolean = false;
  hasError: string | null = null;
  constructor(
    private route: ActivatedRoute,
    private paypalApiService: PaypalApiService,
    private walletService: WalletService,
    private passengerService: PassengerService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.userID = params.get('id') || '';
      this.passengerService.getPassengerByID(this.userID).subscribe((data) => {
        this.user = data;
      });
    });
    this.route.queryParamMap.subscribe((data) => {
      const token = data.get('token') || '';
      this.token = token;
      this.captureOrder(token, this.userID);
    });
  }

  captureOrder(token: string, walletID: string): void {
    this.loading = true;
    this.paypalApiService.captureOrder(token, walletID).subscribe({
      next: (response) => {
        this.toastr.success('Order Captured Successfully');
        this.totalAmount = response.totalAmount;
        this.data = response;
      },
      error: (err) => {
        this.hasError = err.error.error ?? 'unknown error';
        this.loading = false;
        console.error('Error capturing order:', err);
      },
      complete: () => {
        this.loading = false;
      },
    });
  }
}
