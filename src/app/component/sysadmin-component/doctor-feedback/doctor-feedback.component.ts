import { Component, OnInit, ViewChild } from '@angular/core';
import { SvcPhcGetPatientService } from 'src/app/services/services/svc-phc-get-patient.service';
import { SvclocalstorageService } from 'src/app/services/services/svclocalstorage.service';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import { MdbModalRef, MdbModalService } from 'mdb-angular-ui-kit/modal';
import { ReferDoctorComponent } from '../../shared-component/refer-doctor/refer-doctor.component';
import { ngxLoadingAnimationTypes } from 'ngx-loading';
import { SvcmainAuthserviceService } from 'src/app/services/services/svcmain-authservice.service';
import { SearchFilterPipe } from 'src/app/pipes/search-filter.pipe'
import { FormBuilder, FormControl, Validators, FormGroup } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { Svc_MasterService } from 'src/app/services/services/svc_master.service';
import { DatePipe } from '@angular/common';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
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
import { UtilsService } from 'src/app/utils/Utils_Service';
import * as _moment from 'moment';
const moment = _moment;
const EXCEL_TYPE =
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';
import {
  faFilePdf,
  faFileExcel,
  faClose,
  faDownload,
} from '@fortawesome/free-solid-svg-icons';
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
  selector: 'app-doctor-feedback',
  templateUrl: './doctor-feedback.component.html',
  styleUrls: ['./doctor-feedback.component.css'],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
})
export class DoctorFeedbackComponent implements OnInit {
  public ngxLoadingAnimationTypes = ngxLoadingAnimationTypes;
  loading = false;
  public config = {
    animationType: ngxLoadingAnimationTypes.none,
    backdropBorderRadius: '3px',
  };
  // @ViewChild(MatPaginator) paginator: MatPaginator;

  ShowErrorMessage: boolean;
  ValidationMessage: string;
  dataSource: any = []
  doctorFeedback: FormGroup;
  formControl: FormGroup;
  today: Date = new Date();
  faFilePdf = faFilePdf;
  faFileExcel = faFileExcel;
  faClose = faClose;
  displayedColumns = ['srno', 'District', 'Block', 'PHC', 'DrName', 'PatientName', 'PatientID', 'PatientCaseId', 'ConsultTime', 'doctorFeedback']

  constructor(private svcLocalstorage: SvclocalstorageService,
    private SvcPhcPatient: SvcPhcGetPatientService,
    private svcMaster: Svc_MasterService,
    private router: Router,
    private modalService: MdbModalService,
    public datepipe: DatePipe,
    private utilsService: UtilsService,
    private _sweetAlert: SvcmainAuthserviceService,
    private pipe: SearchFilterPipe,
    private _fb: FormBuilder, formBuilder: FormBuilder,) {
    this.doctorFeedback = new FormGroup({
      todate: new FormControl(moment(new Date())),
      fromdate: new FormControl(moment(new Date())),

    });
    this.dataSource.filterPredicate = ((data, filter) => {
      const b =
        !filter.districtName ||
        data.districtName.toLowerCase().includes(filter.districtName);
      const c =
        !filter.doctorName ||
        data.doctorName.toLowerCase().includes(filter.doctorName);
      const d =
        !filter.phcName || data.phcName.toLowerCase().includes(filter.phcName);

      return b && c && d;
    }) as (PeriodicElement, string) => boolean;

    this.formControl = formBuilder.group({
      districtName: '',
      blockName: '',
      phcName: '',
      phase: '',
      doctorName: '',
      trainingSubject: '',
      trainingBy: '',
      traingDate: '',
      doctorFeedback: '',
      cluster: '',
    });
    this.formControl.valueChanges.subscribe((value) => {
      const filter = { ...value, name: value.name } as string;
      this.dataSource.filter = filter;
    });
  }
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  ngAfterViewInit() {

    this.dataSource.paginator = this.paginator;

  }
  ngOnInit(): void {
    this.doctorFeedback = this._fb.group({
      fromdate: [this.today, Validators.required],
      todate: [this.today, Validators.required],

    })
  }
  data: any;
  Search() {
    this.loading = true;
    this.ValidationMessage = ''
    this.ShowErrorMessage = false
    let FromDate = this.datepipe.transform(this.doctorFeedback.value.fromdate, 'yyyy-MM-dd');
    let ToDate = this.datepipe.transform(this.doctorFeedback.value.todate, 'yyyy-MM-dd');

    if (this.utilsService.monthDiffInDay(ToDate, FromDate) > 90) {
      this.ValidationMessage = "Please select date gap for 90 day maximum duration!"
      this.ShowErrorMessage = true;
      this.loading = false;
    }
    else if (this.utilsService.monthDiffInDay(ToDate, FromDate) < 0) {
      this.ValidationMessage = "From Date should be less than or equal to To Date.";
      this.ShowErrorMessage = true;
      this.loading = false;
    }
    else {


      // this.configPage.PageNo=0
      this.SvcPhcPatient.GetPatientCaseDoctorFeedback(FromDate, ToDate).subscribe((data: any) => {

        this.data = data.sort((a, b) => parseFloat(a.srNo) - parseFloat(b.srNo))

        this.dataSource = data

        this.loading = false;
        this.dataSource = new MatTableDataSource(this.data)
        this.dataSource.paginator = this.paginator;
        console.log(data);
        this.dataSource.filterPredicate = ((data, filter) => {
          const b =
            !filter.districtName ||
            data.districtName
              .toLowerCase()
              .includes(filter.districtName.toLowerCase());
          const c =
            !filter.doctorName ||
            data.doctorName
              .toLowerCase()
              .includes(filter.doctorName.toLowerCase());
          const d =
            !filter.phcName ||
            data.phcName.toLowerCase().includes(filter.phcName.toLowerCase());

          return b && c && d;
        }) as (PeriodicElement, string) => boolean;

      }
      )
    }

  }

  public downloadExcel() {
    if (this.dataSource?.length == 0 || this.dataSource?.filteredData?.length == 0) {
      this.loading = false
      this._sweetAlert.sweetAlert('No Data Available', 'error')
      return
    }
    let count: number = 1000000;


    var newArray = this.dataSource.filteredData.map((item: any) => {
      const date = new Date(item.consultTime);
      const hours = date.getHours();
      const minutes = date.getMinutes();
      const seconds = date.getSeconds();
      const formattedTime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

      console.log(formattedTime)
      return {
        'SL No.': item.srNo, 'Dictrict': item.districtName, 'Block': item.blockName, 'PHC': item.phcName, 'Doctor Name': item.doctorName, 'Patient Name': item.patientName, 'Patient ID': item.patientID, 'Patient Case ID': item.patientCaseID, 'Consult Time': formattedTime, 'Doctor Feedback': item.doctorFeedback,
      };
    })
    this.exportAsExcelFile(newArray, 'Doctor Feedback');
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
      fileName
    );
  }
}
