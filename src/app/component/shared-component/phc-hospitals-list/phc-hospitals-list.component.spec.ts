import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PhcHospitalsListComponent } from './phc-hospitals-list.component';

describe('PhcHospitalsListComponent', () => {
  let component: PhcHospitalsListComponent;
  let fixture: ComponentFixture<PhcHospitalsListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PhcHospitalsListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PhcHospitalsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
