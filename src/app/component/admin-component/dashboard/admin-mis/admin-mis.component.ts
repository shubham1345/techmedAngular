import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { environment } from 'src/environments/environment';
import { ActivatedRoute, Router } from '@angular/router';
import { SvclocalstorageService } from 'src/app/services/services/svclocalstorage.service';
import { Svc_MasterService } from 'src/app/services/services/svc_master.service';
import { svc_misService } from 'src/app/services/services/svc_mis_service';
import { DatePipe } from '@angular/common';
import { MatDatepickerModule } from '@angular/material/datepicker';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';

const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';

export interface PeriodicElement {
  name: number;
  position: string;

}

const ELEMENT_DATA: PeriodicElement[] = [
  // {position: 'January/2021' , name: 1000},
  // {position: 'February/2021' , name: 1000},
  // {position: 'March/2021' , name: 1000},
  // {position: 'April/2021' , name: 1000},
  // {position: 'May/2021' , name: 1000},
  // {position: 'June/2021' , name: 1000},
  // {position: 'July/2021' , name: 1000},
  // {position: 'August/2021' , name: 1000},
  // {position: 'September/2021' , name: 1000},
  // {position: 'October/2021' , name: 1000},
  // {position: 'November/2021' , name: 1000},
  // {position: 'December/2021' , name: 1000},
  // {position: 'January/2021' , name: 1000},
  // {position: 'February/2021' , name: 1000},
];


@Component({
  selector: 'app-admin-mis',
  templateUrl: './admin-mis.component.html',
  styleUrls: ['./admin-mis.component.css']
})
export class AdminMisComponent implements OnInit {
  userObjFromToken: any;
  displayedColumns: string[] = ['month','noOfConsultations'];
  dataSource = null;
  doctorForm: FormGroup;
  fromDateValue: Date
  toDateValue: Date
  selected: string = "Select"
  constructor(private fb: FormBuilder, private svcLocalstorage: SvclocalstorageService,
    private Svc_MasterService: Svc_MasterService,
    private Svc_MISService: svc_misService,
    public datepipe: DatePipe,
    private activatedRoute: ActivatedRoute,
    private router: Router)
    {

      this.doctorForm = new FormGroup({
        todate: new FormControl(''),
        fromdate: new FormControl('')
      })
    }
  ngOnInit() {
    this.doctorForm = this.fb.group({

      todate: ['', [Validators.required]],
      fromdate: ['', [Validators.required]],

    });
    this.CompletedConsultation('2022');
  }
  public Download(value: any) {
    console.log(value);
    if(value=='Excel')
    {
      this.exportAsExcelFile(this.dataSource, "CompletedConsultations")
    }
  }

  public exportAsExcelFile(json: any[], excelFileName: string): void {
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(json);
    const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    this.saveAsExcelFile(excelBuffer, excelFileName);
  }
  private saveAsExcelFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], { type: EXCEL_TYPE });
    FileSaver.saveAs(data, fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION);
  }
  ListOfCompletedConsultation: any
  CompletedConsultation(params) {
    this.dataSource = ELEMENT_DATA;
    this.userObjFromToken = this.svcLocalstorage.GetData(environment.AuthTokenKeyLSKey);
    if (this.userObjFromToken) {
      this.Svc_MISService.GetCompletedConsultationChart(params).subscribe(data => {
        console.log(data, "this is GetCompletedConsultationChart data")

        this.dataSource = data;

      })
    }
  }
  submitdetails() {
    if (this.doctorForm.value) {
      let obj: any = {};
      //obj.from = this.doctorForm.get('picker').value;
      obj.to = this.doctorForm.get('todate').value;
      obj.from = this.doctorForm.get('fromdate').value;
      this.toDateValue = obj.to;
      this.fromDateValue = obj.from;
      console.log(obj.from);
      console.log(obj.to);

      this.CompletedConsultation({
        "phcid": 2,
        "fromDate": obj.from,
        "toDate": obj.to
      })

      // obj.specializationId = this.doctorForm.get('spclztn').value;
      // this.validateAllFormFields(this.doctorForm);

    }
  }
}
