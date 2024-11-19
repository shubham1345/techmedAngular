import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { SvcPhcGetPatientService } from './svc-phc-get-patient.service';
import { SvccasedetailService } from './svccasedetail.service';
import { SvclocalstorageService } from './svclocalstorage.service';
import { ActivatedRoute } from '@angular/router';
import { DatePipe } from '@angular/common';
@Injectable({
  providedIn: 'root'
})
export class SvcGetmethodService {

  // constructor(private svcLocalstorage: SvclocalstorageService, private svcCasedetail: SvccasedetailService
  //   ,private SvcPhcPatient : SvcPhcGetPatientService, private activatedRoute: ActivatedRoute,
  //   public datepipe: DatePipe) { }
  // getmethod(){
  //   debugger
  //   const queryString = window.location.search;
  //   const urlParams = new URLSearchParams(queryString);
  //   const patientId = urlParams.get('patientId')
  //   const phcId = urlParams.get('phcid')
  //   this.getphcDetails(patientId, phcId)

  //   this.activatedRoute.queryParams.subscribe(params => {

  //     let patientID = patientId;
  //     let phcID = phcId;
  //   });
  // }

  // userObjFromToken: any
  // patientDetail : any
  // date: any
  // caseLabel: any
  // latestdate: any
  // phcDetail: any
  // getphcDetails(patientId, phcId) {
  //   debugger
  //   this.userObjFromToken = this.svcLocalstorage.GetData(environment.AuthTokenKeyLSKey);
  //   if(this.userObjFromToken){
  //     this.svcCasedetail.GetPatientCaseDetails(patientId, phcId).subscribe(data => {
  //       this.patientDetail = data['patientMaster'];
  //     });
  //     this.SvcPhcPatient.getCaseLabel(patientId).subscribe(f => {
  //       this.date = f[0].caseDateTime
  //       this.latestdate = this.datepipe.transform(this.date, 'd/M/y')
  //       this.caseLabel = f;
  //       console.log(this.caseLabel, "=============ccc777")
  //     });
  //     this.SvcPhcPatient.getphcdetailById(phcId).subscribe(b => {
        
  //         this.phcDetail = b
  //     })
  //   }
   

  // }
}
