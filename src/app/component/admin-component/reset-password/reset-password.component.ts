import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SvclocalstorageService } from 'src/app/services/services/svclocalstorage.service';
import { SvcAuthenticationService } from 'src/app/services/services/svc-authentication.service';
import { environment } from 'src/environments/environment';
import { Roles } from 'src/app/utils/imp-utils';
import { Svc_getdoctordetailService } from 'src/app/services/services/svc_getdoctordetail.service';
import { ngxLoadingAnimationTypes } from 'ngx-loading';
import Swal from 'sweetalert2';
import { E } from '@angular/cdk/keycodes';
import { NotificationHubService } from 'src/app/services/services/notification-hub.service';
import { CustomValidators } from './customValidators';
import { SvcmainAuthserviceService } from 'src/app/services/services/svcmain-authservice.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css'],
})
export class ResetPasswordComponent implements OnInit {
  public ngxLoadingAnimationTypes = ngxLoadingAnimationTypes;
  success = '';
  isShowError = false;
  username: any;
  notMatched = false;
  loading = false;
  errors = false;
  public config = {
    animationType: ngxLoadingAnimationTypes.none,
    backdropBorderRadius: '3px',
  };
  resetPassword = new FormGroup(
    {
      oldPassword: new FormControl('', [Validators.required]),

      password: new FormControl('', [
        Validators.required,
        Validators.minLength(8),
      ]),
      confirmPassword: new FormControl('', [Validators.required]),
    },

    CustomValidators.mustMatch('password', 'confirmPassword') // insert here
  );

  submitted = false;

  constructor(
    private svcAuth: SvcAuthenticationService,
    private svcLocalStorage: SvclocalstorageService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private _sweetAlert:SvcmainAuthserviceService
  ) {


    
    this._sweetAlert.getLoader().subscribe((res:any)=>{
      this.loading=res
      console.log('med',this.loading)
    })
  }
accesstoken:any
  ngOnInit() {
    this.activatedRoute.queryParams.subscribe((res: any) => {
      this.username = res.username;
      this.accesstoken=`Bearer `+res.data
      console.log(this.username);
    });
  }

  get f() {
    return this.resetPassword.controls;
  }

  onSubmit() {
    this.submitted = true;
    if (this.resetPassword.invalid) {
      return;
    }
    let obj: any = {};
    obj.userNameOrEmail = this.username;

    console.log(obj.userNameOrEmail);
    obj.oldPassword =this._sweetAlert.decryptdata( this.resetPassword.get('oldPassword')?.value.trim());
    obj.newPassword = this._sweetAlert.decryptdata(this.resetPassword.get('password')?.value.trim())
    //obj.newPassword = this.resetPassword.get('confirmPassword')?.value;
    if ((this.resetPassword.get('oldPassword')?.value )== (this.resetPassword.get('password')?.value)) {
      Swal.fire({
        text: 'New password should not be same as old password',
        icon: 'warning',
      });
    } else {
      this.svcAuth.ResetPassword(obj,this.accesstoken).subscribe((data: any) => {
        if (data.status == 'Fail') {
          Swal.fire({
            text: data.errorMessage,
            icon: 'warning',
          });
        } else {
          Swal.fire({
            title: 'Success',
            text: 'Pasword changed Successfully',
            icon: 'success',
          })
            this.svcAuth.LogOutUser().subscribe(((res:any)=>{
              this.router.navigate(['login']);
              localStorage.clear()
            }))

  
          
        }
        console.log(data);
        this.loading = false;
      });

      this.loading = true;
    }
    console.log((this.success = JSON.stringify(this.resetPassword.value)));
  }
}
