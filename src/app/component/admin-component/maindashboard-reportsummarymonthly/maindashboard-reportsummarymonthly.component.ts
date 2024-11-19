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


import { MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatDatepicker } from '@angular/material/datepicker';
import * as _moment from 'moment';
// tslint:disable-next-line:no-duplicate-imports
import { default as _rollupMoment, Moment } from 'moment';
import { faClose, faFileExcel, faFilePdf } from '@fortawesome/free-solid-svg-icons';
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
  selector: 'app-maindashboard-reportsummarymonthly',
  templateUrl: './maindashboard-reportsummarymonthly.component.html',
  styleUrls: ['./maindashboard-reportsummarymonthly.component.css'],
  providers: [
    // `MomentDateAdapter` can be automatically provided by importing `MomentDateModule` in your
    // application's root module. We provide it at the component level here, due to limitations of
    // our example generation script.
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    },

    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
})
export class MaindashboardReportsummarymonthlyComponent implements AfterViewInit {
  loading = false;
  ImagesHeader = environment.ImagesHeader
  public ngxLoadingAnimationTypes = ngxLoadingAnimationTypes;
  public config = {
    animationType: ngxLoadingAnimationTypes.none,
    backdropBorderRadius: '3px',
  };

  date = new FormControl(moment());
  totalConsultation: any=0;
  totalMedicine: any=0;
  totalObstetric: any=0;
  totalPediatrics: any=0;
  

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
  today: Date = new Date();
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
    slNo: '',
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
    private _sweetAlert:SvcmainAuthserviceService

  ) {

                //////////used to stop loader when their is error of 401 and 403////

                this._sweetAlert.getLoader().subscribe((res:any)=>{
                  this.loading=res
                  console.log('med',this.loading)
                })
            
                /////////////////////////////////////////////////////////////

    this.doctorForm = new FormGroup({
      todate: new FormControl(''),
      fromdate: new FormControl(''),
      date: new FormControl(utilsService.SubtractMonths(1)),
    });

    this.ReportName = 'Report summary monthly';



    this.dataSourceDownload = this.ELEMENT_DATA;
    // this.GetDashboardReportSummaryMonthlyWithRestrictedAccess({
    //   month: utilsService.SubtractMonths(1).getMonth() + 1,
    //   year: utilsService.SubtractMonths(1).getFullYear(),
    // });
    // this.GetDashboardReportSummaryMonthly({
    //   month: utilsService.SubtractMonths(1).getMonth() + 1,
    //   year: utilsService.SubtractMonths(1).getFullYear(),
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


  SubtractMonths(numOfMonths: number, date = new Date()) {
    date.setMonth(date.getMonth() - numOfMonths);
    return date;
  }

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
  GetDashboardReportSummaryMonthlyWithRestrictedAccess(params: any) {
    this.loading=true
    this.userObjFromToken = this.svcLocalstorage.GetData(
      environment.AuthTokenKeyLSKey
    );
  // GetDashboardReportSummaryMonthly(params: any) {
  //   this.loading=true
  //   this.userObjFromToken = this.svcLocalstorage.GetData(
  //     environment.AuthTokenKeyLSKey
  //   );
    if (this.userObjFromToken) {
      this. totalConsultation=0;
      this. totalMedicine=0;
      this. totalObstetric=0;
      this. totalPediatrics=0
      this.Svc_dashboardService.GetDashboardReportSummaryMonthlyWithRestrictedAccess(params).subscribe(
        (data: any) => {
          this.loading=false;
          console.log(data, 'this is GetDashboardReportSummaryMonthlyWithRestrictedAccess data');
          this.ELEMENT_DATA = data;
          this.dataSourceDownload = this.ELEMENT_DATA;

          this.dataSource = new MatTableDataSource<PeriodicElement>(
            this.ELEMENT_DATA
          );
          this.dataSource.sort = this.sort;
          this.dataSource.paginator = this.paginator;

          this.dataSourceDownload.filter((res:any)=>{
            this. totalConsultation+=res.total;
            this. totalMedicine+=res.generalMedicine;
            this. totalObstetric+=res.obstetricsAndGyne;
            this. totalPediatrics+=res.pediatrics
           })


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
        (error) =>{
          this.loading=false;
        }


      );
      // this.Svc_dashboardService.GetDashboardReportSummaryMonthly(params).subscribe(
      //   (data: any) => {
      //     this.loading=false;
      //     console.log(data, 'this is GetDashboardReportSummaryMonthly data');
      //     this.ELEMENT_DATA = data;
      //     this.dataSourceDownload = this.ELEMENT_DATA;

      //     this.dataSource = new MatTableDataSource<PeriodicElement>(
      //       this.ELEMENT_DATA
      //     );
      //     this.dataSource.sort = this.sort;
      //     this.dataSource.paginator = this.paginator;

      //     this.dataSourceDownload.filter((res:any)=>{
      //       this. totalConsultation+=res.total;
      //       this. totalMedicine+=res.generalMedicine;
      //       this. totalObstetric+=res.obstetricsAndGyne;
      //       this. totalPediatrics+=res.pediatrics
      //      })


      //     this.dataSource.filterPredicate = ((data, filter) => {
      //       const b =
      //         !filter.district ||
      //         data.district.toLowerCase().includes(filter.district.toLowerCase());
      //       const c =
      //         !filter.block || data.block.toLowerCase().includes(filter.block.toLowerCase());
      //       const d = !filter.phc || data.phc.toLowerCase().includes(filter.phc.toLowerCase());
      //       const e = !filter.total || data.total === filter.total.toLowerCase();
      //       const f = !filter.generalMedicine || data.generalMedicine === filter.generalMedicine.toLowerCase();
      //       const g = !filter.obstetricsAndGyne || data.obstetricsAndGyne === filter.obstetricsAndGyne.toLowerCase();
      //       const h = !filter.pediatrics || data.pediatrics === filter.pediatrics.toLowerCase();

      //       //const c = !filter.symbol || data.symbol === filter.symbol;
      //       return b && c && d && e && f && g && h;
      //     }) as (PeriodicElement, string) => boolean;
      //   },
      //   (error) =>{
      //     this.loading=false;
      //   }


      // );
    }
  }
  
 
consultation :any;
generalMedicine: any;
obstetricsAndGyne: any;
pediatrics : any;


  totalnoofconsultation(data ) {
    //debugger
    let totalNoConsultation = {
      noOfConsultation: 0,
      noOfGeneralMedicine: 0,
      noOfObsGyne: 0,
      noOfPediatrice: 0
    }
      this.dataSource.data.map((report, index) => {
       this.consultation=totalNoConsultation['noOfConsultation'] += report.total,
       
       
      console.log( this.consultation,' this.consultation');
      
        this.generalMedicine = totalNoConsultation['noOfGeneralMedicine'] += report.generalMedicine,
       this.obstetricsAndGyne= totalNoConsultation['noOfObsGyne'] += report.obstetricsAndGyne,
        this.pediatrics=totalNoConsultation['noOfPediatrice'] += report.pediatrics
        
    });
   
    console.log(totalNoConsultation , 'ttt');
 if( data== 'consultation'){
  return  this.consultation

 }
 else if(data == 'General'){
 return this.generalMedicine
 }
 else if ( data == 'Obstetrics')
 {
  return this. obstetricsAndGyne
 }
 else if ( data == 'Pediatrics'){
  return this.pediatrics
 }
  }
  


  submitdetails() {
    this.loading=true;
    this.ELEMENT_DATA = [];
    if (this.doctorForm.value) {
      let obj: any = {};
      //obj.from = this.doctorForm.get('picker').value;
      obj.to = this.doctorForm.get('todate').value;
      obj.from = this.doctorForm.get('fromdate').value;
      this.toDateValue = obj.to;
      this.fromDateValue = obj.from;
      console.log(obj.from);
      console.log(obj.to);
      this.dataSource = new MatTableDataSource<PeriodicElement>(this.ELEMENT_DATA);

      this.GetDashboardReportSummaryMonthlyWithRestrictedAccess({
        month: moment(this.date.value).add(0, 'd').toDate().getMonth() + 1,
        year: moment(this.date.value).add(0, 'd').toDate().getFullYear(),
      });
      // this.GetDashboardReportSummaryMonthly({
      //   month: moment(this.date.value).add(0, 'd').toDate().getMonth() + 1,
      //   year: moment(this.date.value).add(0, 'd').toDate().getFullYear(),
      // });
      // obj.specializationId = this.doctorForm.get('spclztn').value;
      // this.validateAllFormFields(this.doctorForm);
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
      let count: number = 1000000;
      // for (let index = 0; this.dataSourceDownload.length >= index; index = index + count) {
      //   ;
      //   var D = this.dataSourceDownload.slice(index, index + count);
      //   this.exportAsExcelFile(D, this.ReportName);
      // }
      const newArrayOfObj = this.dataSourceDownload.map((item,index) => {
        return {
         'SL No.':item.slNo ,'Cluster':item.cluster,'District':item.district,'Block':item.block,'PHC':item.phc,'Phase':item.phase,'No. Of Consultation':item.total,'General Medicine':item.generalMedicine,
         'Obstetrics And Gyne':item.obstetricsAndGyne,'Pediatrics':item.pediatrics
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
      fileName + ' '+
      this.datepipe.transform(this.date.value,'MMM-yyyy') + EXCEL_EXTENSION
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
    var prepare = [];
    if(this.ELEMENT_DATA.length==0){
      this.loading=false
      this._sweetAlert.sweetAlert('No Data Available','error')
      return
    }
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
        'General Medicine',
        'Obstetrics And Gyne',
        'Pediatrics',
      ],
      ],
      body: prepare,
    });
    doc.save(this.ReportName +' '+
    this.datepipe.transform(this.date.value,'MMM-yyyy')+ '.pdf');
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
