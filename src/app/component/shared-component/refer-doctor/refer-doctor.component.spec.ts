import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReferDoctorComponent } from './refer-doctor.component';

describe('ReferDoctorComponent', () => {
  let component: ReferDoctorComponent;
  let fixture: ComponentFixture<ReferDoctorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReferDoctorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReferDoctorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
