import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaindashboardMedprescribedgenericwiseComponent } from './maindashboard-medprescribedgenericwise.component';

describe('MaindashboardMedprescribedgenericwiseComponent', () => {
  let component: MaindashboardMedprescribedgenericwiseComponent;
  let fixture: ComponentFixture<MaindashboardMedprescribedgenericwiseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MaindashboardMedprescribedgenericwiseComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MaindashboardMedprescribedgenericwiseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
