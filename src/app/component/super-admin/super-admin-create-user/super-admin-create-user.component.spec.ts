import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SuperAdminCreateUserComponent } from './super-admin-create-user.component';

describe('SuperAdminCreateUserComponent', () => {
  let component: SuperAdminCreateUserComponent;
  let fixture: ComponentFixture<SuperAdminCreateUserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SuperAdminCreateUserComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SuperAdminCreateUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
