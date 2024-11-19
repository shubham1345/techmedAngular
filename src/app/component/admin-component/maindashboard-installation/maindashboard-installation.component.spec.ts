import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaindashboardInstallationComponent } from './maindashboard-installation.component';

describe('MaindashboardInstallationComponent', () => {
  let component: MaindashboardInstallationComponent;
  let fixture: ComponentFixture<MaindashboardInstallationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MaindashboardInstallationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MaindashboardInstallationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
