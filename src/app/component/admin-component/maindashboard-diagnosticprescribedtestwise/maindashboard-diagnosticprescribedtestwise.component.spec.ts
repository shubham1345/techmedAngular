import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaindashboardDiagnosticprescribedtestwiseComponent } from './maindashboard-diagnosticprescribedtestwise.component';

describe('MaindashboardDiagnosticprescribedtestwiseComponent', () => {
  let component: MaindashboardDiagnosticprescribedtestwiseComponent;
  let fixture: ComponentFixture<MaindashboardDiagnosticprescribedtestwiseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MaindashboardDiagnosticprescribedtestwiseComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MaindashboardDiagnosticprescribedtestwiseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
