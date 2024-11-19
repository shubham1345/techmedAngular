import {
  Component,
  OnInit,
  ViewChild,
  AfterViewInit,
  ElementRef
} from '@angular/core';

import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

import { HttpClient } from '@angular/common/http';
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
import { faClose, faFileExcel, faFilePdf } from '@fortawesome/free-solid-svg-icons';
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
import { parse } from '@fortawesome/fontawesome-svg-core';
import { SvcmainAuthserviceService } from 'src/app/services/services/svcmain-authservice.service';

const moment = _rollupMoment || _moment;


export const MY_FORMATS = {
  parse: {
    dateInput: 'MM/DD/YYYY',
  },
  display: {
    dateInput: 'MM/DD/YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};


@Component({
  selector: 'app-maindashboard-reportsummaryweekly',
  templateUrl: './maindashboard-reportsummaryweekly.component.html',
  styleUrls: ['./maindashboard-reportsummaryweekly.component.css'],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
})
export class MaindashboardReportsummaryweeklyComponent implements AfterViewInit {
  loading = false;
  ImagesHeader = environment.ImagesHeader
  public ngxLoadingAnimationTypes = ngxLoadingAnimationTypes;
  public config = {
    animationType: ngxLoadingAnimationTypes.none,
    backdropBorderRadius: '3px',
  };
  userObjFromToken: any;
  doctorForm: FormGroup;
  fromDateValue: Date;
  formControl: FormGroup;
  toDateValue: Date;
  specializationID: string;
  dataSourceDownload: any[];
  WeekList: any = [];
  ReportName: string;
  faFilePdf = faFilePdf;
  faFileExcel = faFileExcel;
  faClose = faClose;
  today: Date = new Date();
  d: Date = new Date();
  displayedColumns: string[] = [
    'slNo',
    'cluster',
    'district',
    'block',
    'phc',
    'phase',
    'total',
    'generalMedicine',
    'obstetricsAndGyne',
    'pediatrics',
  ];
  filterValues = {

    district: '',
    block: '',
    phc: '',
    total: '',
    generalMedicine: '',
    obstetricsAndGyne: '',
    pediatrics: '',
  };
  ELEMENT_DATA: PeriodicElement[] = [
    // {
    //   slNo: 1,
    //   district: 'district',
    //   block: 'block',
    //   phc: 'phc',
    //   total: 10,
    //   generalMedicine: 3,
    //   obstetricsAndGyne: 3,
    //   pediatrics: 1,
    // },
    // {
    //   slNo: 2,
    //   district: '2district',
    //   block: '2block',
    //   phc: '2phc',
    //   total: 20,
    //   generalMedicine: 7,
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
    private _sweetAlert: SvcmainAuthserviceService

  ) {


    //////////used to stop loader when their is error of 401 and 403////

    this._sweetAlert.getLoader().subscribe((res: any) => {
      this.loading = res
      console.log('med', this.loading)
    })

    /////////////////////////////////////////////////////////////


    this.d.setDate(this.d.getDate() - 6);
    this.doctorForm = new FormGroup({
      start: new FormControl((this.d)),
      end: new FormControl((new Date())),
      week: new FormControl(),
    });



    this.ReportName = 'Report summary weekly';


    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // debugger;
    let startDate = moment().startOf('isoWeek');
    let endDate = moment().endOf('isoWeek');
    var test = moment().day('Monday').isoWeek(1);
    var testS = moment().day('Sunday').isoWeek(1);
    var CurrentWeeknumber = moment(new Date()).isoWeek();
    console.log(CurrentWeeknumber);

    //var CurrentWeeknumber = moment(new Date().getFullYear()).week();
    //var CurrentWeeknumber = moment(new Date().getFullYear()-1).week();
    //CurrentWeeknumber=12;
    if (CurrentWeeknumber >= 13) {
      let CurrentWeeknumberForYear: number;
      CurrentWeeknumberForYear = CurrentWeeknumber;
      for (let index = 13; index > 0; index--, CurrentWeeknumberForYear--) {
        //print all week
        this.WeekList.push(moment().day('Monday').isoWeek(CurrentWeeknumberForYear).format('DD-MM-YYYY') + ' To ' + moment().day('Sunday').isoWeek(CurrentWeeknumberForYear).add(6, 'days').format('DD-MM-YYYY'));
      }
    }
    else {
      let MaxWeek: number = 13;
      for (let index = CurrentWeeknumber; index > 0; index--, CurrentWeeknumber--) {
        //print all week
        this.WeekList.push(moment().day('Monday').isoWeek(CurrentWeeknumber).format('DD-MM-YYYY') +' To ' +moment().day('Monday').isoWeek(CurrentWeeknumber).add(6, 'days').format('DD-MM-YYYY'));
        MaxWeek--;
      }
     var d = new Date();
      var pastYear = d.getFullYear() - 1;
      d.setFullYear(pastYear);
      d.setMonth(11)
     let weeksInLastYear = moment(d).weeksInYear()
      var date = moment(d)

      for (MaxWeek; MaxWeek > 0; MaxWeek--, weeksInLastYear--) {
        this.WeekList.push(moment(date).day('Monday').isoWeek(weeksInLastYear).format('DD-MM-YYYY') + ' To ' + moment(date).day('Sunday').isoWeek(weeksInLastYear).format('DD-MM-YYYY'));

      }
      this.WeekList = [...new Set(this.WeekList)]
    }
    //   thisyearWeek:Number:10;
    //   lastyearWeek:Number:10;

    this.doctorForm = new FormGroup({
      start: new FormControl((this.d)),
      end: new FormControl((new Date())),
      week: new FormControl(this.WeekList[0]),
    });
    // this.submitdetails();

    //  console.log(this.WeekList);
    //  console.log(d);
    //  console.log(moment(d).weeksInYear());
    //  console.log('Start Date:' + startDate.format('MM/DD/YYYY'));
    //  console.log('End Date:' + endDate.format('MM/DD/YYYY'));
    //  console.log('Monday:' + test.format('MM/DD/YYYY'));
    //  console.log('Sunday:' + testS.format('MM/DD/YYYY'));
    //  console.log('weeknumber:' + CurrentWeeknumber);
    //  console.log('PriviousYear:' + new Date().setFullYear(new Date().getFullYear() - 1));


    this.dataSourceDownload = this.ELEMENT_DATA;
    // this.GetDashboardConsultation({
    //   specializationID: this.specializationID,
    //   fromDate: new Date(),
    //   toDate: new Date(),
    // });
    //////////////////////////////////////////////////////////////
    this.dataSource.filterPredicate = ((data, filter) => {
      const b =
        !filter.district ||
        data.district.toLowerCase().includes(filter.district);
      const c =
        !filter.block || data.block.toLowerCase().includes(filter.block);
      const d = !filter.phc || data.phc.toLowerCase().includes(filter.phc);
      const e = !filter.total || data.total === filter.total;
      const f = !filter.generalMedicine || data.generalMedicine === filter.generalMedicine;
      const g = !filter.obstetricsAndGyne || data.obstetricsAndGyne === filter.obstetricsAndGyne;
      const h = !filter.pediatrics || data.pediatrics === filter.pediatrics;

      //const c = !filter.symbol || data.symbol === filter.symbol;
      return b && c && d && e && f && g && h;
    }) as (PeriodicElement, string) => boolean;

    this.formControl = formBuilder.group({
      district: '',
      block: '',
      phc: '',
      total: '',
      generalMedicine: '',
      obstetricsAndGyne: '',
      pediatrics: '',
      phase: '',
      cluster: ''
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
  }
  @ViewChild('content', { static: false }) content: ElementRef;

  ListOfCompletedConsultation: any;
  GetDashboardReportSummaryWithRestrictedAccess(params: any) {
    this.loading = true
    this.userObjFromToken = this.svcLocalstorage.GetData(
      environment.AuthTokenKeyLSKey
    );
    // GetDashboardReportSummary(params: any) {
    //   this.loading=true
    //   this.userObjFromToken = this.svcLocalstorage.GetData(
    //     environment.AuthTokenKeyLSKey
    //   );
    if (this.userObjFromToken) {
      this.Svc_dashboardService.GetDashboardReportSummaryWithRestrictedAccess(params).subscribe(
        (data: any) => {
          this.loading = false
          console.log(data, 'this is GetDashboardReportSummaryWithRestrictedAccess data');
          this.ELEMENT_DATA = data;
          this.dataSourceDownload = this.ELEMENT_DATA;
          console.log(
            this.ELEMENT_DATA,
            'this is GetDashboardReportSummaryWithRestrictedAccess data'
          );
          this.dataSource = new MatTableDataSource<PeriodicElement>(
            this.ELEMENT_DATA
          );
          this.dataSource.sort = this.sort;
          this.dataSource.paginator = this.paginator;
          this.totalnoofconsultation()


          this.dataSource.filterPredicate = ((data, filter) => {
            const b =
              !filter.district ||
              data.district.toLowerCase().includes(filter.district.toLowerCase());
            const c =
              !filter.block || data.block.toLowerCase().includes(filter.block.toLowerCase());
            const d = !filter.phc || data.phc.toLowerCase().includes(filter.phc.toLowerCase());
            const e = !filter.total || data.total === filter.total.toLowerCase();
            const f = !filter.generalMedicine || data.generalMedicine === filter.generalMedicine.toLowerCase();
            const g = !filter.obstetricsAndGyne || data.obstetricsAndGyne === filter.obstetricsAndGyne.toLowerCase();
            const h = !filter.pediatrics || data.pediatrics === filter.pediatrics.toLowerCase();
            const i = !filter.phase || data.phase.toLowerCase().includes(filter.phase.toLowerCase());
            const j = !filter.cluster || data.cluster.toLowerCase().includes(filter.cluster.toLowerCase());

            //const c = !filter.symbol || data.symbol === filter.symbol;
            return b && c && d && e && f && g && h && i && j;
          }) as (PeriodicElement, string) => boolean;
        },
        (error) => {
          this.loading = false;
        }
      );
      //     this.Svc_dashboardService.GetDashboardReportSummary(params).subscribe(
      //       (data: any) => {
      //         this.loading=false
      //         console.log(data, 'this is GetDashboardReportSummary data');
      //         this.ELEMENT_DATA = data;
      //         this.dataSourceDownload = this.ELEMENT_DATA;
      //         console.log(
      //           this.ELEMENT_DATA,
      //           'this is GetDashboardReportSummary data'
      //         );
      //         this.dataSource = new MatTableDataSource<PeriodicElement>(
      //           this.ELEMENT_DATA
      //         );
      //         this.dataSource.sort = this.sort;
      //         this.dataSource.paginator = this.paginator;
      // this.totalnoofconsultation() 


      //         this.dataSource.filterPredicate = ((data, filter) => {
      //     const b =
      //       !filter.district ||
      //       data.district.toLowerCase().includes(filter.district.toLowerCase());
      //     const c =
      //       !filter.block || data.block.toLowerCase().includes(filter.block.toLowerCase());
      //     const d = !filter.phc || data.phc.toLowerCase().includes(filter.phc.toLowerCase());
      //     const e = !filter.total || data.total === filter.total.toLowerCase();
      //     const f = !filter.generalMedicine || data.generalMedicine === filter.generalMedicine.toLowerCase();
      //     const g = !filter.obstetricsAndGyne || data.obstetricsAndGyne === filter.obstetricsAndGyne.toLowerCase();
      //     const h = !filter.pediatrics || data.pediatrics === filter.pediatrics.toLowerCase();

      //     //const c = !filter.symbol || data.symbol === filter.symbol;
      //     return  b && c && d && e && f && g && h;
      //   }) as (PeriodicElement, string) => boolean;
      //       },
      //       (error)=>{
      //         this.loading=false;
      //       }
      //     );
    }
  }
  obj: any = {};
  dateRangeChange(dateRangeStart: HTMLInputElement, dateRangeEnd: HTMLInputElement) {
    console.log(dateRangeStart.value);
    console.log(dateRangeEnd.value);
    this.obj.to = this.datepipe.transform(new Date(dateRangeEnd.value), 'yyyy-MM-dd');
    this.obj.from = this.datepipe.transform(new Date(dateRangeStart.value), 'yyyy-MM-dd');

  }

  IsValidDayes: boolean;
  submitdetails() {

    this.consultation = 0
    this.generalMedicine = 0
    this.obstetricsAndGyne = 0
    this.pediatrics = 0

    //this.loading=true
    this.ELEMENT_DATA = [];
    if (this.doctorForm.value) {
      console.log(this.doctorForm.get('week').value);
      console.log(moment('13-07-2022', 'DD-MM-YYYY').format('YYYY-MM-DD'))
      var splitted = this.doctorForm.get('week').value;
      var splittedarr = String(splitted).split("To");
      console.log(splittedarr);
      console.log(String(splittedarr[0]).trim());
      console.log(String(splittedarr[1]).trim());

      this.obj.from = moment(String(splittedarr[0]).trim(), 'DD-MM-YYYY').format('YYYY-MM-DD');
      this.obj.to = moment(String(splittedarr[1]).trim(), 'DD-MM-YYYY').format('YYYY-MM-DD');
      this.dataSource = new MatTableDataSource<PeriodicElement>(this.ELEMENT_DATA);

      this.IsValidDayes = this.utilsService.weekDiff(this.obj.to, this.obj.from);
      if (!this.IsValidDayes) {
        this.GetDashboardReportSummaryWithRestrictedAccess({
          fromDate: this.obj.from,
          toDate: this.obj.to,
        });
        // this.GetDashboardReportSummary({
        //   fromDate: this.obj.from,
        //   toDate: this.obj.to,
        // });
      }
      else {

      }

      // obj.specializationId = this.doctorForm.get('spclztn').value;
      // this.validateAllFormFields(this.doctorForm);
    }
  }
  consultation: any;
  generalMedicine: any;
  obstetricsAndGyne: any;
  pediatrics: any;


  totalnoofconsultation() {
    // debugger
    let totalNoConsultation = {
      noOfConsultation: 0,
      noOfGeneralMedicine: 0,
      noOfObsGyne: 0,
      noOfPediatrice: 0
    }
    this.dataSource.data.map((report, index) => {
      this.consultation = totalNoConsultation['noOfConsultation'] += report.total,


        console.log(this.consultation, ' this.consultation');

      this.generalMedicine = totalNoConsultation['noOfGeneralMedicine'] += report.generalMedicine,
        this.obstetricsAndGyne = totalNoConsultation['noOfObsGyne'] += report.obstetricsAndGyne,
        this.pediatrics = totalNoConsultation['noOfPediatrice'] += report.pediatrics

    });

    console.log(totalNoConsultation, 'ttt');
    //  if( data== 'consultation'){
    //   return  this.consultation

    //  }
    //  else if(data == 'General'){
    //  return this.generalMedicine
    //  }
    //  else if ( data == 'Obstetrics')
    //  {
    //   return this. obstetricsAndGyne
    //  }
    //  else if ( data == 'Pediatrics'){
    //   return this.pediatrics
    //  }
  }

  public Download(value: any) {
    console.log(value);
    if (this.ELEMENT_DATA.length == 0) {
      this.loading = false
      this._sweetAlert.sweetAlert('No Data Available', 'error')
      return
    }
    if (value == 'Excel') {
      let count: number = 1000000;
      // for (let index = 0;  this.dataSourceDownload.length>=index; index=index+count) {;
      //      var D = this.dataSourceDownload.slice(index,index+count);
      //      this.exportAsExcelFile(D, this.ReportName);
      // }

      const newArrayOfObj = this.dataSourceDownload.map((item, index) => {
        return {
          'SL No.': item.slNo, 'Cluster': item.cluster, 'District': item.district, 'Block': item.block, 'PHC': item.phc, 'Phase': item.phase, 'No. Of Consultation': item.total, 'General Medicine': item.generalMedicine,
          'Obstetrics And Gyne': item.obstetricsAndGyne, 'Pediatrics': item.pediatrics
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
      fileName + ' ' + this.doctorForm.get('week').value + EXCEL_EXTENSION
    );
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
  downloadPdf() {
    if (this.ELEMENT_DATA.length == 0) {
      this.loading = false
      this._sweetAlert.sweetAlert('No Data Available', 'error')
      return
    }
    var prepare = [];
    this.dataSourceDownload.forEach((e) => {
      var tempObj = [];
      tempObj.push(e.slNo);
      tempObj.push(e.cluster);
      tempObj.push(e.district);
      tempObj.push(e.block);
      tempObj.push(e.phc);
      tempObj.push(e.phase);
      tempObj.push(e.total);
      tempObj.push(e.generalMedicine);
      tempObj.push(e.obstetricsAndGyne);
      tempObj.push(e.pediatrics);
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
        'Cluster',
        'District',
        'Block',
        'PHC',
        'Phase',
        'No. of consultation',
        'General Practice',
        'Obstetrics And Gyne',
        'Pediatrics',

      ],
      ],
      body: prepare,
    });
    doc.save(this.ReportName + ' ' + this.doctorForm.get('week').value + '.pdf');
  }

}
export interface PeriodicElement {
  slNo: number;
  district: string;
  block: string;
  phc: string;
  total: number;
  generalMedicine: number;
  obstetricsAndGyne: number;
  pediatrics: number;
}

export interface DateElement {
  id: 1
  Value: "PHC Chandangaon"

}
