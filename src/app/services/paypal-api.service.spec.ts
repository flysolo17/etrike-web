import { TestBed } from '@angular/core/testing';

import { PaypalApiService } from './paypal-api.service';

describe('PaypalApiService', () => {
  let service: PaypalApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PaypalApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
