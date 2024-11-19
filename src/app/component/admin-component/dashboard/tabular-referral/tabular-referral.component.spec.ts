/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { TabularReferralComponent } from './tabular-referral.component';

describe('TabularReferralComponent', () => {
  let component: TabularReferralComponent;
  let fixture: ComponentFixture<TabularReferralComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TabularReferralComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TabularReferralComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
