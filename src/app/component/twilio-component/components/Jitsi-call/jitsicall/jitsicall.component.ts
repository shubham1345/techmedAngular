import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { environment } from 'src/environments/environment';
import { TwilioMiddlewareService } from '../../../services/twilio-middleware.service';
import { NotificationHubService } from 'src/app/services/services/notification-hub.service';
declare var JitsiMeetExternalAPI: any;
import Swal from 'sweetalert2';
import { SvcmainAuthserviceService } from 'src/app/services/services/svcmain-authservice.service';
import { JitsiService } from '../../../services/jitsi.service';
import { DecryptData, EncryptData } from 'src/app/utils/utilityFn';
import { Router } from '@angular/router';
import { NavigationExtras } from '@angular/router';

import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'app-jitsicall',
  templateUrl: './jitsicall.component.html',
  styleUrls: ['./jitsicall.component.css'],
})
export class JitsicallComponent implements OnInit {
  private redirectedToPatientQueue = false;
  @Input() roomName: string;
  @Input() patientCaseId: any;
  showModal: boolean;
  api: any;
  phcJitsiId: any;
  isConnecting: boolean = false;
  isConnectingJitsi : boolean = false;
  @Output() onMeetingCloseTrigger: EventEmitter<boolean> =
    new EventEmitter<boolean>();
  posttreatment: boolean = false;
  role: string;
  constructor(
    private httpClient: HttpClient,
    private twilioService: TwilioMiddlewareService,
    public svcNotification: NotificationHubService,
    private _sweetAlert: SvcmainAuthserviceService,
    private jitsiService: JitsiService,
    private router: Router,
    private route: ActivatedRoute,
    private location: Location
  ) {
    this.onCallEndNotificationReceived();
  }

  ngOnInit(): void {
    this.role = localStorage.getItem('role');
    console.log('hello', this.role);

    this.showModal = true;
    this._sweetAlert.setpatientAbsent(this.roomName, this.patientCaseId);
    const domain = `${environment.jitsi_domain}`;
    const options = {
      roomName: this.roomName,
      width: '100%',
      height: '100%',
      configOverwrite: {
        disableTileEnlargement: false,
        SHOW_BRAND_WATERMARK: false,
        SHOW_WATERMARK_FOR_GUESTS: false,
        hideDispalyName: false,
        prejoinPageEnabled: false,
        toolbarButtons: [],
        apiLogLevels: ['error'],
        disableShortcuts: false,
      },
      interfaceConfigOverwrite: {
        DISABLE_DOMINANT_SPEAKER_INDICATOR: true,
        SHOW_BRAND_WATERMARK: false,
        SHOW_JITSI_WATERMARK: false,
      },
      parentNode: document.querySelector('#jitsi-iframe'),
      userInfo: {
        displayName: JSON.parse(localStorage.getItem('AuthToken')).username,
      },
    };

    this.api = new JitsiMeetExternalAPI(domain, options);
    this.api.addEventListeners({
      // for side by side tile in jitsi
      videoConferenceJoined: () => {
        //event

        this.api.executeCommand('toggleTileView');
        // this.jitsiService.closeModel(); // function(commands )
      },
      recordingStatusChanged: async (res) => {
        // this.recordingStatusChanged(`Recording Status ${res.on}`);
      },
    });
    this.api.addEventListener('participantLeft', (event) => {
      console.log(event,'Hiii hi jitsiiii');

      if(!this._sweetAlert.getisMinVideoTimeCompelted() && event){
       this.endCall(this.roomName, this.patientCaseId, true);
      }
      // else if (this._sweetAlert.getisMinVideoTimeCompelted() && event){

      //   this.jitsiService.isConnectingJitsi.next({ isConnectingJitsiCall: true });
      //   this.endCall(this.roomName, this.patientCaseId, true);
      // }
     
      setTimeout(() => {
        let Participant = this.api.getParticipantsInfo();
        let qs = {
          patientId: this.jitsiService.patientId,
        };
        let strEncText = EncryptData(JSON.stringify(qs));
        if (Participant.length < 2) {
          this.endCall(this.roomName, this.patientCaseId, true);
        }
      }, 25000);
    });
    this.api.addEventListener('participantJoined', (event) => {
      this.jitsiService.isConnecting.next({ isConnectingData: true });
      if (localStorage.getItem('role') == 'Doctor') {
        let qs = {
          patientId: this.jitsiService.patientId,
        };
        let strEncText = EncryptData(JSON.stringify(qs));

        this.router.navigate(['case-details-doc'], {
          queryParams: { src: strEncText },
        });
        this.jitsiService.closeModel();
        // console.log(event);
      }
    });

    setTimeout(() => {
      this.jitsiService.api = this.api;
    }, 10000);
  }

  // to check baseUrl// 08-02-2024 -- Priyanka

  // recordingStatusChanged(event) {
  //   const currentDateTime = this.getCurrentDateTime();
  //   const apiUrl = `${environment.jitsi_baseurl}/api/JitsiAPI/updateMeetingEvents`;
  //   const data = [
  //     { RoomID: this.roomName, EventID: event, EventTime: currentDateTime },
  //   ];

  //   this.httpClient.post(apiUrl, data).subscribe(
  //     (data) => {
  //       console.warn('This is Event Log Response:', data);
  //     },
  //     (error) => {
  //       console.error('POST Error:', error);
  //     }
  //   );
  // }

  getCurrentDateTime() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');

    const formattedDateTime = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    return formattedDateTime;
  }

  onEndCallClick(ispartallyclose) {
    Swal.fire({
      allowOutsideClick: false,
      allowEscapeKey: false,
      allowEnterKey: false,
      position: 'bottom-end',
      icon: 'info',
      title: 'Do you want to close call?',
      showDenyButton: true,
      confirmButtonText: 'Yes',
      denyButtonText: `No`,
    }).then((result) => {
      if (result.isConfirmed) {
        // if(localStorage.getItem('role')=='Doctor'){
        this.endCall(this.roomName, this.patientCaseId, true);
      }
    });
  }

  endCall(activeRoom, patientCaseId, isPartiallyClosed) {
    this.twilioService
      .DismissCall(activeRoom, patientCaseId, isPartiallyClosed, 'endcall')
      .subscribe({
        next: (data: any) => {
          //  if(localStorage.getItem('role')=='Doctor'){
          //    this.router.navigate(['doctor-detail'], {
          //      queryParams: { patientqueue: 'patient-queue' },
          //    });
          //  }
          //  else this.router.navigate(['chc-center'])
          // if(localStorage.getItem('role')=='Doctor'){
          //   const queryParams = { patientqueue: 'patient-queue' };
          //   // Navigate with queryParams
          //     this.router.navigate(['doctor-detail'], { relativeTo: this.route, queryParams: queryParams })
          //     .then(() => {
          //       // Reload the page after navigation
          //       window.location.reload();
          //     });
          //   }
          // this.showLoader = false;
        },
        error: (err) => {
          // this.showLoader = false;
          console.log('ERROR ON SERVER', err);
          Swal.fire({
            allowOutsideClick: false,
            allowEscapeKey: false,
            allowEnterKey: false,
            position: 'bottom-end',
            icon: 'info',
            title: 'There is error on server?',
            showConfirmButton: false,
            timer: 5000,
          }).then((x) => {
            this.onMeetingCloseTrigger.emit(true);
          });
        },
      });
  }

  onCallEndNotificationReceived() {
    this.svcNotification.onNotifyParticipientToExit.subscribe({
      next: (message: any) => {
        console.log('callend notification', message);
        if (
          localStorage.getItem('meetingInstace') == message.roomName.toString()
        ) {
          if (message) {
            // alert('call end');
            Swal.close();
            Swal.fire({
              allowOutsideClick: false,
              allowEscapeKey: false,
              allowEnterKey: false,
              toast: true,
              position: 'bottom-end',
              icon: 'info',
              title: 'Disconnected.',
            });
            this.api.executeCommand('stopRecording', 'file');
            this.api.executeCommand('hangup');
            setTimeout(() => {
              this.showModal = false;
            }, 500);

            this.onMeetingCloseTrigger.emit(true);
          }
        }
      },
    });
  }
}
