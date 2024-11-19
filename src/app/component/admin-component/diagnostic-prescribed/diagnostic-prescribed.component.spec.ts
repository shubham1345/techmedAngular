import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DiagnosticPrescribedComponent } from './diagnostic-prescribed.component';

describe('DiagnosticPrescribedComponent', () => {
  let component: DiagnosticPrescribedComponent;
  let fixture: ComponentFixture<DiagnosticPrescribedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DiagnosticPrescribedComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DiagnosticPrescribedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
