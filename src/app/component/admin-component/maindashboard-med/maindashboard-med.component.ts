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

import { HttpClient } from '@angular/common/http';
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
import { ngxLoadingAnimationTypes } from 'ngx-loading';

const EXCEL_TYPE =
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

import { I } from '@angular/cdk/keycodes';
import {
  faClose,
  faFileExcel,
  faFilePdf,
} from '@fortawesome/free-solid-svg-icons';
import { UtilsService } from 'src/app/utils/Utils_Service';
import { Html2CanvasOptions } from 'jspdf';
import { Column } from 'jspdf-autotable';
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
    monthYearA11yLabel: 'MMM YYYY'
  },
};
@Component({
  selector: 'app-maindashboard-med',
  templateUrl: './maindashboard-med.component.html',
  styleUrls: ['./maindashboard-med.component.css'],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    },
    {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS},
  ],
})
export class MaindashboardMedComponent implements AfterViewInit {

  public ngxLoadingAnimationTypes = ngxLoadingAnimationTypes;
  public config = {
    animationType: ngxLoadingAnimationTypes.none,
    backdropBorderRadius: '3px',
  };

  loading:boolean=false
  userObjFromToken: any;
  doctorForm: FormGroup;
  fromDateValue: Date;
  formControl: FormGroup;
  toDateValue: Date=new Date();
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
    'assignedOn',
    'patientName',
    'age',
    'gender',
    'complaint',
    'doctor',
  ];
  filterValues = {
    cluster:'',
    districtName: '',
    blockName: '',
    phcName: '',
    phase:'',
    assignedOn: '',
    patientName: '',
    age: '',
    gender: '',
    complaint: '',
    doctor: '',
  };
  ELEMENT_DATA: PeriodicElement[] = [
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
    this.doctorForm = new FormGroup({
      todate: new FormControl(moment(new Date())),
      fromdate:new FormControl(moment(new Date())),
    });

    //////////used to stop loader when their is error of 401 and 403////

    this._sweetAlert.getLoader().subscribe((res:any)=>{
      this.loading=res
      console.log('med',this.loading)
    })

    /////////////////////////////////////////////////////////////

    // this.doctorForm.setValue({
    //   todate: this.datepipe.transform(new Date(), 'yyyy-MM-dd'), 
    //   fromdate: this.datepipe.transform(new Date(), 'yyyy-MM-dd'),
    // });
  
    this.toDateValue=new Date();
    console.log(this.toDateValue);
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const code = urlParams.get('specializationID');
    this.specializationID = code;
    console.log(code);
    if (this.specializationID == '1') {
      this.ReportName = 'General Medicine Consultations';
    }
    if (this.specializationID == '2') {
      this.ReportName = 'Obstetrics and Gyne Consultations';
    }
    if (this.specializationID == '3') {
      this.ReportName = 'Pediatrics Consultations';
    }

    this.dataSourceDownload = this.ELEMENT_DATA;
    // this.GetDashboardConsultationWithRestrictedAccess({
    //   specializationID: this.specializationID,
    //   fromDate: new Date(),
    //   toDate: new Date(),
    // });
    // this.GetDashboardConsultation({
    //   specializationID: this.specializationID,
    //   fromDate: new Date(),
    //   toDate: new Date(),
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
      const f = !filter.age || data.age.toLowerCase().includes(filter.age);
      const g =
        !filter.gender || data.gender.toLowerCase().includes(filter.gender);
      const h =
        !filter.complaint ||
        data.complaint.toLowerCase().includes(filter.complaint);
      const i =
        !filter.doctor || data.doctor.toLowerCase().includes(filter.doctor);
      const j =
        !filter.patientName ||
        data.patientName.toLowerCase().includes(filter.patientName);
      const k =
        !filter.cluster ||
        data.cluster.toLowerCase().includes(filter.cluster);
      const l =
        !filter.phase ||
        data.phase.toLowerCase().includes(filter.phase);
      //const c = !filter.symbol || data.symbol === filter.symbol;
      return b && c && d && f && g && h && i && j && k && l;
    }) as (PeriodicElement, string) => boolean;

    this.formControl = formBuilder.group({
      cluster:'',
      districtName: '',
      blockName: '',
      phcName: '',
      phase:'',
      assignedOn: '',
      patientName: '',
      age: '',
      gender: '',
      complaint: '',
      doctor: '',
    });
    this.formControl.valueChanges.subscribe((value) => {
      const filter = { ...value, name: value.name } as string;
      this.dataSource.filter = filter;
    });
  }

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  //@ViewChild(MatSort) sort: MatSort;

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;

    this.toDateValue=new Date();
    // this.doctorForm = this.fb.group({
    //   todate: ['', [Validators.required]],
    //   fromdate: ['', [Validators.required]],
    // });
  }
  @ViewChild('content', { static: false }) content: ElementRef;
  ListOfCompletedConsultation: any;
  GetDashboardConsultationWithRestrictedAccess(params: any) {
   
    this.ELEMENT_DATA=[];
    this.userObjFromToken = this.svcLocalstorage.GetData(
      environment.AuthTokenKeyLSKey
    );
  // GetDashboardConsultation(params: any) {
   
  //   this.ELEMENT_DATA=[];
  //   this.userObjFromToken = this.svcLocalstorage.GetData(
  //     environment.AuthTokenKeyLSKey
  //   );
    if (this.userObjFromToken) {
      this.loading=true
      this.Svc_dashboardService.GetDashboardConsultationWithRestrictedAccess(params).subscribe(
        (data: any) => {
          this.loading=false
          console.log(data, 'this is GetDashboardConsultationWithRestrictedAccess data');
          this.ELEMENT_DATA = data;
          this.dataSourceDownload = this.ELEMENT_DATA;
          console.log(
            this.ELEMENT_DATA,
            'this is GetDashboardConsultationWithRestrictedAccess data'
          );
          this.dataSource = new MatTableDataSource<PeriodicElement>(
            this.ELEMENT_DATA
          );
          console.log(
            this.dataSource.data.length.toString(),
            'this.dataSource.data.length'
          );
          this.dataSource.sort = this.sort;
          console.log( this.dataSource.sort,' this.dataSource.sort');
          
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
            
            const f =
              !filter.age || data.age.toLowerCase().includes(filter.age.toLowerCase());
            const g =
              !filter.gender ||
              data.gender.toLowerCase().startsWith(filter.gender.toLowerCase());
           
            
              const h =
            !filter.complaint||  (filter.complaint.trim().toLowerCase()!='null' &&

            JSON.stringify(data.complaint).toLowerCase().includes(filter.complaint.toLowerCase()))
            const i =
              !filter.doctor ||
              data.doctor.toLowerCase().includes(filter.doctor.toLowerCase());
            const j =
              !filter.patientName ||
              data.patientName.toLowerCase().includes(filter.patientName.toLowerCase());
            const k =
              !filter.cluster ||
              data.cluster.toLowerCase().includes(filter.cluster.toLowerCase());
            const l =
              !filter.phase ||
              data.phase.toLowerCase().includes(filter.phase.toLowerCase());
            //const c = !filter.symbol || data.symbol === filter.symbol;
            return b && c && d && f && g && h && i && j && k && l;
          }) as (PeriodicElement, string) => boolean;
        },
        (error) => {
          this.loading=false
          console.log(error.status);
           if (error.status === 500) {
 
           } else if (error.status === 401) {
             
 
           } else if (error.status === 400) {
            
           }
         }
        
      );
      // this.Svc_dashboardService.GetDashboardConsultation(params).subscribe(
      //   (data: any) => {
      //     this.loading=false
      //     console.log(data, 'this is GetDashboardConsultation data');
      //     this.ELEMENT_DATA = data;
      //     this.dataSourceDownload = this.ELEMENT_DATA;
      //     console.log(
      //       this.ELEMENT_DATA,
      //       'this is GetDashboardConsultation data'
      //     );
      //     this.dataSource = new MatTableDataSource<PeriodicElement>(
      //       this.ELEMENT_DATA
      //     );
      //     console.log(
      //       this.dataSource.data.length.toString(),
      //       'this.dataSource.data.length'
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
      //         !filter.age || data.age.toLowerCase().includes(filter.age.toLowerCase());
      //       const g =
      //         !filter.gender ||
      //         data.gender.toLowerCase().startsWith(filter.gender.toLowerCase());
           
            
      //         const h =
      //       !filter.complaint||  (filter.complaint.trim().toLowerCase()!='null' &&

      //       JSON.stringify(data.complaint).toLowerCase().includes(filter.complaint.toLowerCase()))
      //       const i =
      //         !filter.doctor ||
      //         data.doctor.toLowerCase().includes(filter.doctor.toLowerCase());
      //       const j =
      //         !filter.patientName ||
      //         data.patientName.toLowerCase().includes(filter.patientName.toLowerCase());
      //       //const c = !filter.symbol || data.symbol === filter.symbol;
      //       return b && c && d && f && g && h && i && j;
      //     }) as (PeriodicElement, string) => boolean;
      //   },
      //   (error) => {
      //     this.loading=false
      //     console.log(error.status);
      //      if (error.status === 500) {
 
      //      } else if (error.status === 401) {
             
 
      //      } else if (error.status === 400) {
            
      //      }
      //    }
        
      // );
      this.dataSource = new MatTableDataSource<PeriodicElement>(
        this.ELEMENT_DATA);
    }
  }
  ShowErrorMessage: boolean;
  ValidationMessage:string;
  submitdetails() {
    this.ValidationMessage="";
    this.ShowErrorMessage=false;
    this.ELEMENT_DATA=[];
    if (this.doctorForm.value) {
      let obj: any = {};
      //obj.from = this.doctorForm.get('picker').value;
      obj.to = this.doctorForm.get('todate').value;
      obj.from = this.doctorForm.get('fromdate').value;
      this.toDateValue = obj.to;
      this.fromDateValue = obj.from;
      console.log(obj.from);
      console.log(obj.to);
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
        this.GetDashboardConsultationWithRestrictedAccess({
          specializationID: this.specializationID,
          fromDate: obj.from.format("YYYY-MM-DD"),
          toDate: obj.to.format("YYYY-MM-DD"),
        });
        // this.GetDashboardConsultation({
        //   specializationID: this.specializationID,
        //   fromDate: obj.from.format("YYYY-MM-DD"),
        //   toDate: obj.to.format("YYYY-MM-DD"),
        // });
      } else {
      }

      // obj.specializationId = this.doctorForm.get('spclztn').value;
      // this.validateAllFormFields(this.doctorForm);
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

      const newArrayOfObj = this.dataSourceDownload.map((item,index) => {
        return {
         'SL No.':item.srNo ,'Cluster':item.cluster,'District':item.districtName,'Block':item.blockName,'PHC':item.phcName,'Phase':item.phase,'Date and Time':this.datepipe.transform(item.assignedOn,'dd-MM-yyyy hh:mm:ss a'),'Patient Name':item.patientName,'Age(Years)':item.age,'Gender':item.gender,
         'Complaint':item.complaint,'Doctor':item.doctor
        };
      });

      this.exportAsExcelFile(newArrayOfObj,this.ReportName)

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

  pageSize: number = 2;
  public downloadPDF() {
    if(this.ELEMENT_DATA.length==0){
      this.loading=false
      this._sweetAlert.sweetAlert('No Data Available','error')
      return
    }
    //   //const doc = new jsPDF();
    const doc: jsPDF = new jsPDF('l', 'pt', [1000, 1000]);
    const specialElementHandlers = {
      '#editor': function (element, renderer) {
        return true;
      },
    };

    const content = this.content.nativeElement;

    doc.html(content.innerHTML, {
      html2canvas: {
        // insert html2canvas options here, e.g.
        width: 10,
      },
      callback: function () {
        //doc.output('dataurlnewwindow');
        doc.save(this.ReportName + '.pdf');
      },
    });
  }
  Listtrackigobjct: PeriodicElementTest[] = [
    {
      age: 1,
      DepartmentName: 'Department1',
      CurrentCarType: 'Tata',
      CurrentCarModelString: 'Nexa',
      CurrentModelYear: '2022',
      CurrentFuelTypeEnum: 'Deseal',
      FuelContainerCapacity: '10',
      MileageFloat: '100',
      Column0: 'Column1',
      Column1: 'Column1',
      Column2: 'Column1',
      Column3: 'Column1',
      Column4: 'Column1',
      Column5: 'Column1',
      Column6: 'Column1',
      Column7: 'Column1',
      Column8: 'Column1',
      Column9: 'Column1',
    },
    {
      age: 1,
      DepartmentName: 'Department1',
      CurrentCarType: 'Tata',
      CurrentCarModelString: 'Nexa',
      CurrentModelYear: '2022',
      CurrentFuelTypeEnum: 'Deseal',
      FuelContainerCapacity: '10',
      MileageFloat: '100',
      Column0: 'Column1',
      Column1: 'Column1',
      Column2: 'Column1',
      Column3: 'Column1',
      Column4: 'Column1',
      Column5: 'Column1',
      Column6: 'Column1',
      Column7: 'Column1',
      Column8: 'Column1',
      Column9: 'Column1',
    },
    {
      age: 1,
      DepartmentName: 'Department1',
      CurrentCarType: 'Tata',
      CurrentCarModelString: 'Nexa',
      CurrentModelYear: '2022',
      CurrentFuelTypeEnum: 'Deseal',
      FuelContainerCapacity: '10',
      MileageFloat: '100',
      Column0: 'Column1',
      Column1: 'Column1',
      Column2: 'Column1',
      Column3: 'Column1',
      Column4: 'Column1',
      Column5: 'Column1',
      Column6: 'Column1',
      Column7: 'Column1',
      Column8: 'Column1',
      Column9: 'Column1',
    },
    {
      age: 1,
      DepartmentName: 'Department1',
      CurrentCarType: 'Tata',
      CurrentCarModelString: 'Nexa',
      CurrentModelYear: '2022',
      CurrentFuelTypeEnum: 'Deseal',
      FuelContainerCapacity: '10',
      MileageFloat: '100',
      Column0: 'Column1',
      Column1: 'Column1',
      Column2: 'Column1',
      Column3: 'Column1',
      Column4: 'Column1',
      Column5: 'Column1',
      Column6: 'Column1',
      Column7: 'Column1',
      Column8: 'Column1',
      Column9: 'Column1',
    },
  ];
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
      tempObj.push(this.datepipe.transform(e.assignedOn,'dd-MM-yyyy hh:mm:ss a'));
      tempObj.push(e.patientName);
      tempObj.push(e.age);
      tempObj.push(e.gender);
      tempObj.push(e.complaint);
      tempObj.push(e.doctor);
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
          'Date And Time',
          'Patient Name',
          'Age(years)',
          'Gender',
          'Complaint',
          'Doctor',
      ],
      ],
      body: prepare,
    });
    doc.save(this.ReportName +' '+
    this.datepipe.transform(this.fromDateValue,'dd-MMM-yyyy')+
    ' to '+this.datepipe.transform(this.toDateValue,'dd-MMM-yyyy')+'.pdf');
  }

  convert() {
    var doc = new jsPDF();

    var col = [
      'Id',
      'TypeID',
      'Accnt',
      'Amnt',
      'Start',
      'End',
      'Contrapartida',
    ];
    var rows = [];
    var rowCountModNew = [
      [
        '1721079361',
        '0001',
        '2100074911',
        '200',
        '22112017',
        '23112017',
        '51696',
      ],
      [
        '1721079362',
        '0002',
        '2100074912',
        '300',
        '22112017',
        '23112017',
        '51691',
      ],
      [
        '1721079363',
        '0003',
        '2100074913',
        '400',
        '22112017',
        '23112017',
        '51692',
      ],
      [
        '1721079364',
        '0004',
        '2100074914',
        '500',
        '22112017',
        '23112017',
        '51693',
      ],
    ];
    rowCountModNew.forEach((element) => {
      rows.push(element);
    });
    (doc as any).autoTable(col, rows);
    doc.save('Test.pdf');
  }

  // getPdffile() {
  //   // debugger
  //   // this.preview = {
  //   //   doctorDetail: doctorDetail,
  //   //   treatmentDetail: TreatmentData,
  //   //   diagnostics: diagnostics,
  //   //   referredMedList: referredMedList
  //   // }
  //   // if (this.preview?.doctorDetail?.patientCase?.createdOn) {
  //   //   var today = new Date();
  //   //   var date = today.getDate() + '-' + (today.getMonth() + 1) + '-' + today.getFullYear();
  //   //   this.createdOn = date
  //   // }

  //   // console.log(this.preview?.doctorDetail)

  //   // this.detectChanges.detectChanges()

  //   var html = document.getElementById('content');
  //   return html2canvas(html).then((canvas) => {

  //     const contentDataURL = canvas.toDataURL('image/png')

  //     var imgWidth = 210;

  //     var pageHeight = 295;

  //     var imgHeight = canvas.height * imgWidth / canvas.width;

  //     var heightLeft = imgHeight;

  //     var doc = new jsPDF('p', 'mm', 'a4');
  //     var position = 0; // give some top padding to first page
  //     doc.addImage(contentDataURL, 'PNG', 0, position, imgWidth, imgHeight);
  //     heightLeft -= pageHeight;
  //     while (heightLeft >= 0) {
  //       position += heightLeft - imgHeight; // top padding for other pages
  //       doc.addPage();
  //       doc.addImage(contentDataURL, 'PNG', 0, position, imgWidth, imgHeight);
  //       heightLeft -= pageHeight;
  //     }

  //     const newBlob = new Blob([doc.output('blob')], { type: 'application/pdf' });
  //     return newBlob;
  //   }

  //   )
  //}

  
  

}

export interface PeriodicElement {
  srNo: number;
  cluster: string;
  districtName: string;
  blockName: string;
  phcName: string;
  phase:string;
  complaint: string;

  assignedOn: Date;
  patientName: string;
  age: string;
  gender: string;

  // phcTechnician: string;
  doctor: string;
  // phcAddress: string;
  // cluserID: number;
  // cluster: string;
  // zoneID: number;
  // zone: string;
  // phcid: number;
  // createdBy: number;
  // patientCreatedBy: string;
}
export interface PeriodicElementTest {
  age: number;
  DepartmentName: string;
  CurrentCarType: string;
  CurrentCarModelString: string;
  CurrentModelYear: string;
  CurrentFuelTypeEnum: string;
  FuelContainerCapacity: string;
  MileageFloat: string;

  Column0: string;
  Column1: string;
  Column2: string;
  Column3: string;
  Column4: string;
  Column5: string;
  Column6: string;
  Column7: string;
  Column8: string;
  Column9: string;
}
