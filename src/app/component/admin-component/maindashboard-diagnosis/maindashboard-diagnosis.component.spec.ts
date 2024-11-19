import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaindashboardDiagnosisComponent } from './maindashboard-diagnosis.component';

describe('MaindashboardDiagnosisComponent', () => {
  let component: MaindashboardDiagnosisComponent;
  let fixture: ComponentFixture<MaindashboardDiagnosisComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MaindashboardDiagnosisComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MaindashboardDiagnosisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
