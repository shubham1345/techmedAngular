import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaindashboardNewReportconsultationComponent } from './maindashboard-new-reportconsultation.component';

describe('MaindashboardNewReportconsultationComponent', () => {
  let component: MaindashboardNewReportconsultationComponent;
  let fixture: ComponentFixture<MaindashboardNewReportconsultationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MaindashboardNewReportconsultationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MaindashboardNewReportconsultationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
