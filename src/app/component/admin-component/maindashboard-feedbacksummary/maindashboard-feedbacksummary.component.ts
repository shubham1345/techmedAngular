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
import { ngxLoadingAnimationTypes } from 'ngx-loading';

import { SvclocalstorageService } from 'src/app/services/services/svclocalstorage.service';
import { Chart } from "chart.js";
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
  selector: 'app-maindashboard-feedbacksummary',
  templateUrl: './maindashboard-feedbacksummary.component.html',
  styleUrls: ['./maindashboard-feedbacksummary.component.css'],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    },
    {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS},
  ],
})
export class MaindashboardFeedbacksummaryComponent implements AfterViewInit {
  loading = false;
  ImagesHeader = environment.ImagesHeader
  public ngxLoadingAnimationTypes = ngxLoadingAnimationTypes;
  public config = {
    animationType: ngxLoadingAnimationTypes.none,
    backdropBorderRadius: '3px',
  };


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
    'cluster',
    'districtName',
    'blockName',
    'phcName',
    'phase',
    'patientName',
    'mobileNo',
    'doctorName',
    'feedback',
    'comments',
  ];
  filterValues = {

    cluster:  '',
    districtName:  '',
    blockName:  '',
    phcName:  '',
    phase:  '',
    patientName: '',
    mobileNo: '',
    doctorName: '',
    feedback: '',
    comments: '',

  };
  ELEMENT_DATA: PeriodicElement[] = [];
  dataSource = new MatTableDataSource<PeriodicElement>(this.ELEMENT_DATA);
  public chart: Chart;
  dateForm:FormGroup
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

    this.dateForm=this.fb.group({
      fromdate:new FormControl(new Date()),
      todate:new FormControl(new Date())
    })


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

    this.ReportName = 'Feedback Details';
   

    this.dataSourceDownload = this.ELEMENT_DATA;
    // let params = new HttpParams();
    // params = params.append('fromDate', this.datepipe.transform(new Date(), 'yyyy-MM-dd'));
    // params = params.append('toDate', this.datepipe.transform(new Date(), 'yyyy-MM-dd'));
    //this.GetDashboardFeedbackSummaryReportData();
    // this.GetDashboardFeedbackSummaryReportDataWithRestrictedAccess();
    this.HeaderData="";
    this.TotalRating=0;
    this.oneStar=0;
    this.twoStar=0;
    this.threeStar=0;
    this.fourStar=0;
    this.fiveStar=0;
    //this.GetDashboardFeedbackSummaryReport();
    this.GetDashboardFeedbackSummaryReportWithRestrictedAccess();

    //////////////////////////////////////////////////////////////
    this.dataSource.filterPredicate = ((data, filter) => {
      
      const b =
        !filter.districtName ||
        data.districtName.toLowerCase().includes(filter.districtName);
      const c = !filter.blockName || data.blockName.toLowerCase().includes(filter.blockName);
      const d = !filter.phcName || data.phcName.toLowerCase().includes(filter.phcName);
      const e = !filter.patientName || data.patientName.toLowerCase().includes(filter.patientName);
      const f = !filter.mobileNo || data.mobileNo.toLowerCase().includes(filter.mobileNo);
      const g =
      // = !filter.doctorName || data.doctorName.toLowerCase().includes(filter.doctorName);
      !filter.doctorName||  (filter.doctorName.trim().toLowerCase()!='null' &&

      JSON.stringify(data.doctorName).toLowerCase().includes(filter.doctorName.toLowerCase()))
      const h = !filter.feedback || data.feedback === filter.feedback;
      // const h = !filter.feedback || data.feedback.includes(filter.feedback);

      const i = !filter.comments || data.comments.toLowerCase().includes(filter.comments);
      const j = !filter.cluster || data.cluster.toLowerCase().includes(filter.cluster);
      const k = !filter.phase || data.phase.toLowerCase().includes(filter.phase);
      return  b && c && d && e&& f && g && h&& i && j && k ;
    }) as (PeriodicElement, string) => boolean;

    this.formControl = formBuilder.group({
     
      cluster:'',
      districtName:  '',
      blockName:  '',
      phcName:  '',
      phase:'',
      patientName: '',
      mobileNo: '',
      doctorName: '',
      feedback: '',
      comments: '',
     
    });
    this.formControl.valueChanges.subscribe((value) => {
      const filter = { ...value, name: value.name } as string;
      this.dataSource.filter = filter;
    });
  }

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
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
  HeaderData:any
  isValid:boolean=false;
  GetDashboardFeedbackSummaryReportDataWithRestrictedAccess() {
    this.loading=true;
    this.userObjFromToken = this.svcLocalstorage.GetData(
      environment.AuthTokenKeyLSKey
    );
  // GetDashboardFeedbackSummaryReportData() {
  //   this.loading=true;
  //   this.userObjFromToken = this.svcLocalstorage.GetData(
  //     environment.AuthTokenKeyLSKey
  //   );
    if (this.userObjFromToken) {
      
      let todate=this.datepipe.transform(this.dateForm.value.todate,'yyyy-MM-dd')
      let fromdate=this.datepipe.transform(this.dateForm.value.fromdate,'yyyy-MM-dd')
      this.Svc_dashboardService.GetDashboardFeedbackSummaryReportDataWithRestrictedAccess(fromdate,todate).subscribe(
        (data: any) => {
          this.loading=false;
          console.log(data, 'this is GetDashboardFeedbackReport data');
          this.ELEMENT_DATA = data;
          this.HeaderData = data;
          this.dataSourceDownload = this.ELEMENT_DATA;
          this.isValid=true;
          console.log(
            this.ELEMENT_DATA,
            'this is GetDashboardFeedbackReport data'
          );
          this.dataSource = new MatTableDataSource<PeriodicElement>(
            this.ELEMENT_DATA
          );
          this.dataSource.sort = this.sort;
          this.dataSource.paginator = this.paginator;

          this.dataSource.filterPredicate = ((data, filter) => {
            
            const b =
              !filter.districtName ||
              data.districtName.toLowerCase().includes(filter.districtName.toLowerCase());
            const c = !filter.blockName || data.blockName.toLowerCase().includes(filter.blockName.toLowerCase());
            const d = !filter.phcName || data.phcName.toLowerCase().includes(filter.phcName.toLowerCase());
            const e = !filter.patientName || data.patientName.toLowerCase().includes(filter.patientName.toLowerCase());
            const f = !filter.mobileNo || data.mobileNo.toLowerCase().includes(filter.mobileNo.toLowerCase());
            const g = 
            // !filter.doctorName || data.doctorName.toLowerCase().includes(filter.doctorName.toLowerCase());
            !filter.doctorName||  (filter.doctorName.trim().toLowerCase()!='null' &&

      JSON.stringify(data.doctorName).toLowerCase().includes(filter.doctorName.toLowerCase()))
            const h = !filter.feedback || data.feedback === filter.feedback;
            // const h = !filter.feedback || data.feedback.includes(filter.feedback);

            const i = !filter.comments || data.comments.toLowerCase().includes(filter.comments.toLowerCase());
            const j = !filter.cluster || data.cluster.toLowerCase().includes(filter.cluster.toLowerCase());
            const k = !filter.phase || data.phase.toLowerCase().includes(filter.phase.toLowerCase());
            return  b && c && d && e&& f && g && h&& i && j && k;
          }) as (PeriodicElement, string) => boolean;
      
      
        },
        (error)=>{
          this.loading=false;
        }
      );
      // this.Svc_dashboardService.GetDashboardFeedbackSummaryReportData(fromdate,todate).subscribe(
      //   (data: any) => {
      //     this.loading=false;
      //     console.log(data, 'this is GetDashboardFeedbackReport data');
      //     this.ELEMENT_DATA = data;
      //     this.HeaderData = data;
      //     this.dataSourceDownload = this.ELEMENT_DATA;
      //     this.isValid=true;
      //     console.log(
      //       this.ELEMENT_DATA,
      //       'this is GetDashboardFeedbackReport data'
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
      //       const c = !filter.blockName || data.blockName.toLowerCase().includes(filter.blockName.toLowerCase());
      //       const d = !filter.phcName || data.phcName.toLowerCase().includes(filter.phcName.toLowerCase());
      //       const e = !filter.patientName || data.patientName.toLowerCase().includes(filter.patientName.toLowerCase());
      //       const f = !filter.mobileNo || data.mobileNo.toLowerCase().includes(filter.mobileNo.toLowerCase());
      //       const g = 
      //       // !filter.doctorName || data.doctorName.toLowerCase().includes(filter.doctorName.toLowerCase());
      //       !filter.doctorName||  (filter.doctorName.trim().toLowerCase()!='null' &&

      // JSON.stringify(data.doctorName).toLowerCase().includes(filter.doctorName.toLowerCase()))
      //       const h = !filter.feedback || data.feedback === filter.feedback;
      //       // const h = !filter.feedback || data.feedback.includes(filter.feedback);

      //       const i = !filter.comments || data.comments.toLowerCase().includes(filter.comments.toLowerCase());
      //       return  b && c && d && e&& f && g && h&& i;
      //     }) as (PeriodicElement, string) => boolean;
      
      
      //   },
      //   (error)=>{
      //     this.loading=false;
      //   }
      // );
    }
  }
 

  TotalRating:number
  oneStar:number
  twoStar:number
  threeStar:number
  fourStar:number
  fiveStar:number
  dataarr: any[];
  value: number[] = [];
  GetDashboardFeedbackSummaryReportWithRestrictedAccess() {
    this.userObjFromToken = this.svcLocalstorage.GetData(
      environment.AuthTokenKeyLSKey
    );
  // GetDashboardFeedbackSummaryReport() {
  //   this.userObjFromToken = this.svcLocalstorage.GetData(
  //     environment.AuthTokenKeyLSKey
  //   );
    if (this.userObjFromToken) {
      this.Svc_dashboardService.GetDashboardFeedbackSummaryReportWithRestrictedAccess().subscribe(
        (data: any) => {
          this.dataarr=(data);
          console.log(data, 'this is GetDashboardFeedbackSummaryReportWithRestrictedAccess data');
          this.dataarr.forEach(element => {
            console.log(element.feedback, 'this is GetDashboardGraph data');
            if (element.feedback>0)
            {
              this.value.push(element.feedbackCount)
              this.TotalRating=this.TotalRating+element.feedbackCount;
            } 
            if(element.feedback==1)
            {
              this.oneStar=element.feedbackCount
            } 
            if(element.feedback==2)
            {
              this.twoStar=element.feedbackCount
            } 
            if(element.feedback==3)
            {
              this.threeStar=element.feedbackCount
            } 
            if(element.feedback==4)
            {
              this.fourStar=element.feedbackCount
            } 
            if(element.feedback==5)
            {
              this.fiveStar=element.feedbackCount
            } 
            });
         
            console.log(this.value, 'aaaaathis is GetDashboardFeedbackSummaryReportWithRestrictedAccess data');

          this.chart = new Chart("canvas", {
            type: "bar",
            data: {
              labels: ['5 Star','4 Star','3 Star','2 Star','1 Star'],
              datasets: [
                {
                  label: "Patient Count",
                  data: this.value,
                  backgroundColor: [
                    "rgba(12, 204, 57, 1)",
                    "rgba(169, 204, 12, 1)",
                    "rgba(255, 206, 86, 1)",
                    "rgba(204, 169, 12, 1)",
                    "rgba(204, 12, 12, 1)",
                    "rgba(255, 159, 64, 1)"
                  ],
                  borderColor: [
                    "rgba(12, 204, 57, 1)",
                    "rgba(169, 204, 12, 1)",
                    "rgba(255, 206, 86, 1)",
                    "rgba(204, 169, 12, 1)",
                    "rgba(204, 12, 12, 1)",
                    "rgba(255, 159, 64, 1)"
                  ],
                  borderWidth: 1
                }
              ]
            },
            options: {
              indexAxis: 'y',
              // Elements options apply to all of the options unless overridden in a dataset
              // In this case, we are setting the border of each horizontal bar to be 2px wide
              elements: {
                bar: {
                  borderWidth: 1,
                }
              },
              responsive: true,
              plugins: {
                legend: {
                  position: 'right',
                },
                title: {
                  display: true,
                  text: 'Feedback Summary Chart'
                }
              }
            },
          });
      

      
        }
      );
      // this.Svc_dashboardService.GetDashboardFeedbackSummaryReport().subscribe(
      //   (data: any) => {
      //     this.dataarr=(data);
      //     console.log(data, 'this is GetDashboardFeedbackSummaryReport data');
      //     this.dataarr.forEach(element => {
      //       console.log(element.feedback, 'this is GetDashboardGraph data');
      //       if (element.feedback>0)
      //       {
      //         this.value.push(element.feedbackCount)
      //         this.TotalRating=this.TotalRating+element.feedbackCount;
      //       } 
      //       if(element.feedback==1)
      //       {
      //         this.oneStar=element.feedbackCount
      //       } 
      //       if(element.feedback==2)
      //       {
      //         this.twoStar=element.feedbackCount
      //       } 
      //       if(element.feedback==3)
      //       {
      //         this.threeStar=element.feedbackCount
      //       } 
      //       if(element.feedback==4)
      //       {
      //         this.fourStar=element.feedbackCount
      //       } 
      //       if(element.feedback==5)
      //       {
      //         this.fiveStar=element.feedbackCount
      //       } 
      //       });
         
      //       console.log(this.value, 'this is GetDashboardFeedbackSummaryReport data');

      //     this.chart = new Chart("canvas", {
      //       type: "bar",
      //       data: {
      //         labels: ['5 Star','4 Star','3 Star','2 Star','1 Star'],
      //         datasets: [
      //           {
      //             label: "Patient Count",
      //             data: this.value,
      //             backgroundColor: [
      //               "rgba(12, 204, 57, 1)",
      //               "rgba(169, 204, 12, 1)",
      //               "rgba(255, 206, 86, 1)",
      //               "rgba(204, 169, 12, 1)",
      //               "rgba(204, 12, 12, 1)",
      //               "rgba(255, 159, 64, 1)"
      //             ],
      //             borderColor: [
      //               "rgba(12, 204, 57, 1)",
      //               "rgba(169, 204, 12, 1)",
      //               "rgba(255, 206, 86, 1)",
      //               "rgba(204, 169, 12, 1)",
      //               "rgba(204, 12, 12, 1)",
      //               "rgba(255, 159, 64, 1)"
      //             ],
      //             borderWidth: 1
      //           }
      //         ]
      //       },
      //       options: {
      //         indexAxis: 'y',
      //         // Elements options apply to all of the options unless overridden in a dataset
      //         // In this case, we are setting the border of each horizontal bar to be 2px wide
      //         elements: {
      //           bar: {
      //             borderWidth: 1,
      //           }
      //         },
      //         responsive: true,
      //         plugins: {
      //           legend: {
      //             position: 'right',
      //           },
      //           title: {
      //             display: true,
      //             text: 'Feedback Summary Chart'
      //           }
      //         }
      //       },
      //     });
      

      
      //   }
      // );
    }
  }

  ShowErrorMessage: boolean;
  ValidationMessage:string;
  submitdetails() {
    this.loading=true;
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
        this.GetDashboardFeedbackSummaryReportDataWithRestrictedAccess(
          //{params,}
          );
        // this.GetDashboardFeedbackSummaryReportData(
        //   //{params,}
        //   );
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
          'SL No.':item.srNo,'Cluster':item.cluster ,'District':item.districtName,'Block':item.blockName,'PHC':item.phcName,'Phase':item.phase ,'Patient Name':item.patientName,'Mobile No':item.mobileNo,'Doctor':item.doctorName,'FeedBack':item.feedback,'Comments':item.comments
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
      fileName +' '+ this.datepipe.transform(this.dateForm.value.fromdate,'dd-MMM-yyyy')+
      ' to '+this.datepipe.transform(this.dateForm.value.todate,'dd-MMM-yyyy')+ EXCEL_EXTENSION
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
      tempObj.push(e.cluster);
      tempObj.push(e.districtName);
      tempObj.push(e.blockName);
      tempObj.push(e.phcName);
      tempObj.push(e.phase);
      tempObj.push(e.patientName);
      tempObj.push(e.mobileNo);
      tempObj.push(e.doctorName);
      tempObj.push(e.feedback);
      tempObj.push(e.comments);
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
        'Patient Name',
        'Mobile No',
        'Doctor',
        'Feedback',
        'Comments',
      ],
      ],
      body: prepare,
    });
    doc.save(this.ReportName +' '+
    this.datepipe.transform(this.dateForm.value.fromdate,'dd-MMM-yyyy')+
    ' to '+this.datepipe.transform(this.dateForm.value.todate,'dd-MMM-yyyy')+'.pdf');
  }

  search()
  {
    this.ValidationMessage="";
    this.ShowErrorMessage=false;   
    console.log(this.dateForm.value.todate);
    
      if (this.utilsService.monthDiffInDay(this.dateForm.value.todate,this.dateForm.value.fromdate)>92) {
        this.ValidationMessage="Please select date gap for 92 day maximum duration!"
        this.ShowErrorMessage=true;
      }
      else if(this.utilsService.monthDiffInDay(this.dateForm.value.todate,this.dateForm.value.fromdate)<0)
      {
        this.ValidationMessage="From Date should be less than or equal to To Date.";
        this.ShowErrorMessage=true;
      }
      else{
this.GetDashboardFeedbackSummaryReportDataWithRestrictedAccess()
//this.GetDashboardFeedbackSummaryReportData()
      }   
  }

  keyPressNumbers(event: any) {
    var charCode = (event.which) ? event.which : event.keyCode;
    // Only Numbers 0-9
    if ((charCode < 49 || charCode > 53)) {
      event.preventDefault();
      return false;
    } else {
      return true;
    }
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
  mobileNo: string;

  doctorName: string;
  feedback: number;
  comments: string;
}
