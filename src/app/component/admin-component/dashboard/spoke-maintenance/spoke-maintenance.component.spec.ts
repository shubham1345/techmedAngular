import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpokeMaintenanceComponent } from './spoke-maintenance.component';

describe('SpokeMaintenanceComponent', () => {
  let component: SpokeMaintenanceComponent;
  let fixture: ComponentFixture<SpokeMaintenanceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SpokeMaintenanceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SpokeMaintenanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
