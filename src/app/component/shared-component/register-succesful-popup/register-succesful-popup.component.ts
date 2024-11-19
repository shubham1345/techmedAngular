import { Component, ElementRef, EventEmitter, Inject, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { faLessThanEqual } from '@fortawesome/free-solid-svg-icons';
import { MdbModalRef } from 'mdb-angular-ui-kit/modal';
import { SvcPhcGetPatientService } from 'src/app/services/services/svc-phc-get-patient.service';
import { SvccasedetailService } from 'src/app/services/services/svccasedetail.service';
import { SvclocalstorageService } from 'src/app/services/services/svclocalstorage.service';
import { Svc_getdoctordetailService } from 'src/app/services/services/svc_getdoctordetail.service';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { ngxLoadingAnimationTypes } from 'ngx-loading';
import { IQueryString } from "src/app/model/models.export";
import { EncryptData } from 'src/app/utils/utilityFn';
import { SvcmainAuthserviceService } from 'src/app/services/services/svcmain-authservice.service';


@Component({
  selector: 'app-register-succesful-popup',
  templateUrl: './register-succesful-popup.component.html',
  styleUrls: ['./register-succesful-popup.component.css']
})
export class RegisterSuccesfulPopupComponent implements OnInit {

  public ngxLoadingAnimationTypes = ngxLoadingAnimationTypes;
  loading = false;
  public config = {
    animationType: ngxLoadingAnimationTypes.none,
    backdropBorderRadius: '3px',
  };
  isstartCase = false;
  isReload: boolean = false;
  ispatientregistered = true
  getListOfSpecializationMastervar: any = [];
  // data = new EventEmitter();
  patientDetail: any;
  openSecondPopup = false;
  @Output() data: EventEmitter<any> = new EventEmitter<any>();



  constructor(public modalRef: MdbModalRef<RegisterSuccesfulPopupComponent>,
    private router: Router,
    private fb: FormBuilder,
    private SvcPhcPatient: SvcPhcGetPatientService,
    private svcLocalstorage: SvclocalstorageService,
    private sweetAlert:SvcmainAuthserviceService,
    private svcgetdoctordtls: Svc_getdoctordetailService,
    private _sweetAlert:SvcmainAuthserviceService,
    private svcCaseDetailService: SvccasedetailService) {
    this.getpatientId()
    //console.log("Phc", this.svcLocalstorage.phcDetail);
  }
  casetitleform = new FormGroup({
    opdNumber: new FormControl(''),
    casetitle: new FormControl(''),
    speciality: new FormControl(''),


  })
  ngOnInit(): void {
    //console.log(this.data);

    this._sweetAlert.closeAllModalsOnLogout.subscribe((res:any)=>{
      if(res==true)
      {
        this.close()
      }
    })


    this.getListOfSpecializationMasterfunction(this.patientDetail?.id)

    if (this.openSecondPopup == true) {
      this.isstartCase = true
      this.ispatientregistered = false

    }
    console.log(this.patientDetail.id, "id")
    this.casetitleform = this.fb.group({
      opdNumber: ['', [Validators.required]],
      casetitle: ['', [Validators.required]],
      speciality: ['', [Validators.required]],


    });

    this.closedropdown()
  }
  startCase() {
    this.isstartCase = true;
    this.ispatientregistered = false

  }

  close(): void {

    const closeMessage = 'Modal closed';
    this.modalRef.close(closeMessage)

    //////to stop the refresh on patient registration
    // if (!this.isReload) {
    //   window.location.reload();
    // }
  }
  onsubmitCasedetail() {

    this.validateAllFormFields(this.casetitleform);

    const formValue = this.casetitleform.getRawValue();
    const postValue = {
      "caseFileID": 0,
      "patientID": this.patientDetail.id,
      "caseFileNumber": "string",
      "caseTitle": formValue.casetitle,
      "specializationID": formValue.speciality,
      "createdBy": this.svcLocalstorage.phcDetail?.id,
      "opdNumber": formValue.opdNumber
    }
    if (this.userObjFromToken) {
      this.svcCaseDetailService.createPatientCase(postValue).subscribe((res: any) => {
        this.svcLocalstorage.caseDetails = res;
        this.svcLocalstorage.setCaseDetail(res);
        console.log(this.svcLocalstorage.caseDetails)

        Swal.fire({
          title: 'Case File',
          text: `Case File Created Successfully`,
          icon: 'success',
        }).then((result) => {
          this.close();
        })
        let qs: IQueryString = {
          patientId: this.patientDetail.id,
          phcId: this.patientDetail.phcid,
          CaseType:"new"
        }
        let strEncText = EncryptData(JSON.stringify(qs));

        this.router.navigate(["/case-details"], { queryParams: { src: strEncText } });
        //this.isReload=true;

        this.loading = false
      }, (error:any) => {
        this.loading = false

        
        Swal.fire({
          //title: 'warning',
          text: error.error.CreatePatientCase.errors[0].errorMessage,
          icon: 'warning',
        }).then((res:any)=>{
          this.close()
        })

      });

    }

    this.loading = true;

  }

  validateAllFormFields(formGroup: FormGroup) {         //{1}
    Object.keys(formGroup.controls).forEach(field => {  //{2}
      const control = formGroup.get(field);             //{3}
      if (control instanceof FormControl) {             //{4}
        control.markAsTouched({ onlySelf: true });
      } else if (control instanceof FormGroup) {        //{5}
        this.validateAllFormFields(control);            //{6}
      }
    });
  }
  userObjFromToken: any;
  patientId: any = []
  //  getPatientUID(obj){
  //    debugger
  //     this.userObjFromToken = this.svcLocalstorage.GetData(environment.AuthTokenKeyLSKey);
  //     if (this.userObjFromToken)
  //       this.SvcPhcPatient.SetregisterPatient(obj).subscribe(data => {
  //         this.patientId.push(data)
  //         //console.log("pcdetail", data)
  //     });
  //   }
  getListOfSpecializationMasterfunction(Id) {
   // debugger
    this.userObjFromToken = this.svcLocalstorage.GetData(environment.AuthTokenKeyLSKey);
    if (this.userObjFromToken)
      this.SvcPhcPatient.GetSuggestedSpecializations(Id).subscribe(data => {
        this.getListOfSpecializationMastervar.push(data)

      })
  }
  getpatientId() {
    this.data.emit()
    //console.log(this.data.emit())

  }
  @ViewChild('specialitydropdown') specialitydropdown: ElementRef;
  closedropdown()
  {
    this.sweetAlert.closeSelectDropdownSubject.subscribe((res:any)=>{
      if(res==true)
      {
        this.specialitydropdown.nativeElement.blur()
      }
    })
  }
}
