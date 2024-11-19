import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MainDashboardNewAppointmentComponent } from './main-dashboard-new-appointment.component';

describe('MainDashboardNewAppointmentComponent', () => {
  let component: MainDashboardNewAppointmentComponent;
  let fixture: ComponentFixture<MainDashboardNewAppointmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MainDashboardNewAppointmentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MainDashboardNewAppointmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
