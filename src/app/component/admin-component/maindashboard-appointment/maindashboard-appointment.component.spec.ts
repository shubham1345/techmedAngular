import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaindashboardAppointmentComponent } from './maindashboard-appointment.component';

describe('MaindashboardAppointmentComponent', () => {
  let component: MaindashboardAppointmentComponent;
  let fixture: ComponentFixture<MaindashboardAppointmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MaindashboardAppointmentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MaindashboardAppointmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
