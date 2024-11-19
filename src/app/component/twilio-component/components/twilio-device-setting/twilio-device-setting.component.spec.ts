import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TwilioDeviceSettingComponent } from './twilio-device-setting.component';

describe('TwilioDeviceSettingComponent', () => {
  let component: TwilioDeviceSettingComponent;
  let fixture: ComponentFixture<TwilioDeviceSettingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TwilioDeviceSettingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TwilioDeviceSettingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
