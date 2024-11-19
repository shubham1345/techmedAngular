import {
  Component,
  OnInit,
  ViewChild,
  AfterViewInit,
  ElementRef,
  ViewChildren,
  QueryList,
} from '@angular/core';

import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

import { HttpClient, HttpParams } from '@angular/common/http';
import { merge, Observable, of as observableOf } from 'rxjs';
import { catchError, map, startWith, switchMap } from 'rxjs/operators';
import { DatePipe } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
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



import {MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS} from '@angular/material-moment-adapter';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';
import {MatDatepicker} from '@angular/material/datepicker';
import * as _moment from 'moment';
// tslint:disable-next-line:no-duplicate-imports
import {default as _rollupMoment, Moment} from 'moment';
import { faClose, faFileExcel, faFilePdf } from '@fortawesome/free-solid-svg-icons';
import { UtilsService } from 'src/app/utils/Utils_Service';
import { ngxLoadingAnimationTypes } from 'ngx-loading';
import { SvcmainAuthserviceService } from 'src/app/services/services/svcmain-authservice.service';

const moment = _rollupMoment || _moment;

// See the Moment.js docs for the meaning of these formats:
// https://momentjs.com/docs/#/displaying/format/
export const MY_FORMATS = {
  parse: {
    dateInput: 'MM/YYYY',
  },
  display: {
    dateInput: 'MM/YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMM YYYY'
  },
};


@Component({
  selector: 'app-maindashboard-phc-manpower',
  templateUrl: './maindashboard-phc-manpower.component.html',
  styleUrls: ['./maindashboard-phc-manpower.component.css'],
  providers: [
    // `MomentDateAdapter` can be automatically provided by importing `MomentDateModule` in your
    // application's root module. We provide it at the component level here, due to limitations of
    // our example generation script.
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    },

    {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS},
  ],
})
export class MaindashboardPhcManpowerComponent implements AfterViewInit {

  public ngxLoadingAnimationTypes = ngxLoadingAnimationTypes;
  public config = {
    animationType: ngxLoadingAnimationTypes.none,
    backdropBorderRadius: '3px',
  };

  loading:boolean=false

  date = new FormControl(moment());

  chosenYearHandler(normalizedYear: Moment) {
    const ctrlValue = this.date.value;
    ctrlValue.year(normalizedYear.year());
    this.date.setValue(ctrlValue);
  }

  chosenMonthHandler(normalizedMonth: Moment, datepicker: MatDatepicker<Moment>) {
    const ctrlValue = this.date.value;
    ctrlValue.month(normalizedMonth.month());
    this.date.setValue(ctrlValue);
    datepicker.close();
  }
  isHRReport:boolean
  userObjFromToken: any;
  doctorForm: FormGroup;
  fromDateValue: Date;
  formControl: FormGroup;
  formControlHR:FormGroup;
  toDateValue: Date;
  specializationID: string;
  dataSourceDownload: any[];
  dataSourceDownloadHR: any[];
  ReportName: string;
  ReportNameHR: string;
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
    'location',
    'workingDays',
    'daysPresent',
    'daysAbsent',

  ];
  filterValues = {
    srNo: '',
    districtName:  '',
    blockName:  '',
    phcName:  '',
    //noOfDaysInMonth: '',
    workingDays: '',
    daysPresent: '',
    daysAbsent:'',
  };
  ELEMENT_DATA: PeriodicElement[] = [
    // {
    // srNo: 1,
    // districtName:  'districtName1',
    // blockName:  'blockName1',
    // phcName:  'phcName1',
    // noOfDaysInMonth: 10,
    // workingDays: 11,
    // daysPresent: 22,
    // daysAbsent:33,
    // },
    // {
    //   srNo: 2,
    //   districtName:  'districtName2',
    //   blockName:  'blockName2',
    //   phcName:  'phcName2',
    //   noOfDaysInMonth: 10,
    //   workingDays: 11,
    //   daysPresent: 22,
    //   daysAbsent:33,
    // },
  ];
  ELEMENT_DATA_HR:PeriodicElement []=[
    
  ];
  dataSource = new MatTableDataSource<PeriodicElement>(this.ELEMENT_DATA);
  dataSourceHR= new MatTableDataSource<PeriodicElement>(this.ELEMENT_DATA_HR);
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
    private utilsService:UtilsService,
    private _sweetAlert:SvcmainAuthserviceService
  ) {
    this.changeTab('mainpower')
                    //////////used to stop loader when their is error of 401 and 403////

                    this._sweetAlert.getLoader().subscribe((res:any)=>{
                      this.loading=res
                      console.log('manpower',this.loading)
                    })
                
                    /////////////////////////////////////////////////////////////

    this.doctorForm = new FormGroup({
      // todate: new FormControl(''),
      // fromdate: new FormControl(''),
      date: new FormControl(utilsService.SubtractMonths(1)),
    });

    this.ReportName = 'PHC Manpower Report';
    this.ReportNameHR = 'HR Manpower Report';

    this.dataSourceDownload = this.ELEMENT_DATA;
    this.dataSourceDownloadHR=this.ELEMENT_DATA_HR

    let params = new HttpParams();
      params = params.append('year', moment(this.date.value).add(0, 'd').toDate().getFullYear());
      params = params.append('month', moment(this.date.value).add(0, 'd').toDate().getMonth());
    //  this.GetPHCManpowerReportWithRestrictedAccess({
    //   params
    // });
    //  this.GetPHCManpowerReport({
    //   params
    // });
    //////////////////////////////////////////////////////////////
    this.dataSource.filterPredicate = ((data, filter) => {
      const b =
        !filter.districtName ||
        data.districtName.toLowerCase().includes(filter.districtName);
      const c =
        !filter.blockName || data.blockName.toLowerCase().includes(filter.blockName);
      const d = !filter.phcName || data.phcName.toLowerCase().includes(filter.phcName);
      const e = !filter.phase || data.phase.toLowerCase().includes(filter.phase);
      // const e = !filter.noOfDaysInMonth || data.noOfDaysInMonth === filter.noOfDaysInMonth;
      // const f = !filter.workingDays || data.workingDays === filter.workingDays;
      // const g = !filter.daysPresent || data.daysPresent === filter.daysPresent;
      // const h = !filter.daysAbsent || data.daysAbsent === filter.daysAbsent;
      
      //const c = !filter.symbol || data.symbol === filter.symbol;
      const a = !filter.cluster || data.cluster.toLowerCase().includes(filter.cluster);

      return  b && c && d &&e &&a;
    }) as (PeriodicElement, string) => boolean;

    this.formControl = formBuilder.group({
      districtName:  '',
      blockName:  '',
      phcName:  '',
      //noOfDaysInMonth: '',
      workingDays: '',
      daysPresent: '',
      daysAbsent:'',
      phase:'',
      cluster:''
    });
    this.formControl.valueChanges.subscribe((value) => {
      const filter = { ...value, name: value.name } as string;
      this.dataSource.filter = filter;
    });

    this.dataSourceHR.filterPredicate = ((data, filter) => {
      const b =
        !filter.districtName ||
        data.districtName.toLowerCase().includes(filter.districtName);
      const c =
        !filter.blockName || data.blockName.toLowerCase().includes(filter.blockName);
      const d = !filter.employeeName || data.employeeName.toLowerCase().includes(filter.employeeName);
      const e = !filter.phase || data.phase.toLowerCase().includes(filter.phase);
      // const e = !filter.noOfDaysInMonth || data.noOfDaysInMonth === filter.noOfDaysInMonth;
      // const f = !filter.workingDays || data.workingDays === filter.workingDays;
      // const g = !filter.daysPresent || data.daysPresent === filter.daysPresent;
      // const h = !filter.daysAbsent || data.daysAbsent === filter.daysAbsent;
      
      //const c = !filter.symbol || data.symbol === filter.symbol;
      const a = !filter.cluster || data.cluster.toLowerCase().includes(filter.cluster);

      return  b && c && d &&e &&a;
    }) as (PeriodicElement, string) => boolean;

    this.formControlHR = formBuilder.group({
      // districtName:  '',
      // blockName:  '',
      employeeName:  '',
      //noOfDaysInMonth: '',
      // workingDays: '',
      // daysPresent: '',
      // daysAbsent:'',
      // phase:'',
      // cluster:''
    });
    this.formControlHR.valueChanges.subscribe((value) => {
      const filter = { ...value, name: value.name } as string;
      this.dataSourceHR.filter = filter;
    });
  }
  @ViewChildren(MatPaginator) paginator = new QueryList<MatPaginator>();

  // @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  //@ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator.toArray()[0];
    this.dataSource.sort = this.sort;
    this.dataSourceHR.sort = this.sort;
          this.dataSourceHR.paginator = this.paginator.toArray()[1];
    // this.doctorForm = this.fb.group({
    //   todate: ['', [Validators.required]],
    //   fromdate: ['', [Validators.required]],
    // });
    // this.GetAllPHC();
    this.HeaderData="";
    this.HeaderData.noOfDaysInMonth=0;
    this.HeaderData.totalWorkingDays=0;
    this.HeaderData.totalPresentDays=0;
    this.HeaderData.availabilityPercentage=0;
  }
  @ViewChild('content', { static: false }) content: ElementRef;

  ListOfCompletedConsultation: any;
  HeaderData:any
  isValid:boolean=false;
  GetPHCManpowerReportWithRestrictedAccess(params: any) {
    this.userObjFromToken = this.svcLocalstorage.GetData(
      environment.AuthTokenKeyLSKey
    );
  // GetPHCManpowerReport(params: any) {
  //   this.userObjFromToken = this.svcLocalstorage.GetData(
  //     environment.AuthTokenKeyLSKey
  //   );
    if (this.userObjFromToken) {
      this.loading=true
      this.Svc_dashboardService.GetPHCManpowerReportWithRestrictedAccess(params).subscribe(
        (data: any) => {
          this.loading=false
          
          this.ELEMENT_DATA = data.phcManpowerReports;
          this.HeaderData = data;
          this.dataSourceDownload = this.ELEMENT_DATA;
          this.isValid=true;

          this.dataSource = new MatTableDataSource<PeriodicElement>(
            this.ELEMENT_DATA
          );
          this.dataSource.sort = this.sort;
          this.dataSource.paginator = this.paginator.toArray()[0];

          this.dataSource.filterPredicate = ((data, filter) => {
            const b = !filter.districtName ||data.districtName.toLowerCase().includes(filter.districtName.toLowerCase());
            const c = !filter.blockName || data.blockName.toLowerCase().includes(filter.blockName.toLowerCase());
            const d = !filter.phcName || data.phcName.toLowerCase().includes(filter.phcName.toLowerCase());
            const e = !filter.phase || data?.phase.toLowerCase().includes(filter.phase.toLowerCase());
            // const e = !filter.noOfDaysInMonth || data.noOfDaysInMonth === filter.noOfDaysInMonth;
            // const f = !filter.workingDays || data.workingDays === filter.workingDays;
            // const g = !filter.daysPresent || data.daysPresent === filter.daysPresent;
            // const h = !filter.daysAbsent || data.daysAbsent === filter.daysAbsent;
            
            //const c = !filter.symbol || data.symbol === filter.symbol;
      const a = !filter.cluster || data.cluster.toLowerCase().includes(filter.cluster);
            
            return  b && c && d &&e &&a;
          }) as (PeriodicElement, string) => boolean;
      
      
        }
        ,(err:any)=>{
          this.loading=false
        }
      );
      // this.Svc_dashboardService.GetPHCManpowerReport(params).subscribe(
      //   (data: any) => {
      //     this.loading=false
          
      //     this.ELEMENT_DATA = data.phcManpowerReports;
      //     this.HeaderData = data;
      //     this.dataSourceDownload = this.ELEMENT_DATA;
      //     this.isValid=true;
      //     console.log(
      //       this.ELEMENT_DATA,
      //       'this is GetPHCManpowerReport data'
      //     );
      //     this.dataSource = new MatTableDataSource<PeriodicElement>(
      //       this.ELEMENT_DATA
      //     );
      //     this.dataSource.sort = this.sort;
      //     this.dataSource.paginator = this.paginator;

      //     this.dataSource.filterPredicate = ((data, filter) => {
      //       const b = !filter.districtName ||data.districtName.toLowerCase().includes(filter.districtName.toLowerCase());
      //       const c = !filter.blockName || data.blockName.toLowerCase().includes(filter.blockName.toLowerCase());
      //       const d = !filter.phcName || data.phcName.toLowerCase().includes(filter.phcName.toLowerCase());
      //       // const e = !filter.noOfDaysInMonth || data.noOfDaysInMonth === filter.noOfDaysInMonth;
      //       // const f = !filter.workingDays || data.workingDays === filter.workingDays;
      //       // const g = !filter.daysPresent || data.daysPresent === filter.daysPresent;
      //       // const h = !filter.daysAbsent || data.daysAbsent === filter.daysAbsent;
            
      //       //const c = !filter.symbol || data.symbol === filter.symbol;
      //       return  b && c && d ;
      //     }) as (PeriodicElement, string) => boolean;
      
      
      //   }
      //   ,(err:any)=>{
      //     this.loading=false
      //   }
      // );
    }
  }
  GetHRManpowersAsync(params: any) {
    this.userObjFromToken = this.svcLocalstorage.GetData(
      environment.AuthTokenKeyLSKey
    );
  // GetPHCManpowerReport(params: any) {
  //   this.userObjFromToken = this.svcLocalstorage.GetData(
  //     environment.AuthTokenKeyLSKey
  //   );
    if (this.userObjFromToken) {
      this.loading=true
      this.Svc_dashboardService.GetHRManpowersAsync(params).subscribe(
        (data: any) => {
          this.loading=false
          
          this.ELEMENT_DATA_HR = data;
          this.HeaderData = data;
          this.dataSourceDownloadHR = this.ELEMENT_DATA_HR;
          // this.isValid=true;

          this.dataSourceHR = new MatTableDataSource<PeriodicElement>(
            this.ELEMENT_DATA_HR
          );
          this.dataSourceHR.sort = this.sort;
          this.dataSourceHR.paginator = this.paginator.toArray()[1];

          this.dataSourceHR.filterPredicate = ((data, filter) => {
            // const b = !filter.districtName ||data.districtName.toLowerCase().includes(filter.districtName.toLowerCase());
            // const c = !filter.blockName || data.blockName.toLowerCase().includes(filter.blockName.toLowerCase());
            
            
            const d = !filter.employeeName || JSON.stringify(data.employeeName).toLowerCase().includes(filter.employeeName.toLowerCase());
            
            
            // const e = !filter.phase || data?.phase.toLowerCase().includes(filter.phase.toLowerCase());
            // const e = !filter.noOfDaysInMonth || data.noOfDaysInMonth === filter.noOfDaysInMonth;
            // const f = !filter.workingDays || data.workingDays === filter.workingDays;
            // const g = !filter.daysPresent || data.daysPresent === filter.daysPresent;
            // const h = !filter.daysAbsent || data.daysAbsent === filter.daysAbsent;
            
            //const c = !filter.symbol || data.symbol === filter.symbol;
      // const a = !filter.cluster || data.cluster.toLowerCase().includes(filter.cluster);
            
            return   d ;
          }) as (PeriodicElement, string) => boolean;
      
      
        }
        ,(err:any)=>{
          this.loading=false
        }
      );
    }
  }
  ListOfPHC: any;
  GetAllPHC() {
    this.userObjFromToken = this.svcLocalstorage.GetData(
      environment.AuthTokenKeyLSKey
    );
    if (this.userObjFromToken) {
      this.Svc_dashboardService.GetAllPHC().subscribe(
        (data: any) => {
          console.log(data, 'this is GetAllPHC data');
          this.ListOfPHC=data;
        }
      );
    }
  }
 
  submitdetails() {
    this.ELEMENT_DATA=[];
    this.HeaderData="";
    if (this.doctorForm.value) {
      let obj: any = {};
      let params = new HttpParams();
      params = params.append('year', moment(this.date.value).add(0, 'd').toDate().getFullYear());
      params = params.append('month', moment(this.date.value).add(0, 'd').toDate().getMonth()+1);

     
      // this.toDateValue = obj.to;
      // this.fromDateValue = obj.from;
      // console.log(obj.from);
      // console.log(obj.to);
      console.log(params);
      
      this.dataSource = new MatTableDataSource<PeriodicElement>( this.ELEMENT_DATA);
      this.GetPHCManpowerReportWithRestrictedAccess({
        params}
      );
      // this.GetPHCManpowerReport({
      //   params}
      // );
    }
  }

  submitdetails1() {

    this.ELEMENT_DATA_HR=[];
    this.HeaderData="";
    if (this.doctorForm.value) {
      let obj: any = {};
      let params = new HttpParams();
      params = params.append('year', moment(this.date.value).add(0, 'd').toDate().getFullYear());
      params = params.append('month', moment(this.date.value).add(0, 'd').toDate().getMonth()+1);

     
      // this.toDateValue = obj.to;
      // this.fromDateValue = obj.from;
      // console.log(obj.from);
      // console.log(obj.to);
      console.log(params);
      
      this.dataSourceHR = new MatTableDataSource<PeriodicElement>( this.ELEMENT_DATA_HR);
      this.GetHRManpowersAsync({
        params}
      );
      // this.GetPHCManpowerReport({
      //   params}
      // );
    }
  }
  public Download(value: any) {
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
      //      this.exportAsExcelFile(D, this.ReportName);
      // }

      const newArrayOfObj = this.dataSourceDownload.map(item => {
        return {
         'SL No.':item.srNo ,'Cluster':item.cluster,'District':item.districtName,'Block':item.blockName,'PHC':item.phcName,'Phase':item.phase,'Location':item?.location,'Working Days':item.workingDays,'Days Present':item.daysPresent,'Days Absent':item.daysAbsent};
      });

      this.exportAsExcelFile(newArrayOfObj, this.ReportName);

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
      fileName + ' '+ this.datepipe.transform(this.date.value,'MMM-yyyy')  + EXCEL_EXTENSION
    );
  }


  public DownloadHR(value: any) {
    console.log(value);
    if(this.ELEMENT_DATA_HR.length==0){
      this.loading=false
      this._sweetAlert.sweetAlert('No Data Available','error')
      return
    }
    if (value == 'Excel') {
      let count:number=1000000;
      // for (let index = 0;  this.dataSourceDownload.length>=index; index=index+count) {;
      //      var D = this.dataSourceDownload.slice(index,index+count);
      //      this.exportAsExcelFile(D, this.ReportName);
      // }

      const newArrayOfObj = this.dataSourceDownloadHR.map(item => {
        return {
         'SL No.':item.srNo ,'Cluster':item.cluster,'District':item.districtName,' District HR Name':item.employeeName,'Working Days':item.workingDays,' Present Days':item.daysPresent,' Absent Days':item.daysAbsent};
      });

      this.exportAsExcelFileHR(newArrayOfObj, this.ReportNameHR);

    }
  }
  public exportAsExcelFileHR(json: any[], excelFileName: string): void {
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(json);
    const workbook: XLSX.WorkBook = {
      Sheets: { data: worksheet },
      SheetNames: ['data'],
    };
    const excelBuffer: any = XLSX.write(workbook, {
      bookType: 'xlsx',
      type: 'array',
    });
    this.saveAsExcelFileHR(excelBuffer, excelFileName);
  }
  private saveAsExcelFileHR(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], { type: EXCEL_TYPE });
    FileSaver.saveAs(
      data,
      fileName +  ' '+ this.datepipe.transform(this.date.value,'MMM-yyyy') + EXCEL_EXTENSION
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
      tempObj.push(e.cluster)
      tempObj.push(e.districtName);
      tempObj.push(e.blockName);
      tempObj.push(e.phcName);
      tempObj.push(e.phase);
      tempObj.push(e?.location);
      tempObj.push(e.workingDays);
      tempObj.push(e.daysPresent);
      tempObj.push(e.daysAbsent);
      prepare.push(tempObj);
    });

    console.log(prepare)
    const doc = new jsPDF('l', 'pt', [1000, 1000]);
    doc.setFontSize(18);
    doc.text(this.ReportName, 11, 20);
    doc.setFontSize(11);
    doc.setTextColor(100);
    (doc as any).autoTable({
      head: [[
          'SL No.',
          'Cluster',
          'District',
          'Block',
          'PHC',
          'Phase',
          'Location',
          'Working Days',
          'Days Present',
          'Days Absent',
      ],
      ],
      body: prepare,
    });
    doc.save(this.ReportName + ' '+ this.datepipe.transform(this.date.value,'MMM-yyyy') + '.pdf');
  }
  downloadPdfHR() {
    if(this.ELEMENT_DATA_HR.length==0){
      this.loading=false
      this._sweetAlert.sweetAlert('No Data Available','error')
      return
    }
    var prepare = [];
    this.dataSourceDownloadHR.forEach((e) => {
      var tempObj = [];
      tempObj.push(e.srNo);
      tempObj.push(e.cluster)
      tempObj.push(e.districtName);
      // tempObj.push(e.blockName);
      tempObj.push(e.employeeName);
      // tempObj.push(e.phase);
      // tempObj.push(e?.location);
      tempObj.push(e.workingDays);
      tempObj.push(e.daysPresent);
      tempObj.push(e.daysAbsent);
      prepare.push(tempObj);
    });
    const doc = new jsPDF('l', 'pt', [1000, 1000]);
    doc.setFontSize(18);
    doc.text(this.ReportNameHR, 11, 20);
    doc.setFontSize(11);
    doc.setTextColor(100);
    (doc as any).autoTable({
      head: [[
          'SL No.',
          'cluster',
          'District',
          // 'Block',
          ' District HR Name',
          // 'Phase',
          // 'Location',
          'Working Days',
          ' Present  Days',
          ' Absent  Days',
      ],
      ],
      body: prepare,
    });
    doc.save(this.ReportNameHR + ' '+ this.datepipe.transform(this.date.value,'MMM-yyyy') + '.pdf');
  }
  changeTab(value)
  {
    if(value=='hrmanpower')
    {
      this.isHRReport=true
      this.displayedColumns= [
        'srNo',
        'cluster',
        'districtName',
        // 'blockName',
        'phcName',
        // 'phase',
        // 'location',
        'workingDays',
        'daysPresent',
        'daysAbsent',
    
      ];
    }
    else if(value=='manpower')
    {
      this.isHRReport=false
    this.displayedColumns= [
        'srNo',
        'cluster',
        'districtName',
        'blockName',
        'phcName',
        'phase',
        'location',
        'workingDays',
        'daysPresent',
        'daysAbsent',
    
      ];
    }
  }
}

export interface PeriodicElement {
  // slNo: number;
  // district: string;
  // block: string;
  // phc: string;
  // total: number;
  // generalPractice: number;
  // obstetricsAndGyne: number;
  // pediatrics: number;

  srNo: number;
  districtName: string;
  blockName: string;
  phcName: string;
  noOfDaysInMonth: number;
  workingDays: number;
  daysPresent: number;
  daysAbsent:number;


}



