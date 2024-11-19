import {
  Component,
  OnInit,
  ViewChild,
  AfterViewInit,
  ElementRef,
  OnDestroy,
} from '@angular/core';

import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

import { HttpClient, HttpParams } from '@angular/common/http';
import { merge, Observable, of as observableOf } from 'rxjs';
import { catchError, map, startWith, switchMap } from 'rxjs/operators';
import { DatePipe, Location } from '@angular/common';
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
import { months } from 'moment';
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
declare var $: any;
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
  selector: 'app-maindashboard-emptraining-feedback',
  templateUrl: './maindashboard-emptraining-feedback.component.html',
  styleUrls: ['./maindashboard-emptraining-feedback.component.css'],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS],
    },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
})
export class MaindashboardEmptrainingFeedbackComponent
  implements AfterViewInit
{
  public ngxLoadingAnimationTypes = ngxLoadingAnimationTypes;
  public config = {
    animationType: ngxLoadingAnimationTypes.none,
    backdropBorderRadius: '3px',
  };

  loading: boolean = false;

  faDownload = faDownload;

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

  Quartername: String;
  month: String;

  searchFilter: any = [
    {
      Qtr: '2',
      from: '2022',
      to: '2022',
      name: 'Feb 2022 To Jul 2022',
      value: '1',
    },
    {
      Qtr: '1',
      from: '2022',
      to: '2023',
      name: 'Aug 2022 To Jan 2023',
      value: '2',
    },
    {
      Qtr: '2',
      from: '2023',
      to: '2023',
      name: 'Feb 2023 To Jul 2023',
      value: '3',
    },
    {
      Qtr: '1',
      from: '2023',
      to: '2024',
      name: 'Aug 2023 To Jan 2024',
      value: '4',
    },
    {
      Qtr: '2',
      from: '2024',
      to: '2024',
      name: 'Feb 2024 To Jul 2024',
      value: '5',
    },
    {
      Qtr: '1',
      from: '2024',
      to: '2025',
      name: 'Aug 2024 To Jan 2025',
      value: '6',
    },
    {
      Qtr: '2',
      from: '2025',
      to: '2025',
      name: 'Feb 2025 To Jul 2025',
      value: '7',
    },
    {
      Qtr: '1',
      from: '2025',
      to: '2026',
      name: 'Aug 2025 To Jan 2026',
      value: '8',
    },
    {
      Qtr: '2',
      from: '2026',
      to: '2026',
      name: 'Feb 2026 To Jul 2026',
      value: '9',
    },
    {
      Qtr: '1',
      from: '2026',
      to: '2027',
      name: 'Aug 2026 To Jan 2027',
      value: '10',
    },
    {
      Qtr: '2',
      from: '2027',
      to: '2027',
      name: 'Feb 2027 To Jul 2027',
      value: '10',
    },
    {
      Qtr: '1',
      from: '2027',
      to: '2028',
      name: 'Aug 2027 To Jan 2028',
      value: '10',
    },
  ];

  displayedColumns: string[] = [
    'srNo',
    'cluster',
    'districtName',
    'blockName',
    'phcName',
    'phase',
    'employeeName',
    'trainingSubject',
    'trainingBy',
    'traingDate',

    'employeeFeedback',

    'TrainingDueDate',
    'file',
  ];
  filterValues = {
    districtName: '',
    blockName: '',
    phcName: '',
    employeeName: '',
    trainingSubject: '',
    trainingBy: '',
    traingDate: '',
    employeeFeedback: '',
  };
  ELEMENT_DATA: any = [
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
  @ViewChild('modal') modal: ElementRef;
  dataSource = new MatTableDataSource<PeriodicElement>(this.ELEMENT_DATA);

  constructor(
    private svcLocalstorage: SvclocalstorageService,

    private Svc_dashboardService: svc_dashboardService,
    public datepipe: DatePipe,

    formBuilder: FormBuilder,
    private utilsService: UtilsService,
    private _sweetAlert: SvcmainAuthserviceService,
    private http: HttpClient,
    private location: Location
  ) {
    //////////used to stop loader when their is error of 401 and 403////

    this._sweetAlert.getLoader().subscribe((res: any) => {
      this.loading = res;
      console.log('med', this.loading);
    });

    this.location.subscribe((location: any) => {
      // ...close popup
      $(this.modal.nativeElement).modal('hide');
    });

    /////////////////////////////////////////////////////////////

    this.month = this.datepipe.transform(new Date(), 'MM');
    console.log(this.datepipe.transform(new Date(), 'MM'), 'dfdsfdsfsfs');
    if (this.month == '02' || this.month == '03' || this.month == '04') {
      this.Quartername = '2';
    }
    if (this.month == '05' || this.month == '06' || this.month == '07') {
      this.Quartername = '2';
    }
    if (this.month == '08' || this.month == '09' || this.month == '10') {
      this.Quartername = '1';
    }
    if (this.month == '11' || this.month == '12' || this.month == '01') {
      this.Quartername = '1';
    }

    this.doctorForm = formBuilder.group({
      todate: [new Date(), [Validators.required]],
      fromdate: [new Date(), [Validators.required]],
      //PHCID:new FormControl(''),
      //Quartername: new FormControl(this.Quartername),
      year: new FormControl(this.Quartername),
      //yearname: new FormControl(this.datepipe.transform(new Date(), 'yyyy')),
    });

    this.ReportName = 'Employee Training Feedback';
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
    params = params.append(
      'FromDate',
      this.datepipe.transform(this.doctorForm.value.fromdate, 'yyyy-MM-dd')
    );
    params = params.append(
      'ToDate',
      this.datepipe.transform(this.doctorForm.value.todate, 'yyyy-MM-dd')
    );
    // if(this.Quartername == '1')
    // {
    //   const aYearFromNow = new Date();
    //   aYearFromNow.setFullYear(aYearFromNow.getFullYear() + 1);
    //   params = params.append('Toyear',this.datepipe.transform(this.doctorForm.value.fromdate, 'yyyy-MM-dd'));
    // }
    // else{
    //   params = params.append('Toyear',this.datepipe.transform(new Date(), 'yyyy'));
    // }
    // this.GetDashboardEmployeeFeedbackWithRestrictedAccess({
    //   params,
    // });
    // this.GetDashboardEmployeeFeedback({
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
      const f =
        !filter.employeeName ||
        data.employeeName.toLowerCase().includes(filter.employeeName);
      const g =
        !filter.trainingSubject ||
        data.trainingSubject.toLowerCase().includes(filter.trainingSubject);
      const h =
        !filter.trainingBy ||
        data.trainingBy.toLowerCase().includes(filter.trainingBy);
      const i =
        !filter.traingDate ||
        data.traingDate.toLowerCase().includes(filter.traingDate);
      const j =
        !filter.employeeFeedback ||
        data.employeeFeedback === filter.employeeFeedback;

      const a =
        !filter.phase || data.phase.toLowerCase().includes(filter.phase);
      const k =
        !filter.cluster || data.cluster.toLowerCase().includes(filter.cluster);

      return b && c && d && f && g && h && i && j && a && k;
    }) as (PeriodicElement, string) => boolean;

    this.formControl = formBuilder.group({
      districtName: '',
      blockName: '',
      phcName: '',
      phase: '',
      employeeName: '',
      trainingSubject: '',
      trainingBy: '',
      traingDate: '',
      employeeFeedback: '',
      cluster: '',
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

    // this.GetAllPHC();
  }
  @ViewChild('content', { static: false }) content: ElementRef;
  filteredArrayForBulkCount: any = [];
  ListOfCompletedConsultation: any;
  GetDashboardEmployeeFeedbackWithRestrictedAccess(params: any) {
    this.userObjFromToken = this.svcLocalstorage.GetData(
      environment.AuthTokenKeyLSKey
    );
    // GetDashboardEmployeeFeedback(params: any) {
    //   this.userObjFromToken = this.svcLocalstorage.GetData(
    //     environment.AuthTokenKeyLSKey
    //   );
    if (this.userObjFromToken) {
      this.loading = true;

      this.Svc_dashboardService.GetDashboardEmployeeFeedbackWithRestrictedAccess(
        params
      ).subscribe(
        (data: any) => {
          this.loading = false;
          console.log(
            data,
            'this is GetDashboardEmployeeFeedbackWithRestrictedAccess data'
          );
          this.ELEMENT_DATA = data.map((res) => ({
            ...res,
            duedate: this.duedate(res.traingDate),
          }));

          this.dataSourceDownload = this.ELEMENT_DATA;
          this.filteredArrayForBulkCount = this.ELEMENT_DATA.filter(
            (item) => item.filePath !== null
          );
          console.log(
            this.filteredArrayForBulkCount,
            'filteredArrayForBulkCount'
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
            const f =
              !filter.employeeName ||
              data.employeeName
                .toLowerCase()
                .includes(filter.employeeName.toLowerCase());
            const g =
              !filter.trainingSubject ||
              data.trainingSubject
                .toLowerCase()
                .includes(filter.trainingSubject.toLowerCase());
            const h =
              // !filter.trainingBy ||
              // data.trainingBy.toLowerCase().includes(filter.TrainingBy.toLowerCase());
              !filter.trainingBy ||
              (filter.trainingBy.trim().toLowerCase() != 'null' &&
                JSON.stringify(data.trainingBy)
                  .toLowerCase()
                  .includes(filter.trainingBy.toLowerCase()));
            const i =
              !filter.traingDate ||
              data.traingDate
                .toLowerCase()
                .includes(filter.TraingDate.toLowerCase());
            const j =
              !filter.employeeFeedback ||
              data.employeeFeedback === filter.employeeFeedback;

            const a =
              !filter.phase ||
              data.phase.toLowerCase().includes(filter.phase.toLowerCase());

            const k =
              !filter.cluster ||
              data.cluster.toLowerCase().includes(filter.cluster);

            return b && c && d && f && g && h && i && j && a && k;
          }) as (PeriodicElement, string) => boolean;
        },
        (err: any) => {
          this.loading = false;
        }
      );
      // this.Svc_dashboardService.GetDashboardEmployeeFeedback(params).subscribe(
      //   (data: any) => {
      //     this.loading=false
      //     console.log(data, 'this is GetDashboardEmployeeFeedback data');
      //     this.ELEMENT_DATA = data.map(res => ({...res, duedate: this.duedate(res.traingDate)}))

      //     this.dataSourceDownload = this.ELEMENT_DATA;

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
      //       const f =
      //         !filter.employeeName ||
      //         data.employeeName.toLowerCase().includes(filter.employeeName.toLowerCase());
      //       const g =
      //         !filter.trainingSubject ||
      //         data.trainingSubject
      //           .toLowerCase()
      //           .includes(filter.trainingSubject.toLowerCase());
      //       const h =
      //         // !filter.trainingBy ||
      //         // data.trainingBy.toLowerCase().includes(filter.TrainingBy.toLowerCase());
      //         !filter.trainingBy||  (filter.trainingBy.trim().toLowerCase()!='null' &&

      //         JSON.stringify(data.trainingBy).toLowerCase().includes(filter.trainingBy.toLowerCase()))
      //       const i =
      //         !filter.traingDate ||
      //         data.traingDate.toLowerCase().includes(filter.TraingDate.toLowerCase());
      //       const j =
      //         !filter.employeeFeedback ||
      //         data.employeeFeedback === filter.employeeFeedback;

      //       return b && c && d && f && g && h && i && j;
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
      // obj.from = this.doctorForm.get('picker').value;
      // obj.to = this.doctorForm.get('todate').value;
      // obj.from = this.doctorForm.get('fromdate').value;

      //obj.selectYear = this.doctorForm.get('yearname').value;
      //obj.selectQatr = this.doctorForm.get('Quartername').value;

      var array = this.searchFilter.filter((res: any) => {
        return res.value == this.doctorForm.value.year;
      })[0];
      console.log(array);

      obj.selectQatr = array.Qtr;
      obj.selectFromYear = array.from;
      obj.selectToYear = array.to;

      // obj.PHCID = this.doctorForm.get('PHCID').value;
      this.toDateValue = obj.to;
      this.fromDateValue = obj.from;
      console.log(obj.selectYear);
      console.log(obj.selectQatr);

      let params = new HttpParams();
      params = params.append(
        'FromDate',
        this.datepipe.transform(this.doctorForm.value.fromdate, 'yyyy-MM-dd')
      );
      params = params.append(
        'ToDate',
        this.datepipe.transform(this.doctorForm.value.todate, 'yyyy-MM-dd')
      );

      this.dataSource = new MatTableDataSource<PeriodicElement>(
        this.ELEMENT_DATA
      );
      console.log(
        this.utilsService.monthDiffInDay(
          this.doctorForm.value.todate,
          this.doctorForm.value.fromdate
        ),
        'employeee'
      );

      if (
        this.utilsService.monthDiffInDay(
          this.doctorForm.value.todate,
          this.doctorForm.value.fromdate
        ) > 190
      ) {
        this.ValidationMessage =
          'Please select date gap for 190 day maximum duration!';
        this.ShowErrorMessage = true;
      } else if (
        this.utilsService.monthDiffInDay(
          this.doctorForm.value.todate,
          this.doctorForm.value.fromdate
        ) < 0
      ) {
        this.ValidationMessage =
          'From Date should be less than or equal to To Date.';
        this.ShowErrorMessage = true;
      }
      if (!this.ValidationMessage) {
        this.GetDashboardEmployeeFeedbackWithRestrictedAccess({
          params,
        });
        // this.GetDashboardEmployeeFeedback({
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
          Trainee: item.employeeName,
          'Training Subject': item.trainingSubject,
          'Training By': item.trainingBy,
          'Scheduled Traning Date': this.datepipe.transform(
            item.traingDate,
            'dd-MM-yyyy'
          ),
          'Employee Feedback': item.employeeFeedback,
          'Training Due Date': this.datepipe.transform(
            item.trainingDueDate,
            'dd-MM-yyyy'
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
        this.datepipe.transform(this.doctorForm.value.fromdate, 'dd-MMM-yyyy') +
        ' to ' +
        this.datepipe.transform(this.doctorForm.value.todate, 'dd-MMM-yyyy') +
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

      tempObj.push(e.employeeName);
      tempObj.push(e.trainingSubject);
      tempObj.push(e.trainingBy);
      tempObj.push(this.datepipe.transform(e.traingDate, 'dd-MM-yyyy'));
      //tempObj.push(e.duedate)
      tempObj.push(e.employeeFeedback);
      prepare.push(tempObj);
      //  tempObj.push(this.datepipe.transform(e.scheduledTraningDate,'dd-MM-yyyy'));
      tempObj.push(this.datepipe.transform(e.trainingDueDate, 'dd-MM-yyyy'));
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
          'Employee Name',
          'Training Subject',
          'Training By',
          'Scheduled Traning Date',

          'Employee Feedback',

          'Training Due Date',
        ],
      ],
      body: prepare,
    });
    doc.save(
      this.ReportName +
        ' ' +
        this.datepipe.transform(this.doctorForm.value.fromdate, 'dd-MMM-yyyy') +
        ' to ' +
        this.datepipe.transform(this.doctorForm.value.todate, 'dd-MMM-yyyy') +
        '.pdf'
    );
  }

  duedate(value: any) {
    const d = new Date(value);
    return this.datepipe.transform(d.setMonth(d.getMonth() + 6), 'dd-MM-yyyy');
  }
  fileheader = environment.ImagesHeader;
  openPrescription(element: any) {
    if (element == null || element == 'null') {
      this._sweetAlert.sweetAlert('File Not Found', 'error');
      return;
    }

    let url = this.fileheader + element;
    this.loading = true;
    // const url =
    //   "https://medteleapi.azurewebsites.net//MyFiles/CaseDocuments/5750364.pdf";
    this.http
      .get(url, {
        headers: {
          Accept: 'application/pdf',
        },
        responseType: 'blob',
      })
      .subscribe(
        (x: any) => {
          this.loading = false;
          console.log('x', x);
          // It is necessary to create a new blob object with mime-type explicitly set
          // otherwise only Chrome works like it should
          var newBlob = new Blob([x], { type: 'application/pdf' });

          // IE doesn't allow using a blob object directly as link href
          // instead it is necessary to use msSaveOrOpenBlob

          // For other browsers:
          // Create a link pointing to the ObjectURL containing the blob.
          const data = window.URL.createObjectURL(newBlob);

          var link = document.createElement('a');
          link.href = data;
          var filename = url.replace(/^.*[\\\/]/, '');
          //link.download = name+this.datepipe.transform(new Date,) +".pdf";
          link.download = filename;
          // this is necessary as link.click() does not work on the latest firefox
          link.dispatchEvent(
            new MouseEvent('click', {
              bubbles: true,
              cancelable: true,
              view: window,
            })
          );

          setTimeout(function () {
            // For Firefox it is necessary to delay revoking the ObjectURL
            window.URL.revokeObjectURL(data);
            link.remove();
          }, 100);
        },
        (err) => {
          this.loading = false;
          if (err.status == 404) {
            this._sweetAlert.sweetAlert('File not found', 'error');
          }
        }
      );
  }

  downloadedCout = 0;
  ShowPopup: boolean = false;
  ShowerrPopup: boolean = false;
  OkDisable: boolean = false;
  confirm = false;
  countOfFiles = 0;
  fileCount = 0;
  bulkDownload() {
    this.bulkError = [];
    this.fileCount = 0;
    this.downloadedCout = 0;
    this.nullCount = 0;
    this.countOfFiles = this.filteredArrayForBulkCount.length;
    this.OkDisable = false;
    this.BulkErrorStatus=false


    console.log(this.countOfFiles, 'this.countOfFiles ');

    if (this.ELEMENT_DATA?.length === 0) {
      this.loading = false;
      this.ShowPopup = false;
      this.ShowerrPopup = true;

      return;
    }

    this.ShowPopup = true;
    this.ShowerrPopup = false;

    for (let i = 0; i <= this.ELEMENT_DATA?.length; i++) {
      // this.loading=true

      console.log(this.ELEMENT_DATA[i]);

      this.downloadAll(this.ELEMENT_DATA[i]);
    }
  }
  BulkErrorStatus:boolean=false
  modifiedUrls:any=[]
  totalfilecount:any
  errorDisplay() {
    if (this.bulkError.length == 0) {
      document.getElementById('closeModalButton').click();

      return false;
    }
    console.log(this.modifiedUrls.length);
    
    this.modifiedUrls =this.modifiedUrls.map(url => {
    // Remove everything after the dot
      const withoutDotAndAfter = url;
      return withoutDotAndAfter;
     
     
    });
    this.totalfilecount =    this.modifiedUrls.length;

// Now totalfilecount will always have the total count of URLs in modifiedUrl
    // this.bulkError=this.bulkError.join('\n')
    console.log(this.modifiedUrls,'this.bulkError');
    this.BulkErrorStatus=true;
    this.ShowPopup = false;
    this.ShowerrPopup = false;

    // this._sweetAlert.sweetAlert(`File not found ${this.bulkError}`, 'error');
  }
  nullCount = 0;
  bulkError: any = [];
  downloadSubscription: any;
  downloadarray: any = [];
  downloadAll(element: any) {

    if (element.filePath === null) {
      this.nullCount++;
      // alert('hh')
      return;
    }
    this.fileCount = this.fileCount + 1;


    // this.loading=true
    let url = this.fileheader + element.filePath;
    // const url =
    //   "https://medteleapi.azurewebsites.net//MyFiles/CaseDocuments/5750364.pdf";
    this.downloadSubscription = this.http
      .get(url, {
        headers: {
          Accept: 'application/pdf',
        },
        responseType: 'blob',
      })
      .subscribe(
        (x: any) => {
          this.downloadedCout++;
          this.loading = false;

          console.log('x', x);
          // It is necessary to create a new blob object with mime-type explicitly set
          // otherwise only Chrome works like it should
          var newBlob = new Blob([x], { type: 'application/pdf' });

          // IE doesn't allow using a blob object directly as link href
          // instead it is necessary to use msSaveOrOpenBlob

          // For other browsers:
          // Create a link pointing to the ObjectURL containing the blob.
          const data = window.URL.createObjectURL(newBlob);

          var link = document.createElement('a');
          link.href = data;
          var filename = url.replace(/^.*[\\\/]/, '');
          //link.download = name+this.datepipe.transform(new Date,) +".pdf";
          link.download = filename;
          console.log(filename, 'filename');

          // this is necessary as link.click() does not work on the latest firefox
          link.dispatchEvent(
            new MouseEvent('click', {
              bubbles: true,
              cancelable: true,
              view: window,
            })
          );
          if (
            this.downloadedCout + this.nullCount ===
            this.ELEMENT_DATA.length
          ) {
            this.OkDisable = true;
          }
          setTimeout(function () {
            // For Firefox it is necessary to delay revoking the ObjectURL
            window.URL.revokeObjectURL(data);
            link.remove();
            // if (this.fileCount === this.ELEMENT_DATA.length) {
            //   this.OkDisable = true;
            // }
          }, 100);
        },
        (err) => {
          if (err.status == 404) {
            let error = err.url;
            this.bulkError.push(error);
            this.modifiedUrls =this.bulkError.map(url => {
              // Remove the common prefix
              const withoutPrefix = url.replace(this.fileheader, "");
            
              // Remove everything after the dot
              const withoutDotAndAfter = withoutPrefix;
            
              return withoutDotAndAfter;
            });
            this.loading = false;
            if (this.fileCount === this.filteredArrayForBulkCount.length) {
              this.OkDisable = true;
            }

            // this._sweetAlert.sweetAlert('File not found','error')
          }

          // this._sweetAlert.sweetAlert(`File not found ${this.bulkError}`,'error')
        }
      );
    this.downloadarray.push(this.downloadSubscription);
  }

  onCancelButton() {
    if (this.downloadSubscription) {
      for (let i = 0; i <= this.downloadarray.length; i++) {
        this.downloadarray[i].unsubscribe();
      }
    }
  }
}
export interface PeriodicElement {
  srNo: number;
  districtName: string;
  blockName: string;
  phcName: string;
  employeeName: string;
  trainingSubject: string;
  trainingBy: string;
  traingDate: string;
  employeeFeedback: number;
}
