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
  selector: 'app-maindashboard-diseaseprofileagewise',
  templateUrl: './maindashboard-diseaseprofileagewise.component.html',
  styleUrls: ['./maindashboard-diseaseprofileagewise.component.css'],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    },
    {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS},
  ],
})
export class MaindashboardDiseaseprofileagewiseComponent implements AfterViewInit {

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
    'age',
    'disease',
    'occurrence',
    

  ];
  filterValues = {

    
    age: '',
    disease:'',
    occurrence: '',

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
      fromdate: new FormControl(moment(new Date())),
      //date: new FormControl(''),
    });

    this.ReportName = 'Disease Profile Age Wise';
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
    // this.GetDashboardDiseaseAgeWiseWithRestrictedAccess({
    //   params,
    // });
    // this.GetDashboardDiseaseAgeWise({
    //   params,
    // });
    //////////////////////////////////////////////////////////////
    this.dataSource.filterPredicate = ((data, filter) => {
      const a = !filter.occurrence || data.occurrence === filter.occurrence;
      const b = !filter.age || data.age===filter.age;
      const c = !filter.disease || data.disease.toLowerCase().includes(filter.disease);
      return a && b && c;
    }) as (PeriodicElement, string) => boolean;

    this.formControl = formBuilder.group({
  
      
       age: '',
       disease:'',
       occurrence: '',
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
  GetDashboardDiseaseAgeWiseWithRestrictedAccess(params: any) {
    this.userObjFromToken = this.svcLocalstorage.GetData(
      environment.AuthTokenKeyLSKey
    );
  // GetDashboardDiseaseAgeWise(params: any) {
  //   this.userObjFromToken = this.svcLocalstorage.GetData(
  //     environment.AuthTokenKeyLSKey
  //   );
    if (this.userObjFromToken) {
      this.loading=true
      this.Svc_dashboardService.GetDashboardDiseaseAgeWiseWithRestrictedAccess(params).subscribe(
        (data: any) => {
          this.loading=false
          console.log(data, 'this is GetDashboardDiseaseAgeWiseWithRestrictedAccess data');
          this.ELEMENT_DATA = data;
          this.HeaderData = data;
          this.dataSourceDownload = this.ELEMENT_DATA;
          this.isValid=true;
          console.log(
            this.ELEMENT_DATA,
            'this is GetDashboardDiseaseAgeWiseWithRestrictedAccess data'
          );
          this.dataSource = new MatTableDataSource<PeriodicElement>(
            this.ELEMENT_DATA
          );
          this.dataSource.sort = this.sort;
          this.dataSource.paginator = this.paginator;

          this.dataSource.filterPredicate = ((data, filter) => {
            const a = !filter.occurrence || data.occurrence === filter.occurrence;
            const b = !filter.age || data.age===filter.age;
            const c = !filter.disease || data.disease.toLowerCase().includes(filter.disease.toLowerCase());
            return a && b && c;
          }) as (PeriodicElement, string) => boolean;
        }
        ,(err:any)=>{
          this.loading=false
        }
      );
      // this.Svc_dashboardService.GetDashboardDiseaseAgeWise(params).subscribe(
      //   (data: any) => {
      //     this.loading=false
      //     console.log(data, 'this is GetDashboardDiseaseAgeWise data');
      //     this.ELEMENT_DATA = data;
      //     this.HeaderData = data;
      //     this.dataSourceDownload = this.ELEMENT_DATA;
      //     this.isValid=true;
      //     console.log(
      //       this.ELEMENT_DATA,
      //       'this is GetDashboardDiseaseAgeWise data'
      //     );
      //     this.dataSource = new MatTableDataSource<PeriodicElement>(
      //       this.ELEMENT_DATA
      //     );
      //     this.dataSource.sort = this.sort;
      //     this.dataSource.paginator = this.paginator;

      //     this.dataSource.filterPredicate = ((data, filter) => {
      //       const a = !filter.occurrence || data.occurrence === filter.occurrence;
      //       const b = !filter.age || data.age===filter.age;
      //       const c = !filter.disease || data.disease.toLowerCase().includes(filter.disease.toLowerCase());
      //       return a && b && c;
      //     }) as (PeriodicElement, string) => boolean;
      //   }
      //   ,(err:any)=>{
      //     this.loading=false
      //   }
      // );
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
    this.ValidationMessage="";
    this.ShowErrorMessage=false;
    this.ELEMENT_DATA=[];
    if (this.doctorForm.value) {
      let params = new HttpParams();
      let obj: any = {};
      //obj.from = this.doctorForm.get('picker').value;
      obj.to = this.doctorForm.get('todate').value;
      obj.from = this.doctorForm.get('fromdate').value;
      // obj.PHCID = this.doctorForm.get('PHCID').value;
      this.toDateValue = obj.to;
      this.fromDateValue = obj.from;
      console.log(obj.from);
      console.log(obj.to);
      params = params.append('fromDate', obj.from.format("YYYY-MM-DD"));
      params = params.append('toDate', obj.to.format("YYYY-MM-DD"));

      console.log(params);
      this.dataSource = new MatTableDataSource<PeriodicElement>( this.ELEMENT_DATA);
     
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
        this.GetDashboardDiseaseAgeWiseWithRestrictedAccess({
          params,
        });
        // this.GetDashboardDiseaseAgeWise({
        //   params,
        // });
      } 
      else{
        this.dataSource = new MatTableDataSource<PeriodicElement>( this.ELEMENT_DATA);

      } 
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
         'SL No.':item.srNo ,'Age':item.age,'Disease':item.disease,'Occurrence':item.occurrence
          
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
      tempObj.push(e.age);
      tempObj.push(e.disease);
      tempObj.push(e.occurrence);
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
          'Age',
          'Disease',
          'Occurrence',
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
  age: string;
  disease: string;
  occurrence: number;
}
