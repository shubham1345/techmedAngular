import { Location } from '@angular/common';
import {
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { faL } from '@fortawesome/free-solid-svg-icons';
import {
  HubConnection,
  HubConnectionBuilder,
  LogLevel,
} from '@microsoft/signalr';
import { ngxLoadingAnimationTypes } from 'ngx-loading';
import { Subject, Subscription, timer } from 'rxjs';
import { INotificationResponse } from 'src/app/model/INotificationResponse';
import { IQueryString } from 'src/app/model/QueryStringModel';
import { NotificationHubService } from 'src/app/services/services/notification-hub.service';
import { SvcAuthenticationService } from 'src/app/services/services/svc-authentication.service';
import { SvclocalstorageService } from 'src/app/services/services/svclocalstorage.service';
import { SvcmainAuthserviceService } from 'src/app/services/services/svcmain-authservice.service';
import { DecryptData, EncryptData } from 'src/app/utils/utilityFn';
import { environment } from 'src/environments/environment';

import Swal from 'sweetalert2';
import {
  createLocalAudioTrack,
  createLocalTracks,
  RemoteParticipant,
  Room,
} from 'twilio-video';
import { TwilioMiddlewareService } from '../../services/twilio-service.export';
import { TwilioCameraComponent } from '../twilio-camera/twilio-camera.component';
import { TwilioDeviceSettingComponent } from '../twilio-device-setting/twilio-device-setting.component';
import { TwilioRoomParticipantsComponent } from '../twilio-room-participants/twilio-room-participants.component';
import { JitsiService } from '../../services/jitsi.service';

@Component({
  selector: 'app-twilio-conference-home',
  templateUrl: './twilio-conference-home.component.html',
  styleUrls: ['./twilio-conference-home.component.css'],
})
export class TwilioConferenceHomeComponent implements OnInit, OnDestroy {
  public ngxLoadingAnimationTypes = ngxLoadingAnimationTypes;
  public config = {
    animationType: ngxLoadingAnimationTypes.none,
    backdropBorderRadius: '3px',
  };

  isValidRoom: boolean = false;
  isConnectingData: boolean = false;
  isShowing: boolean = false;
  private isConnectingSubscription: Subscription;
  playAudio: boolean = false;
  queryStringParam: any;
  // private notificationHub: HubConnection;
  activeRoom: Room;
  // @ViewChild('camera', { static: false }) camera: TwilioCameraComponent;
  @ViewChild('settings', { static: false })
  settings: TwilioDeviceSettingComponent;
  // @ViewChild('participants', { static: false }) participants: TwilioRoomParticipantsComponent;
  roomName: string = '';
  meetingStarted: boolean = false;
  showLoader: boolean = false;
  isConnecting: boolean = false;
  isCallInProgress: boolean = false;
  isFullScreen: boolean = false;

  swalToastOpt = {
    icon: 'info',
    toast: true,
    allowOutsideClick: false,
    allowEscapeKey: false,
    allowEnterKey: false,
    position: 'bottom-right',
  };
  role: any;
  callingEnvironment: string = '';

  constructor(
    // private route: Router,
    private actRoute: ActivatedRoute,
    private location: Location,
    private twilioService: TwilioMiddlewareService,
    private changeDetector: ChangeDetectorRef,
    private router: Router,
    public svcNotification: NotificationHubService,
    private svcAuth: SvcAuthenticationService,
    private svcLocalstorage: SvclocalstorageService,
    private _sweetAlert: SvcmainAuthserviceService,
    private jitsiService: JitsiService,
    private route: ActivatedRoute
  ) {
    this.isConnectingSubscription = this.jitsiService.isConnecting.subscribe(
      (data) => {
        this.isConnectingData = data.isConnectingData;
        console.log('isconeecting data', this.isConnectingData);
        if (this.callingEnvironment === 'jitsi') {
          this.timerstart();
        }
      }
    );
    this.role = localStorage.getItem('role');

    this.svcNotification.isCallInProgress.subscribe({
      next: (value) => {
        this.isCallInProgress = value;
      },
      error: (err: any) => {},
      complete: () => {
        this.playAlertAudio = false;
      },
    });

    this.svcNotification.ringTheCallAudio.subscribe({
      next: (value: boolean) => {
        this.playAudio = value;
      },
    });

    this.OnNotificationHubStart();
    // this.svcNotification.NotificationHubStart().then(x => {
    //   this.onCallReceived();
    //   this.onCallRejected();
    //   this.onNotifyParticipants();
    // });
    this.onCallReceived();
    this.onCallRejected();
    this.onNotifyParticipants();
    this.jitsiCallStart();
  }

  triggerRefresh() {
    console.log('Before refreshing the patient wait list');
    this.jitsiService.refreshPatientWaitList();
    console.log('After triggering refresh');
  }
  OnNotificationHubStart() {
    this.svcNotification.OnNotificationHubStart.subscribe({
      next: (message: boolean) => {
        if (message) {
          console.log(
            'Hub starting==================================>',
            message
          );
          this.svcNotification.NotificationHubStart().then((x) => {
            // this.onCallReceived();
            // this.onCallRejected();
            // this.onNotifyParticipants();
          });
        } else {
          if (this.svcLocalstorage.GetData(environment.AuthTokenKeyLSKey)) {
            console.log(
              'Hub starting with referesh==================================>',
              message
            );
            this.svcNotification.OnNotificationHubStart.next(true);
            // this.svcNotification.NotificationHubStart().then((x) => {
            //   console.log("notification refresh working");

            //   // this.onCallReceived();
            //   // this.onCallRejected();
            //   // this.onNotifyParticipants();
            // });
          }
        }
      },
    });
  }
  patientCaseId: number = 0;

  onCallReceived() {
    // this.isValidRoom = false;
    // this.meetingStarted = false;
    // console.log('inside method');
    this.svcNotification.onCallReceived.subscribe({
      next: (message: INotificationResponse) => {
        // this.svcNotification.isCallInProgress.subscribe({
        //   next: (value) => {
        //         console.log(value,'call progress');

        //   },
        //   error:(err:any)=>{},
        //   complete:()=>{
        //     this.playAlertAudio=false
        //   }
        //})

        // alert(this.isCallInProgress)

        if (message) {
          let ringTheCallAudio = this.svcNotification.ringTheCallAudio.value;
          let isCallInDailing = this.svcNotification.isCallInDailing.value;
          if (ringTheCallAudio || isCallInDailing) {
            this.svcNotification.OnCallRejectedNotify(
              message.senderEmail,
              message.receiverEmail
            );
          } else {
            this.callingEnvironment = message.callingEnvironment;
            this.twilioService.callingEnvironment = message.callingEnvironment;
            this.svcNotification.ringTheCallAudio.next(true);
            Swal.close();
            this.patientCaseId = message.patientCaseId;
            let opt: any = Object.assign({}, this.swalToastOpt, {
              title: 'Received call from ' + message.message,

              showDenyButton: true,
              confirmButtonText: 'Accept',
              denyButtonText: `Decline`,
              toast: false,
              timer: 1000 * 20 * 1,
            });
            Swal.fire(opt).then((result) => {
              this.playAlertAudio = false;
              clearInterval(this.timerID);
              if (this.callingEnvironment === 'Twilio') {
                this.timerstart();
              }

              this.svcNotification.ringTheCallAudio.next(false);
              this.svcNotification.isCallInDailing.next(false);
              let notificationMessage: any = message;
              if (result.isConfirmed) {
                if (this.isCallInProgress == true) {
                  this.meetingStarted = false;
                  this.isValidRoom = false;

                  console.log('Hii');
                }
                let roomInstance =
                  message.roomName ||
                  notificationMessage.meetingInstance ||
                  `patient_${message.patientCaseId}_${new Date().valueOf()}`;

                this.validateRoomBeforeInit(
                  this.patientCaseId,
                  roomInstance,
                  this.callingEnvironment == 'jitsi' ? false : true
                );
              } else {
                this._sweetAlert.callNotReceived.next(true);
                clearInterval(this.timerID);
                this.playAlertAudio = false;
                this.svcNotification.OnCallRejectedNotify(
                  message.senderEmail,
                  message.receiverEmail
                );
                let opt2: any = Object.assign({}, this.swalToastOpt, {
                  title: 'Call Disconnected',
                });
                Swal.fire(opt2);
                if (this.callingEnvironment == 'jitsi') {
                  this.endCall(
                    notificationMessage.meetingInstance,
                    notificationMessage.patientCaseId,
                    true
                  );
                  console.log('Hii');
                }
              }
            });
          }
        }
      },
      error(err) {
        this.playAlertAudio = false;
      },
      complete() {
        this.playAlertAudio = false;
      },
    });
  }

  onCallRejected() {
    this.svcNotification.onCallRejected.subscribe({
      next: (message: INotificationResponse) => {
        if (message) {
          this.svcNotification.ringTheCallAudio.next(false);
          this.svcNotification.isCallInDailing.next(false);
          Swal.close();
          this.jitsiService.isShowing.next({ isShowButton: false });
          let opt: any = Object.assign(
            {},
            { title: 'Call Declined.' },
            this.swalToastOpt
          );

          Swal.fire(opt);
        }
      },
      complete() {
        this.playAlertAudio = false;
        // const queryParams = { patientqueue: 'patient-queue' };

        // // Navigate with queryParams

        //   this.router.navigate(['chc-center'], { relativeTo: this.route, queryParams: queryParams })
        //   .then(() => {
        //     // Reload the page after navigation
        //     window.location.reload();
        //   });
      },
    });
  }

  onNotifyParticipants() {
    this.svcNotification.onNotifyParticipientToJoin.subscribe({
      next: (message: INotificationResponse) => {
        clearInterval(this.timerID);
        if (message && this.svcAuth.isDoctor) {
          this.callingEnvironment = message.callingEnvironment;
          if (this.callingEnvironment === 'Twilio') {
            this.timerstart();
          }
          Swal.close();
          let opt: any = Object.assign(
            {},
            { title: 'Starting Call, Please wait...', timer: 5000 },
            this.swalToastOpt
          );
          // let opt: any = Object.assign({}, this.swalToastOpt, {
          //   title: 'Starting Call, Please wait...',
          //   timer: 5000,
          //   // showConfirmButton: false,
          //    toast: false,
          // }
          // )
          Swal.fire(opt);
          this.patientCaseId = message.patientCaseId;
          this.validateRoomBeforeInit(
            message.patientCaseId,
            message.roomName,
            false
          );
        }
      },
      complete() {
        clearInterval(this.timerID);
        this.playAlertAudio = false;
      },
    });
  }
  patientqueue: any;
  onMeetingCloseTrigger(event: any) {
    this.svcNotification.ringTheCallAudio.next(false);
    this.svcNotification.isCallInProgress.next(false);
    this.svcNotification.isCallInDailing.next(false);
    this.playAlertAudio = false;

    this.showLoader = false;

    setTimeout(() => {
      window.location.href = window.location.href;
      //  if(this.callingEnvironment === 'jitsi')
      //  {
      //   if(localStorage.getItem('role')=='Doctor'){
      //     this.router.navigate(['doctor-detail']).then(() => {
      //       window.location.reload();
      //     });
      //   }
      //   else
      //   this.router.navigate(['chc-center']).then(() => {
      //     window.location.reload();
      //   });
      //  }
    }, 3000);
  }

  ngOnInit(): void {
    this.jitsiService.refreshPatientWaitList();
  }
  switchFullScreen(isFullScreen: boolean) {
    this.isFullScreen = isFullScreen;
  }

  validateRoomBeforeInit(
    patientCaseId: number,
    meetingInstance: string,
    isInitiator: boolean
  ) {
    this.showLoader = true;

    localStorage.setItem('meetingInstace', meetingInstance);

    console.log(this.callingEnvironment, 'validate room', meetingInstance);

    this.twilioService
      .ConnectToMeetingRoom(
        patientCaseId,
        meetingInstance,
        this.svcAuth.isDoctor,
        isInitiator,
        this.callingEnvironment
      )
      .subscribe({
        next: async (data: any) => {
          this.connectingRoomProcess(data, meetingInstance, isInitiator);
        },
        error: (err) => {
          this.svcNotification.isCallInProgress.next(false);
          this.showLoader = false;
          Swal.fire({
            allowOutsideClick: false,
            allowEscapeKey: false,
            allowEnterKey: false,
            position: 'bottom-end',
            icon: 'error',
            title: 'Invalid Meeting Room Or Closed',
            confirmButtonText: 'Ok',
          });
        },
        complete() {
          this.playAlertAudio = false;
        },
      });
  }

  connectingRoomProcess(
    data: any,
    meetingInstance: string,
    isInitiator: boolean
  ) {
    this.showLoader = false;
    this.svcNotification.isCallInDailing.next(false);
    if (data.isSuccess) {
      this.isValidRoom = true;
      this.roomName = meetingInstance;
      this.meetingStarted = true;
      this.changeDetector.detectChanges();
      let qs: IQueryString = {
        patientId: data.data,
      };
      this.svcNotification.isCallInProgress.next(true);

      this.svcNotification.isInitiator.next(isInitiator);
      let strEncText = EncryptData(JSON.stringify(qs));

      this._sweetAlert.setVideoCall(false);
      if (this.svcAuth.isDoctor) {
        if (this.callingEnvironment != 'jitsi')
          this.router.navigate(['case-details-doc'], {
            queryParams: { src: strEncText },
          });
      } else {
        // this._sweetAlert.setVideoCall(false);
        this.router.navigate(['case-details'], {
          queryParams: { src: strEncText },
        });
      }
      return true;
    } else {
      this.svcNotification.isCallInProgress.next(false);
      this.showLoader = false;
      return true;
    }
  }

  // deviceInfo: MediaDeviceInfo;
  // async onSettingsChanged(deviceInfo: MediaDeviceInfo) {
  //   this.deviceInfo = deviceInfo;
  // }

  isSettingCameraReady: boolean = false;
  onSettingCameraInitComplete($event) {
    this.isSettingCameraReady = true;
  }

  timerID: any;
  playAlertAudio: boolean = false;
  timerstart() {
    this._sweetAlert.setisMinVideoTimeCompelted(false);
    var seconds = 0;
    var minutes = 0;
    var executedVideoTiming = false; ///////executed video timeing only once
    this.timerID = setInterval(() => {
      seconds++;
      if ((seconds == 30 && minutes > 0) || seconds == 59) {
        //console.log(minutes+':'+seconds,'play audio condition');
        console.log(
          executedVideoTiming,
          'role',
          this.role,
          'min',
          minutes,
          'play audio'
        );

        if (!executedVideoTiming && minutes == 1) {
          console.log(
            executedVideoTiming,
            'role',
            this.role,
            'min',
            minutes,
            'play audio'
          );

          console.log(minutes + ':' + seconds, 'set min video time completed');

          this._sweetAlert.setisMinVideoTimeCompelted(true); //////used to show alert when doctor click on submit and time is lest than 90sec
          executedVideoTiming = true;
        }

        this.playAlertAudio = true;
        setTimeout(() => {
          this.playAlertAudio = false;
        }, 2000);
      }
      if (seconds === 60) {
        minutes++;
        seconds = 0;
      }

      document.getElementById('timer').textContent =
        minutes.toString().padStart(2, '0') +
        ':' +
        seconds.toString().padStart(2, '0');

      var timer1 =
        minutes.toString().padStart(2, '0') +
        ':' +
        seconds.toString().padStart(2, '0');
    }, 1000);
  }

  onCallEndNotificationReceived() {
    // alert('confrence room');
    this.svcNotification.onNotifyParticipientToExit.subscribe({
      next: (message: INotificationResponse) => {
        // alert('confrence disconnected');
        if (message) {
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

          this.onMeetingCloseTrigger(false);
        }
      },
    });
  }

  ngOnDestroy(): void {
    this.playAlertAudio = false;
  }

  jitsiCallStart() {
    this.jitsiService.jitsiCallData.subscribe((res: any) => {
      if (res.meetingInstance) {
        this.isConnecting = false;
        // if(this.isConnectingData){
        //
        // }
        if (this.callingEnvironment === 'Twilio') {
          this.timerstart();
        }
        localStorage.setItem('meetingInstace', res.meetingInstance);
        this.callingEnvironment = res.callingEnvironment;
        this.patientCaseId = res.patientCaseId;
        this.connectingRoomProcess(
          res.roomData,
          res.meetingInstance,
          res.isInitiator
        );
      }
    });
  }

  endCall(
    roomInstance: string,
    patientCaseId: number,
    isPartiallyClosed: boolean
  ) {
    this.twilioService
      .DismissCall(roomInstance, patientCaseId, isPartiallyClosed, 'endcall')
      .subscribe(
        (res: any) => {
          // API call successful, redirect to case details page
          console.log('HIIII ');
          // if(localStorage.getItem('role')=='PHCUser'){
          //   const queryParams = { patientqueue: 'patient-queue' };

          //   // Navigate with queryParams

          //     this.router.navigate(['chc-center'], { relativeTo: this.route, queryParams: queryParams })
          //     .then(() => {
          //       // Reload the page after navigation
          //       window.location.reload();
          //     });
          //   }
        },

        // this.route
        (err: any) => {
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
            this.onMeetingCloseTrigger(true);
          });
        }
      );
  }
}
