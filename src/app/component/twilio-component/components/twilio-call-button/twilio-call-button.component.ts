import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import Swal from 'sweetalert2';
import { TwilioMiddlewareService } from '../../services/twilio-middleware.service';
import { NotificationHubService } from 'src/app/services/services/notification-hub.service';
import { INotificationResponse } from 'src/app/model/INotificationResponse';
import { SvcmainAuthserviceService } from 'src/app/services/services/svcmain-authservice.service';
import { ngxLoadingAnimationTypes } from 'ngx-loading';
import { Router } from '@angular/router';
import { SvcAuthenticationService } from 'src/app/services/services/svc-authentication.service';
import { IQueryString } from 'src/app/model/QueryStringModel';
import { DecryptData, EncryptData } from 'src/app/utils/utilityFn';
import { JitsiService } from '../../services/jitsi.service';
import { Subject, Subscription, timer } from 'rxjs';

@Component({
  selector: 'app-twilio-call-button',
  templateUrl: './twilio-call-button.component.html',
  styleUrls: ['./twilio-call-button.component.css'],
})
export class TwilioCallButtonComponent implements OnInit, OnDestroy {
  @Input() disabled: boolean = false;
  @Input() patientCaseId: number = 0;
  @Input() isPHCFree: string = null;
  @Output() popupClose = new EventEmitter<string>();
  @Input() skipOnInit: boolean = false;

  public ngxLoadingAnimationTypes = ngxLoadingAnimationTypes;
  loading = false;

  public config = {
    animationType: ngxLoadingAnimationTypes.none,
    backdropBorderRadius: '3px',
  };
  callEnv: any;
  isConnectingData: boolean = false;
  isShowing: boolean = false;
  private isConnectingSubscription: Subscription;
  @Output() onMeetingCloseTrigger: EventEmitter<boolean> =
    new EventEmitter<boolean>();
  instance: any;
  swalToastOpt = {
    toast: true,
    allowEscapeKey: false,
    allowOutsideClick: false,
    position: 'bottom-right',
  };
  constructor(
    private svcVideo: TwilioMiddlewareService,
    public svcNotification: NotificationHubService,
    private _sweetAlert: SvcmainAuthserviceService,
    private router: Router,
    private changeDetector: ChangeDetectorRef,
    private twilioService: TwilioMiddlewareService,
    private svcAuth: SvcAuthenticationService,
    private jitsiService: JitsiService
  ) {
    this.isConnectingSubscription = this.jitsiService.isConnecting.subscribe(
      (data) => {
        this.isConnectingData = data.isConnectingData;
        console.log('isconeecting data Two', this.isConnectingData);
      }
    );
    // this.svcNotification.isCallInProgress.subscribe({
    //   next: (value) => {

    //     this.isCallInProgress = value;

    //   }
    // })
  }
  ngOnDestroy(): void {}

  ngOnInit(): void {
    if (!this.skipOnInit) this.beginVideoCall();
  }

  beginVideoCall() {
    this.jitsiService.isShowing.next({ isShowButton: true });
    let callingEnvironment: any = JSON.parse(
      localStorage.getItem('AuthToken')
    ).CallingEnvironment;
    if (callingEnvironment == 'jitsi') {
      if (this.isPHCFree === 'No') {
        let opt: any = Object.assign(
          {},
          {
            title: 'PHC is unavailable to take call. Please try again.',
            timer: 5000,
          },
          this.swalToastOpt
        );
        // let opt: any = Object.assign({}, this.swalToastOpt, {
        //   title: 'Starting Call, Please wait...',
        //   timer: 5000,
        //   // showConfirmButton: false,
        //    toast: false,
        // }
        // )
        this.loading = false;
        this.jitsiService.isShowing.next({ isShowButton: false });

        Swal.fire(opt);
      } else {
        let roomInstance = `patient_${
          this.patientCaseId
        }_${new Date().valueOf()}`;

        this.validateRoomBeforeInit(this.patientCaseId, roomInstance, true);
      }
    } else {
      this.loading = true;
      if (this.isPHCFree === 'No') {
        let opt: any = Object.assign(
          {},
          {
            title: 'PHC is unavailable to take call. Please try again.',
            timer: 5000,
          },
          this.swalToastOpt
        );
        // let opt: any = Object.assign({}, this.swalToastOpt, {
        //   title: 'Starting Call, Please wait...',
        //   timer: 5000,
        //   // showConfirmButton: false,
        //    toast: false,
        // }
        // )
        this.loading = false;
        this.jitsiService.isShowing.next({ isShowButton: false });

        Swal.fire(opt);
      } else {
        this.svcVideo
          .BeginDialingCallToUser(this.patientCaseId, '', 'Twilio')
          .subscribe({
            next: (value: any) => {
              this.dialingCall(value);
            },
            error: (err) => {
              this.loading = false;
              this.jitsiService.isShowing.next({ isShowButton: false });
              let Opt: any = Object.assign(
                {},
                {
                  title: 'Error',
                  text: `Invalid patient detail or Doctor not available now.`,
                  icon: 'info',
                },
                this.swalToastOpt
              );
              Swal.fire(Opt);
            },
          });
      }
    }
  }

  dialingCall(value: any) {
    let callingEnvironmentTwo: any = JSON.parse(
      localStorage.getItem('AuthToken')
    ).CallingEnvironment;
    this.loading = false;
    if (value?.isSuccess === true) {
      if (callingEnvironmentTwo === 'Twilio') {
        this.svcNotification.isCallInDailing.next(true);

        if (this.svcNotification.isCallInProgress.value == true) {
          this.svcNotification.OnCallRejectedNotify(
            value.senderEmail,
            value.receiverEmail
          );
        }
        // this.jitsiService.isShowing.next({ isShowButton: true });
        let successOpt: any = Object.assign({}, this.swalToastOpt, {
          title: 'Connecting',
          icon: 'info',
          timer: 1000 * 20 * 1,
          showConfirmButton: false,
          toast: false,
        });
        // this.jitsiService.isShowing.next({ isShowButton: false });
        Swal.fire(successOpt);
        this.popupClose.emit(value);
        // Swal.fire(successOpt).then(() => {
        //   // Close the popup and emit the value
        //   this.popupClose.emit(value);
        //   // Stop the loader after the popup is closed
        //   this.loading = false;
        // });
      } else if (callingEnvironmentTwo === 'jitsi') {
        this.svcNotification.isCallInDailing.next(true);

        if (this.svcNotification.isCallInProgress.value == true) {
          this.svcNotification.OnCallRejectedNotify(
            value.senderEmail,
            value.receiverEmail
          );
        }
        if (!this.isConnectingData) {
          // let successOpt: any = Object.assign({}, this.swalToastOpt, {
          //   title: 'Connecting',
          //   icon: 'info',
          //   timer: 1000 * 20 * 1,
          //   showConfirmButton: false,
          //   toast: false,
          // });
          // Swal.fire(successOpt);
          var modelRef = this.jitsiService.openModel();
          this.popupClose.emit(value);
        }
      }
    } else {
      this.jitsiService.isShowing.next({ isShowButton: false });
      let Opt: any = Object.assign(
        {},
        {
          title: 'Unavailable',
          text: `Busy or unavailable to take call.`,
          icon: 'info',
        },
        this.swalToastOpt
      );

      Swal.fire(Opt);
      if (callingEnvironmentTwo === 'jitsi') {
        this.svcNotification.isCallInDailing.next(false);
        setTimeout(() => {
          this.endCall(this.instance, this.patientCaseId, true);
        }, 3000);
      }
    }
  }

  validateRoomBeforeInit(
    patientCaseId: number,
    meetingInstance: string,
    isInitiator: boolean
  ) {
    this.loading = true;

    localStorage.setItem('meetingInstace', meetingInstance);

    this.instance = meetingInstance;
    let callingEnvironment3: any = JSON.parse(
      localStorage.getItem('AuthToken')
    ).CallingEnvironment;
    console.log('jitsi', 'validate room', meetingInstance);

    this.twilioService
      .ConnectToMeetingRoom(
        patientCaseId,
        meetingInstance,
        this.svcAuth.isDoctor,
        isInitiator,
        'jitsi'
      )
      .subscribe({
        next: async (data: any) => {
          this.loading = false;
          this.svcNotification.isCallInDailing.next(false);
          if (data.isSuccess) {
            this.jitsiService.patientId = data.data;
            this.jitsiService.jitsiCallData.next({
              roomData: data,
              isInitiator: isInitiator,
              meetingInstance: meetingInstance,
              callingEnvironment: 'jitsi',
              patientCaseId: patientCaseId,
            });
            // this.isValidRoom = true;
            // this.roomName = meetingInstance;
            // this.meetingStarted = true;
            // this.changeDetector.detectChanges();
            // let qs: IQueryString = {
            //   patientId: data.data,
            // };
            // this.svcNotification.isCallInProgress.next(true);

            // this.svcNotification.isInitiator.next(isInitiator); // check
            // let strEncText = EncryptData(JSON.stringify(qs));

            // if (this.svcAuth.isDoctor) {
            //   // this._sweetAlert.setVideoCall(false);
            //   // this.router.navigate(['case-details-doc'], {
            //   //   queryParams: { src: strEncText },
            //   // });
            // } else {
            //   this._sweetAlert.setVideoCall(false);
            //   this.router.navigate(['case-details'], {
            //     queryParams: { src: strEncText },
            //   });
            // }

            // return true;
          } else {
            this.svcNotification.isCallInProgress.next(false);
            this.loading = false;
          }

          this.svcVideo
            .BeginDialingCallToUser(
              this.patientCaseId,
              meetingInstance,
              'jitsi'
            )
            .subscribe({
              next: (value: any) => {
                this.dialingCall(value);
              },
              error: (err) => {
                this.jitsiService.isShowing.next({ isShowButton: false });
                this.loading = false;
                let Opt: any = Object.assign(
                  {},
                  {
                    title: 'Error',
                    text: `Invalid patient detail or Doctor not available now.`,
                    icon: 'info',
                  },
                  this.swalToastOpt
                );
                Swal.fire(Opt);
              },
            });
        },
        error: (err) => {
          this.svcNotification.isCallInProgress.next(false);
          this.jitsiService.isShowing.next({ isShowButton: false });
          this.loading = false;
          Swal.fire({
            allowOutsideClick: false,
            allowEscapeKey: false,
            allowEnterKey: false,
            position: 'bottom-end',
            icon: 'error',
            title: 'Jitsi Invalid Meeting Room Or Closed',
            confirmButtonText: 'Ok',
          });
        },

        complete() {
          this.playAlertAudio = false;
        },
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
            new this.onMeetingCloseTrigger(true);
          });
        }
      );
  }
}
