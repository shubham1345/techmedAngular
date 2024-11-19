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
import {
  faFilePdf,
  faFileExcel,
  faClose,
} from '@fortawesome/free-solid-svg-icons';
import { UtilsService } from 'src/app/utils/Utils_Service';
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
    monthYearA11yLabel: 'MMM YYYY',
  },
};

@Component({
  selector: 'app-maindashboard-patient-registration',
  templateUrl: './maindashboard-patient-registration.component.html',
  styleUrls: ['./maindashboard-patient-registration.component.css'],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS],
    },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
})
export class MaindashboardPatientRegistrationComponent
  implements AfterViewInit
{
  public ngxLoadingAnimationTypes = ngxLoadingAnimationTypes;
  public config = {
    animationType: ngxLoadingAnimationTypes.none,
    backdropBorderRadius: '3px',
  };

  loading: boolean = false;

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
    'srNo',
    'cluster',
    'districtName',
    'blockName',
    'phcName',
    'phase',
    'patientName',
    'gender',
    'age',
    'registrationDate',
  ];
  filterValues = {
    cluster: '',
    districtName: '',
    blockName: '',
    phcName: '',
    phase: '',
    patientName: '',
    gender: '',
    age: '',
    registrationDate: '',
    patientCaseID: '',
  };
  ELEMENT_DATA: PeriodicElement[] = [
    // {
    // srNo: 1,
    // districtName:  'districtName1',
    // blockName:  'blockName1',
    // phcName:  'phcName1',
    // consultationDate: '',
    // noOfConsultation: 12
    // },
    // {
    //   srNo: 2,
    //   districtName:  'districtName2',
    //   blockName:  'blockName2',
    //   phcName:  'phcName2',
    //   consultationDate: '',
    //   noOfConsultation: 12
    // },
  ];
  dataSource = new MatTableDataSource<PeriodicElement>(this.ELEMENT_DATA);
  IsDateNotSelected: boolean;

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
      this.loading = res;
      console.log('med', this.loading);
    });

    /////////////////////////////////////////////////////////////

    this.doctorForm = new FormGroup({
      todate: new FormControl(moment(new Date())),
      fromdate: new FormControl(moment(new Date())),
      //PHCID:new FormControl(''),
    });
    this.ReportName = 'Patient Registration';

    this.dataSourceDownload = this.ELEMENT_DATA;
    let params = new HttpParams();
    params = params.append(
      'fromDate',
      this.datepipe.transform(new Date(), 'yyyy-MM-dd')
    );
    params = params.append(
      'toDate',
      this.datepipe.transform(new Date(), 'yyyy-MM-dd')
    );
    // this.GetPatientRegisterReportWithRestrictedAccess({
    //   params,
    // });
    // this.GetPatientRegisterReport({
    //   params,
    // });
    //////////////////////////////////////////////////////////////
    this.dataSource.filterPredicate = ((data, filter) => {
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
      const f =
        !filter.gender || data.gender.toLowerCase().includes(filter.gender);

      const g =
        !filter.cluster || data.cluster.toLowerCase().includes(filter.cluster);
      const h =
        !filter.phase || data.phase.toLowerCase().includes(filter.phase);
      const i = !filter.age || data.age.toLowerCase().includes(filter.age);

      //const c = !filter.symbol || data.symbol === filter.symbol;
      return b && c && d && e && f && g && h && i;
    }) as (PeriodicElement, string) => boolean;

    this.formControl = formBuilder.group({
      cluster: '',
      districtName: '',
      blockName: '',
      phcName: '',
      phase: '',
      patientName: '',
      gender: '',
      age: '',
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
  }
  @ViewChild('content', { static: false }) content: ElementRef;

  ListOfCompletedConsultation: any;
  GetPatientRegisterReportWithRestrictedAccess(params: any) {
    this.userObjFromToken = this.svcLocalstorage.GetData(
      environment.AuthTokenKeyLSKey
    );
    // GetPatientRegisterReport(params: any) {
    //   this.userObjFromToken = this.svcLocalstorage.GetData(
    //     environment.AuthTokenKeyLSKey
    //   );
    if (this.userObjFromToken) {
      this.loading = true;
      this.Svc_dashboardService.GetPatientRegisterReportWithRestrictedAccess(
        params
      ).subscribe(
        (data: any) => {
          this.loading = false;
          console.log(
            data,
            'this is GetPatientRegisterReportWithRestrictedAccess data'
          );
          this.ELEMENT_DATA = data;
          this.dataSourceDownload = this.ELEMENT_DATA;
          console.log(
            this.ELEMENT_DATA,
            'this is GetPatientRegisterReportWithRestrictedAccess data'
          );
          this.dataSource = new MatTableDataSource<PeriodicElement>(
            this.ELEMENT_DATA
          );
          this.dataSource.sort = this.sort;
          this.dataSource.paginator = this.paginator;

          this.dataSource.filterPredicate = ((data, filter) => {
            const b =
              !filter.districtName ||
              data.districtName
                .toLowerCase()
                .includes(filter.districtName.toLowerCase());
            const c =
              !filter.blockName ||
              data.blockName
                .toLowerCase()
                .includes(filter.blockName.toLowerCase());
            const d =
              !filter.phcName ||
              data.phcName.toLowerCase().includes(filter.phcName.toLowerCase());
            const e =
              !filter.patientName ||
              data.patientName
                .toLowerCase()
                .includes(filter.patientName.toLowerCase());
            const f =
              !filter.gender ||
              data.gender.toLowerCase().startsWith(filter.gender.toLowerCase());

            const g =
              !filter.age ||
              data.age.toLowerCase().includes(filter.age.toLowerCase());
            const h =
              !filter.cluster ||
              data.cluster.toLowerCase().includes(filter.cluster.toLowerCase());
            const i =
              !filter.phase ||
              data.phase.toLowerCase().includes(filter.phase.toLowerCase());

            return b && c && d && e && f && g && h && i;
          }) as (PeriodicElement, string) => boolean;
        },
        (err: any) => {
          this.loading = false;
        }
      );
      // this.Svc_dashboardService.GetPatientRegisterReport(params).subscribe(
      //   (data: any) => {
      //     this.loading=false
      //     console.log(data, 'this is GetPatientRegisterReport data');
      //     this.ELEMENT_DATA = data;
      //     this.dataSourceDownload = this.ELEMENT_DATA;
      //     console.log(
      //       this.ELEMENT_DATA,
      //       'this is GetPatientRegisterReport data'
      //     );
      //     this.dataSource = new MatTableDataSource<PeriodicElement>(
      //       this.ELEMENT_DATA
      //     );
      //     this.dataSource.sort = this.sort;
      //     this.dataSource.paginator = this.paginator;

      //     this.dataSource.filterPredicate = ((data, filter) => {

      //       const b =
      //         !filter.districtName ||
      //         data.districtName.toLowerCase().includes(filter.districtName.toLowerCase());
      //       const c =
      //         !filter.blockName ||
      //         data.blockName.toLowerCase().includes(filter.blockName.toLowerCase());
      //       const d =
      //         !filter.phcName ||
      //         data.phcName.toLowerCase().includes(filter.phcName.toLowerCase());
      //       const e =
      //         !filter.patientName ||
      //         data.patientName.toLowerCase().includes(filter.patientName.toLowerCase());
      //       const f =
      //         !filter.gender ||
      //         data.gender.toLowerCase().startsWith(filter.gender.toLowerCase());

      //         const g =
      //         !filter.age ||
      //         data.age.toLowerCase().includes(filter.age.toLowerCase());

      //       return  b && c && d && e && f&&g;
      //     }) as (PeriodicElement, string) => boolean;
      //   },(err:any)=>{
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
      this.Svc_dashboardService.GetAllPHC().subscribe((data: any) => {
        console.log(data, 'this is GetAllPHC data');
        this.ListOfPHC = data;
      });
    }
  }
  ShowErrorMessage: boolean;
  ValidationMessage: string;
  submitdetails() {
    this.ValidationMessage = '';
    this.ShowErrorMessage = false;
    this.ELEMENT_DATA = [];
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

      // console.log(obj.PHCID);
      let params = new HttpParams();
      params = params.append('fromDate', obj.from.format('YYYY-MM-DD'));
      params = params.append('toDate', obj.to.format('YYYY-MM-DD'));

      this.dataSource = new MatTableDataSource<PeriodicElement>(
        this.ELEMENT_DATA
      );
      this.IsDateNotSelected = false;
      if (obj.to == '' || obj.from == '') {
        this.IsDateNotSelected = true;
      }
      if (this.utilsService.monthDiffInDay(obj.to, obj.from) > 92) {
        this.ValidationMessage =
          'Please select date gap for 92 day maximum duration!';
        this.ShowErrorMessage = true;
      } else if (this.utilsService.monthDiffInDay(obj.to, obj.from) < 0) {
        this.ValidationMessage =
          'From Date should be less than or equal to To Date.';
        this.ShowErrorMessage = true;
      }
      if (!this.ValidationMessage) {
        this.GetPatientRegisterReportWithRestrictedAccess({
          params,
        });
        // this.GetPatientRegisterReport({
        //   params,
        // });
      } else {
        this.dataSource = new MatTableDataSource<PeriodicElement>(
          this.ELEMENT_DATA
        );
      }
    }
  }

  public Download(value: any) {
    console.log(value);
    if (this.ELEMENT_DATA.length == 0) {
      this.loading = false;
      this._sweetAlert.sweetAlert('No Data Available', 'error');
      return;
    }
    if (value == 'Excel') {
      let count: number = 1000000;
      // for (let index = 0;  this.dataSourceDownload.length>=index; index=index+count) {;
      //      var D = this.dataSourceDownload.slice(index,index+count);
      //      this.exportAsExcelFile(D, this.ReportName);
      // }
      const newArrayOfObj = this.dataSourceDownload.map((item) => {
        return {
          'SL No.': item.srNo,
          Cluster: item.cluster,
          District: item.districtName,
          Block: item.blockName,
          PHC: item.phcName,
          Phase: item.phase,
          'Patient Name': item.patientName,
          Gender: item.gender,
          Age: item.age,
          'Registration Date': this.datepipe.transform(
            item.registrationDate,
            'dd-MM-yyyy hh:mm:ss a'
          ),
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
      fileName +
        ' ' +
        this.datepipe.transform(this.fromDateValue, 'dd-MMM-yyyy') +
        ' to ' +
        this.datepipe.transform(this.toDateValue, 'dd-MMM-yyyy') +
        EXCEL_EXTENSION
    );
  }

  downloadPdf() {
    if (this.ELEMENT_DATA.length == 0) {
      this.loading = false;
      this._sweetAlert.sweetAlert('No Data Available', 'error');
      return;
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
      tempObj.push(e.patientName);
      tempObj.push(e.gender);
      tempObj.push(e.age);
      tempObj.push(
        this.datepipe.transform(e.registrationDate, 'dd-MM-yyyy hh:mm:ss a')
      );
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
          'Patient Name',
          'Gender',
          'Age(years)',
          'Registration Date',
        ],
      ],
      body: prepare,
    });
    doc.save(
      this.ReportName +
        ' ' +
        this.datepipe.transform(this.fromDateValue, 'dd-MMM-yyyy') +
        ' to ' +
        this.datepipe.transform(this.toDateValue, 'dd-MMM-yyyy') +
        '.pdf'
    );
  }
}
export interface PeriodicElement {
  srNo: number;
  cluster: string;
  districtName: string;
  blockName: string;
  phcName: string;
  phase: string;
  patientName: string;
  gender: string;
  age: string;
  registrationDate: string;
  patientCaseID: number;
}
