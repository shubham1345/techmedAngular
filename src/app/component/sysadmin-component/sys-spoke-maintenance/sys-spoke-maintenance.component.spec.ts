import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SysSpokeMaintenanceComponent } from './sys-spoke-maintenance.component';

describe('SysSpokeMaintenanceComponent', () => {
  let component: SysSpokeMaintenanceComponent;
  let fixture: ComponentFixture<SysSpokeMaintenanceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SysSpokeMaintenanceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SysSpokeMaintenanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
