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
import { DatePipe , Location } from '@angular/common';
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
import { I, S } from '@angular/cdk/keycodes';

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
  selector: 'app-maindashboard-spokemaintenance',
  templateUrl: './maindashboard-spokemaintenance.component.html',
  styleUrls: ['./maindashboard-spokemaintenance.component.css'],

  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS],
    },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
})
export class MaindashboardSpokemaintenanceComponent implements AfterViewInit {
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
    'dc',
    'date',
    'DueDate',
    'filePath',
  ];
  filterValues = {
    districtName: '',
    blockName: '',
    phcName: '',
    dc: '',
    date: '',
    filePath: '',
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
  @ViewChild('modal') modal: ElementRef;
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
    private _sweetAlert: SvcmainAuthserviceService,
    formBuilder: FormBuilder,
    private utilsService: UtilsService,
    private http: HttpClient,
    private location: Location
  ) {
    //////////used to stop loader when their is error of 401 and 403////

    this._sweetAlert.getLoader().subscribe((res: any) => {
      this.loading = res;
      // console.log('med',this.loading)
    });
    this.location.subscribe((location: any) => {
      // ...close popup
      $(this.modal.nativeElement).modal('hide');
    });

    /////////////////////////////////////////////////////////////

    this.doctorForm = new FormGroup({
      todate: new FormControl(moment(new Date())),
      fromdate: new FormControl(moment(new Date())),
      //PHCID:new FormControl(''),
    });
    this.ReportName = 'Spoke';
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
      'fromDate',
      this.datepipe.transform(new Date(), 'yyyy-MM-dd')
    );
    params = params.append(
      'toDate',
      this.datepipe.transform(new Date(), 'yyyy-MM-dd')
    );
    // this.GetDashboardSpokeMaintenanceWithRestrictedAccess({
    //   params,
    // });
    // this.GetDashboardSpokeMaintenance({
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
      const e = !filter.dc || data.dc.toLowerCase().includes(filter.dc);

      const f = !filter.date || data.date.toLowerCase().includes(filter.date);

      const g =
        !filter.cluster ||
        data?.cluster?.toLowerCase().includes(filter.cluster.toLowerCase());

      const a =
        !filter.phase ||
        data?.phase?.toLowerCase().includes(filter.phase.toLowerCase());
      //const c = !filter.symbol || data.symbol === filter.symbol;
      return b && c && d && e && filter && a && g;
    }) as (PeriodicElement, string) => boolean;

    this.formControl = formBuilder.group({
      districtName: '',
      blockName: '',
      phcName: '',
      dc: '',
      date: '',
      filePath: '',
      phase: '',
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

  download(url: string) {
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
          // console.log("x", x);
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

  ListOfCompletedConsultation: any;
  GetDashboardSpokeMaintenanceWithRestrictedAccess(params: any) {
    this.userObjFromToken = this.svcLocalstorage.GetData(
      environment.AuthTokenKeyLSKey
    );
    // GetDashboardSpokeMaintenance(params: any) {
    //   this.userObjFromToken = this.svcLocalstorage.GetData(
    //     environment.AuthTokenKeyLSKey
    //   );
    if (this.userObjFromToken) {
      this.loading = true;
      this.Svc_dashboardService.GetDashboardSpokeMaintenanceWithRestrictedAccess(
        params
      ).subscribe(
        (data1: any) => {
          let data = data1.map((element) => {
            (element['duedate'] = this.duedate(element.date)),
              (element.date = moment(element.date).format('DD-MM-YYYY'));
            return element;
          });
          this.loading = false;
          // console.log(data, 'this is GetDashboardSpokeMaintenanceWithRestrictedAccess data');
          this.ELEMENT_DATA = data;
          // this.ELEMENT_DATA = data.map(res => ({...res, duedate: this.duedate(res.date)}));
          // console.log(this.ELEMENT_DATA,'@@@@@@@')
          this.dataSourceDownload = this.ELEMENT_DATA;
          // console.log(
          //   this.ELEMENT_DATA,
          //   'this is GetDashboardSpokeMaintenanceWithRestrictedAccess data'
          // );
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

            const a =
              !filter.phase ||
              data?.phase.toLowerCase().includes(filter?.phase.toLowerCase());
            const h =
              !filter.cluster ||
              data?.cluster
                ?.toLowerCase()
                .includes(filter.cluster.toLowerCase());

            //const c = !filter.symbol || data.symbol === filter.symbol;
            const f =
              !filter.dc ||
              data.dc.toLowerCase().includes(filter.dc.toLowerCase());
            const g =
              !filter.date || data.date.toLowerCase().includes(filter.date);
            return b && c && d && e && f && g && a && h;
          }) as (PeriodicElement, string) => boolean;
        },
        (err: any) => {
          this.loading = false;
        }
      );
      // this.Svc_dashboardService.GetDashboardSpokeMaintenance(params).subscribe(
      //   (data1: any) => {
      //     let data=  data1.map((element)=>{
      //       element['duedate']=this.duedate(element.date),
      //       element.date=  moment(element.date).format('DD-MM-YYYY')
      //        return element
      //      })
      //     this.loading=false
      //     console.log(data, 'this is GetDashboardSpokeMaintenance data');
      //     this.ELEMENT_DATA = data
      //     // this.ELEMENT_DATA = data.map(res => ({...res, duedate: this.duedate(res.date)}));
      //     console.log(this.ELEMENT_DATA,'@@@@@@@')
      //     this.dataSourceDownload = this.ELEMENT_DATA;
      //     console.log(
      //       this.ELEMENT_DATA,
      //       'this is GetDashboardSpokeMaintenance data'
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
      //       //const c = !filter.symbol || data.symbol === filter.symbol;
      //       const f =
      //       !filter.dc ||
      //       data.dc.toLowerCase().includes(filter.dc.toLowerCase());
      //       const g =
      //       !filter.date ||
      //       data.date.toLowerCase().includes(filter.date);
      //       return  b && c && d && e && f && g;
      //     }) as (PeriodicElement, string) => boolean;
      //   },
      //   (err:any)=>{
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
        // console.log(data, 'this is GetAllPHC data');
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
      let params = new HttpParams();
      params = params.append('fromDate', obj.from.format('YYYY-MM-DD'));
      params = params.append('toDate', obj.to.format('YYYY-MM-DD'));

      this.dataSource = new MatTableDataSource<PeriodicElement>(
        this.ELEMENT_DATA
      );

      // console.log(this.utilsService.monthDiffInDay(obj.to, obj.from),'1000')

      if (this.utilsService.monthDiffInDay(obj.to, obj.from) > 100) {
        this.ValidationMessage =
          'Please select date gap for 100 day maximum duration!';
        this.ShowErrorMessage = true;
      } else if (this.utilsService.monthDiffInDay(obj.to, obj.from) < 0) {
        this.ValidationMessage =
          'From Date should be less than or equal to To Date.';
        this.ShowErrorMessage = true;
      }
      if (!this.ValidationMessage) {
        this.GetDashboardSpokeMaintenanceWithRestrictedAccess({
          params,
        });
        // this.GetDashboardSpokeMaintenance({
        //   params,
        // });
      } else {
        this.dataSource = new MatTableDataSource<PeriodicElement>(
          this.ELEMENT_DATA
        );
      }
    }
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
    this.OkDisable = false;
    this.countOfFiles = this.ELEMENT_DATA.length;
this.BulkErrorStatus=false
    // console.log(this.countOfFiles,'this.countOfFiles ');

    if (this.ELEMENT_DATA?.length === 0) {
      this.loading = false;
      this.ShowPopup = false;
      this.ShowerrPopup = true;
      return;
    }

    this.ShowPopup = true;
    this.ShowerrPopup = false;

    for (let i = 0; i <= this.ELEMENT_DATA.length; i++) {
      this.downloadAll(this.fileheader + this.ELEMENT_DATA[i].filePath);
    }
  }

  BulkErrorStatus:boolean=false
 modifiedUrls:any=[]
 totalfilecount:any
  errorDisplay() {
    console.log(this.downloadarray, 'downloadarray');
    if (this.bulkError.length == 0) {
      document.getElementById('closeModalButton').click();
      return false;
    }
    this.modifiedUrls =this.modifiedUrls.map(url => {
    
      // Remove everything after the dot
      const withoutDotAndAfter = url;
    
      return withoutDotAndAfter;
    });
    // this.bulkError=this.bulkError.join('\n')
    console.log(this.modifiedUrls,'this.bulkError');
    this.BulkErrorStatus=true;
    this.ShowPopup = false;
    this.ShowerrPopup = false;
    this.totalfilecount=this.modifiedUrls.length
    // this._sweetAlert.sweetAlert(`File not found ${this.modifiedUrls}`, 'error');
  }

  bulkError: any = [];
  downloadSubscription: any;
  downloadarray: any = [];

  async downloadAll(url: string) {
    this.fileCount = this.fileCount + 1;
    // this.loading=true
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

          // console.log("x", x);
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
          // console.log(filename,'filename');

          // this is necessary as link.click() does not work on the latest firefox
          link.dispatchEvent(
            new MouseEvent('click', {
              bubbles: true,
              cancelable: true,
              view: window,
            })
          );
          if (this.downloadedCout === this.ELEMENT_DATA.length) {
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

          // count++
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
            if (this.fileCount === this.ELEMENT_DATA.length) {
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

  public Download(value: any) {
    if (this.ELEMENT_DATA.length == 0) {
      this.loading = false;
      this._sweetAlert.sweetAlert('No Data Available', 'error');
      return;
    }
    // console.log(value);
    if (value == 'Excel') {
      let count: number = 1000000;
      // for (let index = 0;  this.dataSourceDownload.length>=index; index=index+count) {;
      //      var D = this.dataSourceDownload.slice(index,index+count);
      // }

      var newArray = this.dataSourceDownload.map((item: any) => {
        return {
          'SL No.': item.srNo,
          Cluster: item.cluster,
          District: item.districtName,
          Block: item.blockName,
          PHC: item.phcName,
          Phase: item.phase,
          'Name Of MO': item.dc,
          Date: item.date,
          'Due Date': item.duedate,
        };
      });
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

      tempObj.push(e.dc);
      tempObj.push(e.date);
      tempObj.push(e.duedate);
      // tempObj.push(e.filePath);
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

          'Name of MO',
          'Date',
          'Due Date',
          // 'File'
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

  duedate(value: any) {
    const d = new Date(value);
    return this.datepipe.transform(d.setMonth(d.getMonth() + 3), 'dd-MM-yyyy');
  }
}
export interface PeriodicElement {
  srNo: number;
  districtName: string;
  blockName: string;
  phcName: string;
  dc: string;
  date: string;
  filePath: string;
}
