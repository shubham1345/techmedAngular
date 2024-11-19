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
import { from, merge, Observable, of as observableOf, of } from 'rxjs';
import { catchError, count, map, startWith, switchMap } from 'rxjs/operators';
import { DatePipe } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ngxLoadingAnimationTypes } from 'ngx-loading';

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
import { D, I } from '@angular/cdk/keycodes';

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

import {
  faClose,
  faFileExcel,
  faFilePdf,
} from '@fortawesome/free-solid-svg-icons';
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
    monthYearA11yLabel: 'MMM YYYY',
  },
};

@Component({
  selector: 'app-maindashboard-appointment',
  templateUrl: './maindashboard-appointment.component.html',
  styleUrls: ['./maindashboard-appointment.component.css'],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS],
    },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
})
export class MaindashboardAppointmentComponent implements AfterViewInit {
  loading = false;
  ImagesHeader = environment.ImagesHeader
  public ngxLoadingAnimationTypes = ngxLoadingAnimationTypes;
  public config = {
    animationType: ngxLoadingAnimationTypes.none,
    backdropBorderRadius: '3px',
  };
  date = new FormControl(moment());
  IsDateNotSelected: boolean;

  chosenYearHandler(normalizedYear: Moment) {
    const ctrlValue = this.date.value;
    ctrlValue.year(normalizedYear.year());
    this.date.setValue(ctrlValue);
  }

  chosenMonthHandler(
    normalizedMonth: Moment,
    datepicker: MatDatepicker<Moment>
  ) {
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
  today: Date = new Date();
  displayedColumns: string[] = [
    'srNo',
    'cluster',
    'districtName',
    'blockName',
    'phcName',
    'phase',
    'patientName',
    'mobileNo',
    'doctor',
    'Specialization',
    'appointmentTime',
    'consultStatus',
    'doctorAvailable',
    'patientAvailable',
    
  ];
  filterValues = {
    // srNo: '',
    districtName: '',
    blockName: '',
    phcName: '',
    patientName: '',
    mobileNo: '',
    doctor: '',
    appointmentTime: '',
    consultStatus: '',
    doctorAvailable: '',
    patientAvailable: '',
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
    private utilsService: UtilsService,
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
    //this.ELEMENT_DATA.length
    this.ReportName = 'Appointment Report';
   
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
    // this.GetDashboardAppointment({
    //   params,
    // });
    // this.GetDashboardAppointmentWithRestrictedAccess({
    //   params,
    // });
    //////////////////////////////////////////////////////////////
    this.dataSource.filterPredicate = ((data, filter) => {
      //const a = !filter.srNo || data.srNo === filter.srNo;
      const b =
        !filter.districtName ||
        data.districtName.toLowerCase().includes(filter.districtName);
      const c =
        !filter.blockName ||
        data.blockName.toLowerCase().includes(filter.blockName);
      const d =
        !filter.phcName || data.phcName.toLowerCase().includes(filter.phcName);

      // const e = !filter.patientName || data.patientName === filter.patientName;
      const e = !filter.patientName || data.patientName.toLowerCase().includes(filter.patientName);

      // const f = !filter.mobileNo || data.mobileNo === filter.mobileNo;
      const f = !filter.mobileNo || data.mobileNo.toLowerCase().includes(filter.mobileNo);
      // const g = !filter.doctor || data.doctor === filter.doctor;
      const g = !filter.doctor || data.doctor.toLowerCase().includes(filter.doctor);
      // var h =
      //   !filter.appointmentTime ||
      //   data.appointmentTime === filter.appointmentTime;
      //   console.log(data.appointmentTime,'data.appointmentTime1');
        
        const h = !filter.appointmentTime || data.appointmentTime?.toLowerCase().includes(filter?.appointmentTime);
        console.log( data.appointmentTime,' data.appointmentTime1');
        
      // const i =
      //   !filter.consultStatus || data.consultStatus === filter.consultStatus;
      const i = !filter.consultStatus || data.consultStatus.toLowerCase().includes(filter.consultStatus);

      // const j =
      //   !filter.doctorAvailable ||
      //   data.doctorAvailable === filter.doctorAvailable;
      const j = !filter.doctorAvailable || data.doctorAvailable.toLowerCase().includes(filter.doctorAvailable);

      // const k =
      //   !filter.patientAvailable ||
      //   data.patientAvailable === filter.patientAvailable;
      const k = !filter.patientAvailable || data.patientAvailable.toLowerCase().includes(filter.patientAvailable);
      const a = !filter.cluster || data.cluster.toLowerCase().includes(filter.cluster);

      return b && c && d && e && f && g && h && i && j && k &&a;
    }) as (PeriodicElement, string) => boolean;

    this.formControl = formBuilder.group({
      //srNo: '',
      districtName: '',
      blockName: '',
      phcName: '',
      phase:'',
      patientName: '',
      mobileNo: '',
      doctor: '',
      appointmentTime: '',
      consultStatus: '',
      doctorAvailable: '',
      patientAvailable: '',
      cluster:''
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
    this.HeaderData = '';
    this.HeaderData.noOfDaysInMonth = 0;
    this.HeaderData.totalWorkingDays = 0;
    this.HeaderData.totalPresentDays = 0;
    this.HeaderData.availabilityPercentage = 0;
  }
  @ViewChild('content', { static: false }) content: ElementRef;

  ListOfCompletedConsultation: any;
  HeaderData: any;
  isValid: boolean = false;
  GetDashboardAppointmentWithRestrictedAccess(params: any) {
    this.loading=true;
    this.userObjFromToken = this.svcLocalstorage.GetData(
      environment.AuthTokenKeyLSKey
    );
    // GetDashboardAppointment(params: any) {
    //   this.loading=true;
    //   this.userObjFromToken = this.svcLocalstorage.GetData(
    //     environment.AuthTokenKeyLSKey
    //   );
    if (this.userObjFromToken) {
      this.Svc_dashboardService.GetDashboardAppointmentWithRestrictedAccess(params).subscribe(
        (data1: any) => {
        let data=  data1.map((element)=>{
           element.appointmentTime=  moment(element.appointmentTime).format('DD-MM-YYYY')
            // console.log(time,'datetime');
            return element
            
          })
          this.loading=false;
          console.log(data, 'this is GetDashboardAppointmentWithRestrictedAccess data');
          //console.log(data, 'this is GetDashboardAppointment data');
          this.ELEMENT_DATA = data;
          console.log(this.ELEMENT_DATA,'this.ELEMENT_DATA');
          
          this.HeaderData = data;
          this.dataSourceDownload = this.ELEMENT_DATA;
          this.isValid = true;
          console.log(
            this.ELEMENT_DATA,
            'this is GetDashboardAppointmentWithRestrictedAccess data'
          );
          // console.log(
          //   this.ELEMENT_DATA,
          //   'this is GetDashboardAppointment data'
          // );
          this.dataSource = new MatTableDataSource<PeriodicElement>(
            this.ELEMENT_DATA
          );
          this.dataSource.sort = this.sort;
          this.dataSource.paginator = this.paginator;

          this.dataSource.filterPredicate = ((data, filter) => {
            const b =
              !filter.districtName ||
              data.districtName.toLowerCase().includes(filter.districtName.toLowerCase());
            const c =
              !filter.blockName ||
              data.blockName.toLowerCase().includes(filter.blockName.toLowerCase());
            const d =
              !filter.phcName ||
              data.phcName.toLowerCase().includes(filter.phcName.toLowerCase());

              const a =
              !filter.phase ||
              data?.phase.toLowerCase().includes(filter?.phase?.toLowerCase());

            // const e =
            //   !filter.patientName || data.patientName === filter.patientName.toLowerCase();
              const e =
              !filter.patientName ||
              data.patientName.toLowerCase().includes(filter.patientName.toLowerCase());

            // const f = !filter.mobileNo || data.mobileNo === filter.mobileNo.toLowerCase();
            const f =
            !filter.mobileNo ||
            data.mobileNo.toLowerCase().includes(filter.mobileNo.toLowerCase());

            // const g = !filter.doctor || data.doctor === filter.doctor.toLowerCase();
            const g =
            !filter.doctor ||
            data.doctor.toLowerCase().includes(filter.doctor.toLowerCase());


            // var h =
            //   !filter.appointmentTime ||
            //   data.appointmentTime === filter.appointmentTime;
            //   console.log(data.appointmentTime,'data.appointmentTime');
              
            const h =
            !filter.appointmentTime ||
            data.appointmentTime?.toLowerCase().includes(filter?.appointmentTime.toLowerCase());
            console.log( data.appointmentTime,' data.appointmentTime');
            

            // const i =
            //   !filter.consultStatus ||
            //   data.consultStatus === filter.consultStatus.toLowerCase();
            const i =
            !filter.consultStatus ||
            data.consultStatus.toLowerCase().includes(filter.consultStatus.toLowerCase());

            // const j =
            //   !filter.doctorAvailable ||
            //   data.doctorAvailable === filter.doctorAvailable.toLowerCase();
            const j =
            !filter.doctorAvailable ||
            data.doctorAvailable.toLowerCase().includes(filter.doctorAvailable.toLowerCase());

            // const k =
            //   !filter.patientAvailable ||
            //   data.patientAvailable === filter.patientAvailable.toLowerCase();
            const k =
            !filter.patientAvailable ||
            data.patientAvailable.toLowerCase().includes(filter.patientAvailable.toLowerCase());

            const l =
            !filter.cluster ||
            data.cluster.toLowerCase().includes(filter.cluster.toLowerCase());

            return b && c && d  &&e && f && g && h && i && j && k &&a &&l;
          }) as (PeriodicElement, string) => boolean;
        },
        (error) => {
          this.loading=false;
          console.log(error.status);
          if (error.status === 500) {
          } else if (error.status === 401) {
          } else if (error.status === 400) {
          }
        }
      );
      // this.Svc_dashboardService.GetDashboardAppointment(params).subscribe(
      //   (data1: any) => {
      //   let data=  data1.map((element)=>{
      //      element.appointmentTime=  moment(element.appointmentTime).format('DD-MM-YYYY')
      //       // console.log(time,'datetime');
      //       return element
            
      //     })
      //     this.loading=false;
      //     console.log(data, 'this is GetDashboardAppointment data');
      //     this.ELEMENT_DATA = data;
      //     this.HeaderData = data;
      //     this.dataSourceDownload = this.ELEMENT_DATA;
      //     this.isValid = true;
      //     console.log(
      //       this.ELEMENT_DATA,
      //       'this is GetDashboardAppointment data'
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

      //       // const e =
      //       //   !filter.patientName || data.patientName === filter.patientName.toLowerCase();
      //         const e =
      //         !filter.patientName ||
      //         data.patientName.toLowerCase().includes(filter.patientName.toLowerCase());

      //       // const f = !filter.mobileNo || data.mobileNo === filter.mobileNo.toLowerCase();
      //       const f =
      //       !filter.mobileNo ||
      //       data.mobileNo.toLowerCase().includes(filter.mobileNo.toLowerCase());

      //       // const g = !filter.doctor || data.doctor === filter.doctor.toLowerCase();
      //       const g =
      //       !filter.doctor ||
      //       data.doctor.toLowerCase().includes(filter.doctor.toLowerCase());


      //       // var h =
      //       //   !filter.appointmentTime ||
      //       //   data.appointmentTime === filter.appointmentTime;
      //       //   console.log(data.appointmentTime,'data.appointmentTime');
              
      //       const h =
      //       !filter.appointmentTime ||
      //       data.appointmentTime?.toLowerCase().includes(filter?.appointmentTime.toLowerCase());
      //       console.log( data.appointmentTime,' data.appointmentTime');
            

      //       // const i =
      //       //   !filter.consultStatus ||
      //       //   data.consultStatus === filter.consultStatus.toLowerCase();
      //       const i =
      //       !filter.consultStatus ||
      //       data.consultStatus.toLowerCase().includes(filter.consultStatus.toLowerCase());

      //       // const j =
      //       //   !filter.doctorAvailable ||
      //       //   data.doctorAvailable === filter.doctorAvailable.toLowerCase();
      //       const j =
      //       !filter.doctorAvailable ||
      //       data.doctorAvailable.toLowerCase().includes(filter.doctorAvailable.toLowerCase());

      //       // const k =
      //       //   !filter.patientAvailable ||
      //       //   data.patientAvailable === filter.patientAvailable.toLowerCase();
      //       const k =
      //       !filter.patientAvailable ||
      //       data.patientAvailable.toLowerCase().includes(filter.patientAvailable.toLowerCase());

      //       return b && c && d  &&e && f && g && h && i && j && k;
      //     }) as (PeriodicElement, string) => boolean;
      //   },
      //   (error) => {
      //     this.loading=false;
      //     console.log(error.status);
      //     if (error.status === 500) {
      //     } else if (error.status === 401) {
      //     } else if (error.status === 400) {
      //     }
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
  ValidationMessage:string;
  submitdetails() {
   // this.loading=true;
    this.ValidationMessage="";
    this.ShowErrorMessage=false;
    this.ELEMENT_DATA = [];
    if (this.doctorForm.value) {
      let params = new HttpParams();
      let obj: any = {};
      //obj.from = this.doctorForm.get('picker').value;
      obj.to = this.doctorForm.get('todate').value;
      obj.from = this.doctorForm.get('fromdate').value;
      // obj.PHCID = this.doctorForm.get('PHCID').value;
      this.toDateValue = obj.to;
      this.fromDateValue = obj.from;
      console.log(moment(obj.from.toDate()).format('YYYY-MM-DD'));
      console.log(obj.to.format('YYYY-MM-DD'));
      params = params.append('fromDate', obj.from.format('YYYY-MM-DD'));
      params = params.append('toDate', obj.to.format('YYYY-MM-DD'));
     // debugger;
      console.log(params);
      if (this.utilsService.monthDiffInDay(obj.to, obj.from)>92) {
        this.ValidationMessage="Please select date gap for 92 day maximum duration!"
        this.ShowErrorMessage=true;
      }
      else if(this.utilsService.monthDiffInDay(obj.to, obj.from)<0)
      {
        this.ValidationMessage="From Date should be less than or equal to To Date.";
        this.ShowErrorMessage=true;
      }
      

      this.dataSource = new MatTableDataSource<PeriodicElement>(
        this.ELEMENT_DATA
      );
      this.dataSource.paginator = this.paginator

      this.IsDateNotSelected = false;
      if (obj.to == '' || obj.from == '') {
        this.IsDateNotSelected = true;
      }
      if (!this.ShowErrorMessage ) {
        this.GetDashboardAppointmentWithRestrictedAccess({
          params,
        });
        // this.GetDashboardAppointment({
        //   params,
        // });
      } else {
        this.dataSource = new MatTableDataSource<PeriodicElement>(
          this.ELEMENT_DATA
        );
      }
    }
  }



  public async Download(value: any):Promise<any> {

   let data=     this.ELEMENT_DATA;
   console.log(data,'excel');
   
    this.loading=true
    if(this.ELEMENT_DATA.length==0){
      this.loading=false
      this._sweetAlert.sweetAlert('No Data Available','error')
      return
    }
    
    if (value == 'Excel') {
      
      var spliceSouce=this.dataSourceDownload;
      let count:number=1000000;
      // for (let index = 0;  this.dataSourceDownload.length>=index; index=index+count) {;
      //      var D = this.dataSourceDownload.slice(index,index+count);
      //      this.exportAsExcelFile(D, this.ReportName);
      // }

    
        const  newArrayOfObj = this.dataSourceDownload.map(item => {
          return {
           'SL No.':item.srNo ,'Cluster':item.cluster,'District':item.districtName,'Block':item.blockName,'PHC':item.phcName,'Phase':item.phase,'Patient Name':item.patientName,'Mobile No':item.mobileNo,'Doctor':item.doctor,'Date':item.appointmentTime,'Consult Status':item.consultStatus,'Doctor Available':item.doctorAvailable,'Patient Available':item.patientAvailable
          };
        });
  
        setTimeout(()=>{
          this.exportAsExcelFile(newArrayOfObj, this.ReportName)
        },0)
       
    }
  }
  
  public exportAsExcelFile(json: any[], excelFileName: string): void {
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(json);
var aa=[['Id','Cluster','District','Block','PHC','Phase','Patient','Mobile','Doctor','Date','Consult Status','Doctor Available','Patient Available']]


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
    console.log('savewxcel');
    
    const data: Blob = new Blob([buffer], { type: EXCEL_TYPE });

    of(0).subscribe((res:any)=>{      
      FileSaver.saveAs(
        data,
        fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION
      );
  
    },(err:any)=>{},
    ()=>{
      setTimeout(() => {
        this.loading=false
      }, 1000);
      
    })

   
  }

  downloadPdf() {
    if(this.ELEMENT_DATA.length==0){
      this.loading=false
      this._sweetAlert.sweetAlert('No Data Available','error')
      return
    }
    this.loading=true
    setTimeout(() => {
      this.exportPdf()
    }, 0);
  }

  exportPdf()
  {
    var prepare = [];
    this.dataSourceDownload.forEach((e) => {
      var tempObj = [];
      tempObj.push(e.srNo);
      tempObj.push(e.cluster)
      tempObj.push(e.districtName);
      tempObj.push(e.blockName);
      tempObj.push(e.phcName);
      tempObj.push(e.phase);
     
      tempObj.push(e.patientName);
      tempObj.push(e.mobileNo);
      tempObj.push(e.doctor);
      tempObj.push(e.appointmentTime);
      tempObj.push(e.consultStatus);
      tempObj.push(e.doctorAvailable);
      tempObj.push(e.patientAvailable);
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
          "Phase",
          
          'Patient Name',
          'Mobile No',
          'Doctor',
          'Appointment Time',
          'Consult Status',
          'Doctor Available',
          'Patient Available',
        ],
      ],
      body: prepare,
    });
   
      of(1).subscribe((res:any)=>{
        console.log('subs');
        
        doc.save(this.ReportName + '.pdf');
      },(err:any)=>{},    
      ()=>{
        setTimeout(() => {
          console.log('compl');
          
          this.loading=false
        }, 1000);
      })
  }
}
export interface PeriodicElement {
  srNo: number;
  districtName: string;
  blockName: string;
  phcName: string;

  patientName: string;
  mobileNo: string;
  doctor: string;
  appointmentTime: Date;
  consultStatus: string;
  doctorAvailable: string;
  patientAvailable: string;
}
