import { Component, OnInit,AfterViewInit, ViewChild } from '@angular/core';
import { SvcPhcGetPatientService } from 'src/app/services/services/svc-phc-get-patient.service';
import { SvclocalstorageService } from 'src/app/services/services/svclocalstorage.service';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import { MdbModalRef, MdbModalService } from 'mdb-angular-ui-kit/modal';
import { ReferDoctorComponent } from '../../shared-component/refer-doctor/refer-doctor.component';
import { ngxLoadingAnimationTypes } from 'ngx-loading';
import { SvcmainAuthserviceService } from 'src/app/services/services/svcmain-authservice.service';
import {SearchFilterPipe} from 'src/app/pipes/search-filter.pipe'
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';

import { MatCheckboxChange } from '@angular/material/checkbox';
import { Svc_MasterService } from 'src/app/services/services/svc_master.service';
import {MatSort, Sort} from '@angular/material/sort';
@Component({
  selector: 'app-sys-queue-mgmt',
  templateUrl: './sys-queue-mgmt.component.html',
  styleUrls: ['./sys-queue-mgmt.component.css']
  
})
export class SysQueueMgmtComponent implements OnInit,AfterViewInit {
  public ngxLoadingAnimationTypes = ngxLoadingAnimationTypes;
  loading = false;
  public config = {
    animationType: ngxLoadingAnimationTypes.none,
    backdropBorderRadius: '3px',
  };

  @ViewChild(MatPaginator) paginator: MatPaginator;
  // @ViewChild(MatSort, { static: true }) sort: MatSort
  @ViewChild('empTbSort') empTbSort = new MatSort()
dataSource:any=[]
  newArray:any=[]
  DrSpeciality=this._sweetAlert.GetValueOfDropdown();
  selectAllFlag=false
  userObjFromToken: any;
  searchedKeyword: any;
  totalCases={
    "totalRegisteredGeneral": 0,
    "totalConsultedGeneral": 0,
    "totalPendingGeneral": 0,
    "totalRegisteredGyne": 0,
    "totalConsultedGyne": 0,
    "totalPendingGyne": 0,
    "totalRegisteredPedia": 0,
    "totalConsultedPedia": 0,
    "totalPendingPedia": 0
}

  displayedColumns=['srno','patientname','id','phcname','district','creationdate','assignmatedate','drName','speciality','waitlist','action','patientcomplaint','time']



  config1:any = {
    currentPage: 1,
    itemsPerPage: 4,
    
  };

  patient:any


filterform:FormGroup
  constructor(private svcLocalstorage: SvclocalstorageService,
    private SvcPhcPatient: SvcPhcGetPatientService,
    private svcMaster:Svc_MasterService,
    private router: Router,
    private modalService: MdbModalService,
    private _sweetAlert:SvcmainAuthserviceService,
    private pipe:SearchFilterPipe,
    private _fb:FormBuilder
  ) {
this.loading=true
this.filterform=this._fb.group({
  patient:[''],
  regID:[''],
  phcName:[''],
  doctor:['']
})

                      //////////used to stop loader when their is error of 401 and 403////

                      this._sweetAlert.getLoader().subscribe((res:any)=>{
                        this.loading=res
                        console.log('med',this.loading)
                      })

                      this._sweetAlert.getQueueUpdate().subscribe((res:any)=>{
                        if(res==true)
                        {
                          
                          // this.change(this.DrSpeciality)
                          this.getAllPhcPatientQueue()
                          
                  
                           this.formReset()
                          this.selectAllFlag=false
                          this.DrSpeciality=this._sweetAlert.GetValueOfDropdown();
                          this.allselectedFlag=false
                          this.selectedRows=[]
                         this. displayedColumns=['srno','patientname','id','phcname','district','creationdate','assignmatedate','drName','speciality','waitlist','action','patientcomplaint','time']

                      

                        }
                      })

  }
ngAfterViewInit(){
  //  this.dataSource.sort = this.sort;
  this.dataSource.sort = this.empTbSort
  this.dataSource.paginator = this.paginator;
}
  ngOnInit(): void {
    
    this.autoRefresh()
    this.getAllPhcPatientQueue();
    this.DrSpeciality='1';
     this.GetIsPatientCreationActive()
    

  }
  autoRefreshID:any
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
  // changeQueue(PatientCaseID,phcid) {
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
  //         console.log(data);
          
  //         this.modalService.open(ReferDoctorComponent, { data: { patientDetail: data } })
  //         this.getAllPhcPatientQueue();
  //       }

  //       })
     
   
  //   }
  // }

  currentDate(createdOn) {
    var today = new Date(createdOn.createdOn);
    var date = today.getDate() + '-' + (today.getMonth() + 1) + '-' + today.getFullYear();
    return date
  }
  currentAssignDate(assignOn){
    var today = new Date(assignOn.assignedOn);
    var date = today.getDate() + '-' + (today.getMonth() + 1) + '-' + today.getFullYear();
    return date
  }
  getAllPhcPatient: any
  getAllphcpError: any
  errorAllphcp: boolean
  totalItems: number = 0;
  pageIndex: number = 0;
  pageSize: number = 100;
  getAllPhcPatientQueue() {
  
    this.userObjFromToken = this.svcLocalstorage.GetData(environment.AuthTokenKeyLSKey);
    if (this.userObjFromToken) {
      this.loading=true
      this.SvcPhcPatient.GetAllPHCPatientQueue().subscribe((data:any) => {
       
       // this.autoRefresh()
        this.getAllPhcPatient = data.map(v => ({...v, isActive: false}))

        if(this.DrSpeciality!='1')
        {
          clearInterval(this.autoRefreshID)
    this.displayedColumns=['srno','patientname','id','phcname','district','creationdate','assignmatedate','drName','speciality','waitlist','selectAll','action','patientcomplaint','time']
  
          let filteredData = this.getAllPhcPatient.filter((item:any) => {
            item.isActive=false
            let specialityMatch = item.specialization.toLowerCase().indexOf(this.DrSpeciality.toLowerCase()) !== -1;
            return specialityMatch;
          });
      
          // Update the table data and pagination
          this.dataSource = new MatTableDataSource(filteredData);
          this.dataSource.paginator = this.paginator;
          this.totalItems = filteredData.length;
          this.pageIndex = 0;
        }

else
        
      {  this.dataSource=new MatTableDataSource(this.getAllPhcPatient)
        // this.dataSource.sort = this.sort;
        this.dataSource.sort = this.empTbSort
        this.dataSource.paginator = this.paginator;
        this.totalItems = this.dataSource.data.length;
        this.getAllphcpError = ''
                this.loading=false
        console.log(this.getAllPhcPatient, "dataaaa is")}
      }, (error) => {
        this.getAllPhcPatient = []
        this.dataSource=new MatTableDataSource(this.getAllPhcPatient)
        this.totalItems = 0;
        this.loading=false
        
        console.log(error.error.message)
        this.getAllphcpError = error.error.message
      })
    }
    this.GetTotalCaseStatusAndSpecialityWise();
  }

  onPageChange(event:any) {
    // Handle pagination change events
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
  }

  selectAll(event:any)
  {
     this.dataSource.filteredData.filter((res:any)=>{
      res.isActive=event.checked
     })
  }

  changeQueue(patientid,phcid,specializationID)
  {
  var  count=0
  var array=[]
    this.selectedRows.forEach((element:any) => {
     if( element.isActive==true)
     {
         count++
         array.push({
          patientCase:{id:element.patientCaseID,specializationID:element.specializationID},
          phcId:element.phcid
         })
     }
    });

    if(count>1)
    {
      console.log(array);
      this._sweetAlert.deletesweetAlert(`${count} - Patient selected to update are you sure you want to continue`,'info').then((res:any)=>{
        if(res.value==true)
        {
          this.loading = false
          this.modalService.open(ReferDoctorComponent, { data: { patientDetail: array } })
         
        }
      })
    }
    else{
      var data=[{
        patientCase:{id:patientid,specializationID:specializationID},
        phcId:phcid
      }]
                this.loading = false
          this.modalService.open(ReferDoctorComponent, { data: { patientDetail: data } })
          //this.getAllPhcPatientQueue();
    }
  }

  selectPatientCase(event,regid)
  {
      this.selectAllFlag=false
     this.getAllPhcPatient.filter((res:any)=>{
      if(res.regID==regid)
      {
        res.isActive=event.checked
        return
      }
    })
     console.log(this.getAllPhcPatient);
     
  }


  
  refreshButton(){
  clearInterval(this.autoRefreshID)
   
      this.getAllPhcPatientQueue()
      this.autoRefresh()
      this.DrSpeciality='1'
  this.displayedColumns=['srno','patientname','id','phcname','district','creationdate','assignmatedate','drName','speciality','waitlist','action','patientcomplaint','time']

      // this.ngOnInit();
      this.loading = false;
      this.selectedRows=[]
      this.allselectedFlag=false
  }


  autoRefresh(){
    
  this.selectedRows=[]
  this.allselectedFlag=false
  this.DrSpeciality!='1'
   this.autoRefreshID= setInterval(() => {
   this.formReset()
   this.filterform.updateValueAndValidity()
      this.getAllPhcPatientQueue()
    }, 60000);
    }

    pageChange(newPage: number) {
      this.config1.currentPage = newPage
    }


    formReset()
    {
      this.filterform.patchValue({
        patient:'',
        regID:'',
        phcName:'',
        doctor:''
      })
    }

    selectedRows: any[] = [];
    allselectedFlag=false
    toggleSelect(event: MatCheckboxChange, row: any) {
      this.allselectedFlag=false
      if (event.checked) {
        this.selectedRows.push(row);
      } else {
        const index = this.selectedRows.indexOf(row);
        if (index >= 0) {
          this.selectedRows.splice(index, 1);
        }
      }
    }
    
    toggleSelectAll(event: MatCheckboxChange) {
      console.log(event.checked,'wwwwwww');
     this.allselectedFlag=event.checked
      if (event.checked) {
        console.log(this.dataSource.filteredData);
        
        this.dataSource.filteredData.forEach((row:any) => {
          row.isActive=event.checked
          if (!this.selectedRows.includes(row)) {
            this.selectedRows.push(row);
          }
        });
      } else {
        this.dataSource.filteredData.forEach((res:any)=>{
          res.isActive=false
        })
        this.selectedRows = [];
      }
    }

    change($event)
    {
      this._sweetAlert.selectDrownSysQueue=$event.target.value;
      console.log(this._sweetAlert.selectDrownSysQueue,'this._sweetAlert.selectDrownSysQueue');
      
      this.formReset()
  
      this.selectedRows=[]
      this.allselectedFlag=false
      if(this.DrSpeciality!='1')
      {
        clearInterval(this.autoRefreshID)
  this.displayedColumns=['srno','patientname','id','phcname','district','creationdate','assignmatedate','drName','speciality','waitlist','selectAll','action','patientcomplaint','time']

        let filteredData = this.getAllPhcPatient.filter((item:any) => {
          item.isActive=false
          let specialityMatch = item.specialization.toLowerCase().indexOf(this.DrSpeciality.toLowerCase()) !== -1;
          return specialityMatch;
        });
    
        // Update the table data and pagination
        this.dataSource = new MatTableDataSource(filteredData);
        this.dataSource.paginator = this.paginator;
        this.totalItems = filteredData.length;
        this.pageIndex = 0;
      }
      else{
  this.displayedColumns=['srno','patientname','id','phcname','district','creationdate','assignmatedate','drName','speciality','waitlist','action','patientcomplaint','time']

        this.autoRefresh()
        this.getAllPhcPatient.filter((res:any)=>{
          res.isActive=false
        })
        this.dataSource = new MatTableDataSource(this.getAllPhcPatient);
        this.dataSource.paginator = this.paginator;
        this.totalItems = this.getAllPhcPatient.length;
        this.pageIndex = 0;
      }
    }

    applyFilters() {
      // Filter the table data based on user input
      this.selectedRows=[]  
      this.allselectedFlag=false
     
  
      this.dataSource.filteredData.forEach((res:any)=>{
        res.isActive=false
      })
  
     
      
      if(this.DrSpeciality!='1')
      {
      
      let filteredData = this.getAllPhcPatient.filter((item:any) => {
        item.isActive=false
        let patient = item.patient.toLowerCase().indexOf(this.filterform.value.patient.toLowerCase()) !== -1;
        let regid = item.regID.toString().toLowerCase().indexOf(this.filterform.value.regID.toLowerCase()) !== -1;
        let phcname = item.phcName.toLowerCase().indexOf(this.filterform.value.phcName.toLowerCase()) !== -1;
        let doctor = item.doctor.toLowerCase().indexOf(this.filterform.value.doctor.toLowerCase()) !== -1;
        let speciality = item.specialization.toLowerCase().indexOf(this.DrSpeciality.toLowerCase()) !== -1;
        
        return patient && regid && phcname&&doctor&&speciality;
      });
  
   
      this.dataSource = new MatTableDataSource(filteredData);
      this.dataSource.paginator = this.paginator;
      // this.dataSource.sort = this.sort
      this.dataSource.sort = this.empTbSort
      this.totalItems = filteredData.length;
  
      console.log(this.dataSource,'dataSource');
      this.pageIndex = 0;
    }
    else{
      let filteredData = this.getAllPhcPatient.filter((item:any) => {
    
        
        item.isActive=false
        let patient = item.patient.toString().toLowerCase().indexOf(this.filterform.value.patient.toLowerCase()) !== -1;
        let regid = item.regID.toString().toLowerCase().indexOf(this.filterform.value.regID.toLowerCase()) !== -1;
        let phcname = item.phcName.toString().toLowerCase().indexOf(this.filterform.value.phcName.toLowerCase()) !== -1;
        let doctor = item.doctor.toString().toLowerCase().indexOf(this.filterform.value.doctor.toLowerCase()) !== -1;
        
        return patient && regid && phcname&&doctor;
      
      });
  
      // Update the table data and pagination
      this.dataSource = new MatTableDataSource(filteredData);
      this.dataSource.paginator = this.paginator;
      // this.dataSource.sort = this.sort
      this.dataSource.sort = this.empTbSort
      this.totalItems = filteredData.length;
  
      console.log(this.dataSource,'dataSource');
      this.pageIndex = 0;
      }
     }

     setRegistration:boolean=false
     GetIsPatientCreationActive()
     {
      this.svcMaster.GetIsPatientCreationActive().subscribe((res:any)=>{
               this.setRegistration=res
      })
     }

     setPatientRegistration()
     {
      var value=this.setRegistration
      value=!value
       const text=value?'Activate':'Freeze'
      this._sweetAlert.deletesweetAlert(`Are you sure you want to ${text} Patient Registration !`,'info').then((res:any)=>{
            if(res.value==true)

        this.svcMaster.SettIsPatientCreationActive(value).subscribe((res:any)=>{
          this.setRegistration=res 
          const text=res?'Activate':'Freeze'
          this._sweetAlert.sweetAlert(`${text} Registration Successfully`,'success')
        })
      },(err:any)=>{
        this._sweetAlert.sweetAlert(`Something went wrong please try again `,'error')

      })
     }

     GetTotalCaseStatusAndSpecialityWise()
     {
      this.loading=true
      this.SvcPhcPatient.GetTotalCaseStatusAndSpecialityWise().subscribe((res:any)=>{
        this.totalCases=res
        this.loading=false
      },(error:any)=>{
        this.loading=false
      })
     }

    }


