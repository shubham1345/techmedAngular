import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PHCRegistrationComponent } from './phc-registration.component';

describe('PHCRegistrationComponent', () => {
  let component: PHCRegistrationComponent;
  let fixture: ComponentFixture<PHCRegistrationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PHCRegistrationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PHCRegistrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
