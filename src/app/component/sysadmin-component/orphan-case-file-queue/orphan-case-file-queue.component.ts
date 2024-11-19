import { Component, OnInit } from '@angular/core';
import { SvcPhcGetPatientService } from 'src/app/services/services/svc-phc-get-patient.service';
import { SvclocalstorageService } from 'src/app/services/services/svclocalstorage.service';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import { MdbModalRef, MdbModalService } from 'mdb-angular-ui-kit/modal';
import { ReferDoctorComponent } from '../../shared-component/refer-doctor/refer-doctor.component';
import { ngxLoadingAnimationTypes } from 'ngx-loading';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { UtilsService } from 'src/app/utils/Utils_Service';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import {
  MomentDateAdapter,
  MAT_MOMENT_DATE_ADAPTER_OPTIONS,
} from '@angular/material-moment-adapter';
import {
  DateAdapter,
  MAT_DATE_FORMATS,
  MAT_DATE_LOCALE,
} from '@angular/material/core';
import { MatDatepicker } from '@angular/material/datepicker';
import * as _moment from 'moment';
import { default as _rollupMoment, Moment } from 'moment';
import { SvcmainAuthserviceService } from 'src/app/services/services/svcmain-authservice.service';
import { DatePipe } from '@angular/common';

const moment = _rollupMoment || _moment;
export const MY_FORMATS = {
  parse: {
    dateInput: 'YYYY-MM-DD',
  },
  display: {
    dateInput: 'YYYY-MM-DD',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMM YYYY'
  },
};


@Component({
  selector: 'app-orphan-case-file-queue',
  templateUrl: './orphan-case-file-queue.component.html',
  styleUrls: ['./orphan-case-file-queue.component.css']
})
export class OrphanCaseFileQueueComponent implements OnInit {
  public ngxLoadingAnimationTypes = ngxLoadingAnimationTypes;
  loading = false;
  public config = {
    animationType: ngxLoadingAnimationTypes.none,
    backdropBorderRadius: '3px',
  };
  today: Date = new Date();
  userObjFromToken: any;
  searchedKeyword: any;
  searchpatientname: any;
  searchregID: any;
  searchphcName: any;
  searchcurrentDate: any;
  searchspecialization: any;
  orphanCase = new FormGroup({
    todate: new FormControl(moment(new Date())),
    fromdate: new FormControl(moment(new Date())),
  })
  constructor(private svcLocalstorage: SvclocalstorageService,
    private SvcPhcPatient: SvcPhcGetPatientService,
    private router: Router,
    private fb: FormBuilder,
    private modalService: MdbModalService,
    private utilsService: UtilsService,
    private _sweetAlert:SvcmainAuthserviceService,
    private _datepipe:DatePipe
  ) {
                  //////////used to stop loader when their is error of 401 and 403////

                  this._sweetAlert.getLoader().subscribe((res:any)=>{
                    this.loading=res
                    console.log('med',this.loading)
                  })
              
                  /////////////////////////////////////////////////////////////
  }

  ngOnInit(): void {
    this.getAllPendingPhcPatientQueue('', '')
    this.autoRefresh()
    // this.getAllPendingPhcPatientQueue('','')
    this.orphanCase = this.fb.group({
      fromdate: ['', [Validators.required]],
      todate: ['', [Validators.required]],

    });
  }
  autoRefreshID: any
  ngOnDestroy() {
    if (this.autoRefreshID) {
      clearInterval(this.autoRefreshID);
    }
  }
  patientWailtListQueue: any
  pateintWaitList(phcid) {
    this.userObjFromToken = this.svcLocalstorage.GetData(environment.AuthTokenKeyLSKey);
    if (this.userObjFromToken) {
      this.SvcPhcPatient.GetPatientQueue(phcid).subscribe(data => {
        this.patientWailtListQueue = data
        console.log(data)
        console.log(this.patientWailtListQueue)

      })
    }

  }

  changeQueueList: any


  getqueue: any
  changeQueue(PatientCaseID) {
    // this.modalService.open(ReferDoctorComponent)
    this.loading = true

    this.userObjFromToken = this.svcLocalstorage.GetData(environment.AuthTokenKeyLSKey);
    if (this.userObjFromToken) {
      // this.SvcPhcPatient.RemovePatientFromDoctorsQueue(PatientCaseID).subscribe(data => {
      //   this.changeQueueList = data
      //   console.log(this.changeQueueList)
      // })
      this.SvcPhcPatient.getPatientCaseDetail(PatientCaseID).subscribe(data => {
        if (data) {
          this.loading = false
  
          this.modalService.open(ReferDoctorComponent, { data: { patientDetail: [data] } })
        }

      })


    }
  }



  currentDate(createdOn) {
    var today = new Date(createdOn.createdOn);
    var date = today.getDate() + '-' + (today.getMonth() + 1) + '-' + today.getFullYear();
    return date
  }
  currentAssignDate(assignOn) {
    var today = new Date(assignOn.assignedOn);
    var date = today.getDate() + '-' + (today.getMonth() + 1) + '-' + today.getFullYear();
    return date
  }

  getAllPendingPhcPatient: any
  getAllphcpError: any
  errorAllphcp: boolean

  changeFormat(fromDate) {

    var date = new Date(fromDate),
      mnth = ("0" + (date.getMonth() + 1)).slice(-2),
      day = ("0" + date.getDate()).slice(-2);
    fromDate = [date.getFullYear(), mnth, day].join("-");

    return fromDate;
  }
  changeFormat1(toDate) {
    var date = new Date(toDate),
      mnth = ("0" + (date.getMonth() + 1)).slice(-2),
      day = ("0" + date.getDate()).slice(-2);
    toDate = [date.getFullYear(), mnth, day].join("-");
    return toDate;
  }

  // if (this.utilsService.monthDiffInDay(obj.to, obj.from)>90) {
  //   this.ValidationMessage="Please select date gap for 90 day maximum duration!"
  //   this.ShowErrorMessage=true;
  // }
  // else if(this.utilsService.monthDiffInDay(obj.to, obj.from)<0)
  // {
  //   this.ValidationMessage="From Date should be less than or equal to To Date.";
  //   this.ShowErrorMessage=true;
  // }
  ShowErrorMessage: boolean;
  ValidationMessage: string;
  click(){
    this.orphanCase.patchValue({
      fromdate:'',
      todate:''
 
 
     })
  }
  getAllPendingPhcPatientQueue(fromDate, toDate) {
    
    if((fromDate && !toDate)|| (!fromDate && toDate))
    {
      this._sweetAlert.sweetAlert('please select fromdate and todate','info')
      this.orphanCase.patchValue({
        todate:'',
        fromdate:''
      })
      return
    }


    if (fromDate == "") {
      fromDate = ""
      toDate = ""
    }

    else {
      if(this.getDayDiff(fromDate,toDate) < 31){
        fromDate = this.changeFormat(fromDate)
      toDate = this.changeFormat1(toDate)

      
      }      
      else{
        Swal.fire({
          title: 'warning',
          text: ` Please select date gap for 31 day maximum duration`,
          icon: 'warning',
  
        })
        this.orphanCase.patchValue({
          todate:'',
          fromdate:''
        })
        return
      }
    }
    
    if((fromDate && !toDate)|| (!fromDate && toDate))
  {
    this._sweetAlert.sweetAlert('please select from and todate','info')
    return
  }

    
    this.userObjFromToken = this.svcLocalstorage.GetData(environment.AuthTokenKeyLSKey);
    if (this.userObjFromToken) {
      this.loading=true
      this.SvcPhcPatient.GetAllPandingPatientQueue(fromDate, toDate).subscribe(data => {
       this.loading=false
        this.getAllPendingPhcPatient = data
        this.getAllPendingPhcPatient.forEach(element => {
          element.createdOn=this._datepipe.transform(element.createdOn,'dd-MM-yyyy')
        });
        console.log(this.getAllPendingPhcPatient, "dataaaa pending")
      }, (error) => {
        this.loading=false
        this.getAllPendingPhcPatient=[]
        console.log(error.error.message)
        this.getAllphcpError = 'No Pending Patient Found'
      })
    }
  }
  refreshButton() {
   
    this.loading = true;
    setTimeout(() => {
      this.getAllPendingPhcPatientQueue(this.orphanCase.value.fromdate, this.orphanCase.value.todate)
      this.loading = false;

    }, 2000);
  }
  autoRefresh() {
    this.autoRefreshID = setInterval(() => {
      this.getAllPendingPhcPatientQueue(this.orphanCase.value.fromdate, this.orphanCase.value.todate)
    }, 30000);
  }


  getDayDiff(startDate: Date, endDate: Date): number {
    const msInDay = 24 * 60 * 60 * 1000;
    return Math.round(Math.abs(Number(endDate) - Number(startDate)) / msInDay);
  }

}