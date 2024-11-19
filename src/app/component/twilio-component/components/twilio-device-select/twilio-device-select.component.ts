import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
class IdGenerator {
  protected static id: number = 0;
  static getNext() {
    return ++IdGenerator.id;
  }
}

@Component({
  selector: 'app-twilio-device-select',
  templateUrl: './twilio-device-select.component.html',
  styleUrls: ['./twilio-device-select.component.css']
})
export class TwilioDeviceSelectComponent {
  private localDevices: MediaDeviceInfo[] = [];

  id: string;
  selectedId: string;

  get devices(): MediaDeviceInfo[] {
    return this.localDevices;
  }

  @Input() label: string;
  @Input() kind: MediaDeviceKind;
  @Input() set devices(devices: MediaDeviceInfo[]) {
    this.selectedId = this.find(this.localDevices = devices);
    if (this.selectedId) {
      this.setAndEmitSelections(this.selectedId);
    }
  }

  @Output() settingsChanged = new EventEmitter<MediaDeviceInfo>();

  constructor() {
    this.id = `device-select-${IdGenerator.getNext()}`;
  }

  onSettingsChanged(event: any) {
    this.setAndEmitSelections(this.selectedId = event.value);
  }

  private find(devices: MediaDeviceInfo[]) {
    if (devices && devices.length > 0) {
      return devices[0].deviceId;
    }
    return null;
  }

  private setAndEmitSelections(deviceId: string) {
    this.settingsChanged.emit(this.devices.find(d => d.deviceId === deviceId));
  }
  // private setAndEmitDevice(deviceId: string) {
  //   this.settingsChanged.emit(this.devices.find(d => d.deviceId === deviceId));
  // }
}
