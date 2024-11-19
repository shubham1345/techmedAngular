
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

import { DatePipe } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ngxLoadingAnimationTypes } from 'ngx-loading';

import { SvclocalstorageService } from 'src/app/services/services/svclocalstorage.service';

import { environment } from 'src/environments/environment';
import { svc_PHCservice } from 'src/app/services/services/svc_PHC.service';
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
import { faClose, faFileExcel, faFilePdf, faSlash } from '@fortawesome/free-solid-svg-icons';
import { UtilsService } from 'src/app/utils/Utils_Service';
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
  selector: 'app-prescription-not-generated-by-phcs',
  templateUrl: './prescription-not-generated-by-phcs.component.html',
  styleUrls: ['./prescription-not-generated-by-phcs.component.css'],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    },
    {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS},
  ],
})
export class PrescriptionNotGeneratedByPhcsComponent implements AfterViewInit ,OnInit{
  showPrescription = false;
  loading = false;
  ImagesHeader = environment.ImagesHeader
  public ngxLoadingAnimationTypes = ngxLoadingAnimationTypes;
  public config = {
    animationType: ngxLoadingAnimationTypes.none,
    backdropBorderRadius: '3px',
  };


  userObjFromToken: any;
  
  specializationID: string;
  dataSourceDownload: any[];
  ReportName: string;
  faFilePdf = faFilePdf;
  faFileExcel = faFileExcel;
  faClose = faClose;
  today:Date=new Date();
  displayedColumns: string[] = [
    'srNo',
    'phcName',
    'count',
    'date'
  ];
  
  ELEMENT_DATA: PeriodicElement[] = [];
  dataSource = new MatTableDataSource<PeriodicElement>(this.ELEMENT_DATA);

  constructor(
    private svcLocalstorage: SvclocalstorageService,
    private _liveAnnouncer: LiveAnnouncer,
    private Svc_PHCservice: svc_PHCservice,
    public datepipe: DatePipe,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private utilsService:UtilsService,
    private _sweetAlert:SvcmainAuthserviceService
  ) {
        this._sweetAlert.getLoader().subscribe((res:any)=>{
          this.loading=res
          console.log('med',this.loading)
        })

    this.ReportName = 'Prescription_Not_Generated_By_PHCs';
   

    this.dataSourceDownload = this.ELEMENT_DATA;
    
    this.GetDateWisePrescriptionNotGeneratedByPhcs();
    
    
  }

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  ngOnInit(): void {
    let currenttime = new Date().getHours();
    
    this.showPrescription = currenttime >16 ?true:false;
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    
  }

  ListOfCompletedConsultation: any;
  HeaderData:any
  isValid:boolean=false;
  GetDateWisePrescriptionNotGeneratedByPhcs() {
    this.loading=true;
    this.userObjFromToken = this.svcLocalstorage.GetData(
      environment.AuthTokenKeyLSKey
    );
  
    if (this.userObjFromToken) {
      this.Svc_PHCservice.GetDateWisePrescriptionNotGeneratedByPhcs().subscribe(
        (data: any) => {
          this.loading=false;
          console.log(data, 'this is GetDateWisePrescriptionNotGeneratedByPhcs data');
          this.ELEMENT_DATA = data;
          this.HeaderData = data;
          this.dataSourceDownload = this.ELEMENT_DATA;
          this.isValid=true;
          console.log(
            this.ELEMENT_DATA,
            'this is GetDateWisePrescriptionNotGeneratedByPhcs data'
          );
          this.dataSource = new MatTableDataSource<PeriodicElement>(
            this.ELEMENT_DATA
          );
          this.dataSource.sort = this.sort;
          this.dataSource.paginator = this.paginator;

          
      
        },
        (error)=>{
          this.loading=false;
        }
      );

    }
  }
  
  public Download(value: any) {
    console.log(value);
    if (value == 'Excel') {
      let count:number=1000000;
      
      
      var newArray=this.dataSourceDownload.map((item:any)=>{
        return {
          'SL No.':item.srNo,'PHC':item.phcName,'Count':item.count,'Date':item.date
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
      fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION
    );
  }
}
export interface PeriodicElement {
  srNo: number;
  phcName: string;
  count: number;
  date: Date;
}
