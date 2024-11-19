import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeTrainingDetailComponent } from './employee-training-detail.component';

describe('EmployeeTrainingDetailComponent', () => {
  let component: EmployeeTrainingDetailComponent;
  let fixture: ComponentFixture<EmployeeTrainingDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmployeeTrainingDetailComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployeeTrainingDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
