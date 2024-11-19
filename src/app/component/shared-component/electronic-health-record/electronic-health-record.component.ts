import { Component, OnInit } from '@angular/core';
import { MdbModalRef, MdbModalService } from 'mdb-angular-ui-kit/modal';
import { CaseDetailsDocComponent } from '../../admin-component/doctor/case-details-doc/case-details-doc.component';
import { SvclocalstorageService } from 'src/app/services/services/svclocalstorage.service';
import { environment } from 'src/environments/environment';
import { Svc_getdoctordetailService } from 'src/app/services/services/svc_getdoctordetail.service';
import { DatePipe } from '@angular/common';
@Component({
  selector: 'app-electronic-health-record',
  templateUrl: './electronic-health-record.component.html',
  styleUrls: ['./electronic-health-record.component.css']
})
export class ElectronicHealthRecordComponent implements OnInit {
  sucessRegister: MdbModalRef<CaseDetailsDocComponent> | null = null;

  constructor(private svcLocalstorage: SvclocalstorageService, private svcdoc: Svc_getdoctordetailService, public datepipe : DatePipe ) 
  { this.getEHRdetail({ "patientCaseID": 1 })}

  ngOnInit(): void {
  }

  userObjFromToken: any
  ehrDetail: any
  date: any
  latestdate: any
  getEHRdetail(id) {
    this.userObjFromToken = this.svcLocalstorage.GetData(environment.AuthTokenKeyLSKey);
    if (this.userObjFromToken)
      this.svcdoc.EHRData(id).subscribe(data => {
        this.ehrDetail=data
        this.date = this.ehrDetail.priviousCaseDate
       // this.date = new Date();
       this.latestdate =  this.datepipe.transform(this.date, 'd/M/y')
        //console.log(this.latestdate)
      });
  }
}

