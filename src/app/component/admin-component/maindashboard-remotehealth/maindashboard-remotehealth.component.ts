import {
  Component,
  OnInit,
  ViewChild,
  AfterViewInit,
  ElementRef,
  Inject,
  LOCALE_ID
} from '@angular/core';

import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTable, MatTableDataSource } from '@angular/material/table';

import { HttpClient, HttpParams } from '@angular/common/http';
import { DatePipe ,formatDate} from '@angular/common';
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



import {MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS} from '@angular/material-moment-adapter';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';
import {MatDatepicker} from '@angular/material/datepicker';
import * as _moment from 'moment';
// tslint:disable-next-line:no-duplicate-imports
import {default as _rollupMoment, Moment} from 'moment';
import { faClose, faFileExcel, faFilePdf } from '@fortawesome/free-solid-svg-icons';
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

@Component({
  selector: 'app-maindashboard-remotehealth',
  templateUrl: './maindashboard-remotehealth.component.html',
  styleUrls: ['./maindashboard-remotehealth.component.css'],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    },
    {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS},
  ],
})
export class MaindashboardRemotehealthComponent implements AfterViewInit {
  loading = false;

  ImagesHeader = environment.ImagesHeader
  public ngxLoadingAnimationTypes = ngxLoadingAnimationTypes;
  public config = {
    animationType: ngxLoadingAnimationTypes.none,
    backdropBorderRadius: '3px',
  };



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
  displayedColumns: string[] = [
    'srNo',
    'date',
    'workingHours',
    'workingTime',
    'serverUpTime',
    'serverDownTime',
    'downTimings',
    'availability',
  
  ];
  filterValues = {
    // srNo: '',
  date:'',
  WorkingHours: '',
  WorkingTime: '',
  ServerUpTime: '',
  ServerDownTime:'',
  DownTimings: '',
  Availability: '',

  };
  @ViewChild(MatTable, { static: true }) table: MatTable<any>;
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
  dataSource = new MatTableDataSource<PeriodicElement>(this.ELEMENT_DATA);

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
    private _sweetAlert:SvcmainAuthserviceService,
    @Inject(LOCALE_ID) public locale: string
   
  ) {



                //////////used to stop loader when their is error of 401 and 403////

                this._sweetAlert.getLoader().subscribe((res:any)=>{
                  this.loading=res
                  console.log('med',this.loading)
                })
            
                /////////////////////////////////////////////////////////////

    this.doctorForm = new FormGroup({
      todate: new FormControl(moment(new Date())),
      fromdate: new FormControl(moment(new Date())),
      //date: new FormControl(''),
    });

    this.ReportName = 'Server Health Report';
    let params = new HttpParams();
    params = params.append('fromDate', this.datepipe.transform(new Date(), 'yyyy-MM-dd'));
    params = params.append('toDate', this.datepipe.transform(new Date(), 'yyyy-MM-dd'));

    // this.GetDashboardSystemHealthReport({
    //   params,
    // });
    this.dataSourceDownload = this.ELEMENT_DATA;
   
 
    //////////////////////////////////////////////////////////////
  //   this.dataSource.filterPredicate = ((data, filter) => {
  //     //const a = !filter.srNo || data.srNo === filter.srNo;
  //     const b =
  //       !filter.districtName ||
  //       data.districtName.toLowerCase().includes(filter.districtName);
  //     const c =
  //       !filter.blockName || data.blockName.toLowerCase().includes(filter.blockName);
  //     const d = !filter.phcName || data.phcName.toLowerCase().includes(filter.phcName);
     
  //     const e = !filter.patientName || data.patientName === filter.patientName;
  //     const f = !filter.mobileNo || data.mobileNo === filter.mobileNo;
  //     const g = !filter.doctor || data.doctor === filter.doctor;
  //     const h = !filter.appointmentTime || data.appointmentTime === filter.appointmentTime;
  //     const i = !filter.consultStatus || data.consultStatus === filter.consultStatus;
  //     const j = !filter.doctorAvailable || data.doctorAvailable === filter.doctorAvailable;
  //     const k = !filter.patientAvailable || data.patientAvailable === filter.patientAvailable;
  //     return   b && c && d &&  f && g && h&& i&& j&& k;
  //   }) as (PeriodicElement, string) => boolean;

  //   this.formControl = formBuilder.group({
  //     //srNo: '',
  //     date:'',
  // WorkingHours: '',
  // WorkingTime: '',
  // ServerUpTime: '',
  // ServerDownTime:'',
  // DownTimings: '',
  // Availability: '',
     
  //   });
    // this.formControl.valueChanges.subscribe((value) => {
    //   const filter = { ...value, name: value.name } as string;
    //   this.dataSource.filter = filter;
    // });
  }

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  //@ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;

    // this.doctorForm = this.fb.group({
    //   todate: ['', [Validators.required]],
    //   fromdate: ['', [Validators.required]],
    // });
    
  }
  @ViewChild('content', { static: false }) content: ElementRef;

  ListOfCompletedConsultation: any;
  isValid:boolean=false;
  GetDashboardSystemHealthReport(params: any) {
    this.loading=true;
    this.userObjFromToken = this.svcLocalstorage.GetData(
      environment.AuthTokenKeyLSKey
    );
    if (this.userObjFromToken) {
      this.Svc_dashboardService.GetDashboardSystemHealthReport(params).subscribe(
        (data: any) => {
          this.loading=false
          console.log(data, 'this is GetDashboardSystemHealthReport data');
          this.ELEMENT_DATA = data
          // data.forEach((res:any)=>{
          //   res['workingTime']=this.datepipe.transform(new Date(res.workingTime),'mm:ss')
          // });
          this.dataSourceDownload = this.ELEMENT_DATA;
          this.isValid=true;

          this.dataSource = new MatTableDataSource<PeriodicElement>(
            this.ELEMENT_DATA
          );
          this.dataSource.sort = this.sort;
          this.dataSource.paginator = this.paginator;
this.totalnoofconsultation()

          // this.dataSource.filterPredicate = ((data, filter) => {
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
          //   return  b && c && d &&  f && g && h&& i&& j&& k;
          // }) as (PeriodicElement, string) => boolean;
      
      
        },
        (error)=>{
          this.loading=false;
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
  ShowErrorMessage: boolean;
  ValidationMessage:string;
  submitdetails() {
 //   this.loading=true;

 this.up=0;
 this.availability=0;
 this.down=0
 this.work=0

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

      let params = new HttpParams();
      params = params.append('fromDate', obj.from.format("YYYY-MM-DD"));
      params = params.append('toDate', obj.to.format("YYYY-MM-DD"));

      console.log(params);
      this.dataSource = new MatTableDataSource<PeriodicElement>( this.ELEMENT_DATA);
      this.dataSource.paginator=this.paginator
     
      if (this.utilsService.monthDiffInDay(obj.to, obj.from)>92) {
        this.ValidationMessage="Please select date gap for 92 day maximum duration!"
        this.ShowErrorMessage=true;
      }
      else if(this.utilsService.monthDiffInDay(obj.to, obj.from)<0)
      {
        this.ValidationMessage="From Date should be less than or equal to To Date.";
        this.ShowErrorMessage=true;
      }
      if(!this.ValidationMessage)
      {
        this.GetDashboardSystemHealthReport({
          params,
        });
      } 
      else{
        this.dataSource = new MatTableDataSource<PeriodicElement>( this.ELEMENT_DATA);
        this.dataSource.paginator=this.paginator

      } 
    }
  }
  
  availability :any;
  serverUpTime: any;
  serverDownTime: any;
  workingTime : any;

  up:any;
  down:any;
  work:any



  totalnoofconsultation( ) {
    //debugger

    let totalNoConsultation = {
      noOfConsultation: 0,
      serverUpTime: 0,
      serverDownTime: 0,
      workingTime: 0
    }
      this.dataSource.data.map((report, index) => {
      //  this.availability=totalNoConsultation['noOfConsultation'] += report.availability,
       
       
      // console.log( this.availability,' this.consultation');
      
        this.serverUpTime = totalNoConsultation['serverUpTime'] += report.serverUpTimeSS,
        
        // let serverUpTime = 1439
// console.log(
//     moment.unix(this.serverUpTime).utc().format('H [hours,] m [minutes and] s [seconds]')
// )

       this.serverDownTime= totalNoConsultation['serverDownTime'] += report.serverDownTimeSS,
        this.workingTime=totalNoConsultation['workingTime'] += report.workingTimeSS
        
    });
    this.availability= Math.floor((this.serverUpTime*100) / this.workingTime)


    function secondsToHms(d) {
     var time = Number(d);
      //  var h = Math.floor(d / 3600);
      // var m = Math.floor(d % 3600 / 60);
      // var s = Math.floor(d % 3600 % 60);
  
      const minutes = Math.floor(time / 60)
      const seconds = time - minutes * 60;
  
      return minutes+':'+seconds
  
    //  var hDisplay = h > 0 ? (h<10?"0":"")+ h + (h == 1 ? " : " : " : ") : "00:";
      // var mDisplay = m > 0 ?(m<10?"0":"")+ m + (m == 1 ? " : " : " : ") : "00: ";
      // var sDisplay = s > 0 ?(s<10?"0":"")+s + (s == 1 ? " " : " ") : "00";
      // return hDisplay + mDisplay + sDisplay;
  }
  console.log(secondsToHms(this.workingTime),'this.workingTime');

  
 this.up =secondsToHms(this.serverUpTime)
 this.down =secondsToHms(this.serverDownTime)
 this.work =secondsToHms(this.workingTime)
   
    console.log(totalNoConsultation , 'ttt');
//  if( data== 'availability'){
//   return  this.availability

//  }
//  else if(data == 'serverUpTime'){
//  return this.up
//  }
//  else if ( data == 'serverDownTime')
//  {
//   return this. down
//  }
//  else if ( data == 'workingTime'){
//   return this.work
//  }
  }

  public Download(value: any) {
    if(this.ELEMENT_DATA.length==0){
      this.loading=false
      this._sweetAlert.sweetAlert('No Data Available','error')
      return
    }
    console.log(value);
    if (value == 'Excel') {
      let count:number=1000000;
      // for (let index = 0;  this.dataSourceDownload.length>=index; index=index+count) {;
      //      var D = this.dataSourceDownload.slice(index,index+count);
      //      this.exportAsExcelFile(D, this.ReportName);
      // }

      const newArrayOfObj = this.dataSourceDownload.map((item,index) => {
        return {
         'SL No.':item.srNo ,'Date':this.datepipe.transform(item.date,'dd-MM-yyyy'),'Working Hours(AM:PM)':item.workingHours,'Working Time(mm:ss)':item.workingTime,'Server Up Time(mm:ss)':item.serverUpTime,'Server Down Time(mm:ss)':item.serverDownTime,
         'Down Timing(Time)':item.downTimings,'Availability(%)':item.availability,
        };
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
      fileName +' '+ this.datepipe.transform(this.fromDateValue,'dd-MMM-yyyy')+
      ' to '+this.datepipe.transform(this.toDateValue,'dd-MMM-yyyy')+ EXCEL_EXTENSION
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
      tempObj.push(this.datepipe.transform(e.date,'dd-MM-yyyy'));
      tempObj.push(e.workingHours);
      tempObj.push(e.workingTime);
      tempObj.push(e.serverUpTime);
      tempObj.push(e.serverDownTime);
      tempObj.push(e.downTimings);
      tempObj.push(e.availability);
     
      
      prepare.push(tempObj);
    });
    const doc = new jsPDF('l', 'pt', [1000, 1000]);
    doc.setFontSize(18);
    doc.text(this.ReportName, 11, 20);
    doc.setFontSize(11);
    doc.setTextColor(100);
    (doc as any).autoTable({
      head: [[
          'SL No.',
          'Date',
          'Working Hours(AM:PM)',
          'Working Time(mm:ss)',
          'Server UpTime(mm:ss)',
          'Server DownTime(mm:ss)',
          'Down Timings(Time)',
          'Availability',
      
      ],
      ],
      body: prepare,
    });
    doc.save(this.ReportName +' '+
    this.datepipe.transform(this.fromDateValue,'dd-MMM-yyyy')+
    ' to '+this.datepipe.transform(this.toDateValue,'dd-MMM-yyyy')+'.pdf');
  }

}
export interface PeriodicElement {
  srNo: number;
  date: Date;
  workingHours: string;
  workingTime: string;
  serverUpTime: string;
  serverDownTime: string;
  downTimings: string;
  availability: number;
  workingTimeSS: number;
    serverUpTimeSS: number;
    serverDownTimeSS:number
}


