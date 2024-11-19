import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TwilioCallButtonComponent } from './twilio-call-button.component';

describe('TwilioCallButtonComponent', () => {
  let component: TwilioCallButtonComponent;
  let fixture: ComponentFixture<TwilioCallButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TwilioCallButtonComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TwilioCallButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
