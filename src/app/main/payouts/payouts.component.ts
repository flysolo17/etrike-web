import { Component, OnInit } from '@angular/core';
import {
  BehaviorSubject,
  combineLatest,
  map,
  Observable,
  of,
  take,
} from 'rxjs';
import {
  CashOutRequest,
  CashOutStatus,
} from '../../models/wallet/CashOutRequest';
import { WalletService } from '../../services/wallet.service';
import { ToastrService } from 'ngx-toastr';
import { PaypalApiService } from '../../services/paypal-api.service';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-payouts',
  templateUrl: './payouts.component.html',
  styleUrl: './payouts.component.css',
})
export class PayoutsComponent implements OnInit {
  payouts$: Observable<CashOutRequest[]> = this.walletService.getAllPayouts();

  filteredPayouts$ = new BehaviorSubject<CashOutRequest[]>([]);
  searchTerm$ = new FormControl('');
  sevenDaysAgo = new Date();
  requests$: Observable<CashOutRequest[]> = this.payouts$.pipe(
    map((e) => e.filter((s) => s.status === CashOutStatus.PENDING))
  );
  completed$: Observable<CashOutRequest[]> = this.payouts$.pipe(
    map((payouts) => {
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

      return payouts.filter(
        (payout) =>
          payout.status === CashOutStatus.COMPLETED &&
          new Date(payout.createdAt) >= sevenDaysAgo
      );
    })
  );

  totalAmount: Observable<number> = this.completed$.pipe(
    map(
      (payouts) =>
        payouts.reduce((sum, payout) => sum + Number(payout.amount.value), 0) // Ensure payout.amount is a number
    )
  );

  selectedPayouts: { [id: string]: boolean } = {};
  allSelected: boolean = false;

  selectedTab$: string = CashOutStatus.PENDING;
  tabs = ['ALL', ...Object.values(CashOutStatus)];
  constructor(
    private walletService: WalletService,
    private toastr: ToastrService,
    private paypalService: PaypalApiService
  ) {
    this.sevenDaysAgo.setDate(this.sevenDaysAgo.getDate() - 7);
  }
  ngOnInit(): void {
    this.searchTerm$.valueChanges.subscribe(() => {
      this.updateFilteredPayouts();
    });

    this.selectTab(this.tabs[0]);
  }

  selectTab(tab: string) {
    this.selectedTab$ = tab;
    this.updateFilteredPayouts();
  }
  updateFilteredPayouts(): void {
    const term = this.searchTerm$.value?.toLowerCase() ?? '';
    this.payouts$
      .pipe(
        map((payouts) =>
          payouts.filter((payout) => {
            const isActive =
              this.selectedTab$ === 'ALL' ||
              payout.status === this.selectedTab$;
            const matchesSearch =
              payout?.receiver?.toLowerCase().includes(term) ||
              payout?.recipientType?.toLowerCase().includes(term);

            // Convert Firestore timestamp to Date object
            const createdAt = payout.createdAt
              ? new Date(payout.createdAt)
              : null;

            return isActive && matchesSearch;
          })
        )
      )
      .subscribe((filtered) => this.filteredPayouts$.next(filtered));
  }

  get hasSelectedPayout(): boolean {
    return Object.values(this.selectedPayouts).some((isSelected) => isSelected);
  }
  get isAllPayoutSelected(): boolean {
    return (
      Object.keys(this.selectedPayouts).length > 0 &&
      Object.values(this.selectedPayouts).every((isSelected) => isSelected)
    );
  }

  toggleSelectAll() {
    const selectAll = !this.isAllPayoutSelected;

    this.payouts$.pipe(take(1)).subscribe((payouts) => {
      this.selectedPayouts = {};
      payouts.forEach((payout) => {
        if (payout.id) {
          this.selectedPayouts[payout.id] = selectAll;
        }
      });
    });
  }

  batchPayout() {
    this.payouts$.pipe(take(1)).subscribe((payouts) => {
      const selectedPayouts: CashOutRequest[] = payouts
        .filter((payout) => payout.id && this.selectedPayouts[payout.id])
        .map((payout) => ({
          id: payout.id,
          walletID: payout.walletID,
          amount: payout.amount,
          receiver: payout.receiver,
          status: payout.status,
          recipientType: payout.recipientType,
          createdAt: payout.createdAt,
          updatedAt: payout.updatedAt,
        }));

      if (selectedPayouts.length === 0) {
        this.toastr.warning('No payouts selected.');
        return;
      }

      this.paypalService.batchPayout(selectedPayouts).subscribe(
        (response) => {
          this.walletService.payoutSuccess(selectedPayouts);
          console.log('Batch Payout Response:', response);
          this.toastr.success('Payouts successfully processed.');
        },
        (error) => {
          console.error('Batch Payout Failed:', error);
          this.toastr.error('Failed to process payouts.');
        }
      );
    });
  }
}
