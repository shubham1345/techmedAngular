import {
  Component,
  OnInit,
  ViewChild,
  AfterViewInit,
  ElementRef,
  ViewChildren,
  QueryList,
  Directive,
} from '@angular/core';

import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

import { HttpClient, HttpParams } from '@angular/common/http';
import { merge, Observable, of as observableOf } from 'rxjs';
import { catchError, map, startWith, switchMap } from 'rxjs/operators';
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
// tslint:disable-next-line:no-duplicate-imports
import { default as _rollupMoment, Moment } from 'moment';
import {
  faClose,
  faFileExcel,
  faFilePdf,
} from '@fortawesome/free-solid-svg-icons';
import { UtilsService } from 'src/app/utils/Utils_Service';
import { SvcmainAuthserviceService } from 'src/app/services/services/svcmain-authservice.service';


const moment = _rollupMoment || _moment;

// See the Moment.js docs for the meaning of these formats:
// https://momentjs.com/docs/#/displaying/format/
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


export const DATE_FORMAT_2 = {
  parse: {
    dateInput: 'MM-YYYY',
  },
  display: {
    dateInput: 'MM-YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

@Directive({
  selector: '[dateFormat1]',
  providers: [
    {provide: MAT_DATE_FORMATS, useValue: DATE_FORMAT_2},
  ],
})
  
export class MyDirective {
  
  }


@Component({
  selector: 'app-maindashboard-serverhealth',
  templateUrl: './maindashboard-serverhealth.component.html',
  styleUrls: ['./maindashboard-serverhealth.component.css'],
  providers: [
    // `MomentDateAdapter` can be automatically provided by importing `MomentDateModule` in your
    // application's root module. We provide it at the component level here, due to limitations of
    // our example generation script.
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS],
    },

    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS},
  ],
})


export class MaindashboardServerhealthComponent implements AfterViewInit {


  myDate:any

  loading = false;
  ImagesHeader = environment.ImagesHeader
  public ngxLoadingAnimationTypes = ngxLoadingAnimationTypes;
  public config = {
    animationType: ngxLoadingAnimationTypes.none,
    backdropBorderRadius: '3px',
  };
  date = new FormControl(moment());
 dateFormat:any=MY_FORMATS;



 

  chosenYearHandler(normalizedYear: Moment) {
    console.log(this.doctorForm.value.date,'formmmmmmmmm');
    console.log(this.date.value,'connnnnnnnnnnnnnnnnnnnn');
    
    
    const ctrlValue = this.doctorForm.value.date;
    ctrlValue.year(normalizedYear.year());
    this.doctorForm.patchValue({date:ctrlValue});
  }

  chosenMonthHandler(
    normalizedMonth: Moment,
    datepicker: MatDatepicker<Moment>
  ) {
    const ctrlValue = this.doctorForm.value.date;
    ctrlValue.month(normalizedMonth.month());
    this.doctorForm.patchValue({date:ctrlValue});
    datepicker.close();
  }

  userObjFromToken: any;
  doctorForm: FormGroup;
  fromDateValue: Date;
  formControl: FormGroup;
  formControl1: FormGroup;
  formControl2: FormGroup;
  toDateValue: Date;
  specializationID: string;
  dataSourceDownload: any[];
  dataSourceDownloadMonthly: any[];
  ReportNameMonthly: string;
  ReportNameDaily: string;
  faFilePdf = faFilePdf;
  faFileExcel = faFileExcel;
  faClose = faClose;
  today:Date=new Date();
  displayedColumns: string[] = [
    'srNo',
    'cluster',
    'districtName',
    'blockName',
    'phcName',
    'phase',
    'date',
    'totalWorkingTime',
    'phcDownTime',
    'downTime',
  ];
  filterValues = {
    // srNo: '',
    // districtName:  '',
    // blockName:  '',
    // phcName:  '',
    // TotalWorkingTime: '',
    // phcDownTime: '',
    // DownTime: '',
  };
  ELEMENT_DATA: PeriodicElement[] = [];
  ELEMENT_DATAMonthly: PeriodicElementMonthly[] = [];

  dataSource = new MatTableDataSource<PeriodicElement>(this.ELEMENT_DATA);
  dataSourceMonthly = new MatTableDataSource<PeriodicElement>(
    this.ELEMENT_DATAMonthly
  );

  constructor(
    private fb: FormBuilder,
    private svcLocalstorage: SvclocalstorageService,
    private Svc_MISService: svc_misService,
    private _liveAnnouncer: LiveAnnouncer,
    private Svc_dashboardService: svc_dashboardService,
    public datepipe: DatePipe,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    formBuilder: FormBuilder,
    private utilsService: UtilsService,
    private _sweetAlert:SvcmainAuthserviceService
  ) {


    this.changeTab('daily')
    

                //////////used to stop loader when their is error of 401 and 403////

                this._sweetAlert.getLoader().subscribe((res:any)=>{
                  this.loading=res
                  console.log('med',this.loading)
                })
            
                /////////////////////////////////////////////////////////////

    this.doctorForm = new FormGroup({
      todate: new FormControl(moment(new Date())),
      fromdate:new FormControl(moment(new Date())),
      date: new FormControl(moment(new Date(new Date().setMonth(new Date().getMonth() - 1)))),
    });

    this.ReportNameDaily = 'Remote Site Downtime Summary Daily';
    this.ReportNameMonthly = 'Remote Site Downtime Summary Monthly';

    this.dataSourceDownload = this.ELEMENT_DATA;
    this.dataSourceDownloadMonthly = this.ELEMENT_DATAMonthly;

    let params = new HttpParams();
      params = params.append('fromDate', this.datepipe.transform(new Date(), 'yyyy-MM-dd'));
      params = params.append('toDate', this.datepipe.transform(new Date(), 'yyyy-MM-dd'));
      // this.RemoteSiteDowntimeSummaryDailyWithRestrictedAccess({
      //   params,
      // });
      // this.RemoteSiteDowntimeSummaryDaily({
      //   params,
      // });
      this.dataSource.filterPredicate = ((data, filter) => {
        const b =
          !filter.districtName ||
          data.districtName.toLowerCase().includes(filter.districtName);
        const c =
          !filter.blockName ||
          data.blockName.toLowerCase().includes(filter.blockName);
        const d =
          !filter.phcName || data.phcName.toLowerCase().includes(filter.phcName);
       
       const e=!filter.phase || data.phase.toLowerCase().includes(filter.phase)
       const z=!filter.cluster || data.cluster.toLowerCase().includes(filter.cluster)
        //const c = !filter.symbol || data.symbol === filter.symbol;
        return  b && c && d && e &&z;
      }) as (PeriodicElement, string) => boolean;
  
      this.formControl1 = formBuilder.group({
        districtName: '',
        blockName: '',
        phcName: '',
        phase:'',
        cluster:''
        
      });
      this.formControl1.valueChanges.subscribe((value) => {
        const filter = { ...value, name: value.name } as string;
        this.dataSource.filter = filter;
      });
      // let paramsMonth = new HttpParams();
      // paramsMonth = paramsMonth.append('year', utilsService.SubtractMonths(1).getFullYear());
      // paramsMonth = paramsMonth.append('month', utilsService.SubtractMonths(1).getMonth());
      // this.RemoteSiteDowntimeSummaryMonthlyWithRestrictedAccess({
      //   paramsMonth
      // });
      // this.RemoteSiteDowntimeSummaryMonthly({
      //   paramsMonth
      // });
      this.dataSourceMonthly.filterPredicate = ((data, filter) => {
        const b =
          !filter.districtName ||
          data.districtName.toLowerCase().includes(filter.districtName);
        const c =
          !filter.blockName ||
          data.blockName.toLowerCase().includes(filter.blockName);
        const d =
          !filter.phcName || data.phcName.toLowerCase().includes(filter.phcName);
       
          const e =
          !filter.phase || data.phase.toLowerCase().includes(filter.phase);
          const z=!filter.cluster || data.cluster.toLowerCase().includes(filter.cluster)
       
        //const c = !filter.symbol || data.symbol === filter.symbol;
        return  b && c && d &&e&&z ;
      }) as (PeriodicElement, string) => boolean;
  
      this.formControl2 = formBuilder.group({
        districtNameM: '',
        blockNameM: '',
        phcNameM: '',
        phase:'',
        cluster:''
        
      });
      this.formControl2.valueChanges.subscribe((value) => {
        const filter = { ...value, name: value.name } as string;
        this.dataSourceMonthly.filter = filter;
      });

    //////////////////////////////////////////////////////////////
    // this.dataSource.filterPredicate = ((data, filter) => {
    //   //const a = !filter.srNo || data.srNo === filter.srNo;
    //   const b =
    //     !filter.districtName ||
    //     data.districtName.toLowerCase().includes(filter.districtName);
    //   const c =
    //     !filter.blockName || data.blockName.toLowerCase().includes(filter.blockName);
    //   const d = !filter.phcName || data.phcName.toLowerCase().includes(filter.phcName);

    //   const e = !filter.patientName || data.patientName === filter.patientName;
    //   const f = !filter.mobileNo || data.mobileNo === filter.mobileNo;
    //   const g = !filter.doctor || data.doctor === filter.doctor;
    //   const h = !filter.appointmentTime || data.appointmentTime === filter.appointmentTime;
    //   const i = !filter.consultStatus || data.consultStatus === filter.consultStatus;
    //   const j = !filter.doctorAvailable || data.doctorAvailable === filter.doctorAvailable;
    //   const k = !filter.patientAvailable || data.patientAvailable === filter.patientAvailable;
    //   return   b && c && d &&  f && g && h&& i&& j&& k;
    // }) as (PeriodicElement, string) => boolean;

    this.formControl = formBuilder.group({
      //srNo: '',
      // districtName:  '',
      // blockName:  '',
      // phcName:  '',
      // patientName: '',
      // mobileNo: '',
      // doctor: '',
      // appointmentTime: '',
      // consultStatus: '',
      // doctorAvailable: '',
      // patientAvailable: '',
    });
    // this.formControl.valueChanges.subscribe((value) => {
    //   const filter = { ...value, name: value.name } as string;
    //   this.dataSource.filter = filter;
    // });
  }

  // @ViewChildren(MatPaginator, ) paginator: MatPaginator;
  @ViewChildren(MatPaginator) paginator = new QueryList<MatPaginator>();
  @ViewChild(MatSort, { static: false }) sort: MatSort;
  @ViewChild('sorter1') sorter1: MatSort;
  @ViewChild('sorter2') sorter2: MatSort;


  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator.toArray()[0];
    this.dataSource.sort = this.sort;
    this.dataSourceMonthly.paginator = this.paginator.toArray()[1];
    this.dataSourceMonthly.sort = this.sorter2;
  //   this.doctorForm = this.fb.group({
  //     todate: [this.datepipe.transform(new Date(), 'yyyy-MM-dd'), [Validators.required]],
  //     fromdate: [this.datepipe.transform(new Date(), 'yyyy-MM-dd'), [Validators.required]],
  //   });
   }
  @ViewChild('content', { static: false }) content: ElementRef;

  isValid: boolean = false;
  RemoteSiteDowntimeSummaryDailyWithRestrictedAccess(params: any) {
    this.loading=true
    this.userObjFromToken = this.svcLocalstorage.GetData(
      environment.AuthTokenKeyLSKey
    );
  // RemoteSiteDowntimeSummaryDaily(params: any) {
  //   this.loading=true
  //   this.userObjFromToken = this.svcLocalstorage.GetData(
  //     environment.AuthTokenKeyLSKey
  //   );
    if (this.userObjFromToken) {
      this.Svc_dashboardService.RemoteSiteDowntimeSummaryDailyWithRestrictedAccess(params).subscribe((data: any) => {
        this.loading=false;
        console.log(data, 'this is RemoteSiteDowntimeSummaryDailyWithRestrictedAccess data');
        this.ELEMENT_DATA = data;
        this.dataSourceDownload = this.ELEMENT_DATA;
        this.isValid = true;
        console.log(
          this.ELEMENT_DATA,
          'this is RemoteSiteDowntimeSummaryDailyWithRestrictedAccess data'
        );
        this.dataSource = new MatTableDataSource<PeriodicElement>(
          this.ELEMENT_DATA
        );
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator.toArray()[0];
        this.dataSource.filterPredicate = ((data, filter) => {
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
            !filter.phase ||
            data.phase.toLowerCase().includes(filter.phase.toLowerCase());
       const z=!filter.cluster || data.cluster.toLowerCase().includes(filter.cluster)
          
          return  b && c && d &&e &&z;
        }) as (PeriodicElement, string) => boolean;
      },
      (error)=>{
        this.loading=false;
      }
      );
      // this.Svc_dashboardService.RemoteSiteDowntimeSummaryDaily(params).subscribe((data: any) => {
      //   this.loading=false;
      //   console.log(data, 'this is RemoteSiteDowntimeSummaryDaily data');
      //   this.ELEMENT_DATA = data;
      //   this.dataSourceDownload = this.ELEMENT_DATA;
      //   this.isValid = true;
      //   console.log(
      //     this.ELEMENT_DATA,
      //     'this is RemoteSiteDowntimeSummaryDaily data'
      //   );
      //   this.dataSource = new MatTableDataSource<PeriodicElement>(
      //     this.ELEMENT_DATA
      //   );
      //   this.dataSource.sort = this.sort;
      //   this.dataSource.paginator = this.paginator.toArray()[0];
      //   this.dataSource.filterPredicate = ((data, filter) => {
      //     const b =
      //       !filter.districtName ||
      //       data.districtName.toLowerCase().includes(filter.districtName.toLowerCase());
      //     const c =
      //       !filter.blockName ||
      //       data.blockName.toLowerCase().includes(filter.blockName.toLowerCase());
      //     const d =
      //       !filter.phcName ||
      //       data.phcName.toLowerCase().includes(filter.phcName.toLowerCase());
          
      //     return  b && c && d ;
      //   }) as (PeriodicElement, string) => boolean;
      // },
      // (error)=>{
      //   this.loading=false;
      // }
      // );
    }
  }

  RemoteSiteDowntimeSummaryMonthlyWithRestrictedAccess(params: any) {
    this.loading=true;
    this.userObjFromToken = this.svcLocalstorage.GetData(
      environment.AuthTokenKeyLSKey
    );
  // RemoteSiteDowntimeSummaryMonthly(params: any) {
  //   this.loading=true;
  //   this.userObjFromToken = this.svcLocalstorage.GetData(
  //     environment.AuthTokenKeyLSKey
  //   );
    if (this.userObjFromToken) {
      this.Svc_dashboardService.RemoteSiteDowntimeSummaryMonthlyWithRestrictedAccess(params).subscribe((data: any) => {
        this.loading=false
        console.log(data, 'this is RemoteSiteDowntimeSummaryMonthlyWithRestrictedAccess data');
        this.ELEMENT_DATAMonthly = data;
        this.dataSourceDownloadMonthly = this.ELEMENT_DATAMonthly;
        this.isValid = true;
        console.log(
          this.ELEMENT_DATA,
          'this is RemoteSiteDowntimeSummaryMonthlyWithRestrictedAccess data'
        );
        this.dataSourceMonthly = new MatTableDataSource<PeriodicElement>(
          this.ELEMENT_DATAMonthly
        );
        this.dataSourceMonthly.sort = this.sorter2;
        this.dataSourceMonthly.paginator = this.paginator.toArray()[1];
        console.log( this.dataSourceMonthly.paginator,'paginator');
        

        this.dataSourceMonthly.filterPredicate = ((data, filter) => {
          const b =
            !filter.districtNameM ||
            data.districtName.toLowerCase().includes(filter.districtNameM.toLowerCase());
          const c =
            !filter.blockNameM ||
            data.blockName.toLowerCase().includes(filter.blockNameM.toLowerCase());
          const d =
            !filter.phcNameM ||
            data.phcName.toLowerCase().includes(filter.phcNameM.toLowerCase());

            const e =
            !filter.phase ||
            data.phase.toLowerCase().includes(filter.phase.toLowerCase());
       const z=!filter.cluster || data.cluster.toLowerCase().includes(filter.cluster)
          
          return  b && c && d &&e &&z;
        }) as (PeriodicElement, string) => boolean;
      },
      (error)=>{
        this.loading=false;
      }
      );
      // this.Svc_dashboardService.RemoteSiteDowntimeSummaryMonthly(params).subscribe((data: any) => {
      //   this.loading=false
      //   console.log(data, 'this is RemoteSiteDowntimeSummaryMonthly data');
      //   this.ELEMENT_DATAMonthly = data;
      //   this.dataSourceDownloadMonthly = this.ELEMENT_DATAMonthly;
      //   this.isValid = true;
      //   console.log(
      //     this.ELEMENT_DATA,
      //     'this is RemoteSiteDowntimeSummaryMonthly data'
      //   );
      //   this.dataSourceMonthly = new MatTableDataSource<PeriodicElement>(
      //     this.ELEMENT_DATAMonthly
      //   );
      //   this.dataSourceMonthly.sort = this.sort;
      //   this.dataSourceMonthly.paginator = this.paginator.toArray()[1];
      //   console.log( this.dataSourceMonthly.paginator,'paginator');
        

      //   this.dataSourceMonthly.filterPredicate = ((data, filter) => {
      //     const b =
      //       !filter.districtNameM ||
      //       data.districtName.toLowerCase().includes(filter.districtNameM.toLowerCase());
      //     const c =
      //       !filter.blockNameM ||
      //       data.blockName.toLowerCase().includes(filter.blockNameM.toLowerCase());
      //     const d =
      //       !filter.phcNameM ||
      //       data.phcName.toLowerCase().includes(filter.phcNameM.toLowerCase());
          
      //     return  b && c && d ;
      //   }) as (PeriodicElement, string) => boolean;
      // },
      // (error)=>{
      //   this.loading=false;
      // }
      // );
    }
  }

  ShowErrorMessage: boolean;
  ValidationMessage:string;
  submitdetails() {
    //this.loading=true
    this.ValidationMessage="";
    this.ShowErrorMessage=false;
    this.ELEMENT_DATA=[];
    if (this.doctorForm.value) {
      
      let obj: any = {};
      //obj.from = this.doctorForm.get('picker').value;
      obj.to = this.doctorForm.get('todate').value;
      obj.from = this.doctorForm.get('fromdate').value;
      // obj.PHCID = this.doctorForm.get('PHCID').value;
      this.toDateValue = obj.to;
      this.fromDateValue = obj.from;
      console.log(obj.from);
      console.log(obj.to);
      
      let params = new HttpParams();
      params = params.append('fromDate', obj.from.format("YYYY-MM-DD"));
      params = params.append('toDate', obj.to.format("YYYY-MM-DD"));

      console.log(params);

      this.dataSource = new MatTableDataSource<PeriodicElement>(
        this.ELEMENT_DATA
      );
      if (this.utilsService.monthDiffInDay(obj.to, obj.from)>92) {
        this.ValidationMessage="Please select date gap for 92 day maximum duration!"
        this.ShowErrorMessage=true;
      }
      else if(this.utilsService.monthDiffInDay(obj.to, obj.from)<0)
      {
        this.ValidationMessage="FromDate should be less than or equal to ToDate.";
        this.ShowErrorMessage=true;
      }
      if(!this.ValidationMessage)
      {
        this.RemoteSiteDowntimeSummaryDailyWithRestrictedAccess({
          params,
        });
        // this.RemoteSiteDowntimeSummaryDaily({
        //   params,
        // });
      } else {
        this.dataSource = new MatTableDataSource<PeriodicElement>( this.ELEMENT_DATA);

      }
    }
  }

  submitdetailsMonthly() {
    this.loading=true;
    this.ELEMENT_DATAMonthly=[]
    if (this.doctorForm.value) {
      
      let obj: any = {};

      console.log(this.doctorForm.value.date,'valuuuuuuuuuuuuuuuuu');
      

      obj.month = moment(this.doctorForm.value.date).add(0, 'd').toDate().getMonth()+1 ;
      obj.year = moment(this.doctorForm.value.date).add(0, 'd').toDate().getFullYear();
     
      let params = new HttpParams();
      params = params.append('year', obj.year);
      params = params.append('month', obj.month);

      console.log(params);
 
      this.dataSourceMonthly = new MatTableDataSource<PeriodicElement>(
        this.ELEMENT_DATAMonthly
      );
      this.dataSourceMonthly.sort = this.sorter2;

      if (true) {
        this.RemoteSiteDowntimeSummaryMonthlyWithRestrictedAccess({
          params,
        });
        // this.RemoteSiteDowntimeSummaryMonthly({
        //   params,
        // });
      } else {
        this.dataSourceMonthly = new MatTableDataSource<PeriodicElement>(
          this.ELEMENT_DATAMonthly
        );
      }
    }
  }

  public DownloadDaily(value: any) {
    console.log(value);
    if(this.ELEMENT_DATA.length==0){
      this.loading=false
      this._sweetAlert.sweetAlert('No Data Available','error')
      return
    }
    if (value == 'Excel') {
      let count:number=1000000;
      // for (let index = 0;  this.dataSourceDownload.length>=index; index=index+count) {;
      //      var D = this.dataSourceDownload.slice(index,index+count);
      //      this.exportAsExcelFile(D, this.ReportNameDaily);
      // }

      const newArrayOfObj = this.dataSourceDownload.map((item,index) => {
        return {
         'SL No.':item.srNo ,'Cluster':item.cluster,'District':item.districtName,'Block':item.blockName,'PHC':item.phcName,'Phase':item.phase,'Date':this.datepipe.transform(item.date,'dd-MM-yyyy'),'Total Working Time(minute)':item.totalWorkingTime,'PHC Down Time(minute)':item.phcDownTime,'Down Time(%)':item.downTime};
      });

      this.exportAsExcelFile(newArrayOfObj,this.ReportNameDaily+' '+ this.datepipe.transform(this.fromDateValue,'dd-MMM-yyyy')+
      ' to '+this.datepipe.transform(this.toDateValue,'dd-MMM-yyyy'))
    }
  }
  public DownloadMonthly(value: any) {
    console.log(value);
    if(this.ELEMENT_DATAMonthly.length==0){
      this.loading=false
      this._sweetAlert.sweetAlert('No Data Available','error')
      return
    }
    if (value == 'Excel') {
      let count:number=1000000;
      // for (let index = 0;  this.dataSourceDownload.length>=index; index=index+count) {;
      //      var D = this.dataSourceDownload.slice(index,index+count);
      //      this.exportAsExcelFile(D, this.ReportNameMonthly);
      // }
      console.log(this.dataSourceDownloadMonthly)

      const newArrayOfObj = this.dataSourceDownloadMonthly.map((item,index) => {
        return {
         'S.No':item.srNo ,'Cluster':item.cluster,'District':item.districtName,'Block':item.blockName,'PHC':item.phcName,'Phase':item.phase,'Date':this.datepipe.transform(item.date,'dd-MM-yyyy'),'Total Working Time(minute)':item.totalWorkingTime,'PHC Down Time(minute)':item.phcDownTime,'Down Time(%)':item.downTime};
      });


      this.exportAsExcelFile(newArrayOfObj,this.ReportNameMonthly +' '+ this.datepipe.transform(this.doctorForm.value.date,'MMM-yyyy') )
   
    }
  }
  public exportAsExcelFile(json: any[], excelFileName: string): void {
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(json);
    const workbook: XLSX.WorkBook = {
      Sheets: { data: worksheet },
      SheetNames: ['data'],
    };
    const excelBuffer: any = XLSX.write(workbook, {
      bookType: 'xlsx',
      type: 'array',
    });
    this.saveAsExcelFile(excelBuffer, excelFileName);
  }
  private saveAsExcelFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], { type: EXCEL_TYPE });
    FileSaver.saveAs(
      data,
      fileName + EXCEL_EXTENSION
    );
  }
  downloadPdf() {
    if(this.ELEMENT_DATA.length==0){
      this.loading=false
      this._sweetAlert.sweetAlert('No Data Available','error')
      return
    }
    var prepare = [];
    this.dataSourceDownload.forEach((e) => {
      var tempObj = [];
      tempObj.push(e.srNo);
      tempObj.push(e.cluster),
      tempObj.push(e.districtName);
      tempObj.push(e.blockName);
      tempObj.push(e.phcName);
      tempObj.push(e.phase)
      
      tempObj.push(this.datepipe.transform(e.date,'dd-MM-yyyy'))
      tempObj.push(e.totalWorkingTime);
      tempObj.push(e.phcDownTime);
      tempObj.push(e.downTime);
      prepare.push(tempObj);
    });
    const doc = new jsPDF('l', 'pt', [1000, 1000]);
    doc.setFontSize(18);
    doc.text(this.ReportNameDaily, 11, 20);
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
          'Date',
          'Total Working Time(minute)',
          'PHC Down Time(minute)',
          'Down Time(%)',
        ],
      ],
      body: prepare,
    });
    doc.save(this.ReportNameDaily +' '+
    this.datepipe.transform(this.fromDateValue,'dd-MMM-yyyy')+
    ' to '+this.datepipe.transform(this.toDateValue,'dd-MMM-yyyy')+ '.pdf');
  }
  downloadPdfMonthly() {
    if(this.ELEMENT_DATAMonthly.length==0){
      this.loading=false
      this._sweetAlert.sweetAlert('No Data Available','error')
      return
    }
    var prepare = [];
    this.dataSourceDownloadMonthly.forEach((e) => {
      var tempObj = [];
      tempObj.push(e.srNo);
      tempObj.push(e.cluster)
      tempObj.push(e.districtName);
      tempObj.push(e.blockName);
      tempObj.push(e.phcName);
      tempObj.push(e.phase)
      
      tempObj.push(this.datepipe.transform(e.date,'dd-MM-yyyy'))
      tempObj.push(e.totalWorkingTime);
      tempObj.push(e.phcDownTime);
      tempObj.push(e.downTime);
      prepare.push(tempObj);
    });
    const doc = new jsPDF('l', 'pt', [1000, 1000]);
    doc.setFontSize(18);
    doc.text(this.ReportNameMonthly, 11, 20);
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
          'Date',
          'Total Working Time(minute)',
          'PHC Down Time(minute)',
          'Down Time(%)',
        ],
      ],
      body: prepare,
    });
    doc.save(this.ReportNameMonthly+ ' '+ this.datepipe.transform(this.doctorForm.value.date,'MMM-yyyy')  + '.pdf');
  }

  changeTab(value)
  {
    if(value=='monthly')
    {
      // this.submitdetailsMonthly()
      this.displayedColumns= [
        'srNo',
        'cluster',
        'districtName',
        'blockName',
        'phcName',
        'phase',
        'totalWorkingTime',
        'phcDownTime',
        'downTime',
      ];
    }
    else if(value=='daily')
    {
     this. displayedColumns = [
        'srNo',
        'cluster',
        'districtName',
        'blockName',
        'phcName',
        'phase',
        'date',
        'totalWorkingTime',
        'phcDownTime',
        'downTime',
      ];
    }
  }



}
export interface PeriodicElement {
  srNo: number;
  districtName: string;
  blockName: string;
  phcName: string;
  totalWorkingTime: Number;
  phcDownTime: Number;
  downTime: Number;
}
export interface PeriodicElementMonthly {
  srNo: number;
  districtName: string;
  blockName: string;
  phcName: string;
  totalWorkingTime: Number;
  phcDownTime: Number;
  downTime: Number;
}
