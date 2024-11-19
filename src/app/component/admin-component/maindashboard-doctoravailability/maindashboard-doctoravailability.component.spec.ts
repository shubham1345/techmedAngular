import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaindashboardDoctoravailabilityComponent } from './maindashboard-doctoravailability.component';

describe('MaindashboardDoctoravailabilityComponent', () => {
  let component: MaindashboardDoctoravailabilityComponent;
  let fixture: ComponentFixture<MaindashboardDoctoravailabilityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MaindashboardDoctoravailabilityComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MaindashboardDoctoravailabilityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
