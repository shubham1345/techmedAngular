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
import { ngxLoadingAnimationTypes } from 'ngx-loading';
import { SvcmainAuthserviceService } from 'src/app/services/services/svcmain-authservice.service';

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
  selector: 'app-maindashboard-doctoravailability',
  templateUrl: './maindashboard-doctoravailability.component.html',
  styleUrls: ['./maindashboard-doctoravailability.component.css'],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    },
    {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS},
  ],
})
export class MaindashboardDoctoravailabilityComponent implements AfterViewInit {

  public ngxLoadingAnimationTypes = ngxLoadingAnimationTypes;
  public config = {
    animationType: ngxLoadingAnimationTypes.none,
    backdropBorderRadius: '3px',
  };

  loading:boolean=false

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
    'specialization',
    'doctor',
    'qualification',
    'hub',
    'approval-date',
    'date',
    'logedInTime',
    'firstConsultTime',
    'lastConsultTime',
    'logedoutTime',
    'AverageConsultationTime',
    'netLogIntime',
    'noOfConsultation',
  ];
  filterValues = {
  //srNo: '',
  specialization: '',
   doctor: '',
  // date: '',
  // logedInTime: '',
  // firstConsultTime: '',
  // lastConsultTime: '',
  // logedoutTime: '',
  // noOfConsultation: '',
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
    private utilsService:UtilsService,
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
      fromdate:new FormControl(moment(new Date())),
    });

    this.ReportName = 'Doctor Availability';
    // const queryString = window.location.search;
    // const urlParams = new URLSearchParams(queryString);
    // const code = urlParams.get('specializationID');
    // this.specializationID = code;
    // console.log(code);
    // if (this.specializationID == '1') {
    //   this.ReportName = 'General Practice';
    // }
    // if (this.specializationID == '2') {
    //   this.ReportName = 'Obstetrics and Gyne';
    // }
    // if (this.specializationID == '3') {
    //   this.ReportName = 'Pediatrics';
    // }

    this.dataSourceDownload = this.ELEMENT_DATA;
    let params = new HttpParams();
    params = params.append('fromDate', this.datepipe.transform(new Date(), 'yyyy-MM-dd'));
    params = params.append('toDate', this.datepipe.transform(new Date(), 'yyyy-MM-dd'));
    // this.GetDashboardDoctorAvailability({
    //   params,
    // });
    //////////////////////////////////////////////////////////////
    this.dataSource.filterPredicate = ((data, filter) => {
      const a = !filter.specialization || data.specialization.toLowerCase().includes(filter.specialization);
      const b =!filter.doctor.toLowerCase() ||data.doctor.toLowerCase().includes(filter.doctor.toLowerCase());
      return a && b ;
    }) as (PeriodicElement, string) => boolean;

    this.formControl = formBuilder.group({
      //srNo: '',
      specialization: '',
      doctor: '',
      // date: '',
      // logedInTime: '',
      // firstConsultTime: '',
      // lastConsultTime: '',
      // logedoutTime: '',
      // noOfConsultation: '',
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
  GetDashboardDoctorAvailability(params: any) {
    this.userObjFromToken = this.svcLocalstorage.GetData(
      environment.AuthTokenKeyLSKey
    );
    if (this.userObjFromToken) {
      this.loading=true
      this.Svc_dashboardService.GetDashboardDoctorAvailability(params).subscribe(
        (data: any) => {
          this.loading=false
          console.log(data, 'this is GetDashboardDoctorAvailability data');
          this.ELEMENT_DATA = data;
          this.dataSourceDownload = this.ELEMENT_DATA;
          console.log(
            this.ELEMENT_DATA,
            'this is GetDashboardDoctorAvailability data'
          );
          this.dataSource = new MatTableDataSource<PeriodicElement>(
            this.ELEMENT_DATA
          );
          this.dataSource.sort = this.sort;
          this.dataSource.paginator = this.paginator;

          this.dataSource.filterPredicate = ((data, filter) => {
            const a = !filter.specialization || data.specialization.toLowerCase().includes(filter.specialization.toLowerCase());
            const b =
              !filter.doctor ||
              data.doctor.toLowerCase().includes(filter.doctor.toLowerCase());
            return a && b ;
          }) as (PeriodicElement, string) => boolean;
      
        },(err:any)=>{
          this.loading=false
        }
      );
    }
  }
  ShowErrorMessage: boolean;
  ValidationMessage:string;
  submitdetails() {
    this.ValidationMessage="";
    this.ShowErrorMessage=false;
    this.ELEMENT_DATA=[];
    if (this.doctorForm.value) {
      let obj: any = {};
      obj.to = this.doctorForm.get('todate').value;
      obj.from = this.doctorForm.get('fromdate').value;
      this.toDateValue = obj.to;
      this.fromDateValue = obj.from;
      let params = new HttpParams();
      params = params.append('fromDate', obj.from.format("YYYY-MM-DD"));
      params = params.append('toDate', obj.to.format("YYYY-MM-DD"));
      this.dataSource = new MatTableDataSource<PeriodicElement>(
        null
      );
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
          this.GetDashboardDoctorAvailability({
            params
          });
        } 
      else{
        this.dataSource = new MatTableDataSource<PeriodicElement>( this.ELEMENT_DATA);
      
      } 
     
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
      let count:number=1000000;
      // for (let index = 0;  this.dataSourceDownload.length>=index; index=index+count) {;
      //      var D = this.dataSourceDownload.slice(index,index+count);
      //      this.exportAsExcelFile(D, this.ReportName);
      // }

      var newArray=this.dataSourceDownload.map((item:any)=>{
        return {
          'SL No.':item.srNo,'Specialization':item.specialization,'Doctor':item.doctor,'Qualification':item.qualification,'Hub':item?.hub,'Approval Date':this.datepipe.transform(item.approvaldate,'dd-MM-yyyy h:mm:ss a'),'Date':this.datepipe.transform(item.date,'dd-MMM-yyyy'),'Login Time':this.datepipe.transform(item.logedInTime,'h:mm a'),'First Consult Time':this.datepipe.transform(item.firstConsultTime,'h:mm a'),'Last Consult Time':this.datepipe.transform(item.lastConsultTime,'h:mm a'),'Logout Time':this.datepipe.transform(item.logedoutTime,'h:mm a'),'Average Consultation Time (m:m)':item.averageConsultation,'Net Login Time (h:h)':item.netLoginTimeInHours,'No. of Consultation':item.noOfConsultation
        }
      })
            this.exportAsExcelFile(newArray, this.ReportName);
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
    if(this.ELEMENT_DATA.length==0){
      this.loading=false
      this._sweetAlert.sweetAlert('No Data Available','error')
      return
    }
    var prepare = [];
    this.dataSourceDownload.forEach((e) => {
      var tempObj = [];
      tempObj.push(e.srNo);
      tempObj.push(e.specialization);
      tempObj.push(e.doctor);
      tempObj.push(e.qualification);
      tempObj.push(e?.hub);
      tempObj.push(this.datepipe.transform(e.approvaldate ,'dd-MM-yyyy h:mm:ss a'))
      tempObj.push(this.datepipe.transform(e.date,'dd-MMM-yyyy'));
      tempObj.push(this.datepipe.transform(e.logedInTime,'h:mm a'));
      tempObj.push(this.datepipe.transform(e.firstConsultTime,'h:mm a'));
      tempObj.push(this.datepipe.transform(e.lastConsultTime,'h:mm a'));
      tempObj.push(this.datepipe.transform(e.logedoutTime,'h:mm a'));
      tempObj.push(e.averageConsultation);
      tempObj.push(e.netLoginTimeInHours);
      tempObj.push(e.noOfConsultation);
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
          'Specialization',
          'Doctor',
          'Qualification',
          'HUB',
          'Approval Date',
          'Date',
          'Login Time',
          'First Consult Time',
          'Last Consult Time',
          'Logout Time',
          'Average Consultation Time (h:m:s)',
          'Net Login Time (h:h)',
          'No Of Consultation',
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
  specialization: string;
  doctor: string;
  date: Date;
  logedInTime: Date;
  firstConsultTime: Date;
  lastConsultTime: Date;
  logedoutTime: Date;
  noOfConsultation: number;
}

