import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SuperAdminAllowAccessComponent } from './super-admin-allow-access.component';

describe('SuperAdminAllowAccessComponent', () => {
  let component: SuperAdminAllowAccessComponent;
  let fixture: ComponentFixture<SuperAdminAllowAccessComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SuperAdminAllowAccessComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SuperAdminAllowAccessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
