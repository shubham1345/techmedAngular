import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TwilioDeviceSelectComponent } from './twilio-device-select.component';

describe('TwilioDeviceSelectComponent', () => {
  let component: TwilioDeviceSelectComponent;
  let fixture: ComponentFixture<TwilioDeviceSelectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TwilioDeviceSelectComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TwilioDeviceSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
