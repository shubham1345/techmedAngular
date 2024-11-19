/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { TabularCompletedConsultationPhcComponent } from './tabular-completed-consultation-phc.component';

describe('TabularCompletedConsultationPhcComponent', () => {
  let component: TabularCompletedConsultationPhcComponent;
  let fixture: ComponentFixture<TabularCompletedConsultationPhcComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TabularCompletedConsultationPhcComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TabularCompletedConsultationPhcComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
