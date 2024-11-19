import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaindashboardPhcHRManpowerReportComponent } from './maindashboard-phc-hr-manpower-report.component';

describe('MaindashboardPhcHRManpowerReportComponent', () => {
  let component: MaindashboardPhcHRManpowerReportComponent;
  let fixture: ComponentFixture<MaindashboardPhcHRManpowerReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MaindashboardPhcHRManpowerReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MaindashboardPhcHRManpowerReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
