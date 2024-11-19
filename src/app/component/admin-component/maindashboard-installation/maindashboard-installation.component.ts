import { DatePipe ,Location} from '@angular/common';
import { Component, OnInit, ViewChild,ElementRef } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import {
  faFilePdf,
  faFileExcel,
  faClose,
  faDownload,
} from '@fortawesome/free-solid-svg-icons';

import {
  MomentDateAdapter,
  MAT_MOMENT_DATE_ADAPTER_OPTIONS,
} from '@angular/material-moment-adapter';
import {
  DateAdapter,
  MAT_DATE_FORMATS,
  MAT_DATE_LOCALE,
} from '@angular/material/core';
import { UtilsService } from 'src/app/utils/Utils_Service';
import { svc_dashboardService } from 'src/app/services/services/svc_dashboard.service';

import { MatPaginator } from '@angular/material/paginator';
import { MatSort, SortDirection } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ngxLoadingAnimationTypes } from 'ngx-loading';
import { SvcmainAuthserviceService } from 'src/app/services/services/svcmain-authservice.service';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
const EXCEL_TYPE =
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';
declare var $: any;
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
  selector: 'app-maindashboard-installation',
  templateUrl: './maindashboard-installation.component.html',
  styleUrls: ['./maindashboard-installation.component.css'],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS],
    },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
})
export class MaindashboardInstallationComponent implements OnInit {
  public ngxLoadingAnimationTypes = ngxLoadingAnimationTypes;
  public config = {
    animationType: ngxLoadingAnimationTypes.none,
    backdropBorderRadius: '3px',
  };

  loading: boolean = false;

  faFilePdf = faFilePdf;
  faFileExcel = faFileExcel;
  faClose = faClose;
  faDownload = faDownload;
  today: Date = new Date();

  ShowErrorMessage: boolean;
  ValidationMessage: any;

  searchForm: FormGroup;
  filterForm: FormGroup;
  dataSouce: any = [];

  displayedColumns: string[] = [
    'srNo',
    'cluster',
    'districtName',
    'blockName',
    'phcName',
    'phase',
    'NameOfMo',
    'date',
    'filePath',
  ];

  fileheader = environment.ImagesHeader;
  reportName: any = 'Installation';
  reportDataArray: any = [];
  @ViewChild('modal') modal: ElementRef;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private _fb: FormBuilder,
    private _datepipe: DatePipe,
    private utilsService: UtilsService,
    private _maindashboardService: svc_dashboardService,
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

    this.searchForm = this._fb.group({
      todate: [new Date()],
      fromdate: [new Date()],
    });

    this.filterForm = this._fb.group({
      cluster: [''],
      districtName: [''],
      blockName: [''],
      phcName: [''],
      phase: [''],
      moName: [''],
      // dcName:[''],
      date: [''],
    });

    this.filterForm.valueChanges.subscribe((value) => {
      const filter = { ...value, name: value.name } as string;
      this.dataSouce.filter = filter;
    });
  }

  ngOnInit(): void {
    // this.getReport()
  }

  getReport() {
    this.loading = true;
    const fromdate = this._datepipe.transform(
      this.searchForm.value.fromdate,
      'yyyy-MM-dd'
    );
    const todate = this._datepipe.transform(
      this.searchForm.value.todate,
      'yyyy-MM-dd'
    );
    this._maindashboardService
      .getInstallationReportWithRestrictedAccess(fromdate, todate)
      .subscribe(
        (res: any) => {
          this.loading = false;
          this.reportDataArray = res;
          this.dataSouce = new MatTableDataSource(res);
          this.dataSouce.paginator = this.paginator;
          this.dataSouce.sort = this.sort;

          this.dataSouce.filterPredicate = ((data, filter) => {
            console.log(data, '++++++', filter);
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
              !filter.moName ||
              data.dcName.toLowerCase().includes(filter.moName.toLowerCase());
            const h =
              !filter.cluster ||
              data.cluster.toLowerCase().includes(filter.cluster.toLowerCase());
            const i =
              !filter.phase ||
              data.phase.toLowerCase().includes(filter.phase.toLowerCase());

            const g =
              !filter.cluster ||
              data.cluster.toLowerCase().includes(filter.cluster);

            return b && c && d && g && e && h && i;
          }) as (PeriodicElement, string) => boolean;
        },
        (err: any) => {
          this.loading = false;
        }
      );
    //     this._maindashboardService.getInstallationReport(fromdate,todate).subscribe((res:any)=>{
    // this.loading=false
    // this.reportDataArray=res
    // this.dataSouce = new MatTableDataSource(res)
    // this.dataSouce.paginator = this.paginator;
    //     this.dataSouce.sort = this.sort;

    //     this.dataSouce.filterPredicate = ((data, filter) => {
    //       console.log(data,'++++++',filter)
    //       const b =
    //         !filter.districtName ||
    //         data.districtName.toLowerCase().includes(filter.districtName.toLowerCase());
    //       const c =
    //         !filter.blockName ||
    //         data.blockName.toLowerCase().includes(filter.blockName.toLowerCase());
    //       const d =
    //         !filter.phcName ||
    //         data.phcName.toLowerCase().includes(filter.phcName.toLowerCase());

    //         const e=!filter.moName|| data.dcName.toLowerCase().includes(filter.moName.toLowerCase())

    //       const g =
    //       !filter.date ||
    //       data.date.toLowerCase().includes(filter.date);
    //       return  b && c && d  && g && e;
    //     }) as (PeriodicElement, string) => boolean;

    //     },(err:any)=>{
    //       this.loading=false
    //     })
  }

  submitdetails() {
    this.ValidationMessage = '';
    this.ShowErrorMessage = false;
    console.log(this.searchForm.value.todate);

    if (
      this.utilsService.monthDiffInDay(
        this.searchForm.value.todate,
        this.searchForm.value.fromdate
      ) > 92
    ) {
      this.ValidationMessage =
        'Please select date gap for 92 day maximum duration!';
      this.ShowErrorMessage = true;
    } else if (
      this.utilsService.monthDiffInDay(
        this.searchForm.value.todate,
        this.searchForm.value.fromdate
      ) < 0
    ) {
      this.ValidationMessage =
        'From Date should be less than or equal to To Date.';
      this.ShowErrorMessage = true;
    } else {
      this.getReport();
    }
  }

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
    this.OkDisable = false;
    this.BulkErrorStatus=false
    this.countOfFiles = this.reportDataArray.length;

    console.log(this.countOfFiles, 'this.countOfFiles ');

    if (this.reportDataArray.length === 0) {
      this.loading = false;
      this.ShowPopup = false;
      this.ShowerrPopup = true;

      return;
    }

    this.ShowPopup = true;
    this.ShowerrPopup = false;

    for (let i = 0; i <= this.reportDataArray.length; i++) {
      // this.loading=true

      console.log(this.fileCount);

      this.downloadAll(this.fileheader + this.reportDataArray[i].filePath);
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
    this.modifiedUrls =this.modifiedUrls.map(url => {
    
      // Remove everything after the dot
      const withoutDotAndAfter = url
    
      return withoutDotAndAfter;
    });
    // this.bulkError=this.bulkError.join('\n')
    console.log(this.modifiedUrls,'this.bulkError');
    this.BulkErrorStatus=true;
    this.ShowPopup = false;
    this.ShowerrPopup = false;
    this.totalfilecount=this.modifiedUrls.length
    // this._sweetAlert.sweetAlert(`File not found ${this.bulkError}`, 'error');
  }

  bulkError: any = [];
  downloadSubscription: any;
  downloadarray: any = [];
  downloadAll(url: string) {
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
          if (this.downloadedCout === this.reportDataArray.length) {
            this.OkDisable = true;
          }
          setTimeout(function () {
            // For Firefox it is necessary to delay revoking the ObjectURL
            window.URL.revokeObjectURL(data);
            link.remove();
            // if (this.fileCount === this.reportDataArray.length) {
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
              const withoutDotAndAfter = withoutPrefix
            
              return withoutDotAndAfter;
            });
            this.loading = false;
            if (this.fileCount === this.reportDataArray.length) {
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

  downloadPdf() {
    if (this.reportDataArray.length == 0) {
      this.loading = false;
      this._sweetAlert.sweetAlert('No Data Available', 'error');
      return;
    }
    console.log(this.dataSouce);
    var prepare = [];
    this.reportDataArray.forEach((e) => {
      var tempObj = [];
      tempObj.push(e.srNo);
      tempObj.push(e.cluster);
      tempObj.push(e.districtName);
      tempObj.push(e.blockName);
      tempObj.push(e.phcName);
      tempObj.push(e.phase);
      tempObj.push(e.dcName);
      tempObj.push(this._datepipe.transform(e.date, 'dd-MM-yyyy'));
      prepare.push(tempObj);
    });
    const doc = new jsPDF('l', 'pt', [1000, 1000]);
    doc.setFontSize(18);
    doc.text(this.reportName, 11, 20);
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
          'Name of Mo',
          'Date',
        ],
      ],
      body: prepare,
      // columnStyles: {
      //   0: {cellWidth: 80},//80
      //   1: {cellWidth: 150},//150
      //   2: {cellWidth: 150},//150
      //   3: {cellWidth: 100},//100
      //   5:{cellWidth: 80},//80
      //   6: {cellWidth: 140},//166

      // }
    });
    doc.save(
      this.reportName +
        ' ' +
        this._datepipe.transform(
          this.searchForm.value.fromdate,
          'dd-MMM-yyyy'
        ) +
        ' to ' +
        this._datepipe.transform(this.searchForm.value.todate, 'dd-MMM-yyyy') +
        '.pdf'
    );
  }

  public downloadExcel() {
    if (this.reportDataArray.length == 0) {
      this.loading = false;
      this._sweetAlert.sweetAlert('No Data Available', 'error');
      return;
    }
    let count: number = 1000000;

    var newArray = this.reportDataArray.map((item: any) => {
      return {
        'SL No.': item.srNo,
        Cluster: item.cluster,
        District: item.districtName,
        Block: item.blockName,
        PHC: item.phcName,
        Phase: item.phase,
        'Name Of MO': item.dcName,
        Date: this._datepipe.transform(item.date, 'dd-MM-yyyy'),
      };
    });
    this.exportAsExcelFile(newArray, this.reportName);
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
        this._datepipe.transform(
          this.searchForm.value.fromdate,
          'dd-MMM-yyyy'
        ) +
        ' to ' +
        this._datepipe.transform(this.searchForm.value.todate, 'dd-MMM-yyyy') +
        +EXCEL_EXTENSION
    );
  }
}
