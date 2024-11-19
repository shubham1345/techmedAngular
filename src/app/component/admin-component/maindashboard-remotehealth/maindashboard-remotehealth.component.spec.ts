import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaindashboardRemotehealthComponent } from './maindashboard-remotehealth.component';

describe('MaindashboardRemotehealthComponent', () => {
  let component: MaindashboardRemotehealthComponent;
  let fixture: ComponentFixture<MaindashboardRemotehealthComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MaindashboardRemotehealthComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MaindashboardRemotehealthComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
