import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PatientQueueManagementComponent } from './patient-queue-management.component';

describe('PatientQueueManagementComponent', () => {
  let component: PatientQueueManagementComponent;
  let fixture: ComponentFixture<PatientQueueManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PatientQueueManagementComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PatientQueueManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
