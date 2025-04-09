import { Observable } from 'rxjs';

export interface CaptureOrderResponse {
  id: string;
  status: string;
  purchase_units: Array<{
    payments: {
      captures: Array<{
        id: string;
        status: string;
        amount: {
          currency_code: string;
          value: string;
        };
        create_time: string;
        update_time: string;
      }>;
    };
  }>;
}

export function computeCapturedOrderTotal(
  capture: CaptureOrderResponse
): number {
  if (
    !capture ||
    !capture.purchase_units ||
    capture.purchase_units.length === 0
  ) {
    return 0;
  }

  return capture.purchase_units.reduce((total, unit) => {
    const captures = unit.payments?.captures || [];
    const unitTotal = captures.reduce(
      (sum, capture) => sum + parseFloat(capture.amount.value),
      0
    );
    return total + unitTotal;
  }, 0);
}
