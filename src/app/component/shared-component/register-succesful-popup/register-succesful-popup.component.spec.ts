import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterSuccesfulPopupComponent } from './register-succesful-popup.component';

describe('RegisterSuccesfulPopupComponent', () => {
  let component: RegisterSuccesfulPopupComponent;
  let fixture: ComponentFixture<RegisterSuccesfulPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RegisterSuccesfulPopupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RegisterSuccesfulPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
