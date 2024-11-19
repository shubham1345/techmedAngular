/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { TabularCompletedConsultaionDoctorComponent } from './tabular-completed-consultaion-doctor.component';

describe('TabularCompletedConsultaionDoctorComponent', () => {
  let component: TabularCompletedConsultaionDoctorComponent;
  let fixture: ComponentFixture<TabularCompletedConsultaionDoctorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TabularCompletedConsultaionDoctorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TabularCompletedConsultaionDoctorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
