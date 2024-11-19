import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { debounceTime, Subscription } from 'rxjs';
import { TwilioDeviceService } from '../../services/twilio-device.service';
import { TwilioCameraComponent } from "../twilio-camera/twilio-camera.component";
import { TwilioDeviceSelectComponent } from "../twilio-device-select/twilio-device-select.component";
@Component({
  selector: 'app-twilio-device-setting',
  templateUrl: './twilio-device-setting.component.html',
  styleUrls: ['./twilio-device-setting.component.css']
})
export class TwilioDeviceSettingComponent implements OnInit, OnDestroy {
  public devices: MediaDeviceInfo[] = [];
  private subscription: Subscription;
  private videoDeviceId: string;


  @ViewChild('videoSelect', { static: false }) video: TwilioDeviceSelectComponent;

  @ViewChild('camera', { static: false }) camera: TwilioCameraComponent;

  @Input('isPreviewing') isPreviewing: boolean = false;
  @Output() settingsChanged = new EventEmitter<MediaDeviceInfo>();
  @Output() onSettingCameraInitComplete = new EventEmitter<boolean>();
  constructor(private readonly deviceService: TwilioDeviceService) { }


  get hasAudioInputOptions(): boolean {
    return this.devices && this.devices.filter(d => d.kind === 'audioinput').length > 0;
  }
  get hasAudioOutputOptions(): boolean {
    return this.devices && this.devices.filter(d => d.kind === 'audiooutput').length > 0;
  }
  get hasVideoInputOptions(): boolean {
    return this.devices && this.devices.filter(d => d.kind === 'videoinput').length > 0;
  }


  ngOnInit() {
    this.subscription =
      this.deviceService
        .$devicesUpdated
        .pipe(debounceTime(350))
        .subscribe(async deviceListPromise => {
          this.devices = await deviceListPromise;
          //this.handleDeviceAvailabilityChanges();
        });
  }

  ngOnDestroy() {

    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  async onSettingsChanged(deviceInfo: MediaDeviceInfo) {
    if (this.isPreviewing) {
      await this.showPreviewCamera();
    } else {
      this.settingsChanged.emit(deviceInfo);
    }
  }

  async showPreviewCamera() {
    this.isPreviewing = true;
    if (this.videoDeviceId !== this.video?.selectedId) {
      this.videoDeviceId = this.video.selectedId;
      const videoDevice = this.devices.find(d => d.deviceId === this.video.selectedId);
      await this.camera.initializePreview(videoDevice);
    }
    return this.camera.tracks;
  }

  hidePreviewCamera() {
    this.isPreviewing = false;
    this.camera.finalizePreview();
    return this.devices.find(d => d.deviceId === this.video.selectedId);
  }

  private handleDeviceAvailabilityChanges() {
    if (this.devices && this.devices.length && this.video && this.video.selectedId) {
      let videoDevice = this.devices.find(d => d.deviceId === this.video.selectedId);
      if (!videoDevice) {
        videoDevice = this.devices.find(d => d.kind === 'videoinput');
        if (videoDevice) {
          this.video.selectedId = videoDevice.deviceId;
          this.onSettingsChanged(videoDevice);
        }
      }
    }
  }

  onCameraInitComplete($event) {
    this.onSettingCameraInitComplete.emit(true);
  }
}