import { Component, OnInit, ViewChild } from '@angular/core';
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
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { SuperadminService } from 'src/app/services/services/superadmin.service';

const moment = _rollupMoment || _moment;
// export const MY_FORMATS = {
//   parse: {
//     dateInput: 'dd-MM-yyyy',
//   },
//   display: {
//     dateInput: 'dd-MM-yyyy',
//     monthYearLabel: 'MMM YYYY',
//     dateA11yLabel: 'LL',
//     monthYearA11yLabel: 'MMM YYYY'
//   },
// };


@Component({
  selector: 'app-delete-pending-cases',
  templateUrl: './delete-pending-cases.component.html',
  styleUrls: ['./delete-pending-cases.component.css']
})
export class DeletePendingCasesComponent implements OnInit {

  public ngxLoadingAnimationTypes = ngxLoadingAnimationTypes;
  loading = false;
  public config = {
    animationType: ngxLoadingAnimationTypes.none,
    backdropBorderRadius: '3px',
  };
  today: Date = new Date(new Date().setDate(new Date().getDate()-1));
  userObjFromToken: any;
  searchedKeyword: any;
  searchpatientname: any;
  searchregID: any;
  searchphcName: any;
  searchcurrentDate: any;
  searchspecialization: any;
  orphanCaseForm :FormGroup
  filterForm:FormGroup

  dataSource:any=[]
@ViewChild(MatPaginator) paginator: MatPaginator;
  color:'primary'
  statusArray=[{  
    name:'Queued Patient',id:'Queued',},
    {name:'Pending Dr. Assigned Patient',id:'Pending doctor assigned'},
    {name:'Orphan Patient',id:'Orphan'},

    // {name:'Patient Absent',id:3}
  ]  

  displayedColumns=['SrNo','patientname','patientId','phcname','creationDate','assigndate','speciality','status','delete']

  constructor(private svcLocalstorage: SvclocalstorageService,
    private _superAdmin: SuperadminService,
    private router: Router,
    private fb: FormBuilder,
    private modalService: MdbModalService,
    private utilsService: UtilsService,
    private _sweetAlert:SvcmainAuthserviceService,
    private _datepipe:DatePipe
  ) {


    this.orphanCaseForm = this.fb.group({
      fromdate: [this.today, [Validators.required]],
      todate: [this.today, [Validators.required]],

    });

                  //////////used to stop loader when their is error of 401 and 403////

                  this._sweetAlert.getLoader().subscribe((res:any)=>{
                    this.loading=res
                    console.log('med',this.loading)
                  })
              
                  /////////////////////////////////////////////////////////////
  }

  ngOnInit(): void {
   // this.getAllPendingPhcPatientQueue('', '')
    this.getAllpendingCases()
    //this.autoRefresh()



    this.filterForm=this.fb.group({
      patientname:[''],
      patientId:[''],
      phcname:[''],
      speciality:[''],
       dcName:[''],
       status:[''],
       date:['']
     })

     this.filterForm.valueChanges.subscribe((value) => {
      const filter = { ...value, name: value.name } as string;
      this.dataSource.filter = filter;
    });

  }
  autoRefreshID: any
  ngOnDestroy() {
    if (this.autoRefreshID) {
      clearInterval(this.autoRefreshID);
    }
  }
  // patientWailtListQueue: any
  // pateintWaitList(phcid) {
  //   this.userObjFromToken = this.svcLocalstorage.GetData(environment.AuthTokenKeyLSKey);
  //   if (this.userObjFromToken) {
  //     this.SvcPhcPatient.GetPatientQueue(phcid).subscribe(data => {
  //       this.patientWailtListQueue = data
  //     })
  //   }

  // }

  changeQueueList: any


  getqueue: any
  // changeQueue(PatientCaseID) {
  //   // this.modalService.open(ReferDoctorComponent)
  //   this.loading = true

  //   this.userObjFromToken = this.svcLocalstorage.GetData(environment.AuthTokenKeyLSKey);
  //   if (this.userObjFromToken) {
  //     // this.SvcPhcPatient.RemovePatientFromDoctorsQueue(PatientCaseID).subscribe(data => {
  //     //   this.changeQueueList = data
  //     //   console.log(this.changeQueueList)
  //     // })
  //     this.SvcPhcPatient.getPatientCaseDetail(PatientCaseID).subscribe(data => {
  //       if (data) {
  //         this.loading = false
  //         this.modalService.open(ReferDoctorComponent, { data: { patientDetail: data } })
  //       }

  //     })


  //   }
  // }


  // currentDate(createdOn) {
  //   var today = new Date(createdOn.createdOn);
  //   var date = today.getDate() + '-' + (today.getMonth() + 1) + '-' + today.getFullYear();
  //   return date
  // }
  // currentAssignDate(assignOn) {
  //   var today = new Date(assignOn.assignedOn);
  //   var date = today.getDate() + '-' + (today.getMonth() + 1) + '-' + today.getFullYear();
  //   return date
  // }

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
    this.orphanCaseForm.patchValue({
      fromdate:'',
      todate:''
 
 
     })
  }
//   getAllPendingPhcPatientQueue(fromDate, toDate) {
    
//     if (fromDate == "") {
//       fromDate = ""
//       toDate = ""
//     }

//     else {
//       if(this.getDayDiff(fromDate,toDate) < 31){
//         fromDate = this.changeFormat(fromDate)
//       toDate = this.changeFormat1(toDate)
      
//       }      
//       else{
//         Swal.fire({

//           title: 'warning',
//           text: ` Please select date gap for 31 day maximum duration`,
//           icon: 'warning',
  
//         })
//       }
//       return
//     }
    

    
//     this.userObjFromToken = this.svcLocalstorage.GetData(environment.AuthTokenKeyLSKey);
//     if (this.userObjFromToken) {
//       this.SvcPhcPatient.GetAllPandingPatientQueue(fromDate, toDate).subscribe(data => {
       
//         this.getAllPendingPhcPatient = data
//         this.getAllPendingPhcPatient.forEach(element => {
//           element.createdOn=this._datepipe.transform(element.createdOn,'dd-MM-yyyy')
//         });
//         this.dataSource = new MatTableDataSource(this.getAllPendingPhcPatient)
// this.dataSource.paginator = this.paginator;



// this.dataSource.filterPredicate = ((data, filter) => {
//   console.log(data,'++++++',filter)
//   const b =
//     !filter.patientname ||
//     data.patient.toLowerCase().includes(filter.patientname.toLowerCase());
//   const c =
//     !filter.patientId ||
//     data.regID.toString().toLowerCase().includes(filter.patientId.toLowerCase());
//   const d =
//     !filter.phcname ||
//     data.phcName.toLowerCase().includes(filter.phcname.toLowerCase());

//     const e=!filter.speciality|| data.specialization.toLowerCase().includes(filter.speciality.toLowerCase())

//     const f=!filter.status|| data.dcName.toLowerCase().includes(filter.status.toLowerCase())
   

//   const g =
//   !filter.date ||
//   data.createdOn.toLowerCase().includes(filter.date);
//   return  b && c && d  && g && e && f;
// }) as (PeriodicElement, string) => boolean;

  

//         console.log(this.getAllPendingPhcPatient, "dataaaa pending")
//       }, (error) => {
//         console.log(error.error.message)
//         this.getAllphcpError = error.error.message
//       })
//     }
//   }
  refreshButton() {
   
    console.log(this.today,'oooo');
    
this.orphanCaseForm.get("fromdate").setValue(this.today)
this.orphanCaseForm.get("todate").setValue(this.today)


      this.getAllpendingCases()

  }
  // autoRefresh() {
  //   this.autoRefreshID = setInterval(() => {
  //     this.getAllPendingPhcPatientQueue(this.orphanCaseForm.value.fromdate, this.orphanCaseForm.value.todate)
  //   }, 30000);
  // }


  getDayDiff(startDate: Date, endDate: Date): number {
    const msInDay = 24 * 60 * 60 * 1000;
    return Math.round(Math.abs(Number(endDate) - Number(startDate)) / msInDay);
  }

  delete()
  {
    if(this.deleteArray.length==0)
    {
      this._sweetAlert.sweetAlert('Please Select any case first','error')
    }
    else{
      this._sweetAlert.deletesweetAlert('Are you sure you want to delete these case','info').then((res:any)=>{
       if(res.value==true){

        this.loading=true
        this._superAdmin.DeletePatientCase(this.deleteArray).subscribe((res:any)=>{
          this.loading=false
          this._sweetAlert.sweetAlert('Case Deleted Successfully','success')
          this.getAllpendingCases()
          },(err:any)=>{
            this.loading=false
            if(err.status==404)
            {
              this._sweetAlert.sweetAlert(err.error.message,'error')
            }
          })
       }
      })

    }

  }

  deleteArray:any=[]
  selectCheckBoxes(value:any,id:any)
  {
    
      if(!this.deleteArray.includes(id))
        {
            this.deleteArray.push(id)
        }
      else{
        const index = this.deleteArray.indexOf(id);
        if (index > -1) { 
          this.deleteArray.splice(index, 1); 
        }
      }
  }

  getAllpendingCases()
  {
    if(this.orphanCaseForm.invalid)
    {
      alert('Please Fill All The Required Fields')
    }
    else{

     let  fromdate=this._datepipe.transform(this.orphanCaseForm.value.fromdate,'yyyy-MM-dd')
     let  todate=this._datepipe.transform(this.orphanCaseForm.value.todate,'yyyy-MM-dd')

      if(this.getDayDiff(this.orphanCaseForm.value.fromdate,this.orphanCaseForm.value.todate) > 31){
        Swal.fire({

          title: 'warning',
          text: ` Please select date gap for 31 day maximum duration`,
          icon: 'warning',
  
        })
      
      }      
      else{
        this.userObjFromToken = this.svcLocalstorage.GetData(environment.AuthTokenKeyLSKey);
        if (this.userObjFromToken) {
         this.loading=true
          this._superAdmin.GetAllPendingPatientToDelete(fromdate,todate).subscribe(data => {
           
            this.getAllphcpError=''
            this.getAllPendingPhcPatient = data
            this.getAllPendingPhcPatient.forEach(element => {
              element['checkbox']=false
            });
           
            

            this.datafilter(this.getAllPendingPhcPatient)

    
      
    this.loading=false
     
          }, (error:any) => {
            this.dataSource=[]
            this.getAllPendingPhcPatient=[]
            this.loading=false
            this.getAllphcpError = error.error.message
          })
        }
      }
    }
  }


  changeStatus(event:any)
  {
if(event.value.length)
{
var data=this.getAllPendingPhcPatient.filter((res:any)=>event.value.includes(res.status))
console.log(data,'qqqqqqqqqq');

this.datafilter(data)
}
else{
this.datafilter(this.getAllPendingPhcPatient)
}

  }



  datafilter(array:[])

  {
    this.dataSource = new MatTableDataSource(array)   
    console.log(this.dataSource);
    
    this.dataSource.paginator = this.paginator;
    
    this.dataSource.filterPredicate = ((data, filter) => {
     
      const b =
        !filter.patientname ||
        data.patient?.toLowerCase().includes(filter.patientname.toLowerCase());
      const c =
        !filter.patientId ||
        data.regID?.toString().toLowerCase().includes(filter.patientId.toLowerCase());
      const d =
        !filter.phcname ||
        data.phcName?.toLowerCase().includes(filter.phcname.toLowerCase());
    
        const e=!filter.speciality|| data.specialization?.toLowerCase().includes(filter.speciality.toLowerCase())
    
        const f=!filter.status|| data.dcName?.toLowerCase().includes(filter.status.toLowerCase())
       
    
      const g =
      !filter.date ||
      data.createdOn?.toLowerCase().includes(filter.date);
      return  b && c && d  && g && e && f;
    }) as (PeriodicElement, string) => boolean;
  }


}