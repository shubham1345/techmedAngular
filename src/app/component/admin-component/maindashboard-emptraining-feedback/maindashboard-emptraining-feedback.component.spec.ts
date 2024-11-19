import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaindashboardEmptrainingFeedbackComponent } from './maindashboard-emptraining-feedback.component';

describe('MaindashboardEmptrainingFeedbackComponent', () => {
  let component: MaindashboardEmptrainingFeedbackComponent;
  let fixture: ComponentFixture<MaindashboardEmptrainingFeedbackComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MaindashboardEmptrainingFeedbackComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MaindashboardEmptrainingFeedbackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
