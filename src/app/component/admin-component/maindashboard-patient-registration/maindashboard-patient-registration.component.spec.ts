import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaindashboardPatientRegistrationComponent } from './maindashboard-patient-registration.component';

describe('MaindashboardPatientRegistrationComponent', () => {
  let component: MaindashboardPatientRegistrationComponent;
  let fixture: ComponentFixture<MaindashboardPatientRegistrationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MaindashboardPatientRegistrationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MaindashboardPatientRegistrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
