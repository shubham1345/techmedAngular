import { DatePipe } from '@angular/common';
import { HttpParams } from '@angular/common/http';
import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { svc_dashboardService } from 'src/app/services/services/svc_dashboard.service';
import { SvclocalstorageService } from 'src/app/services/services/svclocalstorage.service';
import { environment } from 'src/environments/environment';
import { faClose, faFileExcel, faFilePdf } from '@fortawesome/free-solid-svg-icons';
import { SvcmainAuthserviceService } from 'src/app/services/services/svcmain-authservice.service';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import { ngxLoadingAnimationTypes } from 'ngx-loading';
import { UtilsService } from 'src/app/utils/Utils_Service';
const EXCEL_TYPE =
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';


import {MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS} from '@angular/material-moment-adapter';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';
import {MatDatepicker} from '@angular/material/datepicker';
import * as _moment from 'moment';
// tslint:disable-next-line:no-duplicate-imports
import {default as _rollupMoment, Moment} from 'moment';

const moment = _rollupMoment || _moment;

export const MY_FORMATS = {
  parse: {
    dateInput: 'MM/YYYY',
  },
  display: {
    dateInput: 'MM/YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

@Component({
  selector: 'app-maindashboard-phc-hr-manpower-report',
  templateUrl: './maindashboard-phc-hr-manpower-report.component.html',
  styleUrls: ['./maindashboard-phc-hr-manpower-report.component.css'],
  providers: [
    // `MomentDateAdapter` can be automatically provided by importing `MomentDateModule` in your
    // application's root module. We provide it at the component level here, due to limitations of
    // our example generation script.
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    },

    {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS},
  ],
  encapsulation: ViewEncapsulation.None
})
export class MaindashboardPhcHRManpowerReportComponent implements OnInit {
  previousMonth=moment().subtract(1, 'month')
  monthyear = new FormControl(this.previousMonth)
  maxdate = moment()
  minDate=moment('01-01-2000')
  ReportName: string = 'HR Manpower Report'
  dataSourceHR:any=[]
  HRReportArray:any=[]
  displayedColumns = [
    'srNo',
    'cluster',
    'districtName',  
    'HRName',
    'workingDays',
    'daysPresent',
    'daysAbsent',
  ];
  HeaderData: any = {
    noOfDaysInMonth: 0,
    totalWorkingDays: 0,
    totalPresentDays: 0,
    availabilityPercentage: 0
  }
  faFilePdf = faFilePdf;
  faFileExcel = faFileExcel;
  faClose = faClose;
  loading: boolean
  employeeName=new FormControl('')

  public ngxLoadingAnimationTypes = ngxLoadingAnimationTypes;
  public config = {
    animationType: ngxLoadingAnimationTypes.none,
    backdropBorderRadius: '3px',
  };


  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  constructor(private svcLocalstorage: SvclocalstorageService, private Svc_dashboardService: svc_dashboardService,
    private _datepipe: DatePipe, private _sweetAlert: SvcmainAuthserviceService, private utilsService:UtilsService,) {

  }

  ngOnInit(): void {

  }

  // setMonthAndYear(normalizedMonthAndYear: Moment, datepicker: MatDatepicker<Moment>) {
  //   const ctrlValue = this.monthyear.value!;
  //   ctrlValue.month(normalizedMonthAndYear.month());
  //   ctrlValue.year(normalizedMonthAndYear.year());
  //   this.monthyear.setValue(ctrlValue);
  //   datepicker.close();
  // }

  chosenYearHandler(normalizedYear: Moment) {
    const ctrlValue = this.monthyear.value;
    ctrlValue.year(normalizedYear.year());
    this.monthyear.setValue(ctrlValue);
  }

  chosenMonthHandler(normalizedMonth: Moment, datepicker: MatDatepicker<Moment>) {
    const ctrlValue = this.monthyear.value;
    ctrlValue.month(normalizedMonth.month());
    this.monthyear.setValue(ctrlValue);
    datepicker.close();
  }



  getHRReport() {
    console.log(this.monthyear.value)
    this.dataSourceHR = []
    if (this.svcLocalstorage.GetData(environment.AuthTokenKeyLSKey)) {
      this.loading = true
      this.Svc_dashboardService.GetHRManpowersAsync(this.monthyear.value).subscribe((res: any) => {
        this.HeaderData = res
        this.HRReportArray=res.hRManpowerVMs
        this.dataSourceHR = new MatTableDataSource(res.hRManpowerVMs)
        this.dataSourceHR.paginator = this.paginator
        this.loading=false
      },(err:any)=>{
        this.loading=false
      })
    }
  }

  filter(value:any)
  {
    let filteredData = this.HRReportArray.filter((item:any) => {
      let employeeName = JSON.stringify(item.employeeName).toLowerCase().indexOf(value.target.value.toLowerCase().trimStart()) !== -1;
      return employeeName;
    
    });

    // Update the table data and pagination
    this.dataSourceHR = new MatTableDataSource(filteredData);
    this.dataSourceHR.paginator = this.paginator;
  }

  downloadPdfHR() {

    console.log(this.dataSourceHR, 'length')
    if(this.dataSourceHR?.data?.length===0 || this.dataSourceHR.length==0)
    {
      this._sweetAlert.sweetAlert('No Data Available','error')
    }
    else{

    let headerArray = ['SL No.','cluster','District','District HR Name','Working Days','Present  Days',' Absent  Days',]
    let pdfdataArray=['srNo','cluster','districtName','employeeName','workingDays','daysPresent','daysAbsent']
    this._sweetAlert.downloadPdf(this.dataSourceHR?.data,headerArray,pdfdataArray,this.ReportName+' '+ this._datepipe.transform(this.monthyear.value,'MMM-yyyy'))
    }
  }  

  DownloadExcelHR() {
    if(this.dataSourceHR?.data?.length===0 || this.dataSourceHR.length==0)
    {
      this._sweetAlert.sweetAlert('No Data Available','error')
    }
    else{
    const newArrayOfObj = this.dataSourceHR.data.map(item => {
      return {
        'SL No.': item.srNo, 'Cluster': item.cluster, 'District': item.districtName, ' District HR Name': item.employeeName, 'Working Days': item.workingDays, ' Present Days': item.daysPresent, ' Absent Days': item.daysAbsent
      };
    });
    this.exportAsExcelFileHR(newArrayOfObj, this.ReportName);
  }
  }

  public exportAsExcelFileHR(json: any[], excelFileName: string): void {
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(json);
    const workbook: XLSX.WorkBook = {
      Sheets: { data: worksheet },
      SheetNames: ['data'],
    };
    const excelBuffer: any = XLSX.write(workbook, {
      bookType: 'xlsx',
      type: 'array',
    });
    this.saveAsExcelFileHR(excelBuffer, excelFileName);
  }

  private saveAsExcelFileHR(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], { type: EXCEL_TYPE });
    FileSaver.saveAs(
      data,
      fileName + ' '+ this._datepipe.transform(this.monthyear.value,'MMM-yyyy') + EXCEL_EXTENSION
    );
  }

}


