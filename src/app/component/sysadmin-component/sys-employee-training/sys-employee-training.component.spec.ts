import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SysEmployeeTrainingComponent } from './sys-employee-training.component';

describe('SysEmployeeTrainingComponent', () => {
  let component: SysEmployeeTrainingComponent;
  let fixture: ComponentFixture<SysEmployeeTrainingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SysEmployeeTrainingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SysEmployeeTrainingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
