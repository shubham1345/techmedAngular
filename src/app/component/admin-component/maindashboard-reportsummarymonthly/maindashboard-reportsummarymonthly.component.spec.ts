import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaindashboardReportsummarymonthlyComponent } from './maindashboard-reportsummarymonthly.component';

describe('MaindashboardReportsummarymonthlyComponent', () => {
  let component: MaindashboardReportsummarymonthlyComponent;
  let fixture: ComponentFixture<MaindashboardReportsummarymonthlyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MaindashboardReportsummarymonthlyComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MaindashboardReportsummarymonthlyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
