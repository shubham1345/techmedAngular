import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TwilioSpeakerViewComponent } from './twilio-speaker-view.component';

describe('TwilioSpeakerViewComponent', () => {
  let component: TwilioSpeakerViewComponent;
  let fixture: ComponentFixture<TwilioSpeakerViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TwilioSpeakerViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TwilioSpeakerViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
