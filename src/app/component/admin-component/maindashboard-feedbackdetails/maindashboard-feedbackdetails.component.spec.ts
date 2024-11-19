import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaindashboardFeedbackdetailsComponent } from './maindashboard-feedbackdetails.component';

describe('MaindashboardFeedbackdetailsComponent', () => {
  let component: MaindashboardFeedbackdetailsComponent;
  let fixture: ComponentFixture<MaindashboardFeedbackdetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MaindashboardFeedbackdetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MaindashboardFeedbackdetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
