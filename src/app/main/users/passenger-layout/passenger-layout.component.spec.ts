import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PassengerLayoutComponent } from './passenger-layout.component';

describe('PassengerLayoutComponent', () => {
  let component: PassengerLayoutComponent;
  let fixture: ComponentFixture<PassengerLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PassengerLayoutComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PassengerLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
