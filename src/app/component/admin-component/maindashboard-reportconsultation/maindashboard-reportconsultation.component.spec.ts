import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaindashboardReportconsultationComponent } from './maindashboard-reportconsultation.component';

describe('MaindashboardReportconsultationComponent', () => {
  let component: MaindashboardReportconsultationComponent;
  let fixture: ComponentFixture<MaindashboardReportconsultationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MaindashboardReportconsultationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MaindashboardReportconsultationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
