import { Component, OnInit, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { SvclocalstorageService } from 'src/app/services/services/svclocalstorage.service';
import { SvcAuthenticationService } from 'src/app/services/services/svc-authentication.service';
import { environment } from 'src/environments/environment';
import { Roles } from 'src/app/utils/imp-utils';
import { Svc_getdoctordetailService } from 'src/app/services/services/svc_getdoctordetail.service';
import { ngxLoadingAnimationTypes } from 'ngx-loading';
import { faL } from '@fortawesome/free-solid-svg-icons';
import Swal from 'sweetalert2';
import { E } from '@angular/cdk/keycodes';
import { NotificationHubService } from 'src/app/services/services/notification-hub.service';
import { SvcmainAuthserviceService } from 'src/app/services/services/svcmain-authservice.service';
import { svc_dashboardService } from 'src/app/services/services/svc_dashboard.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  public ngxLoadingAnimationTypes = ngxLoadingAnimationTypes;

  @ViewChild('myCanvas') myCanvas: any;

  isShowError = false;
  notMatched = false;
  loading = false;
  errors = false;
  errormsg: any = '';

  captcha: any;

  public config = {
    animationType: ngxLoadingAnimationTypes.none,
    backdropBorderRadius: '3px',
  };
  error = false;
  constructor(
    private router: Router,
    private fb: FormBuilder,
    private svcLocalStorage: SvclocalstorageService,
    private svcAuth: SvcAuthenticationService,
    private svcdoc: Svc_getdoctordetailService,
    public svcNotification: NotificationHubService,
    private _sweetAlert: SvcmainAuthserviceService,
    private Svc_dashboardService: svc_dashboardService
  ) {
    //////////used to stop loader when their is error of 401 and 403////

    this._sweetAlert.getLoader().subscribe((res: any) => {
      this.loading = res;
      console.log('chc-center', this.loading);
    });

    /////////////////////////////////////////////////////////////
  }
  loginForm = new FormGroup({
    username: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required),
    captcha: new FormControl(''),
  });
  ngOnInit(): void {
    // debugger;

    this.generateCaptch();

    //localStorage.clear()

    if (this.svcLocalStorage.GetData(environment.AuthTokenKeyLSKey)) {
      this.postLoginRequest(this.svcAuth.currentUserEmail);
    }
    this.loginForm = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]],
      captcha: [''],
    });
  }
  register() {
    this.isShowError = true;
  }
  forgetPassword() {
    this.isShowError = true;
  }
  login() {
    this.error = false;
    if (this.loginForm.invalid) {
      alert('Please fill all the fields.');
    } else {
      if (this.captcha !== this.loginForm.value.captcha) {
        // if('1234'!==this.loginForm.value.captcha)
        alert('Please Fill The Captcha Correctly');
      } else {
        // if (this.loginForm.valid && this.loginForm.value.username != " " && this.loginForm.value.password != " ") {
        this.loading = true;
        let strValue = {
          username: this.loginForm.value.username.trim(),
          password: this._sweetAlert.decryptdata(
            this.loginForm.value.password.trim()
          ),
          //password: this.loginForm.value.password.trim(),
        };
        const encModel = strValue;
        //       this.svcAuth.AuthenticateUser(encModel).subscribe({
        //         next: (data: any) => {
        //           this.loading = false;
        //           this.svcLocalStorage.SetData(environment.AuthTokenKeyLSKey, JSON.stringify(data.data));
        //           sessionStorage.setItem('open','true')
        //           if (data.data.isPasswordChanged == false) {
        //             this.router.navigate(['reset-password'], { queryParams: { "username": encModel.username } },)
        //             return
        //           }
        //           else {
        //             if (data.data.isOnOtherDevice) {
        //               Swal.fire({
        //                 allowOutsideClick: false,
        //                 allowEscapeKey: false,
        //                 allowEnterKey: false,
        //                 position: 'bottom-end',
        //                 icon: 'info',
        //                 title: "You are login on multiple devices. Do you want to logout from other devices?",
        //                 showDenyButton: true,
        //                 confirmButtonText: 'Yes',
        //                 denyButtonText: `No`,
        //               }).then((result) => {

        //                 if (result.isConfirmed) {
        //                   this.loading = true;
        //                   this.svcAuth.LogoutFromOtherDevice().subscribe({
        //                     next: (isdone) => {
        //                       this.svcLocalStorage.DeleteAll();
        //                       this.svcNotification.onLogoutFromOtherDevices(data.data.username);

        //                       setTimeout(() => {
        //                         this.loading = false;
        //                         this.svcLocalStorage.SetData(environment.AuthTokenKeyLSKey, JSON.stringify(data.data));
        //                         this.postLoginRequest(data.data.username);
        //                         this.UpdateUserLastAlive()

        //                       }, 2000);
        //                     }, error: () => {
        //                       this.loading = false;
        //                       this.svcLocalStorage.DeleteAll();
        //                     }
        //                   })
        //                 } else {
        //                   this.svcLocalStorage.DeleteAll();
        //                 }

        //               })
        //             } else {

        //               this.postLoginRequest(data.data.username);
        //               this.UpdateUserLastAlive()

        //             }
        //           }

        //         },
        //         error: (error:any) => {

        //           this.loading = false;
        // alert('error')
        //           // if (error.status === 500) {
        //           //   // alert("Wrong Credentials");
        //           this.error = true;
        //           // }
        //           // else if (error.status === 401) {
        //           //   this.error = true
        //           //   //   this.router.navigate(["/login"])
        //           // }
        //           // else if (error.status === 400) {
        //           //   this.errors = true
        //           // }
        //         }
        //       }
        //       );
        //}

        this.svcAuth.AuthenticateUser(encModel).subscribe(
          (data: any) => {
            sessionStorage.setItem('login', 'login');
            this.loading = false;
            localStorage.setItem(
              'logoutToken',
              JSON.stringify(data.data.accessToken)
            );
            console.log(localStorage.getItem('logoutToken'), 'logout token');

            //this.svcLocalStorage.SetData(environment.AuthTokenKeyLSKey, JSON.stringify(data.data));
            localStorage.setItem('loginTime', new Date().getTime().toString());
            if (data.data.isPasswordChanged == false) {
              this.router.navigate(['reset-password'], {
                queryParams: {
                  username: encModel.username,
                  data: data.data.accessToken,
                },
              });
              return;
            } else {
              if (data.data.isOnOtherDevice) {
                Swal.fire({
                  allowOutsideClick: false,
                  allowEscapeKey: false,
                  allowEnterKey: false,
                  position: 'bottom-end',
                  icon: 'info',
                  title:
                    'You are login on multiple devices. Do you want to logout from other devices?',
                  showDenyButton: true,
                  confirmButtonText: 'Yes',
                  denyButtonText: `No`,
                }).then((result) => {
                  if (result.isConfirmed) {
                    this.loading = true;
                    this.svcAuth
                      .LogoutFromOtherDevice(data.data.accessToken)
                      .subscribe({
                        next: (isdone) => {
                          this.svcLocalStorage.DeleteAll();
                          this.svcNotification.onLogoutFromOtherDevices(
                            data.data.username
                          );

                          setTimeout(() => {
                            localStorage.setItem(
                              'logoutToken',
                              JSON.stringify(data.data.accessToken)
                            );
                            this.loading = false;
                            this.svcLocalStorage.SetData(
                              environment.AuthTokenKeyLSKey,
                              JSON.stringify(data.data)
                            );
                            this.postLoginRequest(data.data.username);
                            this.svcNotification.OnNotificationHubStart.next(
                              true
                            );
                              // to uncomment this line for capturing the status of user  either it is online or not ,commented this line on (27 oct 2023)

                            // this.UpdateUserLastAlive();
                          }, 2000);
                        },
                        error: () => {
                          this.loading = false;
                          this.svcLocalStorage.DeleteAll();
                          // this.svcAuth.LogOutUser().subscribe((res:any)=>{
                          //   this.svcLocalStorage.DeleteAll();
                          // })
                        },
                      });
                  } else {
                    this.svcLocalStorage.DeleteAll();
                    //  this.svcAuth.LogOutUser().subscribe((res:any)=>{
                    //   this.svcLocalStorage.DeleteAll();
                    // })
                  }
                });
              } else {
                this.svcLocalStorage.SetData(
                  environment.AuthTokenKeyLSKey,
                  JSON.stringify(data.data)
                );
                this.postLoginRequest(data.data.username);
                this.svcNotification.OnNotificationHubStart.next(true);
                  // to uncomment this line for capturing the status of user  either it is online or not ,commented this line on (27 oct 2023)

                // this.UpdateUserLastAlive();
              }
            }
          },
          (error: any) => {
            this.loading = false;

            // if (error.status === 500) {
            //   // alert("Wrong Credentials");
            this.error = true;
            this.errormsg = error.error.errorMessage;
            console.log(error, 'ssssssssssssssssssssssss');

            // }
            // else if (error.status === 401) {
            //   this.error = true
            //   //   this.router.navigate(["/login"])
            // }
            // else if (error.status === 400) {
            //   this.errors = true
            // }
          }
        );
      }
    }
  }

  postLoginRequest(userName: string) {
    this.loading = false;
    this._sweetAlert.setNavigation(true);

    this.svcAuth.GetLoggedUserDetail(userName).subscribe((l: any) => {
      this.svcLocalStorage.SetData(environment.UserId, l.id);

      this.svcAuth.GetRole(userName).subscribe((res) => {
        this.svcLocalStorage.SetData(environment.Role, res.toString());

        if (this.svcLocalStorage.GetData(environment.Role) === Roles.PHC) {
          this.svcAuth.GetPhcDetailById(userName).subscribe((f: any) => {
            this.svcLocalStorage.SetData(environment.PhcID, f.phcId);
            this.svcLocalStorage.SetData(environment.PhcName, f.phcname);
            this.svcLocalStorage.SetData(environment.BlockID, f.bLockID);
            this.router.navigate(['chc-center']);
          });
          //  this.router.navigate(['chc-center']);
        }
        // else if (this.svcLocalStorage.GetData(environment.Role) === Roles.ADMIN) {

        //   this.router.navigate(['tabular-report']);
        // }
        else if (
          this.svcLocalStorage.GetData(environment.Role) === Roles.GovEmployee
        ) {
          this.GetApiDomians();
        } else if (
          this.svcLocalStorage.GetData(environment.Role) === Roles.SysAdmin
        ) {
          this.router.navigate(['SysAdmin-Header']);
        } else if (
          this.svcLocalStorage.GetData(environment.Role) === Roles.DOCTOR
        ) {
          this.svcAuth.GetDoctorDetails(userName).subscribe((a: any) => {
            this.svcLocalStorage.SetData(environment.doctorID, a.id);
            this.svcLocalStorage.SetData(environment.doctorEmail, userName);
            this.svcLocalStorage.SetData(
              environment.doctorName,
              a.detailsDTO.firstName +
                ' ' +
                a.detailsDTO.middleName +
                ' ' +
                a.detailsDTO.lastName
            );
            this.router.navigate(['doctor-detail']);
          });
        } else if (
          this.svcLocalStorage.GetData(environment.Role) === Roles.SuperAdmin
        ) {
          this.router.navigate(['Side-bar']);
        }
      });
    });
  }
  userObjFromToken: any;
  UpdateUserLastAlive() {
    this.userObjFromToken = this.svcLocalStorage.GetData(
      environment.AuthTokenKeyLSKey
    );
    if (this.userObjFromToken) {
      this.svcAuth.UpdateUserLastAlive().subscribe((data) => {});
    }
  }

  generateCaptch() {
    this.captcha = '';
    this.loginForm.controls['captcha'].reset();
    var chars: any =
      '0123456789ABCDEFGHJKLMNOPQRSTUVWXTZabcdefghikmnopqrstuvwxyz'.split('');
    var length: any = 6;

    if (!length) {
      length = Math.floor(Math.random() * chars.length);
    }

    for (var i = 0; i < length; i++) {
      this.captcha += chars[Math.floor(Math.random() * chars.length)];
    }
    //this.captcha=Math.round((Math.pow(36, 7) - Math.random() * Math.pow(36, 7))).toString(36).slice(1)

    var c: any = document.getElementById('myCanvas');
    var ctx = c.getContext('2d');

    ctx.clearRect(0, 0, 200, 200);
    // ctx.moveTo(0, 17);
    // ctx.lineTo(200, 17);
    // ctx.stroke()
    ctx.font = '23px Arial';
    ctx.fillText(this.captcha, 10, 23);
  }

  GetApiDomians() {
    this.Svc_dashboardService.GetApiDomains().subscribe((res: any) => {
      if (res.isReadReportingDomianFromAPI == '1') {
        this.GetReportDomians();
      } else {
        this.router.navigate(['main-dashboard']);
      }
    });
  }
  GetReportDomians() {
    this.Svc_dashboardService.GetReportDomians().subscribe((res: any) => {
      localStorage.setItem('domainNames', JSON.stringify(res));
      this.router.navigate(['main-dashboard']);
    });
  }
}
