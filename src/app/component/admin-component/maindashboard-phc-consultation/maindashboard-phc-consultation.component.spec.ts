import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaindashboardPhcConsultationComponent } from './maindashboard-phc-consultation.component';

describe('MaindashboardPhcConsultationComponent', () => {
  let component: MaindashboardPhcConsultationComponent;
  let fixture: ComponentFixture<MaindashboardPhcConsultationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MaindashboardPhcConsultationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MaindashboardPhcConsultationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
