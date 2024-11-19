import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaindashboardReportsummaryweeklyComponent } from './maindashboard-reportsummaryweekly.component';

describe('MaindashboardReportsummaryweeklyComponent', () => {
  let component: MaindashboardReportsummaryweeklyComponent;
  let fixture: ComponentFixture<MaindashboardReportsummaryweeklyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MaindashboardReportsummaryweeklyComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MaindashboardReportsummaryweeklyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
