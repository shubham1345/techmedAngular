import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TwilioRoomParticipantsComponent } from './twilio-room-participants.component';

describe('TwilioRoomParticipantsComponent', () => {
  let component: TwilioRoomParticipantsComponent;
  let fixture: ComponentFixture<TwilioRoomParticipantsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TwilioRoomParticipantsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TwilioRoomParticipantsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
