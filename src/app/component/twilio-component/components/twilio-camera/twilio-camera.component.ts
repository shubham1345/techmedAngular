import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnInit, Output, Renderer2, ViewChild } from '@angular/core';
import { createLocalTracks, LocalTrack, LocalVideoTrack } from 'twilio-video';

@Component({
    selector: 'app-twilio-camera',
    templateUrl: './twilio-camera.component.html',
    styleUrls: ['./twilio-camera.component.css']
})
export class TwilioCameraComponent implements AfterViewInit {
    @ViewChild('preview', { static: false }) previewElement: ElementRef;
    @Output() onCameraInitComplete = new EventEmitter<boolean>();
   

    get tracks(): LocalTrack[] {
        return this.localTracks;
    }

    isInitializing: boolean = true;

    private videoTrack: LocalVideoTrack;
    private localTracks: LocalTrack[] = [];

    constructor(
        private readonly renderer: Renderer2) { }

    async ngAfterViewInit() {
        // debugger;
        // if (this.previewElement && this.previewElement.nativeElement) {
        //     await this.initializeDevice();
        // }
    }

    initializePreview(deviceInfo?: MediaDeviceInfo) {

        if (deviceInfo) {
            this.initializeDevice(deviceInfo.kind, deviceInfo.deviceId);
        } else {
            this.initializeDevice();
        }
    }

    finalizePreview() {

        try {
            if (this.videoTrack) {
                this.videoTrack.detach().forEach(element => element.remove());
                //aks
                this.videoTrack.stop();
            }
        } catch (e) {
            console.error(e);
        }
    }

    private async initializeDevice(kind?: MediaDeviceKind, deviceId?: string) {

        try {
            this.isInitializing = true;

            this.finalizePreview();

            this.localTracks = kind && deviceId
                ? await this.initializeTracks(kind, deviceId)
                : await this.initializeTracks();

            this.videoTrack = this.localTracks.find(t => t.kind === 'video') as LocalVideoTrack;
            const videoElement = this.videoTrack.attach();
            this.renderer.setStyle(videoElement, 'height', '100%');
            this.renderer.setStyle(videoElement, 'width', '100%');
            this.renderer.appendChild(this.previewElement.nativeElement, videoElement);
        } finally {
            this.isInitializing = false;
            if (this.onCameraInitComplete) {
                this.onCameraInitComplete.emit(true);
            }
        }
    }

    private initializeTracks(kind?: MediaDeviceKind, deviceId?: string) {

        if (kind) {
            switch (kind) {
                case 'audioinput':
                    return createLocalTracks({ audio: { deviceId }, video: true });
                case 'videoinput':
                    return createLocalTracks({ audio: true, video: { deviceId } });
            }
        }

        return createLocalTracks({ audio: true, video: true });
    }
}
