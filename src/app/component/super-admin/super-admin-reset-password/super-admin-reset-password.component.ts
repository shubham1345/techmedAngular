import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { SvcmainAuthserviceService } from 'src/app/services/services/svcmain-authservice.service';
import { svc_dashboardService } from 'src/app/services/services/svc_dashboard.service';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { ngxLoadingAnimationTypes } from 'ngx-loading';

@Component({
  selector: 'app-super-admin-reset-password',
  templateUrl: './super-admin-reset-password.component.html',
  styleUrls: ['./super-admin-reset-password.component.css']
})


export class SuperAdminResetPasswordComponent implements OnInit {
  public ngxLoadingAnimationTypes = ngxLoadingAnimationTypes;
  loading = false;
  public config = {
    animationType: ngxLoadingAnimationTypes.none,
    backdropBorderRadius: '3px',
  };
  hidden: boolean = false;
  resetpassword = new FormGroup({
    email: new FormControl(''),
    name: new FormControl(''),
    usertype: new FormControl(''),



  })

  constructor(
    private Svc_dashboardService: svc_dashboardService,
    private fb: FormBuilder,
    private _sweetAlert: SvcmainAuthserviceService
  ) {

    //////////used to stop loader when their is error of 401 and 403////

    this._sweetAlert.getLoader().subscribe((res: any) => {
      this.loading = res
      console.log('med', this.loading)
    })

    /////////////////////////////////////////////////////////////

  }

  ngOnInit(): void {

    this.resetpassword = this.fb.group({
      email: ['', [Validators.required]],
      name: ['', [Validators.required]],
      usertype: ['', [Validators.required]],

    });
  }
  detail: any = [];
  getdetail(email) {
    this.resetpassword.markAllAsTouched();
    this.resetpassword.get('name').setValue('')
    this.resetpassword.get('usertype').setValue('')

    if (email) {
      let payload = { "email": email }
      this.loading = true
      this.Svc_dashboardService.GetUserDetails(payload).subscribe((data: any) => {
        this.loading = false
        console.log(this.detail, 'this.detail');
        if (data.name || data.userType) {
          this.resetpassword.patchValue({
            name: data.name,
            usertype: data.userType,
          })
          this.detail = data;
          this.hidden = true
        }
        else {
          this.hidden = false;
          this.detail = ''
          this._sweetAlert.sweetAlert('No Data Available', 'error')
        }
      },
        (error => {
          this.loading = false
        })
      )
    }
  }

  reset() {
    if (this.resetpassword.value) {
      let obj: any = {};
      obj.UserMailID = this.resetpassword.get('email').value;
      this.loading = true
      this.Svc_dashboardService.UpdateUserPassword(obj.UserMailID).subscribe((res: any) => {
        Swal.fire({
          title: 'Success',
          text: `You submitted succesfully! Please check your mail for password`,
          icon: 'success',

        }).then(function () {
          window.location.reload();
        })
        // this.resetpassword.reset()
        this.loading = false
      },
        (error) => {
          this.loading = false
          if (error.errorMessage == false) {
            return
          }
        }
      )
    }
  }

}
