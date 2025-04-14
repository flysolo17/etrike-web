import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateDocumentModalComponent } from './create-document-modal.component';

describe('CreateDocumentModalComponent', () => {
  let component: CreateDocumentModalComponent;
  let fixture: ComponentFixture<CreateDocumentModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CreateDocumentModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CreateDocumentModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
