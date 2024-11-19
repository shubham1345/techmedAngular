import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaindashboardMedprescribedphcwiseComponent } from './maindashboard-medprescribedphcwise.component';

describe('MaindashboardMedprescribedphcwiseComponent', () => {
  let component: MaindashboardMedprescribedphcwiseComponent;
  let fixture: ComponentFixture<MaindashboardMedprescribedphcwiseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MaindashboardMedprescribedphcwiseComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MaindashboardMedprescribedphcwiseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
