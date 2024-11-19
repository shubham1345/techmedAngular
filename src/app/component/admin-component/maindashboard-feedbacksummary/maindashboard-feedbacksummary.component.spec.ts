import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaindashboardFeedbacksummaryComponent } from './maindashboard-feedbacksummary.component';

describe('MaindashboardFeedbacksummaryComponent', () => {
  let component: MaindashboardFeedbacksummaryComponent;
  let fixture: ComponentFixture<MaindashboardFeedbacksummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MaindashboardFeedbacksummaryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MaindashboardFeedbacksummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
