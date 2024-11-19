import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TwilioConferenceHomeComponent } from './twilio-conference-home.component';

describe('TwilioConferenceHomeComponent', () => {
  let component: TwilioConferenceHomeComponent;
  let fixture: ComponentFixture<TwilioConferenceHomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TwilioConferenceHomeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TwilioConferenceHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
