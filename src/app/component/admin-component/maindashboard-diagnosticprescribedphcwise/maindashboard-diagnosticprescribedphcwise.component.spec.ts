import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaindashboardDiagnosticprescribedphcwiseComponent } from './maindashboard-diagnosticprescribedphcwise.component';

describe('MaindashboardDiagnosticprescribedphcwiseComponent', () => {
  let component: MaindashboardDiagnosticprescribedphcwiseComponent;
  let fixture: ComponentFixture<MaindashboardDiagnosticprescribedphcwiseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MaindashboardDiagnosticprescribedphcwiseComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MaindashboardDiagnosticprescribedphcwiseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
