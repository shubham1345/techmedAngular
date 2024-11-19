import {
  ChangeDetectorRef,
  Component,
  HostListener,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { environment } from 'src/environments/environment';
import { INotificationResponse } from './model/INotificationResponse';
import { NotificationHubService } from './services/services/notification-hub.service';
import { TwilioConferenceHomeComponent } from './component/twilio-component/components/twilio-conference-home/twilio-conference-home.component';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { EncryptData } from './utils/utilityFn';
import { SvclocalstorageService } from './services/services/svclocalstorage.service';
import { SvcAuthenticationService } from './services/services/svc-authentication.service';
import { AutoLogoutService } from './services/services/autoLogout.service';
import { SvcPhcGetPatientService } from './services/services/svc-phc-get-patient.service';
import { AsyncAction } from 'rxjs/internal/scheduler/AsyncAction';
import { HttpClient } from '@angular/common/http';
import { SvcmainAuthserviceService } from './services/services/svcmain-authservice.service';
import { TabrouteguardService } from './services/auth/tabrouteguard.service';
import { Subscription, take, timer } from 'rxjs';
import { svc_dashboardService } from 'src/app/services/services/svc_dashboard.service';

declare var $: any;
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  title = 'MedTech - MP Telemedicine Network';
  loadChildForm: boolean = false;
  patientCaseId: number = 0;
  name = 'Angular';

  constructorTimeOut: any;

  obj: any;
  expirytime: any;
  currenttime: any;
  diff: any;
  minleft: any;
  countDownDate: any;
  x: any;
  refreshtoken: boolean = false;
  distancebuffer: any;
  constructor(
    public svcNotification: NotificationHubService,
    private router: Router,
    private svcLocalStorage: SvclocalstorageService,
    private svcAuth: SvcAuthenticationService,
    private changeDetector: ChangeDetectorRef,
    private service: AutoLogoutService,
    private SvcPhcPatient: SvcPhcGetPatientService,
    private http: HttpClient,
    private _sweetalert: SvcmainAuthserviceService,
    private tabGuardService: TabrouteguardService,
    private Svc_dashboardService: svc_dashboardService
  ) {
    // this.startIdleTimer();

    if (!this.tabGuardService.checkTab()) {
      alert('You cannot open multiple tabs of this page.');
    }

    this._sweetalert.getNavigation().subscribe((res: any) => {
      if (res == true) {
        //  alert('navi')
        if (this.timerUnsubscribe) {
          this.timerUnsubscribe.unsubscribe();
        }
        this.userObjFromToken = this.svcLocalStorage.GetData(
          environment.AuthTokenKeyLSKey
        );
        if (this.userObjFromToken) {
          this.constructorTimeOut = setTimeout(() => {
            this.calculatetime();
          }, 1000);
        }
      } else {
        clearTimeout(this.clearCalculateTimeOut);
        clearTimeout(this.clearUpdateAlivetimeOut);
        clearTimeout(this.constructorTimeOut);
      }
    });

    if (
      this.svcLocalStorage.GetData(environment.AuthTokenKeyLSKey) &&
      sessionStorage.getItem('login')
    ) {
      //  alert('token mila')
      clearTimeout(this.clearCalculateTimeOut);
      clearTimeout(this.clearUpdateAlivetimeOut);
      this.constructorTimeOut = setTimeout(() => {
        this.calculatetime();
      }, 1000);
    }

    var cleartimeout: any;

    this._sweetalert.getLoginUser().subscribe((res: any) => {
      clearInterval(this.x);
      if (localStorage.getItem('AuthToken')) {
        console.warn('user login hai');
        this.count();
      } else {
        console.warn('user login nh hai');
        this.refreshtoken = true;
      }
    });
  }

  // count() {
  //   console.warn('count function');
  //   // this.refreshtoken=true
  //   clearInterval(this.x);
  //   this.obj = '';
  //   this.expirytime = '';
  //   this.countDownDate = '';
  //   this.obj = JSON.parse(localStorage.getItem('AuthToken'));
  //   this.expirytime = new Date(this.obj.accessTokenExpirationTime).valueOf();
  //   this.countDownDate = new Date(this.expirytime).getTime();

  //   console.log(this.expirytime, 'expiry', this.countDownDate);

  //   var now = new Date().getTime();

  //   // Find the distance between now and the count down date
  //   var distance = this.countDownDate - now;

  //   console.log(distance, 'distance', this.countDownDate - now);

  //   this.distancebuffer = distance - 1000 * 60 * 2;
  //   console.log(this.distancebuffer, 'distance------------------------');

  //   var min = Math.floor(
  //     (this.distancebuffer % (1000 * 60 * 60)) / (1000 * 60)
  //   );
  //   var sec = Math.floor((this.distancebuffer % (1000 * 60)) / 1000);

  //   console.log(min + 'mmmmm' + sec);

  //   // Time calculations for days, hours, minutes and seconds

  //   var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
  //   var seconds = Math.floor((distance % (1000 * 60)) / 1000);

  //   console.log(minutes, ':', seconds, 'minutes and seconds');

  //   if (minutes < 2) {
  //     this.refreshtoken = false;
  //     console.warn('time kam hai ');
  //     ///////refresh token api hit if time is less than 2 min of expiration
  //     // this.generateRefreshToken();
  //   } else {
  //     console.log('time greater than 2 min');

  //     this.refreshtoken = true;
  //     /////setInterval

  //     console.warn('else condition');

  //     // Update the count down
  //     this.x = setInterval(
  //       () => {
  //         console.warn('set interval chalgea');

  //         // Get today's date and time
  //         var now = new Date().getTime();

  //         // Find the distance between now and the count down date
  //         var distance = this.countDownDate - now;
  //         // Time calculations for days, hours, minutes and seconds
  //         //console.log(distance,'pppppppppppppppppppp');

  //         var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
  //         var seconds = Math.floor((distance % (1000 * 60)) / 1000);

  //         // Output the result in an element with id="demo"
  //         console.log(+minutes + 'm ' + seconds + 's');

  //         // If the count down is over, write some text
  //         //  if (minutes<2 ) {
  //         clearInterval(this.x);
  //         // this.generateRefreshToken();
  //         // }
  //         // else{
  //         //   this.refreshtoken=true
  //         // }
  //       },

  //       this.distancebuffer
  //     );
  //   }
  // }

  timerUnsubscribe: any;

  count() {
    let accessTokenExpirationTime = JSON.parse(
      localStorage.getItem('AuthToken')
    ).accessTokenExpirationTime;

    const twoMinutesInMilliseconds = 2 * 60 * 1000; // 2 minutes in milliseconds
    console.log(accessTokenExpirationTime, 'access');

    // Calculate the time to wait before triggering the action
    const timeToWait =
      new Date(accessTokenExpirationTime).getTime() -
      new Date().getTime() -
      twoMinutesInMilliseconds;

    // Create a timer observable
    const timer$ = timer(timeToWait);

    // Subscribe to the timer observable and perform the action
    this.timerUnsubscribe = timer$.subscribe(() => {
      // Your action to perform 2 minutes before the target date and time
      // console.log('Action performed 2 minutes before the target date and time.');

      this.generateRefreshToken();
    });
  }

  generateRefreshToken() {
    // clearInterval(this.x)
    this.timerUnsubscribe.unsubscribe();
    console.warn('api call hui');
    this.svcAuth.GenerateRefreshToken().subscribe(
      (res: any) => {
        this.svcAuth.SaveTokens(res);
        this.refreshtoken = true;
        this.count();
      },
      (err: any) => {
        this.refreshtoken = true;
      }
    );
  }

  allowMultiTab(): void {
    this.tabGuardService.allowMultiTab();
  }
  clearCalculateTimeOut: any;
  async calculatetime() {
    //  alert('cal')
    // clearTimeout(this.varcleartimeout)
    // clearTimeout(this.clearCalculateTimeOut)
    // clearTimeout(this.clearUpdateAlivetimeOut)
    // console.log('calculate time');
    var ms =
      JSON.parse(localStorage.getItem('loginTime')) +
      1000 * 60 * 5 -
      new Date().getTime();
    var min = Math.floor((ms / 1000 / 60) << 0);
    var sec = Math.floor((ms / 1000) % 60);

    // console.log(min + ':' + sec);
    if (
      new Date().getTime >=
      JSON.parse(localStorage.getItem('loginTime')) + 1000 * 60 * 5
    ) {
      // console.log('if condition');
      // to uncomment this line for capturing the status of user  either it is online or not ,commented this line on (27 oct 2023)
      // this.UpdateUserLastAlive();
    } else {
      this.clearCalculateTimeOut = setTimeout(() => {
        // to uncomment this line for capturing the status of user  either it is online or not ,commented this line on (27 oct 2023)
        // this.UpdateUserLastAlive();
      }, JSON.parse(localStorage.getItem('loginTime')) + 1000 * 60 * 5 - new Date().getTime());
    }
  }

  ngOnInit() {
    this.loadChildForm = true;
    this.IsUserLoggedIn();
    this.clearSessionStorage();
    if (this.svcLocalStorage.GetData('logOutOnDelete')) {
      this.svcAuth.LogOutUser().subscribe({
        next: () => {
          this.svcLocalStorage.DeleteAll();
          this.router.navigate(['login']);
        },
      });
      Swal.fire({
        allowOutsideClick: false,
        allowEscapeKey: false,
        allowEnterKey: false,
        toast: true,
        position: 'bottom-end',
        icon: 'info',
        title: 'You have been logout by admin!',
      });
    }

    // this._sweetalert.windowRef.addEventListener('beforeunload', this.logout.bind(this));
  }

  // @HostListener('window:mousemove')
  // @HostListener('window:keypress')
  // resetIdleTimer() {
  //   clearTimeout(this.idleTimer);
  //   this.startIdleTimer();
  //   this.showScreenSaver = false;
  // }

  // startIdleTimer() {
  //   this.idleTimer = setTimeout(() => {
  //     this.showScreenSaver = true;
  //   }, this.idleTime);
  // }

  logout() {
    this._sweetalert.LogOutUser();
  }

  // onMeetingRoomCloseByDoctor() {
  //   this.svcNotification.onMeetingRoomCloseByDoctor.subscribe({
  //     next: (message: INotificationResponse) => {

  //       if (message) {
  //         debugger;
  //         Swal.close();
  //         Swal.fire(
  //           {
  //             allowOutsideClick: false,
  //             allowEscapeKey: false,
  //             allowEnterKey: false,
  //             toast: true,
  //             position: 'bottom-end',
  //             icon: 'info',
  //             title: message.message
  //           });
  //         this.router.navigate(["/case-details"], { queryParams: { patientId: message.patientId, patientCaseId: message.patientCaseId } });
  //       }
  //     }
  //   })

  // }

  onCallRoomStartForDoctor() {
    this.svcNotification.onCallinRoomStartForDoctor.subscribe({
      next: (message: INotificationResponse) => {
        if (message) {
          Swal.close();
          Swal.fire({
            allowOutsideClick: false,
            allowEscapeKey: false,
            allowEnterKey: false,
            toast: true,
            position: 'bottom-end',
            icon: 'info',
            title: message.message,
            timer: 5000,
          });

          //this.svcNotification.onMeetingRoomInitiatedByDoctor(message.patientCaseId, message.senderEmail);
          var encId = {
            patientCaseId: message.patientCaseId,
            meetingInstance: `patient_${
              message.patientCaseId
            }_${new Date().valueOf()}`,
            isDoctor: true,
            toUser: message.senderEmail,
          };
          let strEncText = EncryptData(JSON.stringify(encId));

          this.router.navigate(['/patient-meet', strEncText], {
            queryParams: { src: strEncText },
          });
        }
      },
    });
  }

  onCallRoomStartForPHC() {
    this.svcNotification.onCallinRoomStartForPHC.subscribe({
      next: (message: INotificationResponse) => {
        if (message) {
          Swal.close();
          Swal.fire({
            allowOutsideClick: false,
            allowEscapeKey: false,
            allowEnterKey: false,
            toast: true,
            position: 'bottom-end',
            icon: 'info',
            title: message.message,
            timer: 5000,
          });

          var encId = {
            patientCaseId: message.patientCaseId,
            meetingInstance: message.roomName,
            isDoctor: false,
            toUser: message.senderEmail,
          };
          let strEncText = EncryptData(JSON.stringify(encId));
          this.router.navigate(['/patient-meet', strEncText], {
            queryParams: { src: strEncText },
          });
        }
      },
    });
  }
  userObjFromToken: any;
  getPatientQueueTimer() {
    this.userObjFromToken = this.svcLocalStorage.GetData(
      environment.AuthTokenKeyLSKey
    );
    if (this.userObjFromToken) {
      this.SvcPhcPatient.GetPatientQueue(0).subscribe((data) => {});
    }
  }
  clearUpdateAlivetimeOut: any;
  UpdateUserLastAlive() {
    // alert('update')
    console.log('updateAlive api call hui');
    this.userObjFromToken = this.svcLocalStorage.GetData(
      environment.AuthTokenKeyLSKey
    );
    if (this.userObjFromToken) {
      this.svcAuth.UpdateUserLastAlive().subscribe(
        (data) => {
          localStorage.setItem('loginTime', new Date().getTime().toString());
          this.clearUpdateAlivetimeOut = setTimeout(() => {
            this.calculatetime();
          }, 1000);
        },
        (err: any) => {
          localStorage.setItem('loginTime', new Date().getTime().toString());
          this.clearUpdateAlivetimeOut = setTimeout(() => {
            this.calculatetime();
          }, 1000);
        }
      );
    }
  }

  /*clear session storage to stop the user from
   entering again if he open the tab after closing*/

  clearSessionStorage() {
    if (
      !sessionStorage.getItem('login') &&
      localStorage.getItem('logoutToken')
    ) {
      this.svcAuth.LogOutUser().subscribe({
        next: () => {
          localStorage.clear();
          this.router.navigate(['']);
        },
      });
    }
  }
  IsUserLoggedInStatus: any;
  IsUserLoggedIn() {
    this.userObjFromToken = this.svcLocalStorage.GetData(
      environment.AuthTokenKeyLSKey
    );
    if (this.userObjFromToken) {
      let userId = this.svcLocalStorage.GetData(environment.UserId)
        ? this.svcLocalStorage.GetData(environment.UserId)
        : 0;
      this.Svc_dashboardService.IsUserLoggedIn(userId).subscribe(
        (data: any) => {
          this.IsUserLoggedInStatus = data;
          console.log(this.IsUserLoggedInStatus);
          if (this.IsUserLoggedInStatus == false) {
            this.svcAuth.LogOutUser().subscribe({
              next: () => {
                this.svcLocalStorage.DeleteAll();
                this.router.navigate(['login']);
              },
            });
            Swal.fire({
              allowOutsideClick: false,
              allowEscapeKey: false,
              allowEnterKey: false,
              toast: true,
              position: 'bottom-end',
              icon: 'info',
              title: 'You have been logout by admin!',
            });
          }
        },
        (err: any) => {}
      );
    }
  }
}
