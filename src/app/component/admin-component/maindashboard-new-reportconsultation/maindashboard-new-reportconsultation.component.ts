import { Component, OnInit, ViewChild,
  AfterViewInit,
  ElementRef,
  NgZone, } from '@angular/core';
  
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

import { HttpClient, HttpParams } from '@angular/common/http';
import {forkJoin, fromEvent, merge, Observable, of as observableOf, of, Subject } from 'rxjs';
import { catchError, debounceTime, delay, finalize, map, startWith, switchMap, takeUntil } from 'rxjs/operators';
import { DatePipe } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ngxLoadingAnimationTypes } from 'ngx-loading';
import { SvclocalstorageService } from 'src/app/services/services/svclocalstorage.service';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { svc_misService } from 'src/app/services/services/svc_mis_service';
import { environment } from 'src/environments/environment';
import { svc_dashboardService } from 'src/app/services/services/svc_dashboard.service';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';

const EXCEL_TYPE =
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { I } from '@angular/cdk/keycodes';
import {
  faClose,
  faFileExcel,
  faFilePdf,
  faDownload,
  faL,
} from '@fortawesome/free-solid-svg-icons';
import { UtilsService } from 'src/app/utils/Utils_Service';

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
import Swal from 'sweetalert2';
import { Svc_getdoctordetailService } from 'src/app/services/services/svc_getdoctordetail.service';
import { SvcmainAuthserviceService } from 'src/app/services/services/svcmain-authservice.service';
import { SvccasedetailService} from 'src/app/services/services/svccasedetail.service'
import { Roles } from 'src/app/utils/imp-utils';
const moment = _rollupMoment || _moment;


export const MY_FORMATS = {
  parse: {
    dateInput: 'DD-MM-YYYY',
  },
  display: {
    dateInput: 'DD-MM-YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMM YYYY'
  },
};

@Component({
  selector: 'app-maindashboard-new-reportconsultation',
  templateUrl: './maindashboard-new-reportconsultation.component.html',
  styleUrls: ['./maindashboard-new-reportconsultation.component.css'],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    },
    {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS},
  ],
})


export class MaindashboardNewReportconsultationComponent implements AfterViewInit,OnInit {
  loading = false;
  ImagesHeader = environment.ImagesHeader
  public ngxLoadingAnimationTypes = ngxLoadingAnimationTypes;
  public config = {
    animationType: ngxLoadingAnimationTypes.none,
    backdropBorderRadius: '3px',
  };
  todatedisablepre:any=true;
  todatedisable:any=true;
  userObjFromToken: any;
  doctorForm: FormGroup;
  fromDateValue: Date;
  formControl: FormGroup;
  toDateValue: Date;
  specializationID: string;
  dataSourceDownload: any[];
  ReportName: string;
  faFilePdf = faFilePdf;
  faFileExcel = faFileExcel;
  faClose = faClose;
  today:Date=new Date();
  faDownload = faDownload;
  configPage:any;
  newArrayOfObj:any=[]


  totalRows = 0;
  pagesize = 10;
  currentPage = 0;
  pageSizeOptions: number[] = [10, 25,50];


  displayedColumns: string[] = [
    'srNo',
    'cluster',
    'districtName',
    'blockName',
    'phcName',
    // 'phase',
    'patientName',
    'age',
    'gender',
    // 'mobileNo',
    'opdNo',
    // 'reviewDate',
    'consultDate',
    'starttime',
    'endtime',
    'specialization',
    'doctor',
    // 'patientCaseID',
    'Prescription',
    
  ];
  filterValues = {
    cluster:'',
    districtName: '',
    blockName: '',
    phcName: '',
    // phase:'',
    patientName: '',
    age: '',
    gender: '',
    // mobileNo: '',
    // opdNo: '',
    // reviewDate: '',
    consultDate: '',
    starttime: '',
    endtime: '',
    specialization: '',
    doctor: '',
    patientCaseID:'',
    Prescription: '',
  };
  ELEMENT_DATA: PeriodicElement[] = [
    // {
    //   srNo: 1,
    //       districtName: 'districtName1',
    //       blockName: 'blockName1',
    //       phcName: 'phcName1',
    //       patientName:'patientName1',
    //       age:100,
    //       gender:'male',
    //       mobileNo:'mobileNo',
    //       opdNo:'opdNo',
    //       reviewDate:'reviewDate',
    //       consultDate:'consultDate',
    //       starttime:'starttime',
    //       endtime:'endtime',
    //       specialization:'specialization',
    //       doctor:'doctor',
    //       Prescription:'Prescription',
    // },
    // {
    //   srNo: 1,
    //   districtName: 'districtName',
    //   blockName: 'blockName',
    //   phcName: 'phcName',
    //   patientName:'patientName',
    //   age:100,
    //   gender:'gender',
    //   mobileNo:'mobileNo',
    //   opdNo:'opdNo',
    //   reviewDate:'reviewDate',
    //   consultDate:'consultDate',
    //   starttime:'starttime',
    //   endtime:'endtime',
    //   specialization:'specialization',
    //   doctor:'doctor',
    //   Prescription:'Prescription',
    // },
  ];
  dataSource = new MatTableDataSource<PeriodicElement>(this.ELEMENT_DATA);

  constructor(
    private svcLocalstorage: SvclocalstorageService,
    private Svc_MISService: svc_misService,
    private _liveAnnouncer: LiveAnnouncer,
    private Svc_dashboardService: svc_dashboardService,
    private SvccasedetailService:SvccasedetailService,
    public datepipe: DatePipe,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    formBuilder: FormBuilder,
    private utilsService: UtilsService,
    private http: HttpClient,
    private svcdoctor: Svc_getdoctordetailService,
    private _sweetAlert:SvcmainAuthserviceService,
    private zone: NgZone
  ) {
    this.configPage={
       PageNo:0,
       PageSize:10,
      SortColumn:0

    }

                    //////////used to stop loader when their is error of 401 and 403////

                    this._sweetAlert.getLoader().subscribe((res:any)=>{
                      this.loading=res
                      console.log('report consultation',this.loading)
                    })
                
                    /////////////////////////////////////////////////////////////

    this.doctorForm = new FormGroup({
      todate: new FormControl(moment(new Date())),
      fromdate: new FormControl(moment(new Date())),
      PHCID: new FormControl(0),
      patientName: new FormControl(''),
      mobileNo: new FormControl(''),
      opdNo: new FormControl(''),
    });

    this.ReportName = 'Report consultation';

    this.dataSourceDownload = this.ELEMENT_DATA;

    // this.GetDashboardReportConsultationWithRestrictedAccess({
    //   PHCID: 0,
    //   fromDate: new Date(),
    //   toDate:  new Date(),
    //   patientName: '',
    //   mobileNo: '',
    //   opdNo: '',
    // });
    // this.GetDashboardReportConsultation({
    //   PHCID: 0,
    //   fromDate: new Date(),
    //   toDate:  new Date(),
    //   patientName: '',
    //   mobileNo: '',
    //   opdNo: '',
    // });

    this.dataSource.filterPredicate = ((data, filter) => {
      //const a = !filter.age || data.age === filter.age;
      const a =
      !filter.age ||
      data.age.toLowerCase().includes(filter.age);
      const b =
        !filter.districtName ||
        data.districtName.toLowerCase().includes(filter.districtName);
      const c =
        !filter.blockName ||
        data.blockName.toLowerCase().includes(filter.blockName);
      const d =
        !filter.phcName || data.phcName.toLowerCase().includes(filter.phcName);
      const e =
        !filter.patientName ||
        data.patientName.toLowerCase().includes(filter.patientName);
      const g =
        !filter.gender || data.gender.toLowerCase().includes(filter.gender);
      const h =
        !filter.mobileNo ||
        data.mobileNo.toLowerCase().includes(filter.mobileNo);
      const i =
        !filter.opdNo || data.opdNo.toLowerCase().includes(filter.opdNo);
      const j =
        !filter.specialization ||
        data.specialization.toLowerCase().includes(filter.specialization);
      const k =
        !filter.doctor || data.doctor.toLowerCase().includes(filter.doctor);
      const l =
        !filter.cluster || data.cluster.toLowerCase().includes(filter.cluster);
      const m =
        !filter.phase || data.phase.toLowerCase().includes(filter.phase);

      return a && b && c && d && e && g && h && i && j && k && k && m;
    }) as (PeriodicElement, string) => boolean;

    this.formControl = formBuilder.group({
      // srNo: '',
      cluster:'',
      districtName: '',
      blockName: '',
      phcName: '',
      phase:'',
      patientName: '',
      age: '',
      gender: '',
      mobileNo: '',
      opdNo: '',
      // reviewDate:'',
      // consultDate:'',
      // starttime:'',
      // endtime:'',
      specialization: '',
      doctor: '',
      //Prescription:'',
    });
    this.formControl.valueChanges.subscribe((value) => {
      const filter = { ...value, name: value.name } as string;
      this.dataSource.filter = filter;
    });
  }
  ngOnInit(): void {
  // this.GetConsultedPatientsAsync()
  }

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  // @ViewChild(MatPaginator, { static: true }) pagesize: MatPaginator;

  //@ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  fileheader: string;
  ngAfterViewInit() {
    this.fileheader = environment.ImagesHeader;
    this.dataSource.paginator = this.paginator;
    // this.dataSource.paginator=this.pagesize;
    this.dataSource.sort = this.sort;
    // this.doctorForm = this.fb.group({
    //   todate: ['', [Validators.required]],
    //   fromdate: ['', [Validators.required]],
    // });
    // this.GetAllPHC();
  }
  @ViewChild('content', { static: false }) content: ElementRef;

  download(url: string) {
    // const url =
    //   "https://medteleapi.azurewebsites.net//MyFiles/CaseDocuments/5750364.pdf";
    this.http
      .get(url, {
        headers: {
          Accept: 'application/pdf',
        },
        responseType: 'blob',
      })
      .subscribe(
        (x: any) => {
          console.log('x', x);
          // It is necessary to create a new blob object with mime-type explicitly set
          // otherwise only Chrome works like it should
          var newBlob = new Blob([x], { type: 'application/pdf' });

          // IE doesn't allow using a blob object directly as link href
          // instead it is necessary to use msSaveOrOpenBlob

          // For other browsers:
          // Create a link pointing to the ObjectURL containing the blob.
          const data = window.URL.createObjectURL(newBlob);

          var link = document.createElement('a');
          link.href = data;
          var filename = url.replace(/^.*[\\\/]/, '');
          //link.download = name+this.datepipe.transform(new Date,) +".pdf";
          link.download = filename;
          // this is necessary as link.click() does not work on the latest firefox
          link.dispatchEvent(
            new MouseEvent('click', {
              bubbles: true,
              cancelable: true,
              view: window,
            })
          );

          setTimeout(function () {
            // For Firefox it is necessary to delay revoking the ObjectURL
            window.URL.revokeObjectURL(data);
            link.remove();
          }, 100);
        },
        (err) => {
          console.log('ERR', err);
        }
      );
  }

  ListOfCompletedConsultation: any;
  GetDashboardReportConsultationWithRestrictedAccess(params: any) {
    this.loading=true
    this.userObjFromToken = this.svcLocalstorage.GetData(
      environment.AuthTokenKeyLSKey
    );
  // GetDashboardReportConsultation(params: any) {
  //   this.loading=true
  //   this.userObjFromToken = this.svcLocalstorage.GetData(
  //     environment.AuthTokenKeyLSKey
  //   );
    if (this.userObjFromToken) {
      this.Svc_dashboardService.GetDashboardReportConsultationWithRestrictedAccess(params).subscribe((data: any) => {
        console.log(data, 'this is GetDashboardReportConsultationWithRestrictedAccess data');
        this.ELEMENT_DATA = data;
      
        this.loading=false
        this.dataSourceDownload = this.ELEMENT_DATA;
      
        this.dataSource = new MatTableDataSource<PeriodicElement>(
          this.ELEMENT_DATA
        );
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
        //this.Download('Excel')
        this.dataSource.filterPredicate = ((data, filter) => {
          //const a = !filter.age || data.age === filter.age;
          const a =
          !filter.age ||
          data.age.toLowerCase().includes(filter.age.toLowerCase());
          const b =
            !filter.districtName ||
            data.districtName.toLowerCase().includes(filter.districtName.toLowerCase());
          const c =
            !filter.blockName ||
            data.blockName.toLowerCase().includes(filter.blockName.toLowerCase());
          const d =
            !filter.phcName ||
            data.phcName.toLowerCase().includes(filter.phcName.toLowerCase());
          const e =
            !filter.patientName ||
            data.patientName.toLowerCase().includes(filter.patientName.toLowerCase());
          const g =
            !filter.gender || data.gender.toLowerCase().startsWith(filter.gender.toLowerCase());
          const h =
            !filter.mobileNo ||
            data.mobileNo.toLowerCase().includes(filter.mobileNo.toLowerCase());
          const i =
            !filter.opdNo || data.opdNo.toLowerCase().includes(filter.opdNo.toLowerCase());
          const j =
            !filter.specialization ||
            data.specialization.toLowerCase().includes(filter.specialization.toLowerCase());
          const k =
            !filter.doctor || data.doctor.toLowerCase().includes(filter.doctor.toLowerCase());
          const l =
            !filter.cluster || data.cluster.toLowerCase().includes(filter.cluster.toLowerCase());
          const m =
            !filter.phase || data.phase.toLowerCase().includes(filter.phase.toLowerCase());

          return a && b && c && d && e && g && h && i && j && k && l && m;
        }) as (PeriodicElement, string) => boolean;
      },
      (error)=>{
        this.loading=false;
        this.dataSourceDownload = [];
      
        this.dataSource = new MatTableDataSource<PeriodicElement>(
          []
        );
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
      }
      );
      // this.Svc_dashboardService.GetDashboardReportConsultation(params).subscribe((data: any) => {
      //   console.log(data, 'this is GetDashboardReportConsultation data');
      //   this.ELEMENT_DATA = data;
      
      //   this.loading=false
      //   this.dataSourceDownload = this.ELEMENT_DATA;
      
      //   this.dataSource = new MatTableDataSource<PeriodicElement>(
      //     this.ELEMENT_DATA
      //   );
      //   this.dataSource.sort = this.sort;
      //   this.dataSource.paginator = this.paginator;
      //   //this.Download('Excel')
      //   this.dataSource.filterPredicate = ((data, filter) => {
      //     //const a = !filter.age || data.age === filter.age;
      //     const a =
      //     !filter.age ||
      //     data.age.toLowerCase().includes(filter.age.toLowerCase());
      //     const b =
      //       !filter.districtName ||
      //       data.districtName.toLowerCase().includes(filter.districtName.toLowerCase());
      //     const c =
      //       !filter.blockName ||
      //       data.blockName.toLowerCase().includes(filter.blockName.toLowerCase());
      //     const d =
      //       !filter.phcName ||
      //       data.phcName.toLowerCase().includes(filter.phcName.toLowerCase());
      //     const e =
      //       !filter.patientName ||
      //       data.patientName.toLowerCase().includes(filter.patientName.toLowerCase());
      //     const g =
      //       !filter.gender || data.gender.toLowerCase().startsWith(filter.gender.toLowerCase());
      //     const h =
      //       !filter.mobileNo ||
      //       data.mobileNo.toLowerCase().includes(filter.mobileNo.toLowerCase());
      //     const i =
      //       !filter.opdNo || data.opdNo.toLowerCase().includes(filter.opdNo.toLowerCase());
      //     const j =
      //       !filter.specialization ||
      //       data.specialization.toLowerCase().includes(filter.specialization.toLowerCase());
      //     const k =
      //       !filter.doctor || data.doctor.toLowerCase().includes(filter.doctor.toLowerCase());

      //     return a && b && c && d && e && g && h && i && j && k;
      //   }) as (PeriodicElement, string) => boolean;
      // },
      // (error)=>{
      //   this.loading=false;
      // }
      // );
    }
  }
  ListOfPHC: any;
  GetAllPHC() {
    this.userObjFromToken = this.svcLocalstorage.GetData(
      environment.AuthTokenKeyLSKey
    );
    if (this.userObjFromToken) {
      this.Svc_dashboardService.GetAllPHC().subscribe((data: any) => {
        
        this.ListOfPHC = data;
      });
    }
  }
  PageSize:any;
lastpage:any;
GetConsultedPatientsReportAsync(){
  let PageNo=0;
  let SortDirection='DESC';
    let SearchValue=this.doctorForm.value.patientName;
    let FromDate=this.datepipe.transform(this.doctorForm.value.fromdate,'yyyy-MM-dd');
    let ToDate=this.datepipe.transform(this.doctorForm.value.todate,'yyyy-MM-dd');
    let UserID=localStorage.getItem('userId');
    this.loading=true;
    if(this.ELEMENT_DATA.length==0){
      this.loading=false
      this._sweetAlert.sweetAlert('No Data Available','error')
      return
    }
    if(this.lastpage==0)
    {
      this.loading=false
      this._sweetAlert.sweetAlert('No Data Available','error')
      return
    }
    
  this.Svc_dashboardService.GetConsultedPatientsReportAsync(PageNo,this.lastpage,this.configPage.SortColumn,SortDirection,SearchValue,FromDate,ToDate,UserID)
  .subscribe((response: Blob) => {
    this.loading=false;
    const url = URL.createObjectURL(response);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'ReportConsultation'+' '+
    this.datepipe.transform(this.doctorForm.value.fromdate,'dd-MMM-yyyy')+
    ' to '+this.datepipe.transform(this.doctorForm.value.todate,'dd-MMM-yyyy')+'.csv'; // Specify the file name and extension
    link.click();
  },
  (error)=>{
    this.loading=false;
  }
  );  
}
filterCount:any=0
  GetConsultedPatientsAsync(){
   this.loading=true
    let SortDirection='DESC';
    let SearchValue=this.doctorForm.value.patientName;
    let FromDate=this.datepipe.transform(this.doctorForm.value.fromdate,'yyyy-MM-dd');
    let ToDate=this.datepipe.transform(this.doctorForm.value.todate,'yyyy-MM-dd');
    let UserID=localStorage.getItem('userId');

    
    
    this.Svc_dashboardService.GetConsultedPatientsAsync(this.currentPage,this.pageSize,this.configPage.SortColumn,SortDirection,SearchValue,FromDate,ToDate,UserID).subscribe(
      (data:any )=>{
        
        this.loading=false
        if(data.length)
        {
          this.lastpage=data[0]?.filteredCount
          this.filterCount=data[0]?.filteredCount
        }
        else{
          this.lastpage=0
          this.filterCount=0
        }

        this.ELEMENT_DATA=data;
        this.loading=false
        console.log(this.ELEMENT_DATA,'Element data');
        
        this.dataSourceDownload = this.ELEMENT_DATA;
        this.dataSource = new MatTableDataSource(
          this.ELEMENT_DATA
        );
        this.dataSource.sort = this.sort;
        // this.dataSource.paginator = this.paginator;

        if(data.length)
        {
        setTimeout(() => {
          this.paginator.pageIndex = this.currentPage;
          this.paginator.length = this.dataSourceDownload[0]?.filteredCount
        });
      }
      else{
        this.currentPage=0
        this.paginator.pageIndex = this.currentPage;
        this.paginator.length = 0
      }
        
      },
      (error)=>{
        this.loading=false;
      }
    )
  }

  pageChanged(event: any) {
    console.log({ event });
    this.pageSize = event.pageSize;
    this.currentPage = event.pageIndex;
    this. GetConsultedPatientsAsync();
  }  

  submitdetails1(){
    this.ValidationMessage=''
    this.ShowErrorMessage=false
    let obj: any = {};
    this.currentPage=0
    obj.to = this.doctorForm.get('todate').value;
    obj.from = this.doctorForm.get('fromdate').value;

    let params = new HttpParams();
    params = params.append('fromDate', obj.from.format("YYYY-MM-DD"));
    params = params.append('toDate', obj.to.format("YYYY-MM-DD"));

    this.dataSource = new MatTableDataSource<PeriodicElement>(
      this.ELEMENT_DATA
    );
    
    if (this.utilsService.monthDiffInDay(obj.to, obj.from)>90) {
      this.ValidationMessage="Please select date gap for 90 day maximum duration!"
      this.ShowErrorMessage=true;
    }
    else if(this.utilsService.monthDiffInDay(obj.to, obj.from)<0)
    {
      this.ValidationMessage="From Date should be less than or equal to To Date.";
      this.ShowErrorMessage=true;
    }
    else{

    this.dataSource = new MatTableDataSource<PeriodicElement>( this.ELEMENT_DATA);
    // this.configPage.PageNo=0
    this.GetConsultedPatientsAsync();
    this.todatedisable=false
    }
    
  }
  next(){
    this.loading=true;
    this.configPage.PageNo+=1
    this.GetConsultedPatientsAsync()
    this.todatedisablepre=false;
    
    if(Math.floor(this.lastpage/10)==this.configPage.PageNo){
      this.todatedisable=true

console.log(this.todatedisable);

    }
  }
  pre(){
    this.loading=true;
    this.configPage.PageNo-=1
    this.todatedisable=false
    this.GetConsultedPatientsAsync()
    if(this.configPage.PageNo==0){
      this.todatedisablepre=true;
    }
  }
   pageSize = 10; // Number of items to display per page
  currentPageIndex = 0;
  // pageChanged(event: any): void {
   
  //   this.configPage.PageNo+=1
  //   this.currentPageIndex = event;
  //   this.pageSize = this.PageSize;
  //   this.configPage.PageSize=10
  //   this. GetConsultedPatientsAsync();

  //   // You can perform any actions here, such as fetching data for the new page.
  //   // For example, if you have a method named `fetchData()` to fetch data based on the
  //   // current page and page size, you can call it here.
  //   // this.fetchData();
  // }
  ShowErrorMessage: boolean;
  ValidationMessage:string;
  // submitdetails() {
   
  //   this.ValidationMessage="";
  //   this.ShowErrorMessage=false;
  //   this.ELEMENT_DATA=[];
  //   if (this.doctorForm.value) {
  //     let obj: any = {};
  //     //obj.from = this.doctorForm.get('picker').value;
  //     obj.to = this.doctorForm.get('todate').value;
  //     obj.from = this.doctorForm.get('fromdate').value;
  //     obj.PHCID = this.doctorForm.get('PHCID').value;
  //     obj.SpatientName = this.doctorForm.get('patientName').value;
  //     obj.SmobileNo = this.doctorForm.get('mobileNo').value;
  //     obj.SopdNo = this.doctorForm.get('opdNo').value;
  //     console.log(obj);

  //     this.dataSource = new MatTableDataSource<PeriodicElement>( this.ELEMENT_DATA);

  //     if (this.utilsService.monthDiffInDay(obj.to, obj.from)>90) {
  //       this.ValidationMessage="Please select date gap for 90 day maximum duration!"
  //       this.ShowErrorMessage=true;
  //     }
  //     else if(this.utilsService.monthDiffInDay(obj.to, obj.from)<0)
  //     {
  //       this.ValidationMessage="From Date should be less than or equal to To Date.";
  //       this.ShowErrorMessage=true;
  //     }
  //     if(!this.ValidationMessage)
  //     {
        
  //       this.GetDashboardReportConsultationWithRestrictedAccess({
  //         PHCID: obj.PHCID,
  //         fromDate: obj.from.format("YYYY-MM-DD"),
  //         toDate: obj.to.format("YYYY-MM-DD"),
  //         patientName: obj.SpatientName,
  //         mobileNo: obj.SmobileNo,
  //         opdNo: obj.SopdNo,
  //       });
  //       // this.GetDashboardReportConsultation({
  //       //   PHCID: obj.PHCID,
  //       //   fromDate: obj.from.format("YYYY-MM-DD"),
  //       //   toDate: obj.to.format("YYYY-MM-DD"),
  //       //   patientName: obj.SpatientName,
  //       //   mobileNo: obj.SmobileNo,
  //       //   opdNo: obj.SopdNo,
  //       // });
        
  //     } else {
       
  //     }
  //   }
    
  // }


  openPrescriptionData:any
  openPrescription(patientCaseDetailId:number)
  {
    debugger
    this.loading = true;
    this.userObjFromToken = this.svcLocalstorage.GetData(environment.AuthTokenKeyLSKey);
    if (this.userObjFromToken) {
      forkJoin([
        this.svcdoctor.CreatePrescription(patientCaseDetailId)
        //this.svcdoctor.CreatePrescription(220)
      ]).subscribe({
        next: (data: any) => {
          this.loading=false
    
          this.openPrescriptionData=data;

          if(this.openPrescriptionData[0].prescriptionFilePath=='pending')
          {
            Swal.fire({
              title: 'Warning',
              text: `Prescription is in-progress, please try after some time`,
              icon: 'warning',
            })
            this.loading =  false
          }
          else if(this.openPrescriptionData[0].prescriptionFilePath=='consultationpending')
          {
            Swal.fire({
              title: 'Warning',
              text: `Consultation pending`,
              icon: 'warning',
            })
            this.loading =  false
          }
          else
          {

            const path=this.openPrescriptionData[0].prescriptionFilePath
            const storage=this.openPrescriptionData[0].storageSource==null?0:this.openPrescriptionData[0].storageSource
    
            window.open(`${environment.ApiEndPoint}${environment.EndPoints.Doctor.Endpoint}${environment.EndPoints.Doctor.methods.GetPrescriptionFile}?filePath=${path}&StorageSource=${storage}`)

           // window.open(this.ImagesHeader+this.openPrescriptionData[0].prescriptionFilePath,'_blank');
            //window.open('https://tele-med-dev.azurewebsites.net/MyFiles/CaseDocuments/62993c1c-ed5a-429b-8353-918c006dc32a.pdf','_blank');
            this.loading = false;
          }        
            
        },error(err) {
          this.loading=false
        },
      });
    }
  }

  @ViewChild('content') table: ElementRef<any>;
  // Download(value:any)
  // {
  //   const ws: XLSX.WorkSheet=XLSX.utils.table_to_sheet(this.table.nativeElement);//converts a DOM TABLE element to a worksheet
  //   const wb: XLSX.WorkBook = XLSX.utils.book_new();
  //   XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

  //   /* save to file */
  //   XLSX.writeFile(wb, 'SheetJS.xlsx');

  // }




  //  Download(value:any)
  // {
  //   this.loading=true
  //   // XLSX.utils.book_append_sheet(this.workBook1, this.workSheet, 'SheetName',);
  //   // XLSX.writeFile(this.workBook1, 'filename.xlsx')
  //   // this.exportAsExcelFile(this.newArrayOfObj,this.ReportName)

  //   this._sweetAlert.download(this.newArrayOfObj,this.ReportName)
 
  // }


  // Download(value:any)
  // {
  //   let arr = [
  //     { firstName: 'Jack', lastName: 'Sparrow', email: 'abc@example.com' },
  //     { firstName: 'Harry', lastName: 'Potter', email: 'abc@example.com' },
  //   ];

    

  //   let Heading = [['srNo',
  //   'districtName',
  //   'blockName',
  //   'phcName',
  //   'patientName',
  //   'age',
  //   'gender',
  //   'mobileNo',
  //   'opdNo',
  //   'reviewDate',
  //   'consultDate',
  //   'starttime',
  //   'endtime',
  //   'specialization',
  //   'doctor',
  //   'Prescription',]];

  //   //Had to create a new workbook and then add the header
  //   const wb = XLSX.utils.book_new();
  //   const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet([]);
  //   XLSX.utils.sheet_add_aoa(ws, Heading);

  //   //Starting in the second row to avoid overriding and skipping headers
  //   XLSX.utils.sheet_add_json(ws, this.ELEMENT_DATA, { origin: 'A2', skipHeader: true });

  //   XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

  //   XLSX.writeFile(wb, 'filename.xlsx');
  // }





  public Download(value: any) {
    console.log(value);
    if (value == 'Excel') {
       this.loading=true
      let count:number=1000000;
      // for (let index = 0;  this.dataSourceDownload.length>=index; index=index+count) {;
      //      var D = this.dataSourceDownload.slice(index,index+count);
      //      this.exportAsExcelFile(D, this.ReportName);
      // }

      this.loading=true

      return new Promise((resolve, reject) => {
      this.newArrayOfObj = this.dataSourceDownload.map((item,index) => {
        return {
         'SL No.':item.srNo ,'Cluster':item.cluster ,'District':item.districtName,'Block':item.blockName,'PHC':item.phcName,'Phase':item.phase ,'Patient':item.patientName,'Age':item.age,'Gender':item.gender,
         'Mobile No':item.mobileNo,'OPD No':item.opdNo,'Referral Date':item.reviewDate,
         'Consult Date':item.consultDate,'Start Time':item.starttime,'End Time':item.endtime,
         'Specialization':item.specialization,'Doctor':item.doctor
        };
       
        
      });


      setTimeout(()=>{
        this.exportAsExcelFile(this.newArrayOfObj,this.ReportName)
      },0)
      });
    }
  }

  excelBuffer:any
  calls = new Subject();

  // Mock of an actual service
  service = {
    getData: () => of(this.saveAsExcelFile(this.excelBuffer, this.ReportName)).pipe(delay(1500)),
  };


  // public async exportAsExcelFile() {
  //   this.loading=true
  //   this.calls.next(true);
  //   this.service.getData().pipe(
  //     takeUntil(this.calls),
  //   ).subscribe(res => {
  //   this.loading=false});
   
  //  // await  this.saveAsExcelFile(this.excelBuffer, this.ReportName);
  // }

  exportAsExcelFile(array:any,reportname:any)
  {
   
    // var json=this.newArrayOfObj
    // var excelFileName=this.ReportName
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(array);
    const workbook: XLSX.WorkBook = {
      Sheets: { data: worksheet },
      SheetNames: ['data'],
    };
    this. excelBuffer = XLSX.write(workbook, {
      bookType: 'xlsx',
      type: 'array',
    });

   // this.saveAsExcelFile(this.excelBuffer,reportname)


//    of(this.saveAsExcelFile(this.excelBuffer,reportname)).subscribe((res:any)=>{
// this.loading=false
//    })


   //////////working code/////////////
    const request = new Request('', {
      method:'POST',
      body: this.excelBuffer
    });
    
    request.arrayBuffer().then((buffer) => {
     this.saveAsExcelFile(this.excelBuffer,reportname).subscribe((res:any)=>{
      console.log(res,'arraybuffer');
      this.loading=false
      Swal.close()
     })
      
    });

/////////////////working code close///////////
    // forkJoin(
    //   this.saveAsExcelFile(this.excelBuffer,reportname)

    // ).subscribe((res:any)=>{
    //   this.loading=false
    // })


   // this.saveAsExcelFile(this.excelBuffer,reportname)
  }

  // private saveAsExcelFile(buffer: any, fileName: string){
  //   console.log(this.excelBuffer,'excelllllllllllllllllllll');
    
  //   const data: Blob = new Blob([buffer], { type: EXCEL_TYPE });
  //  var aa= FileSaver.saveAs(
  //     data,
  //     fileName + '_export_' + new Date().getTime() + '.csv'
  //   );
 
    
  // }
  
  private saveAsExcelFile(buffer: any, fileName: string):Observable<any> {
    console.log(this.excelBuffer,'excelllllllllllllllllllll');
    
    const data: Blob = new Blob([buffer], { type: EXCEL_TYPE });
   var aa= FileSaver.saveAs(
      data,
      fileName + '_export_' + new Date().getTime() + '.csv'
    );
    return of(false)
    
  }
  public downloadPDF() {
    //   //const doc = new jsPDF();
    //   const doc: jsPDF = new jsPDF('l', 'pt', [1000, 1000]);
    //   const specialElementHandlers = {
    //     '#editor': function (element, renderer) {
    //       return true;
    //     },
    //   };
    //   const content = this.content.nativeElement;
    //   doc.html(content.innerHTML, {
    //     html2canvas: {
    //       // insert html2canvas options here, e.g.
    //       width: 10,
    //     },
    //     callback: function () {
    //       doc.output('dataurlnewwindow');
    //     },
    //   });
    //   // doc.html(content.innerHTML, 15, 15, {
    //   //   width: 190,
    //   //   'elementHandlers': specialElementHandlers
    //   // });
    //   //   doc.html(content.innerHTML,
    //   //     {callback: () => {
    //   //     doc.output('dataurlnewwindow');
    //   //  }});
    //   //   doc.save('test.pdf');
    // }
    // // convert() {
    // //   var doc = new jsPDF();
    // //   var col = [
    // //     'Id',
    // //     'TypeID',
    // //     'Accnt',
    // //     'Amnt',
    // //     'Start',
    // //     'End',
    // //     'Contrapartida',
    // //   ];
    // //   var rows = [];
    // //   var rowCountModNew = [
    // //     [
    // //       '1721079361',
    // //       '0001',
    // //       '2100074911',
    // //       '200',
    // //       '22112017',
    // //       '23112017',
    // //       '51696',
    // //     ],
    // //     [
    // //       '1721079362',
    // //       '0002',
    // //       '2100074912',
    // //       '300',
    // //       '22112017',
    // //       '23112017',
    // //       '51691',
    // //     ],
    // //     [
    // //       '1721079363',
    // //       '0003',
    // //       '2100074913',
    // //       '400',
    // //       '22112017',
    // //       '23112017',
    // //       '51692',
    // //     ],
    // //     [
    // //       '1721079364',
    // //       '0004',
    // //       '2100074914',
    // //       '500',
    // //       '22112017',
    // //       '23112017',
    // //       '51693',
    // //     ],
    // //   ];
    // //   rowCountModNew.forEach((element) => {
    // //     rows.push(element);
    // //   });
    // //   doc.autoTable(col, rows);
    // //   doc.save('Test.pdf');
  }
  // downloadPdf() {
  //   this.loading=true;

  //   var prepare = [];

  //     this.dataSourceDownload.forEach((e) => {
  //       var tempObj = [];
  //       tempObj.push(e.srNo);
  //       tempObj.push(e.districtName);
  //       tempObj.push(e.blockName);
  //       tempObj.push(e.phcName);
  //       tempObj.push(e.patientName);
  //       tempObj.push(e.age);
  //       tempObj.push(e.gender);
  //       tempObj.push(e.mobileNo);
  //       tempObj.push(e.opdNo);
  //       tempObj.push(e.reviewDate);
  //       tempObj.push(e.consultDate);
  //       tempObj.push(e.starttime);
  //       tempObj.push(e.endtime);
  //       tempObj.push(e.specialization);
  //       tempObj.push(e.doctor);
  //       tempObj.push(e.prescription);
  //       prepare.push(tempObj);
  //     });
  //     const doc = new jsPDF('l', 'pt', [1000, 1000]);
  //     doc.setFontSize(18);
  //     doc.text(this.ReportName, 11, 20);
  //     doc.setFontSize(11);
  //     doc.setTextColor(100);
  //     (doc as any).autoTable({
  //       head: [
  //         [
  //           'SL No.',
  //           'District',
  //           'Block',
  //           'PHC',
  //           'Patient',
  //           'Age',
  //           'Gender',
  //           'Mobile No',
  //           'OPD No',
  //           'Review Date',
  //           'Consult Date',
  //           'Starttime',
  //           'Endtime',
  //           'Specialization',
  //           'Doctor',
  //           'Prescription',
  //         ],
  //       ],
  //       body: prepare,
  //       columnStyles: {
  //         0: {cellWidth: 30},
  //         1: {cellWidth: 60},
  //         2: {cellWidth: 60},
  //         3: {cellWidth: 60},
  //         4: {cellWidth: 60},
  //         5: {cellWidth: 20},
  //         6: {cellWidth: 40},
  //         7: {cellWidth: 70},
  //         8: {cellWidth: 60},
  //         9: {cellWidth: 60},
  //         10: {cellWidth: 60},
  //         11: {cellWidth: 60},
  //         12: {cellWidth: 60},
  //         13: {cellWidth: 80},
  //         14: {cellWidth: 60},
  //         15: {cellWidth: 80},
  //       }
  //     });
  //     doc.save(this.ReportName + '.pdf');
  
  //      this.loading=false
  


  // }


  downloadPdf() {
  
    this.loading=true;

    setTimeout(() => {
      this.exportPdf()
    }, 0);

}

exportPdf()
{console.log('func');

  var prepare = [];
  
  this.dataSourceDownload.forEach((e) => {
    var tempObj = [];
    tempObj.push(e.srNo);
    tempObj.push(e.cluster);
    tempObj.push(e.districtName);
    tempObj.push(e.blockName);
    tempObj.push(e.phcName);
    tempObj.push(e.phase);
    tempObj.push(e.patientName);
    tempObj.push(e.age);
    tempObj.push(e.gender);
    tempObj.push(e.mobileNo);
    tempObj.push(e.opdNo);
    tempObj.push(e.reviewDate);
    tempObj.push(e.consultDate);
    tempObj.push(e.starttime);
    tempObj.push(e.endtime);
    tempObj.push(e.specialization);
    tempObj.push(e.doctor);
    //tempObj.push(e.prescription);
    prepare.push(tempObj);
  });
  const doc = new jsPDF('l', 'pt', [1000, 1000]);
  doc.setFontSize(18);
  doc.text(this.ReportName, 11, 20);
  doc.setFontSize(11);
  doc.setTextColor(100);
  (doc as any).autoTable({
    head: [
      [
        'SL No.',
        'Cluster',
        'District',
        'Block',
        'PHC',
        'Phase',
        'Patient',
        'Age',
        'Gender',
        'Mobile No',
        'OPD No',
        'Referral Date',
        'Consult Date',
        'Starttime',
        'Endtime',
        'Specialization',
        'Doctor',
        // 'Prescription',
      ],
    ],
    body: prepare,
    // columnStyles: {
    //   0: {cellWidth: 30},
    //   1: {cellWidth: 60},
    //   2: {cellWidth: 60},
    //   3: {cellWidth: 60},
    //   4: {cellWidth: 60},
    //   5: {cellWidth: 20},
    //   6: {cellWidth: 40},
    //   7: {cellWidth: 70},
    //   8: {cellWidth: 60},
    //   9: {cellWidth: 60},
    //   10: {cellWidth: 60},
    //   11: {cellWidth: 60},
    //   12: {cellWidth: 60},
    //   13: {cellWidth: 80},
    //   14: {cellWidth: 60},
    //   15: {cellWidth: 80},
    //   16: {cellWidth: 60},
    //   17: {cellWidth: 80},
    // }
  });
  of(0).subscribe((res:any)=>{
    doc.save(this.ReportName + '.pdf');
  },(err:any)=>{},()=>{
    setTimeout(() => {
      console.log('loader');
      
      this.loading=false
    }, 1000);
  })
 
}
}
export interface PeriodicElement {
  srNo: number;
  cluster:string;
  districtName: string;
  blockName: string;
  phcName: string;
  phase:string;
  patientName: string;
  age: string;
  gender: string;
  mobileNo: string;
  opdNo: string;
  reviewDate: string;
  consultDate: string;
  starttime: string;
  endtime: string;
  specialization: string;
  doctor: string;
  Prescription: string;
  patientCaseID:number;
  // "complaint": "string",
  // "assignedOn": "2022-05-24T06:28:07.875Z",
  // "phcTechnician": "string",
  // "phcAddress": "string",
  // "cluserID": 0,
  // "cluster": "string",
  // "blockID": 0,
  // "phcid": 0,
  // "createdBy": 0,
  // "patientCreatedBy": "string"
}
