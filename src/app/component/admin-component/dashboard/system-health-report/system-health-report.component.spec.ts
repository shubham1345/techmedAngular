import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SystemHealthReportComponent } from './system-health-report.component';

describe('SystemHealthReportComponent', () => {
  let component: SystemHealthReportComponent;
  let fixture: ComponentFixture<SystemHealthReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SystemHealthReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SystemHealthReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
