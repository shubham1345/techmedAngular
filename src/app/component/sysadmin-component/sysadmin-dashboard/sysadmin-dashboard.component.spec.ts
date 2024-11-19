import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SysadminDashboardComponent } from './sysadmin-dashboard.component';

describe('SysadminDashboardComponent', () => {
  let component: SysadminDashboardComponent;
  let fixture: ComponentFixture<SysadminDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SysadminDashboardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SysadminDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
