import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MdbModalRef, MdbModalService } from 'mdb-angular-ui-kit/modal';
import { PateintFeedbackComponent } from 'src/app/component/shared-component/pateint-feedback/pateint-feedback.component';
import { ReferDoctorComponent } from 'src/app/component/shared-component/refer-doctor/refer-doctor.component';
import { ElectronicHealthRecordComponent } from 'src/app/component/shared-component/electronic-health-record/electronic-health-record.component';
import { SvclocalstorageService } from 'src/app/services/services/svclocalstorage.service';
import { environment } from 'src/environments/environment';
import { Svc_getdoctordetailService } from 'src/app/services/services/svc_getdoctordetail.service';
import { ActivatedRoute, ActivatedRouteSnapshot, Router } from '@angular/router';
import { DatePipe } from '@angular/common'
import { FilepopupComponent } from 'src/app/component/shared-component/filepopup/filepopup.component';
import { SvccasedetailService } from 'src/app/services/services/svccasedetail.service';
import { SvcPhcGetPatientService } from 'src/app/services/services/svc-phc-get-patient.service';


@Component({
  selector: 'app-case-details-doc',
  templateUrl: './case-details-doc.component.html',
  styleUrls: ['./case-details-doc.component.css']
})
export class CaseDetailsDocComponent implements OnInit {
  ngOnInit(): void {
    
  }

}
