import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SuperAdminResetPasswordComponent } from './super-admin-reset-password.component';

describe('SuperAdminResetPasswordComponent', () => {
  let component: SuperAdminResetPasswordComponent;
  let fixture: ComponentFixture<SuperAdminResetPasswordComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SuperAdminResetPasswordComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SuperAdminResetPasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
