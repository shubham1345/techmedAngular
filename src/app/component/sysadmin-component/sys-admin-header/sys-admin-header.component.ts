import { UpperCasePipe } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { MdbModalRef, MdbModalService } from 'mdb-angular-ui-kit/modal';
import { environment } from 'src/environments/environment';
import { AccountRegisterComponent } from '../../shared-component/account-register/account-register.component';
import { PatientsSearchbarComponent } from '../../shared-component/patients-searchbar/patients-searchbar.component';
import { SvclocalstorageService } from 'src/app/services/services/svclocalstorage.service';
import { SvcPhcGetPatientService } from 'src/app/services/services/svc-phc-get-patient.service';
import { SvcAuthenticationService } from 'src/app/services/services/svc-authentication.service';
import { ngxLoadingAnimationTypes } from 'ngx-loading';
import { SvcmainAuthserviceService } from 'src/app/services/services/svcmain-authservice.service';
import { svc_dashboardService } from 'src/app/services/services/svc_dashboard.service';
declare var $;
@Component({
  selector: 'app-sys-admin-header',
  templateUrl: './sys-admin-header.component.html',
  styleUrls: ['./sys-admin-header.component.css'],
})
export class SysAdminHeaderComponent implements OnInit, OnDestroy {
  public ngxLoadingAnimationTypes = ngxLoadingAnimationTypes;

  isShowError = false;
  notMatched = false;
  loading = false;
  errors = false;
  showMenu: string = 'Dashboard';

  public config = {
    animationType: ngxLoadingAnimationTypes.none,
    backdropBorderRadius: '3px',
  };
  error = false;

  constructor(
    private svcLocalstorage: SvclocalstorageService,
    private SvcPhcPatient: SvcPhcGetPatientService,
    private fb: FormBuilder,
    private svcAuth: SvcAuthenticationService,
    private router: Router,
    private _sweetAlert: SvcmainAuthserviceService,
    private Svc_dashboardService: svc_dashboardService
  ) {
    //////////used to stop loader when their is error of 401 and 403////

    // this._sweetAlert.getLoader().subscribe((res:any)=>{
    //   this.loading=res
    //   console.log('med',this.loading)
    // })

    /////////////////////////////////////////////////////////////
    this.GetReportAccessDetailsByUserID();
  }
  ngOnDestroy(): void {
    this._sweetAlert.closeAllModalsOnLogout.next(true);
  }
  sysadmin = this.svcLocalstorage.GetData(environment.Role);
  isDoctor: boolean;
  ngOnInit(): void {
    // this.GetReportAccessDetailsByUserID()
  }
  onSignOut() {
    this.svcAuth.LogOutUser().subscribe({
      next: () => {
        this.svcLocalstorage.DeleteAll();

        this.router.navigate(['/login']);

        this.checkSignOut();
      },
    });
  }
  isSignOut: boolean;
  checkSignOut() {
    if (this.svcLocalstorage.GetData(environment.AuthTokenKeyLSKey) != null) {
      this.isSignOut = true;
    } else {
      this.isSignOut = false;
    }
  }
  // isPhcRegistration: boolean= true;
  // isDoctorRegistration: boolean= false;
  // isqueue: boolean= false;
  // isOrphan: boolean= false;
  // isholiday: boolean= false;
  // isSpoke: boolean= false;
  // isemp: boolean= false;
  // ishealth: boolean= false;
  // isInstallation:boolean=false;
  // isPrescription:boolean=false;

  // clickbutton(data){
  // console.log(data,'data');

  //   if(data == 'PHC Registration'){
  //     this.isDoctorRegistration=false
  //     this.isqueue=false
  //     this.isOrphan= false
  //     this.isholiday= false
  //     this.isSpoke = false
  //     this.isemp= false
  //     this.ishealth= false
  //     this.isInstallation=false
  //     this.isPrescription=false

  //  this.isPhcRegistration=true

  //   }
  //   else if(data == 'Doctor Registration'){
  //     this.isPhcRegistration=false
  //   this.isDoctorRegistration= true
  //   console.log(this.isDoctorRegistration,'is');
  //   // this.isDoctorRegistration=false
  //     this.isqueue=false
  //     // this.isPhcRegistration= false
  //     this.isholiday= false
  //     this.isSpoke = false
  //     this.isemp= false
  //     this.ishealth= false
  //  this.isOrphan= false
  //  this.isInstallation=false
  //  this.isPrescription=false

  //   }
  //   else if(data == 'Patient queue management'){
  //     this.isDoctorRegistration=false
  //     this.isqueue=false
  //     this.isOrphan= false
  //     this.isholiday= false
  //     this.isSpoke = false
  //     this.isPhcRegistration=false
  //     this.ishealth= false
  //  this.isqueue= true
  //  this.isInstallation=false
  //  this.isPrescription=false
  //   }

  //   else if(data == 'Orphan Case file'){
  //     this.isDoctorRegistration=false
  //     this.isqueue=false
  //     this.isPhcRegistration= false
  //     this.isholiday= false
  //     this.isSpoke = false
  //     this.isemp= false
  //     this.ishealth= false
  //  this.isOrphan= true
  //  this.isInstallation=false
  //  this.isPrescription=false
  //   }
  //   else if(data == 'Holiday Calendar'){
  //     this.isDoctorRegistration=false
  //     this.isqueue=false
  //     this.isPhcRegistration= false
  //     this.isholiday= true
  //     this.isSpoke = false
  //     this.isemp= false
  //     this.ishealth= false
  //  this.isOrphan= false
  //  this.isInstallation=false
  //  this.isPrescription=false
  //   }

  //   else if(data == 'Spoke Maintenance'){
  //     this.isDoctorRegistration=false
  //     this.isqueue=false
  //     this.isPhcRegistration= false
  //     this.isholiday= false
  //     this.isSpoke = true
  //     this.isemp= false
  //     this.ishealth= false
  //  this.isOrphan= false
  //  this.isInstallation=false
  //  this.isPrescription=false
  // // return this.isSpoke = true
  //   }

  //   else if(data == 'Employee training'){
  //     this.isDoctorRegistration=false
  //     this.isqueue=false
  //     this.isPhcRegistration= false
  //     this.isholiday= false
  //     this.isSpoke = false
  //     this.isemp= true
  //     this.ishealth= false
  //  this.isOrphan= false
  //  this.isInstallation=false
  //  this.isPrescription=false
  // // return this.isemp = true
  //   }
  //   else if(data == 'System health'){
  //     this.isDoctorRegistration=false
  //     this.isqueue=false
  //     this.isPhcRegistration= false
  //     this.isholiday= false
  //     this.isSpoke = false
  //     this.isemp= false
  //     this.ishealth= true
  //  this.isOrphan= false
  //  this.isInstallation=false
  //  this.isPrescription=false
  // // return this.ishealth = true
  //   }

  //   else if(data == 'Installation'){
  //     this.isDoctorRegistration=false
  //     this.isqueue=false
  //     this.isPhcRegistration= false
  //     this.isholiday= false
  //     this.isSpoke = false
  //     this.isemp= false
  //     this.ishealth= false
  //  this.isOrphan= false

  //  this.isInstallation=true
  //  this.isPrescription=false

  // // return this.ishealth = true
  //   }
  // else if(data == 'Prescription'){
  //   this.isDoctorRegistration=false
  //     this.isqueue=false
  //     this.isPhcRegistration= false
  //     this.isholiday= false
  //     this.isSpoke = false
  //     this.isemp= false
  //     this.ishealth= false
  //  this.isOrphan= false

  //  this.isInstallation=false
  //  this.isPrescription=true
  // }

  // }

  clickbutton(data, index, tabid) {
    //this.showMenu = data;
    if (this.reportAccessArrayOriginal[index].isChecked == false) {
      this._sweetAlert.sweetAlert(`you can't access ${data}`, 'error');
    } else {
      this.showMenu = data;
    }
  }

  reportAccessArray = [];
  reportAccessArrayOriginal = [];
  GetReportAccessDetailsByUserID() {
    this.loading = true;
    this.Svc_dashboardService.GetReportAccessDetailsByUserID().subscribe(
      (res: any) => {
        this.loading = false;
        this.reportAccessArrayOriginal = res;
        console.log(this.reportAccessArray, this.showMenu);
      },
      (err: any) => {
        this.loading = false;
      }
    );
  }
}
