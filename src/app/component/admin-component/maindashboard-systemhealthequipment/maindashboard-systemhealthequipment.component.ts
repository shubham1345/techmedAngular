import {
  Component,
  OnInit,
  ViewChild,
  AfterViewInit,
  ElementRef,
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
  selector: 'app-maindashboard-systemhealthequipment',
  templateUrl: './maindashboard-systemhealthequipment.component.html',
  styleUrls: ['./maindashboard-systemhealthequipment.component.css'],
  providers: [
    // `MomentDateAdapter` can be automatically provided by importing `MomentDateModule` in your
    // application's root module. We provide it at the component level here, due to limitations of
    // our example generation script.
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS],
    },

    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
})
export class MaindashboardSystemhealthequipmentComponent
  implements AfterViewInit
{
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

  chosenMonthHandler(
    normalizedMonth: Moment,
    datepicker: MatDatepicker<Moment>
  ) {
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
    'cluster',
    'districtName',
    'blockName',
    'phcName',
    'phase',
    'wokingDays',
    'otoscope',
    'dermascope',
    'fetalDoppler',
    'headphone',
    'webCam',
    'printer',
    'inverter',
    'computer',
  ];
  filterValues = {
    districtName: '',
    blockName: '',
    phcName: '',
    wokingDays: '',
    otoscope: '',
    dermascope: '',
    fetalDoppler: '',
    headphone: '',
    webCam: '',
    printer: '',
    inverter: '',
    computer: '',
    phase:''
  };
  ELEMENT_DATA: PeriodicElement[] = [
    // {
    //   slNo: 1,
    //   district: 'district',
    //   block: 'block',
    //   phc: 'phc',
    //   total: 10,
    //   generalPractice: 3,
    //   obstetricsAndGyne: 3,
    //   pediatrics: 1,
    // },
    // {
    //   slNo: 2,
    //   district: '2district',
    //   block: '2block',
    //   phc: '2phc',
    //   total: 20,
    //   generalPractice: 7,
    //   obstetricsAndGyne: 7,
    //   pediatrics: 6,
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
    private utilsService: UtilsService,
    private _sweetAlert:SvcmainAuthserviceService
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
      date: new FormControl(utilsService.SubtractMonths(1)),
    });

    this.ReportName = 'Equipment uptime report';

    this.dataSourceDownload = this.ELEMENT_DATA;
    let params = new HttpParams();
    params = params.append('month',utilsService.SubtractMonths(1).getMonth()+1);
    params = params.append('year',utilsService.SubtractMonths(1).getFullYear());
    // this.GetDashboardEquipmentUptimeReportWithRestrictedAccess({
    //   params,
    // });
    // this.GetDashboardEquipmentUptimeReport({
    //   params,
    // });
    // this.GetDashboardEquipmentUptimeHeaderReport({
    //   params,
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
      // const e = !filter.total || data.total === filter.total;
      // const f =
      //   !filter.generalPractice ||
      //   data.generalPractice === filter.generalPractice;
      // const g =
      //   !filter.obstetricsAndGyne ||
      //   data.obstetricsAndGyne === filter.obstetricsAndGyne;
      // const h = !filter.pediatrics || data.pediatrics === filter.pediatrics;

      // //const c = !filter.symbol || data.symbol === filter.symbol;
      return b && c && d &&e;
    }) as (PeriodicElement, string) => boolean;

    this.formControl = formBuilder.group({
      districtName: '',
      blockName: '',
      phcName: '',
      wokingDays: '',
      otoscope: '',
      dermascope: '',
      fetalDoppler: '',
      headphone: '',
      webCam: '',
      printer: '',
      inverter: '',
      computer: '',
      phase:'',
      cluster:''
    });
    this.formControl.valueChanges.subscribe((value) => {
      const filter = { ...value, name: value.name } as string;
      this.dataSource.filter = filter;
    });
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

    this.HeaderData ;
   // this.HeaderData.noOfPHC = 0;
    // this.HeaderData.workingDays = 0;
    // this.HeaderData.EquipmentAtPHC = 0;
    // this.HeaderData.ExpectedUpTime = 0;
    // this.HeaderData.ActualUpTime = 0;
    // this.HeaderData.Availability = 0;
  }
  @ViewChild('content', { static: false }) content: ElementRef;
  isValid: boolean = false;
  HeaderData: any;
  // noOfPHC :number ;
  // workingDays :number ;
  // EquipmentAtPHC :number ;
  // ExpectedUpTime :number ;
  // ActualUpTime :number ;
  // Availability:number ;
  ListOfCompletedConsultation: any;
  GetDashboardEquipmentUptimeReportWithRestrictedAccess(params: any) {
   
    this.userObjFromToken = this.svcLocalstorage.GetData(
      environment.AuthTokenKeyLSKey
    );
  // GetDashboardEquipmentUptimeReport(params: any) {
   
  //   this.userObjFromToken = this.svcLocalstorage.GetData(
  //     environment.AuthTokenKeyLSKey
  //   );
    if (this.userObjFromToken) {
      this.Svc_dashboardService.GetDashboardEquipmentUptimeReportWithRestrictedAccess(params).subscribe((data: any) => {
    
        console.log(data, 'this is GetDashboardEquipmentUptimeReportWithRestrictedAccess data');
        this.ELEMENT_DATA = data;
        this.isValid = true;
        this.dataSourceDownload = this.ELEMENT_DATA;
        console.log(
          this.ELEMENT_DATA,
          'this is GetDashboardEquipmentUptimeReportWithRestrictedAccess data'
        );
        this.dataSource = new MatTableDataSource<PeriodicElement>(
          this.ELEMENT_DATA
        );
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;

        this.dataSource.filterPredicate = ((data, filter) => {
          const b =
            !filter.districtName ||
            data.districtName.toLowerCase().includes(filter.districtName.toLowerCase());
          const c =
            !filter.blockName || data.blockName.toLowerCase().includes(filter.blockName.toLowerCase());
          const d = !filter.phcName || data.phcName.toLowerCase().includes(filter.phcName.toLowerCase());
          const e = !filter.total || data.total === filter.total;
          const f =
            !filter.generalPractice ||
            data.generalPractice === filter.generalPractice;
          const g =
            !filter.obstetricsAndGyne ||
            data.obstetricsAndGyne === filter.obstetricsAndGyne;
          const h = !filter.pediatrics || data.pediatrics === filter.pediatrics;
          const i = !filter.phase || data.phase.toLowerCase().includes(filter.phase.toLowerCase());
          const j=!filter.cluster||data.cluster.toLowerCase().includes(filter.cluster.toLowerCase())
          //const c = !filter.symbol || data.symbol === filter.symbol;
          return b && c && d&& e&&f&&g&& h &&i &&j;
        }) as (PeriodicElement, string) => boolean;
      }

      );
      // this.Svc_dashboardService.GetDashboardEquipmentUptimeReport(params).subscribe((data: any) => {
    
      //   console.log(data, 'this is GetDashboardEquipmentUptimeReport data');
      //   this.ELEMENT_DATA = data;
      //   this.isValid = true;
      //   this.dataSourceDownload = this.ELEMENT_DATA;
      //   console.log(
      //     this.ELEMENT_DATA,
      //     'this is GetDashboardEquipmentUptimeReport data'
      //   );
      //   this.dataSource = new MatTableDataSource<PeriodicElement>(
      //     this.ELEMENT_DATA
      //   );
      //   this.dataSource.sort = this.sort;
      //   this.dataSource.paginator = this.paginator;

      //   this.dataSource.filterPredicate = ((data, filter) => {
      //     const b =
      //       !filter.districtName ||
      //       data.districtName.toLowerCase().includes(filter.districtName.toLowerCase());
      //     const c =
      //       !filter.blockName || data.blockName.toLowerCase().includes(filter.blockName.toLowerCase());
      //     const d = !filter.phcName || data.phcName.toLowerCase().includes(filter.phcName.toLowerCase());
      //     const e = !filter.total || data.total === filter.total;
      //     const f =
      //       !filter.generalPractice ||
      //       data.generalPractice === filter.generalPractice;
      //     const g =
      //       !filter.obstetricsAndGyne ||
      //       data.obstetricsAndGyne === filter.obstetricsAndGyne;
      //     const h = !filter.pediatrics || data.pediatrics === filter.pediatrics;

      //     //const c = !filter.symbol || data.symbol === filter.symbol;
      //     return b && c && d&& e&&f&&g&& h ;
      //   }) as (PeriodicElement, string) => boolean;
      // }

      // );
    }
  }
  GetDashboardEquipmentUptimeHeaderReport(params: any) {
    this.loading=true
    this.userObjFromToken = this.svcLocalstorage.GetData(
      environment.AuthTokenKeyLSKey
    );
    if (this.userObjFromToken) {
      this.Svc_dashboardService.GetDashboardEquipmentHeaderReportWithRestrictedAccess(params).subscribe((data: any) => {
        this.loading=false
        console.log(data, 'this is GetDashboardEquipmentHeaderReportWithRestrictedAccess data');
         if(data.length ==0)
         {
//debugger;
    this.HeaderData[0].noOfPHC = 0;
    this.HeaderData[0].workingDays = 0;
    this.HeaderData[0].equipmentAtPHC = 0;
    this.HeaderData[0].expectedUpTime = 0;
    this.HeaderData[0].actualUpTime = 0;
    this.HeaderData[0].availability = 0;
    //this.isValid = false;
         }
         else{
          this.HeaderData = data;
          this.isValid = true;
         }
       
      },
      (error)=>{
        this.loading=false
      }

      );
//       this.Svc_dashboardService.GetDashboardEquipmentHeaderReport(params).subscribe((data: any) => {
//         this.loading=false
//         console.log(data, 'this is GetDashboardEquipmentHeaderReport data');
//          if(data.length ==0)
//          {
// //debugger;
//     this.HeaderData[0].noOfPHC = 0;
//     this.HeaderData[0].workingDays = 0;
//     this.HeaderData[0].equipmentAtPHC = 0;
//     this.HeaderData[0].expectedUpTime = 0;
//     this.HeaderData[0].actualUpTime = 0;
//     this.HeaderData[0].availability = 0;
//     //this.isValid = false;
//          }
//          else{
//           this.HeaderData = data;
//           this.isValid = true;
//          }
       
//       },
//       (error)=>{
//         this.loading=false
//       }

//       );
    }
  }

  submitdetails() {
    this.loading=true;
    this.ELEMENT_DATA=[];
    if (this.doctorForm.value) {
      let obj: any = {};
     
      let params = new HttpParams();
      params = params.append(
        'month',
        moment(this.date.value).add(0, 'd').toDate().getMonth() + 1
      );
      params = params.append(
        'year',
        moment(this.date.value).add(0, 'd').toDate().getFullYear()
      );

      this.dataSource = new MatTableDataSource<PeriodicElement>( this.ELEMENT_DATA);

      this.GetDashboardEquipmentUptimeReportWithRestrictedAccess({
        params,
      });
      // this.GetDashboardEquipmentUptimeReport({
      //   params,
      // });
      this.GetDashboardEquipmentUptimeHeaderReport({
        params,
      });
    }
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
         'SL No.':item.srNo ,'Cluster':item.cluster,'District':item.districtName,'Block':item.blockName,'PHC':item.phcName,'Phase':item.phase,'Working Days':item.wokingDays,
         'Otoscope':item.otoscope,'Dermascope':item.dermascope,'FetalDoppler':item.fetalDoppler,
         'HeadPhone':item.headphone,'WebCam':item.webCam,'Printer':item.printer,'Inverter':item.inverter,'Computer':item.computer
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
      fileName +  ' '+ this.datepipe.transform(this.date.value,'MMM-yyyy')  + EXCEL_EXTENSION
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
      tempObj.push(e.cluster);
      tempObj.push(e.districtName);
      tempObj.push(e.blockName);
      tempObj.push(e.phcName);
      tempObj.push(e.phase);
      
      tempObj.push(e.wokingDays);
      tempObj.push(e.otoscope);
      tempObj.push(e.dermascope);
      tempObj.push(e.fetalDoppler);
      tempObj.push(e.headphone);
      tempObj.push(e.webCam);
      tempObj.push(e.printer);
      tempObj.push(e.inverter);
      tempObj.push(e.computer);
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
          'Woking Days',
          'Otoscope',
          'Dermascope',
          'FetalDoppler',
          'Headphone',
          'WebCam',
          'Printer',
          'Inverter',
          'Computer',
        ],
      ],
      body: prepare,
    });
    doc.save(this.ReportName + ' '+ this.datepipe.transform(this.date.value,'MMM-yyyy') + '.pdf');
  }
}
export interface PeriodicElement {
  srNo: number;
  districtName: string;
  blockName: string;
  phcName: string;
  wokingDays: number;
  otoscope: number;
  dermascope: number;
  fetalDoppler: number;
  headphone: number;
  webCam: number;
  printer: number;
  inverter: number;
  computer: number;
}
