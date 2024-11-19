import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaindashboardPatientReferredComponent } from './maindashboard-patient-referred.component';

describe('MaindashboardPatientReferredComponent', () => {
  let component: MaindashboardPatientReferredComponent;
  let fixture: ComponentFixture<MaindashboardPatientReferredComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MaindashboardPatientReferredComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MaindashboardPatientReferredComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
