import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaindashboardPatientReviewComponent } from './maindashboard-patient-review.component';

describe('MaindashboardPatientReviewComponent', () => {
  let component: MaindashboardPatientReviewComponent;
  let fixture: ComponentFixture<MaindashboardPatientReviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MaindashboardPatientReviewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MaindashboardPatientReviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
