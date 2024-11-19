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

import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
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
  faDownload,
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
import Swal from 'sweetalert2';
import { Svc_getdoctordetailService } from 'src/app/services/services/svc_getdoctordetail.service';

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
  selector: 'app-maindashboard-patient-referred',
  templateUrl: './maindashboard-patient-referred.component.html',
  styleUrls: ['./maindashboard-patient-referred.component.css'],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS],
    },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
})
export class MaindashboardPatientReferredComponent implements AfterViewInit {
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
  faDownload = faDownload;
  displayedColumns: string[] = [
    'srNo',
    'cluster',
    'districtName',
    'blockName',
    'phcName',
    'phase',
    'patientName',
    'doctorName',
    'consultdate',
    'referralNote',
    'complaints',
    'prescription',
  ];
  filterValues = {
    cluster: '',
    districtName: '',
    blockName: '',
    phcName: '',
    phase: '',
    patientName: '',
    doctorName: '',
    consultdate: '',
    referralNote: '',
    complaints: '',
    prescription: '',
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
    private http: HttpClient,
    private sweetAlert: SvcmainAuthserviceService,
    private svcdoctor: Svc_getdoctordetailService
  ) {
    //////////used to stop loader when their is error of 401 and 403////

    this.sweetAlert.getLoader().subscribe((res: any) => {
      this.loading = res;
      console.log('med', this.loading);
    });

    /////////////////////////////////////////////////////////////

    this.doctorForm = new FormGroup({
      todate: new FormControl(moment(new Date())),
      fromdate: new FormControl(moment(new Date())),
      //PHCID:new FormControl(''),
    });
    this.ReportName = 'Patient Referred Report';

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
    // this.GetReferredPatientReportWithRestrictedAccess({
    //   params,
    // });
    // this.GetReferredPatientReport({
    //   params,
    // });

    /////////////////////////////////////////////////////////////////////////////
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
        !filter.doctorName ||
        data.doctorName.toLowerCase().includes(filter.doctorName);
      const g =
        !filter.cluster || data.cluster.toLowerCase().includes(filter.cluster);
      const h =
        !filter.phase || data.phase.toLowerCase().includes(filter.phase);
      //const c = !filter.symbol || data.symbol === filter.symbol;
      return b && c && d && e && f && g && h;
    }) as (PeriodicElement, string) => boolean;

    this.formControl = formBuilder.group({
      cluster: '',
      districtName: '',
      blockName: '',
      phcName: '',
      phase: '',
      patientName: '',
      doctorName: '',
    });
    this.formControl.valueChanges.subscribe((value) => {
      const filter = { ...value, name: value.name } as string;
      this.dataSource.filter = filter;
    });
  }

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  //@ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  fileheader: string;
  ngAfterViewInit() {
    this.fileheader = environment.ImagesHeader;
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    // this.doctorForm = this.fb.group({
    //   todate: ['', [Validators.required]],
    //   fromdate: ['', [Validators.required]],
    // });
    // this.GetAllPHC();
  }
  @ViewChild('content', { static: false }) content: ElementRef;

  // download(url: string) {
  //   this.loading=true
  //   // const url =
  //   //   "https://medteleapi.azurewebsites.net//MyFiles/CaseDocuments/5750364.pdf";
  //   this.http.get(url, {
  //     headers: {
  //       "Accept": "application/pdf"
  //     },
  //     responseType: "blob"
  //   }).subscribe(
  //     (x: any) => {
  //       this.loading=false
  //       console.log("x", x);
  //       // It is necessary to create a new blob object with mime-type explicitly set
  //       // otherwise only Chrome works like it should
  //       var newBlob = new Blob([x], { type: "application/pdf" });

  //       // IE doesn't allow using a blob object directly as link href
  //       // instead it is necessary to use msSaveOrOpenBlob

  //       // For other browsers:
  //       // Create a link pointing to the ObjectURL containing the blob.
  //       const data = window.URL.createObjectURL(newBlob);

  //       var link = document.createElement("a");
  //       link.href = data;
  //       var filename = url.replace(/^.*[\\\/]/, '')
  //       //link.download = name+this.datepipe.transform(new Date,) +".pdf";
  //       link.download = filename;
  //       // this is necessary as link.click() does not work on the latest firefox
  //       link.dispatchEvent(
  //         new MouseEvent("click", {
  //           bubbles: true,
  //           cancelable: true,
  //           view: window
  //         })
  //       );

  //       setTimeout(function() {
  //         // For Firefox it is necessary to delay revoking the ObjectURL
  //         window.URL.revokeObjectURL(data);
  //         link.remove();
  //       }, 100);
  //     },
  //     err => {
  //       this.loading=false
  //       if(err.status==404)
  //       {
  //       this.sweetAlert.sweetAlert('File not found','error')
  //       }
  //       console.log("ERR", err);
  //     }
  //   );
  // }

  openPrescriptionData: any;
  openPrescription(patientCaseDetailId: number) {
    this.loading = true;
    this.userObjFromToken = this.svcLocalstorage.GetData(
      environment.AuthTokenKeyLSKey
    );
    if (this.userObjFromToken) {
      this.svcdoctor.CreatePrescription(patientCaseDetailId).subscribe({
        next: (data: any) => {
          this.loading = false;

          this.openPrescriptionData = data;
          if (this.openPrescriptionData.prescriptionFilePath == 'pending') {
            Swal.fire({
              title: 'Warning',
              text: `Prescription is in-progress, please try after some time`,
              icon: 'warning',
            });
            this.loading = false;
          } else if (
            this.openPrescriptionData.prescriptionFilePath ==
            'consultationpending'
          ) {
            Swal.fire({
              title: 'Warning',
              text: `Consultation pending`,
              icon: 'warning',
            });
            this.loading = false;
          } else {
            const path = this.openPrescriptionData.prescriptionFilePath;
            const storage =
              this.openPrescriptionData.storageSource == null
                ? 0
                : this.openPrescriptionData.storageSource;

            window.open(
              `${environment.ApiEndPoint}${environment.EndPoints.Doctor.Endpoint}${environment.EndPoints.Doctor.methods.GetPrescriptionFile}?filePath=${path}&StorageSource=${storage}`
            );

            // window.open(this.ImagesHeader+this.openPrescriptionData[0].prescriptionFilePath,'_blank');
            //window.open('https://tele-med-dev.azurewebsites.net/MyFiles/CaseDocuments/62993c1c-ed5a-429b-8353-918c006dc32a.pdf','_blank');
            this.loading = false;
          }
        },
        error(err) {
          this.loading = false;
        },
      });
    }
  }

  ListOfCompletedConsultation: any;
  GetReferredPatientReportWithRestrictedAccess(params: any) {
    this.userObjFromToken = this.svcLocalstorage.GetData(
      environment.AuthTokenKeyLSKey
    );
    // GetReferredPatientReport(params: any) {
    //   this.userObjFromToken = this.svcLocalstorage.GetData(
    //     environment.AuthTokenKeyLSKey
    //   );
    if (this.userObjFromToken) {
      this.loading = true;
      this.Svc_dashboardService.GetReferredPatientReportWithRestrictedAccess(
        params
      ).subscribe(
        (data: any) => {
          this.loading = false;
          console.log(
            data,
            'this is GetReferredPatientReportWithRestrictedAccess data'
          );
          this.ELEMENT_DATA = data;
          this.dataSourceDownload = this.ELEMENT_DATA;
          console.log(
            this.ELEMENT_DATA,
            'this is GetReferredPatientReportWithRestrictedAccess data'
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
              !filter.doctorName ||
              data.doctorName
                .toLowerCase()
                .includes(filter.doctorName.toLowerCase());
            const g =
              !filter.cluster ||
              data.cluster.toLowerCase().includes(filter.cluster.toLowerCase());
            const h =
              !filter.phase ||
              data.phase.toLowerCase().includes(filter.phase.toLowerCase());
            //const c = !filter.symbol || data.symbol === filter.symbol;
            return b && c && d && e && f && g && h;
          }) as (PeriodicElement, string) => boolean;
        },
        (err: any) => {
          this.loading = false;
        }
      );
      // this.Svc_dashboardService.GetReferredPatientReport(params).subscribe(
      //   (data: any) => {
      //     this.loading=false
      //     console.log(data, 'this is GetReferredPatientReport data');
      //     this.ELEMENT_DATA = data;
      //     this.dataSourceDownload = this.ELEMENT_DATA;
      //     console.log(
      //       this.ELEMENT_DATA,
      //       'this is GetReferredPatientReport data'
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

      //         const f =
      //         !filter.doctorName ||
      //         data.doctorName.toLowerCase().includes(filter.doctorName.toLowerCase());
      //       //const c = !filter.symbol || data.symbol === filter.symbol;
      //       return  b && c && d && e&& f;
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
      if (obj.to == '' || obj.from == '' || obj.PHCID == '') {
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
        this.GetReferredPatientReportWithRestrictedAccess({
          params,
        });
        // this.GetReferredPatientReport({
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
    if (this.ELEMENT_DATA.length == 0) {
      this.loading = false;
      this.sweetAlert.sweetAlert('No Data Available', 'error');
      return;
    }
    console.log(value);
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
          Doctor: item.doctorName,
          'Consult Date': this.datepipe.transform(
            item.consultdate,
            'dd-MM-yyyy'
          ),
          'Referral Note': item.referralNote,
          Complaints: item.complaints,
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
      this.sweetAlert.sweetAlert('No Data Available', 'error');
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
      tempObj.push(e.doctorName);
      tempObj.push(this.datepipe.transform(e.consultdate, 'dd-MM-yyyy'));
      tempObj.push(e.referralNote);
      tempObj.push(e.complaints);
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
          'Patient Name',
          'Doctor',
          'Consult Date',
          'Referral Note',
          'Complaints',
          //'Prescription',
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
  doctorName: string;
  consultdate: string;
  referralNote: string;
  complaints: string;
  prescription: string;
}
