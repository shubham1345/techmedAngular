import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaindashboardReportsummarydailyComponent } from './maindashboard-reportsummarydaily.component';

describe('MaindashboardReportsummarydailyComponent', () => {
  let component: MaindashboardReportsummarydailyComponent;
  let fixture: ComponentFixture<MaindashboardReportsummarydailyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MaindashboardReportsummarydailyComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MaindashboardReportsummarydailyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
