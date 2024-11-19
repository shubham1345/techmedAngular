import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaindashboardDiseaseprofileagewiseComponent } from './maindashboard-diseaseprofileagewise.component';

describe('MaindashboardDiseaseprofileagewiseComponent', () => {
  let component: MaindashboardDiseaseprofileagewiseComponent;
  let fixture: ComponentFixture<MaindashboardDiseaseprofileagewiseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MaindashboardDiseaseprofileagewiseComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MaindashboardDiseaseprofileagewiseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
