import {
  Component,
  OnInit,
  ElementRef,
  ViewChild,
  Input,
  SimpleChanges,
  OnChanges,
  Output,
  AfterViewInit,
  EventEmitter,
  HostListener,
  OnDestroy,
} from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MdbModalRef, MdbModalService } from 'mdb-angular-ui-kit/modal';
import { PateintFeedbackComponent } from 'src/app/component/shared-component/pateint-feedback/pateint-feedback.component';
import { ReferDoctorComponent } from 'src/app/component/shared-component/refer-doctor/refer-doctor.component';
import { SvclocalstorageService } from 'src/app/services/services/svclocalstorage.service';
import { environment } from 'src/environments/environment';
import { SvccasedetailService } from 'src/app/services/services/svccasedetail.service';
import { SvcPhcGetPatientService } from 'src/app/services/services/svc-phc-get-patient.service';
import { DatePipe, LocationStrategy } from '@angular/common';
import { Svc_getdoctordetailService } from 'src/app/services/services/svc_getdoctordetail.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Svc_MasterService } from 'src/app/services/services/svc_master.service';
import { PatientVitals } from 'src/app/model/patient-vitals';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { ConsoleLogger } from '@microsoft/signalr/dist/esm/Utils';
import { I } from '@angular/cdk/keycodes';
import { faThumbsDown } from '@fortawesome/free-solid-svg-icons';
import {
  debounce,
  debounceTime,
  distinctUntilChanged,
  distinctUntilKeyChanged,
  elementAt,
  filter,
  forkJoin,
  fromEvent,
  interval,
  map,
  Observable,
  startWith,
  Subscription,
  switchMap,
  tap,
} from 'rxjs';
import { PrescriptionPreviewPdfComponent } from '../../prescription-preview-pdf/prescription-preview-pdf.component';
import { ngxLoadingAnimationTypes } from 'ngx-loading';
import { RegisterSuccesfulPopupComponent } from 'src/app/component/shared-component/register-succesful-popup/register-succesful-popup.component';
import { TwilioMiddlewareService } from 'src/app/component/twilio-component/services/twilio-middleware.service';
import moment from 'moment';
import { DecryptData } from 'src/app/utils/utilityFn';
import { IQueryString } from 'src/app/model/QueryStringModel';
import { SvcmainAuthserviceService } from 'src/app/services/services/svcmain-authservice.service';
import { TwilioDeviceService } from 'src/app/component/twilio-component/services/twilio-device.service';
import { INotificationResponse } from 'src/app/model/INotificationResponse';
import { NotificationHubService } from 'src/app/services/services/notification-hub.service';
import { ScreenSaverComponent } from 'src/app/screen-saver/screen-saver.component';
import { JitsiService } from 'src/app/component/twilio-component/services/jitsi.service';

@Component({
  selector: 'app-case-details',
  templateUrl: './case-details.component.html',
  styleUrls: ['./case-details.component.css'],
})
export class CaseDetailsComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('movieSearchInput', { static: true }) movieSearchInput: ElementRef;
  isgoingvideo: boolean; ///used to check if video is on or not
  isConnectingJitsiCall: boolean = false;
  isShowing: boolean = false;
  private isConnectingJitsiSubscription: Subscription;
  callingEnviroment: any;
  minDate = new Date();
  @Input() starRating: any;
  preview: boolean;
  existingCaseFile: MdbModalRef<RegisterSuccesfulPopupComponent> | null = null;
  isCheckDisabled: boolean = true;
  public ngxLoadingAnimationTypes = ngxLoadingAnimationTypes;
  loading = false;
  public config = {
    animationType: ngxLoadingAnimationTypes.none,
    backdropBorderRadius: '3px',
  };
  caseDetailPrint: any = [];
  @ViewChild('trigger') trigger!: ElementRef;
  @ViewChild('presription') presription!: ElementRef;
  @ViewChild('PrescriptionPreviewPdfComponent', { static: false })
  PrescriptionPreviewPdfComponent: PrescriptionPreviewPdfComponent;
  @ViewChild('searchDrug') searchDrug: any;
  @Output() onMeetingCloseTrigger: EventEmitter<boolean> =
    new EventEmitter<boolean>();
  o8;
  isReadOnly: boolean;
  isRefercase: boolean = true;
  previewPrint: any = {};
  isCaseDetailtextBox: any;
  isCaselableError: Boolean;
  feedback: MdbModalRef<PateintFeedbackComponent> | null = null;
  doctorreferral: MdbModalRef<PateintFeedbackComponent> | null = null;
  isYesterdayPatient = true;
  isAdvancePatient = false;
  isReferToDoctor = false;
  doctorSignature: any;
  //caseDeatilForm!: FormGroup;
  items: any = [
    'Aadhar Card',
    'Driving License',
    'PAN Card',
    'Passport',
    'Election ID',
    'Others',
  ];
  fileName = '';
  isFileInput = true;
  isFileName = false;
  files: any[];
  imageSrc: any[];
  patientcaseDetail: any = null;
  patientDetail: any;
  phcDetail: any;
  caseDetail: any;
  caseLabel: any = [];
  doctorList: any = [];
  patientVitals: PatientVitals[];
  vitals: any = [];
  patientId: any;
  patientCaseId: any;
  listVital: any = [];
  getqueue: any;
  currentDate: any;
  showSecondTab: boolean = false;
  isDoctor: boolean = false;
  isTreatment: boolean = false;
  isdisabledOnsubmit: boolean;
  ImagesHeader = environment.ImagesHeader;
  prescriptionPdf: any;
  existingPatientId: any;
  genPractice: boolean;
  subs: any;
  CaseDate: any;
  serverTime: any;
  role: any = localStorage.getItem('role');
  //treatmentplan: FormGroup
  // morning = false
  // noon = false
  // night = false
  // emptyStomach = false
  // afterMeal = false
  // od = false
  // bd = false
  // td = false
  // isDelete : boolean

  constructor(
    private modalService: MdbModalService,
    private fb: FormBuilder,
    private svcLocalstorage: SvclocalstorageService,
    private svcCasedetail: SvccasedetailService,
    private SvcPhcPatient: SvcPhcGetPatientService,
    public datepipe: DatePipe,
    private svcdoctor: Svc_getdoctordetailService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private svcgetdoctordtls: Svc_getdoctordetailService,
    private SvcTwilioMiddleware: TwilioMiddlewareService,
    private svcMaster: Svc_MasterService,
    private svcPatientService: SvcPhcGetPatientService,
    private _sweetAlert: SvcmainAuthserviceService,
    private location: LocationStrategy,
    private svcNotification: NotificationHubService,
    private jitsiService: JitsiService
  ) {
    //////////used to stop loader when their is error of 401 and 403////
    if (this.role == 'PHCUser') {
      this.callReceived();
    }
    this._sweetAlert.getLoader().subscribe((res: any) => {
      this.loading = res;
    });

    this._sweetAlert.getVideoCall().subscribe((res: any) => {
      this.isgoingvideo = res;
      console.log(res, 'videoca;llllllllllllllllllllllllllllll');

      if (res == false) {
        console.error('video accepted');

        history.pushState(null, null, this.router.url);
        this.location.onPopState(() => {
          let route = this.router.url.split('?')[0];
          let order = this.router.url.split('?')[1];
          history.pushState(null, '', this.router.url);
        });
      }
    });

    /////////////////////////////////////////////////////////////

    // if(this.getqueue.doctorSpecialization == 'General Practice'){
    //   this.genPractice = false;
    // }
    //this.patientDetail = this.svcLocalstorage.getPatientDetail();
    //this.caseDetail = this.svcLocalstorage.getCaseDetail();
    //console.log(this.caseDetail.caseFileID,'Case Detail.......')

    // this.datavitalsubmit()

    // this.getpatientcasequeue(2, 4)

    // this.getdetailphc(this.patientId,this.svcLocalstorage.GetData(environment.PhcID))

    // this.activatedRoute.queryParams.subscribe((res:any) => {
    //   this.patientDetail = res.res

    //   console.log( this.patientDetail,"====================respo")
    // }

    // );
    // this.getCasedetails(0,0)
  }
  ngOnDestroy(): void {
    clearTimeout(this.idleTimer);
    this._sweetAlert.closeAllModalsOnLogout.next(true);
  }
  phcName = this.svcLocalstorage.GetData(environment.PhcName);
  // diseasesListforProvisional:Observable<any[]>;
  snomedCodesList: any = [];
  filteredOptions: Observable<any>;

  ngOnInit(): void {
    this.callingEnviroment = this.SvcTwilioMiddleware.callingEnvironment;
    console.log(this.SvcTwilioMiddleware.callingEnvironment);
    this.treatmentFormInit();
    // this.svcNotification.OnNotificationHubStart.next(true);
    // this.filteredOptions = this.searchDrug.valueChanges.pipe(
    //   startWith(''),
    //   map((value:any) => this._filter(value)),
    // );

    this.DoctorNamefunction();

    //////call api on every search in Suggested Diagnosis (Snomed-CT) to filter/////

    // this.snomedCodesList = this.treatmentplan.get("suggestedDiagnosis").valueChanges.pipe(
    //   switchMap(term => this.svcMaster.SearchSnomedCTCodes(term)),
    //   map((response: []) => {
    //     return response
    //   })
    // );

    // this.diseasesListforProvisional = this.treatmentplan.get("provisionalDiagnosis").valueChanges.pipe(
    //   switchMap(term => this.svcdoctor.GetCDSSGuidelineDiseasesByDiseasesAndAge(term)),
    //   map((response: []) => {
    //     console.log(response);
    //     return response
    //   })
    // );

    this.date = new Date();
    this.currentDate = this.datepipe.transform(this.date, 'dd/MM/yyyy');

    const queryString = window.location.search;
    //if(typeof queryString !=  'undefined' && queryString){
    // const urlParams = new URLSearchParams(queryString);
    // const patientId = urlParams.get('patientId')
    // const phcid = urlParams.get('phcid')
    //this.getphcDetails(patientId , phcid)
    this.activatedRoute.queryParams.subscribe((qsRes: any) => {
      if (qsRes.src) {
        let qsData: IQueryString = JSON.parse(DecryptData(qsRes.src));

        this.existingPatientId = qsData.patientId;
        // let phcID = res.phcid;
        if (qsData.patientCaseId) {
          this.onSelection({ target: { value: qsData.patientCaseId } });
        }
        let userType = this.svcLocalstorage.GetData(environment.Role);

        if (userType === 'Doctor') {
          this.isDoctor = true;

          this.UserName = this.svcLocalstorage.GetData(environment.doctorName);
          var re = /null/gi;
          var str = this.UserName;
          this.phcName = str.replace(re, '');
          console.log(this.phcName);
          //  this.UserName = this.svcLocalstorage.GetData(environment.doctorName);
          // this.DoctorEmail = this.svcLocalstorage.GetData(environment.doctorEmail);
        }
        if (qsData.patientId) {
          //  this.getPhcDetail(phcID);
          this.getPatientProfile(qsData.patientId);
          // this.SvcPhcPatient.getCaseLabel(patientID).subscribe(data => {
          //   this.date = data[0].caseDateTime
          //   // this.date = new Date();
          //   this.latestdate = this.datepipe.transform(this.date, 'd/M/y')
          //   this.caseLabel = data;
          // //  this.getPatientCaseDetail(phcID, patientID)
          // });
          // //this.getListofVital()

          //this.getpatientcasequeue(phcID, patientID)
          //this.getCaseLabel(this.patientDetail.id);
          // this.PHCNamefunction()
          if (qsData.CaseType == 'new' || qsData.CaseType != undefined) {
          } else {
            this.GetDrugList();
            this.GetDiagnosticTest();
          }
        }
      } else {
      }
    });
    // this.jitsiService.isConnectingJitsi.subscribe(state => {
    //   this.isConnectingJitsiCall = state.isConnectingJitsiCall;
    //   localStorage.setItem('isConnectingJitsiCall', this.isConnectingJitsiCall.toString()); // Store the value in local storage
    //   console.log('jitsi Call end', this.isConnectingJitsiCall);
    // });
  }
  getIsConnectingJitsiCallFromLocalStorage() {
    return localStorage.getItem('isConnectingJitsiCall') === 'true';
  }
  ngAfterViewInit(): void {
    // fromEvent(this.movieSearchInput.nativeElement, 'keyup').pipe(
    //   // get value
    //   map((event: any) => {
    //     return event.target.value;
    //   })
    //   // if character length greater then 2t[[tttt[[t]]]]
    //   , filter((res) => {return res.length > 2})
    //   // Time in milliseconds between key events
    //   , debounceTime(1000)
    //   // If previous query is diffent from current
    //   , distinctUntilChanged()
    //   // subscription for response
    // ).subscribe((text: string) => {
    // this.onProvisionalValue()
    // });
  }

  videocalldata: any;
  markpatientabsent() {
    // debugger
    this.videocalldata = '';
    this._sweetAlert.getpatientAbsent().subscribe((res1: any) => {
      this._sweetAlert
        .deletesweetAlert(
          'Are you sure you want to mark patient absent ?',
          'info'
        )
        .then((res: any) => {
          if (res.isConfirmed == true) {
            this.videocalldata = res1;
            this.patientabsent();
          }
        });
    });
  }

  // get medicineVMs() {
  //   return this.treatmentplan.controls;
  // }
  get medicineVMs(): FormArray {
    return this.treatmentplan.controls['medicineVMs'] as FormArray;
  }

  caseDeatilForm: FormGroup = this.fb.group({
    file: new FormControl(''),
    // fileSource: new FormControl('', [Validators.required]),
    bloodpressure: new FormControl(''),
    // bodytemperature: new FormControl('', [Validators.required]),
    bloodsuger: new FormControl('', [Validators.required]),
    weight: new FormControl('', [Validators.required]),
    height: new FormControl(''),
    spo2: new FormControl(''),
    foetal: new FormControl(''),
    respirationRate: new FormControl('', [Validators.required]),
    Haemoglobin: new FormControl(''),
    lastMenstruation: new FormControl(''),
    ANC: new FormControl(''),
    ChildrenLiving: new FormControl(''),
    ChildrenDead: new FormControl(''),
    frh: new FormControl(''),
    Abortion: new FormControl(''),
    Muac: new FormControl(''),
    WfL: new FormControl(''),
    colour: new FormControl(''),
    CRT: new FormControl(''),
    Cry: new FormControl(''),
    Convulsions: new FormControl(''),
    Jaundice: new FormControl(''),
    breastFeeding: new FormControl(''),
    Sucking: new FormControl(''),
    HeadCircumference: new FormControl(''),
    Length: new FormControl(''),
    complaints: new FormControl('', [Validators.required]),
    //observations: new FormControl(''),
    examination_PA: new FormControl(''),
    examination_RS: new FormControl(''),
    examination_CVS: new FormControl(''),
    examination_CNS: new FormControl(''),
    Allergies: new FormControl(''),
    FamilyHistory: new FormControl(''),
    caseFileNumber: new FormControl('', [Validators.required]),
    caseHeading: new FormControl('', [Validators.required]),
  });
  get vital(): FormArray {
    return this.caseDeatilForm.get('vitals') as FormArray;
  }
  keyPressNumbers(event: any) {
    var charCode = event.which ? event.which : event.keyCode;
    // Only Numbers 0-9
    if (charCode < 48 || charCode > 57) {
      event.preventDefault();
      return false;
    } else {
      return true;
    }
  }
  openfeedback() {}
  dataSubmitpatient: any;
  datavitalsubmit() {
    let obj: any;
    obj.vitals = this.caseDeatilForm.get('vital').value;
    this.userObjFromToken = this.svcLocalstorage.GetData(
      environment.AuthTokenKeyLSKey
    );
    if (this.userObjFromToken) {
      this.SvcPhcPatient.AddPatientCaseDetails(obj).subscribe((data) => {
        this.dataSubmitpatient = data;
      });
    }
  }

  get bloodpressure() {
    return this.caseDeatilForm.get('bloodpressure');
  }

  get bloodsuger() {
    return this.caseDeatilForm.get('bloodsuger');
  }
  get weight() {
    return this.caseDeatilForm.get('weight');
  }
  get height() {
    return this.caseDeatilForm.get('height');
  }
  get spo2() {
    return this.caseDeatilForm.get('spo2');
  }
  get foetal() {
    return this.caseDeatilForm.get('foetal');
  }
  get respirationRate() {
    return this.caseDeatilForm.get('respirationRate');
  }
  get Haemoglobin() {
    return this.caseDeatilForm.get('Haemoglobin');
  }
  get lastMenstruation() {
    return this.caseDeatilForm.get('lastMenstruation');
  }
  get ANC() {
    return this.caseDeatilForm.get('ANC');
  }
  get ChildrenLiving() {
    return this.caseDeatilForm.get('ChildrenLiving');
  }
  get ChildrenDead() {
    return this.caseDeatilForm.get('ChildrenDead');
  }
  get frh() {
    return this.caseDeatilForm.get('frh');
  }
  get Abortion() {
    return this.caseDeatilForm.get('Abortion');
  }
  get Muac() {
    return this.caseDeatilForm.get('Muac');
  }
  get WfL() {
    return this.caseDeatilForm.get('WfL');
  }
  get colour() {
    return this.caseDeatilForm.get('colour');
  }
  get CRT() {
    return this.caseDeatilForm.get('CRT');
  }
  get Cry() {
    return this.caseDeatilForm.get('Cry');
  }
  get Convulsions() {
    return this.caseDeatilForm.get('Convulsions');
  }
  get Jaundice() {
    return this.caseDeatilForm.get('Jaundice');
  }
  get breastFeeding() {
    return this.caseDeatilForm.get('breastFeeding');
  }
  get Sucking() {
    return this.caseDeatilForm.get('Sucking');
  }
  get HeadCircumference() {
    return this.caseDeatilForm.get('HeadCircumference');
  }
  get Length() {
    return this.caseDeatilForm.get('Length');
  }
  bloodPressurevalidate: Boolean = false;
  bloodPressurevalidtaion(event: any) {
    this.bloodPressurevalidate = true;
    var bPValid = event.target.value.split('/');

    if (+parseInt(bPValid[0]) > +parseInt(bPValid[1])) {
      this.bloodPressurevalidate = false;
    } else {
      this.bloodPressurevalidate = true;
    }
  }

  keyPressNumbers1(event: any) {
    var charCode = event.which ? event.which : event.keyCode;
    // Only Numbers 0-9
    if (charCode < 47 || charCode > 57) {
      event.preventDefault();
      return false;
    } else {
      return true;
    }
  }
  keyPressNumbers2(event: any) {
    var charCode = event.which ? event.which : event.keyCode;
    // Only Numbers 0-9
    if (charCode < 46 || charCode > 57) {
      event.preventDefault();
      return false;
    } else {
      return true;
    }
  }
  keyPressNumber(event: any) {
    var charCode = event.which ? event.which : event.keyCode;
    // Only Numbers 0-9
    if (charCode < 48 || charCode > 57) {
      event.preventDefault();
      return false;
    } else {
      return true;
    }
  }
  refDoc: any;
  referDoctor() {
    console.log(this.phcDetail, 'eeeeeeeeeeeeeeeeeee', this.getqueue);

    this.doctorreferral = this.modalService.open(ReferDoctorComponent, {
      data: { phcDetail: this.phcDetail, patientDetail: [this.getqueue] },
    });
    this.doctorreferral.onClose.subscribe((message: any) => {
      //this.getPatientCaseDetail(this.getqueue?.patientCase?.id);
    });
    // let refParam = {
    //     patientCaseID: this.getqueue.patientCase.id,
    //     assignedDocterID: 0,
    //     phcid: this.getqueue.phcId
    //   }

    //   this.svcPatientService.AddReferDoctorInPatientCase(refParam).subscribe(res =>

    //   {
    //     this.refDoc = res
    //     console.log(this.refDoc.assignedDocterID)
    //     if(this.refDoc.assignedDocterID == 0){
    //       Swal.fire({
    //         title: 'Warning',
    //         text: `No Doctor Available, please try after some time!`,
    //         icon: 'warning',
    //       })
    //       this.loading =  false
    //     }
    //     else{
    //       Swal.fire({
    //         title: 'Success',
    //         text: `Referred to doctor succesfully!`,
    //         icon: 'success',
    //       }).then((result) => {
    //             this.router.navigate(['chc-center']);
    //            })
    //     this.loading = false

    //     }
    //     },err => {

    //       Swal.fire({
    //         title: 'Warning',
    //         text: `Something Went Wrong!!`,
    //         icon: 'warning',
    //       })
    //       console.log(err, "err")
    //       this.loading = false
    //     })

    //     this.loading = true

    //
  }
  get f() {
    return this.caseDeatilForm.controls;
  }
  clickuplaoddoc() {
    this.isFileInput = false;
    this.isFileName = true;
  }
  imgfile: any[];

  imgFileInfo: any;

  clickTreatment() {
    // this.showSecondTab = true
    // this.getpatientcasequeue(this.patientDetail.phcid, this.patientDetail.id)
  }
  validateAllFormFields(formGroup: FormGroup) {
    //{1}
    Object.keys(formGroup.controls).forEach((field) => {
      //{2}
      const control = formGroup.get(field); //{3}
      if (control instanceof FormControl) {
        //{4}
        control.markAsTouched({ onlySelf: true });
      } else if (control instanceof FormGroup) {
        //{5}
        this.validateAllFormFields(control); //{6}
      }
    });
  }
  userObjFromToken: any;
  //   getCasedetails(PHCId: any, PatientId: any){
  //     this.patientcaseDetail = null;
  //     this.userObjFromToken = this.svcLocalstorage.GetData(environment.AuthTokenKeyLSKey);
  //      //console.log(this.userObjFromToken)
  //      if (this.userObjFromToken)
  //        this.svcCasedetail.GetPatientCaseDetails(PHCId,PatientId).subscribe(data => {
  //        this.patientcaseDetail = data
  //        });

  // }

  setCaseDetailPhc: any;
  setCaseDetail() {
    this.addViatalsInForm();
    let obj: any = {};

    obj.symptom = this.caseDeatilForm.get('complaints').value;
    //obj.observation = this.caseDeatilForm.get('observations').value;
    obj.allergies = this.caseDeatilForm.get('Allergies').value;
    obj.familyHistory = this.caseDeatilForm.get('FamilyHistory').value;
    obj.vitals = this.vitals;

    this.userObjFromToken = this.svcLocalstorage.GetData(
      environment.AuthTokenKeyLSKey
    );
    if (this.userObjFromToken)
      this.svcCasedetail.setCasedetailPhc(obj).subscribe((data) => {});
  }

  //   getdetailphc(patientId,phcid){

  //    // const queryString = window.location.search;
  //    // const urlParams = new URLSearchParams(queryString);
  //     // const patientId = urlParams.get('patientId')
  //     // const phcid = urlParams.get('phcid')

  //   console.log(patientId, "=======code")
  //   console.log(phcid, "=======code")

  //   //this.getPhcDetail({  "patientID": code })
  //  // this.getphcDetails(patientId , phcid)
  //   this.activatedRoute.queryParams.subscribe((res: any) => {
  //     let patientID = patientId;
  //     let phcID = phcid;

  //   }

  //    );
  //   }
  imagespatient = environment.ImagesHeader;
  gender: any;
  maritalstatus: any;
  getPhcDetail(phcId) {
    this.SvcPhcPatient.getphcdetailById(phcId).subscribe((data) => {
      this.phcDetail = data;
      //this.svcLocalstorage.getPatientCaseDetail(this.phcDetail.id, this.patientDetail.id);
      // if (this.patientDetail.genderId == 1) {
      //   this.gender = "male"
      // }
      // if (this.patientDetail.genderId == 2) {
      //   this.gender = "female"
      // }
      // if(this.patientDetail.maritalStatusID == 1){
      //   this.maritalstatus = "Married"
      // }
      // if(this.patientDetail.maritalStatusID == 2){
      //   this.maritalstatus = "UnMarried"
      // }
      // if(this.patientDetail.maritalStatusID == 3){
      //   this.maritalstatus = "Widow"
      // }
      // if(this.patientDetail.maritalStatusID == 4){
      //   this.maritalstatus = "Widower"
      // }
    });
  }
  // getmethod(patientId,phcId){
  //   const queryString = window.location.search;
  //   const urlParams = new URLSearchParams(queryString);
  //   // const patientId = urlParams.get('patientId')
  //   // const phcId = urlParams.get('phcid')
  //   this.getphcDetails(patientId, phcId)

  //   this.activatedRoute..subscribe(params => {

  //     let patientID = patientId;
  //     let phcID = phcId;
  //   });
  // }
  // getphcDetails(patientId, phcId) {
  //   this.userObjFromToken = this.svcLocalstorage.GetData(environment.AuthTokenKeyLSKey);
  //   if(this.userObjFromToken){
  //     // this.svcCasedetail.GetPatientCaseDetails(patientId, phcId).subscribe(data => {
  //     //   this.patientDetail = data['patientMaster'];
  //     //   this.svcLocalstorage.SetData("patientDetail",JSON.stringify(this.patientDetail))
  //     //   console.log( data  , "ddddsertt")

  //     // });
  //     this.SvcPhcPatient.getCaseLabel(patientId).subscribe(f => {
  //       debugger
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

  date: any;
  latestdate: any;
  getCaseLabel(patientId) {
    this.SvcPhcPatient.getCaseLabel(patientId).subscribe((data) => {
      this.date = data[0].caseDateTime;
      // this.date = new Date();
      this.latestdate = this.datepipe.transform(this.date, 'd/M/y');
      this.caseLabel = data;
    });
  }

  getListofVital() {
    this.userObjFromToken = this.svcLocalstorage.GetData(
      environment.AuthTokenKeyLSKey
    );
    if (this.userObjFromToken)
      this.svcdoctor.GetListOfVital().subscribe((data) => {
        this.listVital.push(data);
      });
  }
  patientqueue: any;

  // getpatientcasequeue(phcid, patientid) {
  //   this.userObjFromToken = this.svcLocalstorage.GetData(environment.AuthTokenKeyLSKey);
  //   if (this.userObjFromToken)
  //     this.SvcPhcPatient.getpatientcasequeue(phcid, patientid).subscribe((data:any) => {
  //       this.patientqueue = data
  //       console.log(data, 'Patient Queue')
  //       this.isReferToDoctor = data.doctorID > 0
  //     });

  // }

  addViatalsInForm() {
    this.vitals = [];
    let caseid = this.getqueue.patientCase.id;
    let currentDate = new Date(this.date).toISOString();
    let formValue = this.caseDeatilForm.value;
    this.vitals = [
      {
        patientCaseId: caseid,
        vitalId: 1,
        vitalName: 'Blood Pressure',
        unit: '',
        value: formValue.bloodpressure || '',
        date: currentDate,
      },
      {
        patientCaseId: caseid,
        vitalId: 2,
        vitalName: 'Blood Suger',
        unit: '',
        value: formValue.bloodsuger || '',
        date: currentDate,
      },
      {
        patientCaseId: caseid,
        vitalId: 3,
        vitalName: 'Weight',
        unit: '',
        value: formValue.weight || '',
        date: currentDate,
      },
      {
        patientCaseId: caseid,
        vitalId: 4,
        vitalName: 'Height',
        unit: '',
        value: formValue.height || '',
        date: currentDate,
      },
      {
        patientCaseId: caseid,
        vitalId: 5,
        vitalName: 'SPO2',
        unit: '',
        value: formValue.spo2 || '',
        date: currentDate,
      },
      {
        patientCaseId: caseid,
        vitalId: 7,
        vitalName: 'Respiration Rate',
        unit: '',
        value: formValue.respirationRate || '',
        date: currentDate,
      },
      {
        patientCaseId: caseid,
        vitalId: 8,
        vitalName: 'Head Circumference',
        unit: '',
        value: formValue.HeadCircumference || '',
        date: currentDate,
      },
      {
        patientCaseId: caseid,
        vitalId: 9,
        vitalName: 'Length',
        unit: '',
        value: formValue.Length || '',
        date: currentDate,
      },
      {
        patientCaseId: caseid,
        vitalId: 10,
        vitalName: 'MUAC',
        unit: '',
        value: formValue.Muac || '',
        date: currentDate,
      },
      {
        patientCaseId: caseid,
        vitalId: 11,
        vitalName: 'Weight for length',
        unit: '',
        value: formValue.WfL || '',
        date: currentDate,
      },
      {
        patientCaseId: caseid,
        vitalId: 12,
        vitalName: 'Haemoglobin',
        unit: '',
        value: formValue.Haemoglobin || '',
        date: currentDate,
      },
      {
        patientCaseId: caseid,
        vitalId: 13,
        vitalName: 'Last Menstruation',
        unit: '',
        value: formValue.lastMenstruation || '',
        date: currentDate,
      },
      {
        patientCaseId: caseid,
        vitalId: 14,
        vitalName: 'ANC Month',
        unit: '',
        value: formValue.ANC || '',
        date: currentDate,
      },
      {
        patientCaseId: caseid,
        vitalId: 15,
        vitalName: 'No of children - Living',
        unit: '',
        value: formValue.ChildrenLiving || '',
        date: currentDate,
      },
      {
        patientCaseId: caseid,
        vitalId: 16,
        vitalName: 'No of children - Dead',
        unit: '',
        value: formValue.ChildrenDead || '',
        date: currentDate,
      },
      {
        patientCaseId: caseid,
        vitalId: 17,
        vitalName: 'Abortion - No. of Week ago',
        unit: '',
        value: formValue.Abortion || '',
        date: currentDate,
      },
      {
        patientCaseId: caseid,
        vitalId: 18,
        vitalName: 'FRH BPM',
        unit: '',
        value: formValue.frh || '',
        date: currentDate,
      },
      {
        patientCaseId: caseid,
        vitalId: 19,
        vitalName: 'Colour',
        unit: '',
        value: formValue.colour || '',
        date: currentDate,
      },
      {
        patientCaseId: caseid,
        vitalId: 20,
        vitalName: 'CRT > 3 secs',
        unit: '',
        value: formValue.CRT || '',
        date: currentDate,
      },
      {
        patientCaseId: caseid,
        vitalId: 21,
        vitalName: 'Cry',
        unit: '',
        value: formValue.Cry || '',
        date: currentDate,
      },
      {
        patientCaseId: caseid,
        vitalId: 22,
        vitalName: 'Convulsions',
        unit: '',
        value: formValue.Convulsions || '',
        date: currentDate,
      },
      {
        patientCaseId: caseid,
        vitalId: 23,
        vitalName: 'Jaundice',
        unit: '',
        value: formValue.Jaundice || '',
        date: currentDate,
      },
      {
        patientCaseId: caseid,
        vitalId: 24,
        vitalName: 'Taking Breast Feeds',
        unit: '',
        value: formValue.breastFeeding || '',
        date: currentDate,
      },
      {
        patientCaseId: caseid,
        vitalId: 25,
        vitalName: 'Sucking',
        unit: '',
        value: formValue.Sucking || '',
        date: currentDate,
      },
    ];
    if (formValue.foetal) {
      this.vitals.push({
        patientCaseId: caseid,
        vitalId: 6,
        vitalName: 'Foetal Doppler',
        unit: '',
        value: formValue.foetal || '',
        date: currentDate,
      });
    }
  }

  treatmentplan: FormGroup;
  treatmentFormInit() {
    this.treatmentplan = this.fb.group({
      suggestedDiagnosis: new FormControl('', [Validators.required]),
      provisionalDiagnosis: new FormControl('', [Validators.required]),
      reviewDate: new FormControl(''),
      patientCaseDiagonostics: new FormControl(''),
      instruction: new FormControl(''),
      findings: new FormControl(''),
      doctorFeedback: new FormControl(''),

      referredTo: new FormControl(''),
      comment: new FormControl(''),
      form_treatment: new FormControl(''),

      medicineVMs: this.fb.array([
        this.fb.group({
          drugID: new FormControl(''),
          //  morning: new FormControl(false),
          //   noon: new FormControl(false),
          //  night: new FormControl(false),
          // emptyStomach: new FormControl(false),
          // afterMeal: new FormControl(false),
          // od: new FormControl(false),
          // bd: new FormControl(false),
          // td: new FormControl(false),
          duration: new FormControl(''),
          doseDuration: new FormControl('emptyStomach'),
          doseTiming: new FormControl('od'),
          medicinecomments: new FormControl(''),
        }),
      ]),
      // examination_PA: new FormControl(''),
      // examination_RS: new FormControl(''),
      // examination_CVS: new FormControl(''),
      // examination_CNS: new FormControl(''),
    });
  }

  getPdf(event) {}
  // uploadPrescription() {
  //   this.preview = false;
  //   const pdfblob = this.PrescriptionPreviewPdfComponent.getPdffile()
  //   const name = "prescription"
  //   const id = "0"
  //   let fileData = new FormData();
  //   const DocumentTypeId = '2';

  //   fileData.append(`caseDocumentVM[0].name`, name)
  //   fileData.append(`caseDocumentVM[0].file`, pdfblob)
  //   fileData.append(`caseDocumentVM[0].id`, id)
  //   fileData.append(`caseDocumentVM[0].patientCaseId`, this.getqueue.patientCase.id)
  //   fileData.append(`caseDocumentVM[0].DocumentTypeId`, DocumentTypeId)

  //   this.svcCasedetail.caseFileUpload(fileData).subscribe(data => {
  //     Swal.fire({
  //       title: 'Success',
  //       text: `You submitted succesfully!`,
  //       icon: 'success',
  //     }).then((result) => {
  //       this.referDoctor()
  //     })
  //   }, error => {
  //     Swal.fire({
  //       title: 'Warning',
  //       text: `Something Went Wrong!`,
  //       icon: 'warning',
  //     })
  //   }
  //   )
  // }

  printPrescription() {
    let referredMedList = this.referredMedList;

    let diagnostics = [];
    if (this.patientCaseDiagonostics?.length) {
      this.patientCaseDiagonostics.forEach((diagnostic) => {
        diagnostics.push({
          id: 0,
          patientCaseID: this.patientCaseDetailId,
          diagonosticTestID: diagnostic.id,
          getDiagnosticTestName: this.getDiagnosticTestName(diagnostic.id),
        });
      });
    }
    const pdfblob = this.PrescriptionPreviewPdfComponent?.getPdffile(
      this.getqueue,
      this.treatmentplan.value,
      diagnostics,
      referredMedList
    );
    pdfblob?.then((result) => {
      const data = window.URL.createObjectURL(result);
      const link = document.createElement('a');
      link.href = data;
      link.target = '_blank';
      //    link.download = `newPdf.pdf`;
      link.click();
    });
    //this.preview = true;
    // this.PrescriptionPreviewPdfComponent.getPdfHtmlElement()
    // if(this.preview){
    //  const data = window.URL.createObjectURL(this.prescriptionPdf);
    // const link = document.createElement('a');
    // link.href = this.prescriptionPdf;
    // link.target = '_blank';
    // link.download = `newPdf.pdf`;
    // link.click();
    //       }
  }
  // uploadPrescription(){
  //   const doc = new jsPDF();

  //   const pdfTable = this.pdfTable.nativeElement;

  //   var html = htmlToPdfmake(pdfTable.innerHTML);

  //   const documentDefinition = { content: html };
  //   pdfMake.createPdf(documentDefinition).open();

  //   // let fileData = new FormData();
  //   // const DocumentTypeId = '2'
  //   // this.userSelectedDoc.filter(x => x.id == 0).forEach((element, i) => {
  //   //   fileData.append(`caseDocumentVM[${i}].name`, element.name)
  //   //   fileData.append(`caseDocumentVM[${i}].file`, element.file)
  //   //   fileData.append(`caseDocumentVM[${i}].id`, element.id)
  //   //   fileData.append(`caseDocumentVM[${i}].patientCaseId`, this.getqueue.patientCase.id)
  //   //   fileData.append(`caseDocumentVM[${i}].DocumentTypeId`, DocumentTypeId)
  //   // });
  //     // fileData.append(`caseDocumentVM.name`, name)
  //     // fileData.append(`caseDocumentVM.file`, file)
  //     // fileData.append(`caseDocumentVM.id`, id)
  //     // fileData.append(`caseDocumentVM.patientCaseId`, this.getqueue.patientCase.id)
  //     // fileData.append(`caseDocumentVM.DocumentTypeId`, DocumentTypeId)
  //   // this.svcCasedetail.caseFileUpload(fileData).subscribe(data => {
  //   //   Swal.fire({
  //   //     title: 'Success',
  //   //     text: `You submitted succesfully!`,
  //   //     icon: 'success',
  //   //   }).then((result) => {
  //   //     this.referDoctor()
  //   //   })
  //   // },error =>{
  //   //   Swal.fire({
  //   //     title: 'Warning',
  //   //     text: `Something Went Wrong!`,
  //   //     icon: 'warning',
  //   //   })
  //   // }
  //   // )
  // }

  fileUploadDocToServer(docList, DocumentTypeId) {
    let fileData = new FormData();
    //const DocumentTypeId = '1'
    docList
      .filter((x) => x.id == 0)
      .forEach((element, i) => {
        fileData.append(`caseDocumentVM[${i}].name`, element.name);
        fileData.append(`caseDocumentVM[${i}].file`, element.file);
        fileData.append(`caseDocumentVM[${i}].id`, element.id);
        fileData.append(
          `caseDocumentVM[${i}].patientCaseId`,
          this.getqueue.patientCase.id
        );
        fileData.append(`caseDocumentVM[${i}].DocumentTypeId`, DocumentTypeId);
      });
    this.svcCasedetail.caseFileUpload(fileData).subscribe(
      (data) => {
        this.loading = false;
        this.getPatientCaseDetail(this.patientCaseDetailId);
        if (DocumentTypeId == 1) {
          Swal.fire({
            title: 'Success',
            text: `Submitted and Document uploaded Succesfully`,
            icon: 'success',
          }).then((result) => {
            if (DocumentTypeId == 1) this.referDoctor();
          });
        } else {
          Swal.fire({
            title: 'Success',
            text: `Treatment Plan Submitted Succesfully`,
            icon: 'success',
          }).then((result) => {
            if (DocumentTypeId == 1) this.referDoctor();
          });
        }
      },
      (error) => {
        this.loading = false;
        Swal.fire({
          title: 'Warning',
          text: `Something Went Wrong`,
          icon: 'warning',
        });
      }
    );
    this.loading = true;
  }
  checkFormValue() {
    if (
      !this.caseDeatilForm.value.bloodpressure &&
      this.caseDetails.patientCase.specializationID.toString() == '3'
    ) {
      this.bloodPressurevalidate = false;
    }
    if (this.caseDeatilForm.invalid || this.bloodPressurevalidate) {
      console.log(this.bloodPressurevalidate, 'blood pressure');
      console.log(this.caseDeatilForm, 'form');

      this.caseDeatilForm.markAllAsTouched();
      return;
    }
    // return false;
    this.isRefercase = false;

    let formValue = this.caseDeatilForm.value;
    //console.log(formValue)

    this.addViatalsInForm();
    let data = {
      phcUserId: this.getqueue.phcUserId,
      phcId: this.getqueue.phcId,
      patientID: this.getqueue.patientMaster.id,
      patientCase: {
        id: this.getqueue.patientCase.id,
        patientId: this.getqueue.patientMaster.id,
        caseFileNumber: this.getqueue.patientCase.caseFileNumber,
        caseHeading: this.getqueue.patientCase.caseHeading,
        //observation: formValue.observations,
        observation:
          formValue.examination_PA +
          '#=#' +
          formValue.examination_RS +
          '#=#' +
          formValue.examination_CVS +
          '#=#' +
          formValue.examination_CNS,
        symptom: formValue.complaints,
        allergies: formValue.Allergies,
        familyHistory: formValue.FamilyHistory,
        diagnosis: '',
        instruction: '',
        prescription: '',
        test: '',
        createdBy: this.getqueue.phcId,
        updatedBy: this.getqueue.phcId,
      },

      vitals: this.vitals,
    };

    if (data.vitals.length == 0) {
      data.vitals = {};
    }
    // return false;
    this.userObjFromToken = this.svcLocalstorage.GetData(
      environment.AuthTokenKeyLSKey
    );
    if (this.userObjFromToken) {
      this.svcCasedetail.setCasedetailPhc(data).subscribe(
        (x) => {
          // this.userSelectedDoc = []
          if (this.userSelectedDoc.filter((x) => x.id == 0).length > 0) {
            this.fileUploadDocToServer(this.userSelectedDoc, 1);
          } else {
            this.loading = false;
            Swal.fire({
              title: 'Success',
              text: `Submitted Successfully`,
              icon: 'success',
            }).then((result) => {
              this.referDoctor();
            });
          }

          this.isRefercase = false;
        },
        (error) => {
          this.loading = false;
          Swal.fire({
            title: 'warning',
            text: ``,
            icon: 'warning',
          });
        }
      );
      this.loading = true;
    }
  }

  checkReferDoctor(data) {
    this.isReferToDoctor = data.doctorName ? true : false;
  }

  patientopd: any;
  isCompleted: boolean;
  canCallInitiate: boolean = false;
  isvideoCall: boolean;
  isSubmitShow :boolean
  isClinical: boolean;
  isPrescription: boolean;
  showTreatmentMenu: boolean = false;
  referIdnotMatched: boolean = false;
  buttonHideRefer: boolean = true;
  imgInfo: string = '../../../../../assets/Images/file-icon/upload-icon.png';
  caseStatusID: number = 0;
  caseDetails: any;
  patientCaseIdForFeedbak: any;
  getPatientCaseDetail(patientCaseId) {
    this.treatmentplan.reset();
    this.treatmentplan.updateValueAndValidity();
    this.treatmentFormInit();
    this.snomedCodesList = [];
    this.diseasesListforProvisional = [];
    this.errorProvision = false;
    //this.patientCaseDiagonostics.setValue({})

    console.log(this.treatmentplan.value, 'getpatient');

    this.userObjFromToken = this.svcLocalstorage.GetData(
      environment.AuthTokenKeyLSKey
    );
    if (this.userObjFromToken) {
      this.loading = true;
      forkJoin([
        this.SvcPhcPatient.getPatientCaseDetail(patientCaseId),
        this.SvcPhcPatient.getPatientCasedocList(patientCaseId),
      ]).subscribe({
        next: (patientCaseDetails: any) => {
          this.loading = false;
          const data = patientCaseDetails[0];
          const docs = patientCaseDetails[1];
          // if(docs[0]?.documentTypeID == 1){
          //   this.isClinical = true;
          //   this.isPrescription = false;
          // }
          // if(docs[0]?.documentTypeID == 2){
          //   this.isClinical = false;
          //   this.isPrescription = true;
          // }

          this.patientCaseIdForFeedbak = data.patientCase.id;
          console.log(
            this.patientCaseIdForFeedbak,
            'this.patientCaseIdForFeedbak'
          );

          this.CaseDate = data.assignedOn;
          this.serverTime = data.serverCurrentDateTime;
          this.caseDetails = data;
          console.log(this.caseDetails, 'this.caseDetails');

          if (data) {
            // this.canCallInitiate = this.isDoctor && data.videoCallStatus == false;
            this.isvideoCall =
              this.isDoctor 
            && data.videoCallStatus == 'in-progress';
            // this.isSubmitShow = this.isDoctor  && this.isConnectingJitsiCall

            this.isCDSS = false;

            this.prescriptionPdf = data?.patientCase?.prescription
              ? `${this.ImagesHeader}${data?.patientCase?.prescription}`
              : '';
            //  this.isCompleted = data?.caseFileStatusID === 5 ? true : false;
            this.isCompleted =
              data?.caseFileStatusID == 1 || data?.caseFileStatusID === 5
                ? true
                : false;
            let userType = this.svcLocalstorage.GetData(environment.PhcID);

            if (data?.patientCase?.createdBy != userType) {
              this.referIdnotMatched = true;
              this.buttonHideRefer = false;
            }
            this.checkReferDoctor(data);
            this.getqueue = data;
            this.showSubmitbtn = this.getqueue?.patientCase?.caseStatusID == 1;
            this.showTreatmentMenu =
              this.getqueue?.patientCase?.caseStatusID == 3;
            this.caseStatusID = this.getqueue?.patientCase?.caseStatusID;

            this.caseDetailPrint = data;
            //this.caseDeatilForm.controls['Allergies'].setValue('abcdd')

            this.caseDeatilForm.patchValue({
              complaints: data.patientCase.symptom,
              observations: data.patientCase.observation,
              Allergies: data.patientCase.allergies,
              FamilyHistory: data.patientCase.familyHistory,
              bloodpressure: data.vitals[0]?.value,
              bloodsuger: data.vitals[1]?.value,
              weight: data.vitals[2]?.value,
              height: data.vitals[3]?.value,
              spo2: data.vitals[4]?.value,
              respirationRate: data.vitals[5]?.value,
              HeadCircumference: data.vitals[6]?.value,
              Length: data.vitals[7]?.value,
              Muac: data.vitals[8]?.value,
              WfL: data.vitals[9]?.value,
              Haemoglobin: data.vitals[10]?.value,
              lastMenstruation: data.vitals[11]?.value,
              ANC: data.vitals[12]?.value,
              ChildrenLiving: data.vitals[13]?.value,
              ChildrenDead: data.vitals[14]?.value,
              Abortion: data.vitals[15]?.value,
              frh: data.vitals[16]?.value,
              colour: data.vitals[17]?.value,
              CRT: data.vitals[18]?.value,
              Cry: data.vitals[19]?.value,
              Convulsions: data.vitals[20]?.value,
              Jaundice: data.vitals[21]?.value,
              breastFeeding: data.vitals[22]?.value,
              Sucking: data.vitals[23]?.value,
              foetal: data.vitals[24]?.value,

              caseFileNumber: data?.patientCase?.caseFileNumber,
              caseHeading: data?.patientCase?.caseHeading,
              file: data?.caseDocuments[0]?.documentPath,
            });

            this.patientCaseDiagonostics = [];
            data?.caseDiagnosisTestList?.forEach((test) => {
              const diagnosis = this.getDiagnosticTestName(
                test?.diagonosticTestID
              );
              this.patientCaseDiagonostics.push({
                id: test?.diagonosticTestID,
                name: this.getDiagnosticTestName(test?.diagonosticTestID).name,
              });
              // this.patientCaseDiagonostics.name
            });
            this.treatmentplan.patchValue({
              suggestedDiagnosis: data?.patientCase?.suggestedDiagnosis,
              provisionalDiagnosis: data?.patientCase?.provisionalDiagnosis,
              instruction: data?.patientCase?.instruction,
              findings: data?.patientCase?.finding,
              doctorFeedback: data?.patientCase?.doctorFeedback,

              reviewDate: data?.patientCase?.reviewDate,
            });

            if (data?.patientCase?.observation) {
              let obItems = (data?.patientCase?.observation).split(/#=#/g);

              this.caseDeatilForm.patchValue({
                examination_PA: obItems[0],
                examination_RS: obItems[1],
                examination_CVS: obItems[2],
                examination_CNS: obItems[3],
              });
            }

            data?.caseMedicineList?.map((caseMedicine) => {
              caseMedicine.drugID = caseMedicine?.drugMasterID;
              caseMedicine.medicineName =
                caseMedicine?.drugName + caseMedicine?.drugFormAndVolume;
              caseMedicine.noon = caseMedicine?.noon
                ? caseMedicine?.noon
                : false;
              caseMedicine.doseTiming = caseMedicine.od
                ? 'od'
                : caseMedicine.bd
                ? 'bd'
                : caseMedicine.td
                ? 'td'
                : caseMedicine.qid
                ? 'qid'
                : 'od';
              caseMedicine.doseDuration = caseMedicine.afterMeal
                ? 'afterMeal'
                : 'emptyStomach';
              caseMedicine.medicinecomments = caseMedicine.comment;
            });
            this.referredMedList = [...data.caseMedicineList];

            this.patientDetail = data.patientMaster;
            this.patientopd = data.patientCase;
          }
          this.userSelectedDoc = [];
          if (docs?.length) {
            docs.forEach((doc) => {
              this.userSelectedDoc.push({
                name: doc.documentName,
                file: `${this.ImagesHeader}${doc.documentPath}`,
                id: doc.id,
                imgInfo:
                  '../../../../../assets/Images/file-icon/upload-icon.png',
                documentTypeID: doc.documentTypeID,
              });
            });
          }
          if (this.patientDetail.genderId == 1) {
            this.gender = 'male';
          }
          if (this.patientDetail.genderId == 2) {
            this.gender = 'female';
          }
          if (this.patientDetail.maritalStatusID == 1) {
            this.maritalstatus = 'Married';
          }
          if (this.patientDetail.maritalStatusID == 2) {
            this.maritalstatus = 'UnMarried';
          }
          if (this.patientDetail.maritalStatusID == 3) {
            this.maritalstatus = 'Widow';
          }
          if (this.patientDetail.maritalStatusID == 4) {
            this.maritalstatus = 'Widower';
          }
          this.specializationSelect();

          //  this.getpatientcasequeue(this.patientDetail.phcid, this.patientDetail.id)
        },
        error: (data: any) => {
          this.loading = false;
          this.caseDeatilForm.reset();
          this.userSelectedDoc.length == 0;
        },
      });
    }
  }
  filterItemsOfType(type) {
    return this.userSelectedDoc.filter((x) => x.documentTypeID == type);
  }
  imageurls = [];
  base64String: string;
  name: string;
  imagePath: string;

  removeImageEdit(i, imagepath) {
    this.caseDeatilForm.value.id = i;
    this.caseDeatilForm.value.ImagePath = imagepath;
  }

  removeImage(i) {
    this.userSelectedDoc.splice(i, 1);
    this.arr1 = [];
  }
  fileSizeError: string = 'File is more than 5 MB is not allowed';
  userSelectedDoc: any = [];
  biggerFile: boolean = false;
  arr1 = [];
  onSelectFile(event) {
    if (event.target.files && event.target.files[0]) {
      var filesAmount = event.target.files.length;
      var filea = event.target.files;
      for (let i = 0; i < filesAmount; i++) {
        if (this.arr1.indexOf(filea[i].name) === -1) {
          this.arr1.push(filea[i].name);

          let size = filea[i]?.size / 1024 / 1024;

          if (filea[i].type.toLowerCase().startsWith('video') && size > 20) {
            this.biggerFile = true;
            filesAmount = [];
            this.fileSizeError = 'File is more than 20 MB is not allowed';
            return false;
          } else if (
            !filea[i].type.toLowerCase().startsWith('video') &&
            size > 5
          ) {
            this.fileSizeError = 'File is more than 5 MB is not allowed';

            // alert('File is bigger than 5MB');
            this.biggerFile = true;
            filesAmount = [];
            return false;
          } else {
            this.biggerFile = false;
          }

          // if (filea[i].name == currentfiles) {
          //   alert("Duplicate File");
          //   break;
          // }

          this.userSelectedDoc.push({
            name: event.target.files[i].name,
            file: event.target.files[i],
            id: 0,
            imgInfo: '../../../../../assets/Images/file-icon/upload-icon.png',
            documentTypeID: 1,
          });
        } else {
          alert(filea[i].name + ' already selected');
        }
      }
    }
  }
  backToDashboard() {
    if (this.isDoctor) {
      this.router.navigate(['doctor-detail']);
    } else {
      this.router.navigate(['chc-center']);
    }
  }

  getlabelDate(createdOn) {
    let today = new Date(createdOn.caseDateTime);
    let date =
      today.getDate() +
      '-' +
      (today.getMonth() + 1) +
      '-' +
      today.getFullYear() +
      ' ' +
      '(' +
      today.getHours() +
      ':' +
      today.getMinutes() +
      ')';

    return date;
  }
  patientProfileDetail: any;
  ExistingCasepatientID: any;
  reversecaseDetail: any;
  getPatientProfile(patientId) {
    this.userObjFromToken = this.svcLocalstorage.GetData(
      environment.AuthTokenKeyLSKey
    );
    if (this.userObjFromToken) {
      this.SvcPhcPatient.getPatientProfile(patientId).subscribe((data) => {
        this.patientProfileDetail = data;

        if (
          parseInt(this.patientProfileDetail?.patientMaster?.storageSource) ==
            0 ||
          parseInt(this.patientProfileDetail?.patientMaster?.storageSource) == 1
        ) {
          this.GetPatientImageFile(
            this.patientProfileDetail?.patientMaster?.photo,
            this.patientProfileDetail?.patientMaster?.storageSource
          );
        } else {
          this.imgprofile =
            this.imagespatient +
            this.patientProfileDetail?.patientMaster?.photo;
        }

        let x = this.patientProfileDetail.caseLabelDTOs;
        this.reversecaseDetail = [...x].reverse();
        if (this.reversecaseDetail.length > 0) {
          this.reversecaseDetail[0];
          this.CaseDate = this.reversecaseDetail[0].caseDateTime;

          this.onSelection({
            target: { value: this.reversecaseDetail[0].caseID },
          });
        }
        this.ExistingCasepatientID = this.patientProfileDetail.patientMaster.id;
      });
    }
  }

  imgprofile: any;
  GetPatientImageFile(image, path) {
    this.SvcPhcPatient.GetPatientImageFile(image, path).subscribe(
      (res: any) => {
        // this.imgprofile=res
        const reader = new FileReader();
        const url = reader.readAsDataURL(res);
        reader.onloadend = () => (this.imgprofile = reader.result);

        // let objectURL = URL.createObjectURL(res);
        // this.imgprofile = this.sanitizer.bypassSecurityTrustUrl(objectURL);
      },
      (err: any) => {},
      () => {
        //this.loading=false
      }
    );
  }

  onSelectionCaseId: any;
  showSubmitbtn: boolean;
  patientCaseDetailId: any;
  isshowcaselabelError: boolean = true;
  onSelection($event: any) {
    var element = document.getElementById('borderColor');
    element.classList.remove('textdangerSelection');
    this.isshowcaselabelError = false;
    this.getPatientCaseDetail($event?.target?.value);

    this.patientCaseDetailId = $event?.target?.value;
    // if ($event?.target?.value == 0) {
    //   this.showSubmitbtn = false
    // }
    // else {
    //   this.showSubmitbtn = true
    // }
  }
  obsspec: boolean;
  pediaSpec: boolean;

  headLength: boolean;
  isAgeLessThen28Day: number = -1;
  specializationSelect() {
    this.isAgeLessThen28Day = -1;
    this.genPractice = true;
    this.pediaSpec = false;
    this.obsspec = false;

    // if (this.getqueue?.patientCase.specializationID == 1) {
    // }
    if (this.getqueue?.patientCase.specializationID == '2') {
      this.obsspec = true;
    }
    if (this.getqueue?.patientCase.specializationID == 3) {
      var a = moment(new Date());
      var b = moment(new Date(this.getqueue.patientMaster.dob));
      let days = a.diff(b, 'days'); // 1
      let years = a.diff(b, 'years');
      this.pediaSpec = true;
      if (days <= 28) {
        this.isAgeLessThen28Day = 1;
        this.obsspec = false;
      } else if (days >= 29 && years <= 14) {
        this.isAgeLessThen28Day = 2;
        this.obsspec = false;
      }
    }
  }

  patientabsent() {
    this.loading = true;
    let objt: any = {};
    objt.comment = 'Patient Absent';
    objt.caseID = this.patientCaseDetailId;
    objt.doctorID = this.svcLocalstorage.GetData(environment.doctorID);
    objt.roomInstance = localStorage.getItem('meetingInstace');
    this.svcgetdoctordtls.PatientAbsent(objt).subscribe(
      (res: any) => {
        this.loading = false;
        //this.router.navigate(['/doctor-detail'])
        this.isCompleted = true;
        this._sweetAlert.showAlert(
          'Patient Marked absent Sucessfully',
          'success'
        );
        setTimeout(() => {
          this.loading = false;
          this.callclose();
        }, 1000);
      },
      (err: any) => {
        this.loading = false;
      }
    );
  }

  callclose() {
    this.loading = true;
    this.SvcTwilioMiddleware.DismissCall(
      this.videocalldata.room,
      this.videocalldata.patient,
      true,
      'case detail'
    ).subscribe({
      next: (data: any) => {
        this.loading = false;
      },
      error: (err) => {
        this.loading = false;
        Swal.fire({
          allowOutsideClick: false,
          allowEscapeKey: false,
          allowEnterKey: false,
          position: 'bottom-end',
          icon: 'info',
          title: 'There is error on server?',
          showConfirmButton: false,
          timer: 5000,
        }).then((x) => {
          this.onMeetingCloseTrigger.emit(true);
        });
      },
    });
  }
  isHigherFacility: boolean;
  ptcId: any;
  sendTreatmentDisabledbyhf: boolean = true;
  chkLength: any;
  isInputHidecomment: boolean;
  higherfacility() {
    this.isHigherFacility = true;
    this.isInputHide = true;
    this.isCrossHide = true;
    this.isInputHidecomment = true;
    if (this.isInputHide == true) {
      this.sendTreatmentDisabledbyhf = true;
    } else {
      this.sendTreatmentDisabledbyhf = false;
    }

    if (this.isInputHidecomment == true) {
      this.sendTreatmentDisabledbyhf = true;
    } else {
      this.sendTreatmentDisabledbyhf = false;
    }
  }
  onChangeInputBox($event) {
    if ($event.target.value.length > 0) {
      this.sendTreatmentDisabledbyhf = false;
    } else {
      this.sendTreatmentDisabledbyhf = true;
    }
  }
  drugList: any = [];
  drugname: any = [];
  GetDrugList() {
    this.userObjFromToken = this.svcLocalstorage.GetData(
      environment.AuthTokenKeyLSKey
    );
    if (this.userObjFromToken) {
      this.SvcPhcPatient.GetMedicineTest().subscribe((data) => {
        this.drugList = data;
        this.newMedicineArray = data;
      });
    }
  }

  // isMedicineChange($event){
  // }
  // medicineVMs : any = []
  // medicinelist($event){
  //   this.medicineVMs = $event
  // }
  patientCaseDiagonostics: any = [];
  isDiagnosticMax: boolean;
  testDiagnostic: boolean;
  changeDiagnosticTest() {
    let testId =
      this.diagnostictest[this.treatmentplan?.value?.patientCaseDiagonostics];

    if (this.patientCaseDiagonostics.length >= 1) {
      let result = this.patientCaseDiagonostics.filter(
        (o2) => testId.id == o2.id
      );

      if (result.length > 0) {
        this.testDiagnostic = true;
        return true;
      } else {
        this.testDiagnostic = false;
      }
    }

    if (this.patientCaseDiagonostics.length > 9) {
      this.isDiagnosticMax = true;
      return;
    }
    this.isDiagnosticMax = this.isDiagnosticMax ? false : this.isDiagnosticMax;
    this.patientCaseDiagonostics.push(
      this.diagnostictest[this.treatmentplan?.value?.patientCaseDiagonostics]
    );
    this.treatmentplan.patchValue({
      patientCaseDiagonostics: '',
    });
  }
  saveFeedbackData: any;
  saveFeedback() {
    this.loading = true;
    let patinetCaseID = this.patientCaseIdForFeedbak;
    let doctorFeedback = this.treatmentplan
      .get('doctorFeedback')
      .value.trimStart();
    if (
      doctorFeedback == '' ||
      doctorFeedback == null ||
      doctorFeedback == undefined
    ) {
      this.loading = false;
      Swal.fire({
        title: 'Warning',
        text: `Please Mention Your Feedback`,
        icon: 'warning',
      });
      return false;
    } else {
      this.svcPatientService
        .UpdatePatientCaseDoctorFeedback(patinetCaseID, doctorFeedback)
        .subscribe((data) => {
          this.saveFeedbackData = data;
          console.log(this.saveFeedbackData);
          Swal.fire({
            title: 'Success',
            text: `Save feedback succesfully!`,
            icon: 'success',
          });
          this.loading = false;
        });
    }
  }
  submitPostTreatment: any = [];
  posttreatment() {
    // this.loading = true;
    // if (this.referredMedList.length > 10) {
    //   this.isMedicineMax = true
    //   return;
    // }
    // this.isMedicineMax = this.isMedicineMax ? false : this.isMedicineMax;
    //let formVal = this.treatmentplan.value;
    if (this.errorProvision == true) {
      this.loading = false;
      Swal.fire({
        text: `Please Click on Check CDSS`,
      });
      return false;
    }

    if (this.treatmentplan.valid) {
      if (
        this.treatmentplan.get('referredTo').value.length > 0 &&
        this.treatmentplan.get('comment').value.length == 0
      ) {
        this.loading = false;
        Swal.fire({
          text: `Please fill the comment fields`,
        });
        return false;
      }

      if (
        this.treatmentplan.get('referredTo').value.length < 1 &&
        this.treatmentplan.get('comment').value.length < 1 &&
        this.isCrossHide == true
      ) {
        this.loading = false;
        Swal.fire({
          text: `Please fill the fields`,
        });
        return false;
      }

      if (this.patientCaseDiagonostics.length > 10) {
        this.loading = false;
        this.isDiagnosticMax = true;
        return;
      }
      //debugger
      this.isDiagnosticMax = this.isDiagnosticMax
        ? false
        : this.isDiagnosticMax;

      let obj: any = {};
      obj.patientCaseID = this.patientCaseDetailId;
      obj.suggestedDiagnosis =
        this.treatmentplan.get('suggestedDiagnosis').value;
      obj.provisionalDiagnosis = this.treatmentplan.get(
        'provisionalDiagnosis'
      ).value;
      obj.observation =
        this.caseDeatilForm.get('examination_PA').value +
        '#=#' +
        this.caseDeatilForm.get('examination_RS').value +
        '#=#' +
        this.caseDeatilForm.get('examination_CVS').value +
        '#=#' +
        this.caseDeatilForm.get('examination_CNS').value;
      obj.medicineVMs = this.referredMedList;

      obj.instruction = this.treatmentplan.get('instruction').value;
      obj.referredTo = this.treatmentplan.get('referredTo').value;
      obj.comment = this.treatmentplan.get('comment').value;
      // obj.test = this.treatmentplan.get('patientCaseDiagonostics').value;
      // obj.reviewDate = this.treatmentplan.get('reviewDate').value;
      obj.reviewDate = this.datepipe.transform(
        this.treatmentplan.get('reviewDate').value,
        'yyyy-MM-dd'
      );
      obj.roomInstance = localStorage.getItem('meetingInstace');

      if (this.treatmentplan.get('reviewDate').value == '') {
        this.loading = false;
        obj.reviewDate = null;
      }
      let diagnostics = [];
      if (this.patientCaseDiagonostics?.length) {
        this.loading = false;
        this.patientCaseDiagonostics.forEach((diagnostic) => {
          diagnostics.push({
            id: 0,
            patientCaseID: this.patientCaseDetailId,
            diagonosticTestID: diagnostic.id,
            getDiagnosticTestName: this.getDiagnosticTestName(diagnostic.id),
          });
        });
      }

      obj.patientCaseDiagonostics = diagnostics;
      obj.findings = this.treatmentplan.get('findings').value;
      obj.prescription = 'prescription';
      obj.doctorFeedback = this.treatmentplan.get('doctorFeedback').value;
      obj.CallingEnvironment = this.SvcTwilioMiddleware.callingEnvironment;
      // this.previewPrint = {
      //   treatmentPlan: obj,
      //   caseDetail: this.caseDeatilForm.value,
      //   isComplete: true,
      //   doctorDetail: this.getqueue
      // }

      this.userObjFromToken = this.userObjFromToken =
        this.svcLocalstorage.GetData(environment.AuthTokenKeyLSKey);
      if (this.userObjFromToken) {
        if (!this._sweetAlert.getisMinVideoTimeCompelted()) {
          this.loading = false;
          this._sweetAlert
            .deletesweetAlert(
              'Consultation time is less than 90 seconds, do you still want to end the call',
              'info'
            )
            .then((res: any) => {
              if (res.isConfirmed == true) {
                this.jitsiService.endMeeting();
                this.sendtreatmentApi(diagnostics, obj);
              }
            });
        } else {
          // alert('greater than 1:30 min')
          this.jitsiService.endMeeting();
          this.sendtreatmentApi(diagnostics, obj);
        }

        // var isMinVideocallTimeCompleted= this._sweetAlert.isMinVideocallTimeCompleted.subscribe((res:any)=>{
        //       if(res==false)
        //       {
        //         this.loading=false
        //         this._sweetAlert.deletesweetAlert('Consultation time is less than 90 seconds, do you still want to end the call','info').then((res:any)=>{
        //        if(res.isConfirmed==true)
        //        {
        //         this.sendtreatmentApi(diagnostics,obj)
        //        }

        //         })
        //       }
        //       else{
        //         this.sendtreatmentApi(diagnostics,obj)
        //     }
        //     })

        //     isMinVideocallTimeCompleted.unsubscribe()
      }
    } else {
      this.loading = false;
      Swal.fire({
        text: `Please Enter Required Fields`,
      });
    }
  }

  sendtreatmentApi(diagnostics, obj) {
    this.loading = true;
    this.preview = false;

    this.PrescriptionPreviewPdfComponent?.getPdffile(
      this.getqueue,
      this.treatmentplan.value,
      diagnostics,
      this.referredMedList
    ).then((result) => {});

    this.svcgetdoctordtls.PostTreatmentPlan(obj).subscribe(
      (data) => {
        this.loading = false;
        this.previewPrint = {
          treatmentPlan: obj,
          caseDetail: this.caseDeatilForm.value,
          isComplete: true,
          doctorDetail: this.getqueue,
        };
        //this.createPrescription()
        this.submitPostTreatment = data;

        // const pdfblob = this.PrescriptionPreviewPdfComponent?.getPdffile(this.getqueue, this.treatmentplan.value, diagnostics, this.referredMedList)
        // pdfblob?.then((result) => {
        //   let postPrescription = []
        //   postPrescription.push({
        //     name: "prescription",
        //     file: result,
        //     id: 0,
        //     patientCaseId: this.getqueue.patientCase.id,
        //     DocumentTypeId: 2

        //   })
        //   // this.fileUploadDocToServer(postPrescription, 2)

        //   this.previewPrint.isComplete = false
        // })

        // debugger
        // this.svcgetdoctordtls.CreatePrescription(this.getqueue.patientCase.id).subscribe(data=>
        // {
        //     console.log("CreatePrescription");
        // })

        Swal.fire({
          title: 'Success',
          text: `Send Treatment Successfully`,
          icon: 'success',
        });

        //window.localStorage.setItem('patient-queue','1')
        this.router.navigate(['doctor-detail'], {
          queryParams: { patientqueue: 'patient-queue' },
        });
        this._sweetAlert.postTreatmentSubject.next(true);
        // this.router.navigate(['doctor-detail']).then((result) => {
        //   setTimeout(() => {
        //     document.getElementById("v-pills-home-tab").classList.remove("active");
        //       document.getElementById("v-pills-home").classList.remove("show");
        //       document.getElementById("v-pills-home").classList.remove("active");
        //       document.getElementById("v-pills-patient-queue-tab").classList.add("active");
        //       document.getElementById("v-pills-patient-queue").classList.add("show");
        //       document.getElementById("v-pills-patient-queue").classList.add("active");
        // }, 3000);
        // });
      },
      (err) => {
        this.loading = false;

        Swal.fire({
          title: 'Warning',
          text: `Something went wrong`,
          icon: 'warning',
        });
        this.previewPrint.isComplete = false;
      }
    );
  }

  get form_treatment() {
    return this.treatmentplan.controls;
  }
  onSelected($event) {}

  errormsgMed: any;
  referredMedList: any = [];
  isMedicineMax: boolean;
  isshowErrormsg: boolean;
  showDurationErrMsg: boolean;
  oneTimedose: boolean;
  saveMedicine() {
    // debugger
    let medId = this.treatmentplan.value.medicineVMs[0].drugID.trim();
    console.log(medId, 'meddddddddddd');

    let obj: any = this.treatmentplan.value.medicineVMs[0];
    console.log(obj, 'abcd');

    console.log(this.referredMedList, 'refferrddddddddddd');

    if (this.referredMedList.length >= 1) {
      let result = this.referredMedList.filter(
        (o2) => medId == o2.medicineName
      );
      if (result.length > 0) {
        this.oneTimedose = true;
        return true;
      } else {
        this.oneTimedose = false;
      }
    }

    // if (this.referredMedList.length > 9) {
    //   this.isMedicineMax = true
    //   return;
    // }
    // this.isMedicineMax = this.isMedicineMax ? false : this.isMedicineMax;
    if (obj.doseDuration == '' && obj.doseTiming == '') {
      this.isshowErrormsg = true;
      return this.referredMedList;
    } else {
      this.isshowErrormsg = false;
    }
    if (obj.doseDuration == 'emptyStomach') {
      obj.emptyStomach = true;
    } else {
      obj.emptyStomach = false;
    }
    if (obj.doseDuration == 'afterMeal') {
      obj.afterMeal = true;
    } else {
      obj.afterMeal = false;
    }
    if (obj.doseTiming == 'od') {
      obj.od = true;
    } else {
      obj.od = false;
    }
    if (obj.doseTiming == 'bd') {
      obj.bd = true;
    } else {
      obj.bd = false;
    }
    if (obj.doseTiming == 'td') {
      obj.td = true;
    } else {
      obj.td = false;
    }
    if (obj.doseTiming == 'qid') {
      obj.qid = true;
    } else {
      obj.qid = false;
    }

    obj.medicineName = this.drugList.filter((item) => {
      if (item.name == medId) {
        obj.drugID = item.id;
      }
      return item.name == medId;
    })[0]?.name;

    if (obj.drugID == '') {
      this.isshowErrormsg = true;
      return this.referredMedList;
    }
    if (obj.duration == '') {
      this.showDurationErrMsg = true;
      return this.referredMedList;
    }
    if (obj.duration) {
      this.showDurationErrMsg = false;
    }
    if (obj.comment) {
      this.isshowErrormsg = true;
      return this.referredMedList;
    } else {
      this.isshowErrormsg = false;
    }

    if (obj.medicineName) {
      this.newMedicineArray = this.drugList;
      this.referredMedList.push(obj);

      this.treatmentplan.patchValue({
        medicineVMs: [
          {
            drugID: '',
            duration: '',
            doseDuration: 'emptyStomach',
            doseTiming: 'od',
            medicinecomments: '',
          },
        ],
      });

      console.log(this.referredMedList, 'oooooooooooooooooooooooooooo');
    }
  }

  deleteReferMed(index) {
    this.referredMedList.splice(index, 1);
  }
  diagnostictest: any = [];
  GetDiagnosticTest() {
    this.userObjFromToken = this.svcLocalstorage.GetData(
      environment.AuthTokenKeyLSKey
    );
    if (this.userObjFromToken) {
      this.SvcPhcPatient.GetDiagnosticTest().subscribe((data) => {
        this.diagnostictest = data;
      });
    }
  }
  getDiagnosticTestName(id) {
    if (!id) {
      return;
    }

    return this.diagnostictest.filter((test) => id === test.id)[0];
  }
  removeDiagnostic(index) {
    this.patientCaseDiagonostics.splice(index, 1);
  }
  isCrossHide: boolean = false;
  isInputHide: boolean = true;
  isInputBoxHide() {
    // this.treatmentplan.get('referredTo').clearValidators();
    this.isCrossHide = false;
    this.isInputHide = false;
    this.isInputHidecomment = false;
    this.sendTreatmentDisabledbyhf = true;
    // let clear = document.getElementById('referInputBox') as HTMLInputElement | null;
    //   clear.value = ''
    this.treatmentplan.patchValue({
      referredTo: '',
      comment: '',
    });
  }

  postPatientFeedback() {
    this.feedback = this.modalService.open(PateintFeedbackComponent, {
      data: { patientCaseId: this.patientCaseDetailId },
    });
  }

  ExistingCaseLabel() {
    this.existingCaseFile = this.modalService.open(
      RegisterSuccesfulPopupComponent,
      {
        data: {
          patientDetail: {
            patientId: this.existingPatientId,
            id: this.existingPatientId,
          },
          openSecondPopup: true,
          isReload: true,
        },
      }
    );
    this.existingCaseFile.onClose.subscribe({
      next: (val) => {
        this.ngOnInit();
      },
    });
  }

  onInitiateMeeting() {
    //console.log(request ,res)
    // this.router.navigate(["/case-details-doc"], {queryParams: {res}});

    // let queryStringParam = {
    //   initiator: this.svcLocalstorage.GetData(environment.UserId),
    //   caseId: patient.patientCaseID,
    //   patientId: patient.patientID,
    //   phcId: patient.referredbyPHCId,
    //   isGroup: false,
    //   roomName: '',
    //   isDoctor: true
    // }
    // //queryStringParam.roomName = `RM_${queryStringParam.initiator}_${queryStringParam.caseId}_${queryStringParam.patientId}_${queryStringParam.phcId}_${new Date().valueOf()}`;

    // let strEncText = EncryptData(JSON.stringify(queryStringParam));
    // console.log(strEncText)
    // this.router.navigate(["/patient-meet", strEncText], { queryParams: { src: strEncText } });
    this.SvcTwilioMiddleware.CallingByPatientCaseId(
      this.patientCaseDetailId
    ).subscribe({
      next: (data) => {
        Swal.fire({
          allowOutsideClick: false,
          allowEscapeKey: false,
          allowEnterKey: false,
          position: 'bottom-end',
          icon: 'info',
          title: 'Please wait while, Calling in progress..',
          showConfirmButton: false,
          timer: 60 * 1000,
        });
      },
      error: (err) => {
        alert('ERROR WHILE CALLING');
      },
    });
  }
  errorProvision: boolean;
  onProvision() {
    // var event=event
    if (this.treatmentplan.get('provisionalDiagnosis').value.length > 0) {
      this.errorProvision = true;
      this.isEmptyProvision = false;
      this.isCheckDisabled = false;
      //this.ProvisionalDiagnosis(event)
    } else {
      this.isCDSS = false;
      this.errorProvision = false;
      this.isCheckDisabled = true;
    }
  }

  ProvisionalDiagnosis(event: any) {
    if (event.target.value.length === 3) {
      this.onProvisionalValue();
    } else if (event.target.value.length < 3) {
      this.diseasesListforProvisional = [];
    }

    //   else if(event.target.value.length>=4)
    //   {
    //   this.diseasesListforProvisional= this.diseasesListforProvisional.filter(option => {option.diseases.toLowerCase().includes(event.target.value.toLowerCase())})
    // console.log(this.diseasesListforProvisional,'ppppppppp');
    // return this.diseasesListforProvisional

    // }
    //   else{
    //     console.log('lessssssssssssssssssssss');

    //     this.diseasesListforProvisional=[]
    //     // var data=[]
    //     // if(this.diseasesListforProvisional)
    //     // {
    //     //  data=  this.diseasesListforProvisional.filter(option => option.diseases.toLowerCase().includes(event.target.value))
    //     //  console.log(data,'pppppppppppppp');
    //     //  return data

    //     // }
    //   }
  }

  suggestedDiagnosis(event) {
    if (event.target.value.length === 3) {
      this.svcMaster.SearchSnomedCTCodes(event.target.value).subscribe(
        (res: any) => {
          if (res.length) {
            this.snomedCodesList = res;
          } else this.snomedCodesList = [];
        },
        (err: any) => {
          this.snomedCodesList = [];
        }
      );
    } else if (event.target.value.length < 3) {
      this.snomedCodesList = [];
    }
  }

  onProvisionalValue() {
    if (this.isDoctor) this.diseaseList();
  }
  diseases: any;
  diseasesListforProvisional: any = [];

  diseaseList() {
    let obj: any = {};
    obj.Diseases = this.treatmentplan.get('provisionalDiagnosis').value;
    obj.Age = this.patientProfileDetail?.patientMaster?.age;
    this.userObjFromToken = this.svcLocalstorage.GetData(
      environment.AuthTokenKeyLSKey
    );
    if (this.userObjFromToken) {
      //this.loading=true
      this.svcdoctor
        .GetCDSSGuidelineDiseasesByDiseasesAndAge(obj)
        .pipe(debounceTime(2000))
        .subscribe(
          (data) => {
            this.loading = false;
            this.diseasesListforProvisional = data;

            return this.diseasesListforProvisional;
          },
          (err: any) => {
            this.loading = false;
          }
        );
    }
  }

  isCDSS: boolean = false;
  isSendSuggested: boolean;
  isEmptyProvision: boolean;
  isCheckCdss() {
    let diseases = this.treatmentplan.get('provisionalDiagnosis').value;
    if (!diseases) {
      this.isEmptyProvision = true;
      return false;
    } else {
      this.isEmptyProvision = false;
    }

    this.errorProvision = false;

    let obj: any = {};

    obj.Diseases = diseases;
    obj.Age = this.patientProfileDetail?.patientMaster?.age;
    this.userObjFromToken = this.svcLocalstorage.GetData(
      environment.AuthTokenKeyLSKey
    );
    if (this.userObjFromToken) {
      this.svcdoctor.GetCDSSGuideLinesByDiseasesAndAge(obj).subscribe(
        (data) => {
          this.diseases = data;
          if (Object.keys(data).length === 0) {
            this.isCDSS = true;

            Swal.fire({
              title: 'Warning',
              text: `No record Exist`,
              icon: 'warning',
            });
          } else {
            this.isCDSS = true;
            this.diseases.map((item) => {
              Swal.fire({
                html: `<p style='height:400px; class='swalCdss'>${item.treatment}</p>,`,
              });
            });
          }
        },
        (err) => {
          Swal.fire({
            title: 'Warning',
            text: `Something Went Wrong`,
            icon: 'warning',
          });
        }
      );
    }
  }

  CookiesUserName: string;
  UserName: string;
  DoctorEmail: string;
  DoctorNamefunction() {
    if (this.isDoctor) {
      setTimeout(() => {
        this.UserName = this.svcLocalstorage.GetData(environment.doctorName);
        var re = /null/gi;
        var str = this.UserName;
        this.CookiesUserName = str.replace(re, '');
        console.log(this.CookiesUserName);
        this.DoctorEmail = this.svcLocalstorage.GetData(
          environment.doctorEmail
        );
      }, 1000);
    }
  }

  openPrescriptionData: any;
  //   openPrescription()
  //   {

  //     if(new Date(this.CaseDate).toLocaleDateString()!=new Date(this.serverTime).toLocaleDateString())
  //     {
  //       this.loading=false

  //       if(this.caseDetails.prescription.includes('.pdf'))
  //       {

  //       const path=this.caseDetails.prescription
  //       const storage=this.caseDetails.patientCase.storageSource==null?0:this.caseDetails.patientCase.storageSource
  //       window.open(`${environment.ApiEndPoint}${environment.EndPoints.Doctor.Endpoint}${environment.EndPoints.Doctor.methods.GetPrescriptionFile}?filePath=${path}&StorageSource=${storage==null?0:storage}`)

  //         // this.svcdoctor.GetPrescriptionFile(this.caseDetails.patientCase.storageSource,this.caseDetails.prescription).subscribe((res:any)=>{
  //         //   console.log(res,'pppottttttttttttttttttttt');

  //         // })
  //          //window.open(this.ImagesHeader+this.caseDetails.prescription,'_blank');
  //     //window.open(environment.AngEndPoint+`download-prescription?patientcaseid=${this.caseDetails.patientCase.id}`)
  //       }
  //       else
  //       {
  //         this._sweetAlert.sweetAlert('Prescription can be generated only for today','error')
  //       }
  //     }
  //     else{
  //     //this.loading=true

  //     if(this.caseDetails.prescription.includes('.pdf'))
  //     {
  //       //window.open(this.ImagesHeader+this.caseDetails.prescription,'_blank');

  //       // this.svcdoctor.GetPrescriptionFile(this.caseDetails.patientCase.storageSource,this.caseDetails.prescription).subscribe((res:any)=>{
  //       //   console.log(res,'pppottttttttttttttttttttt');

  //       // })
  // const path=this.caseDetails.prescription
  // const storage=this.caseDetails.patientCase.storageSource==null?0:this.caseDetails.patientCase.storageSource
  //       window.open(`${environment.ApiEndPoint}${environment.EndPoints.Doctor.Endpoint}${environment.EndPoints.Doctor.methods.GetPrescriptionFile}?filePath=${path}&StorageSource=${storage==null?0:storage}`)

  //     }
  //     else{
  //      window.open(environment.AngEndPoint+`/download-prescription?patientcaseid=${this.caseDetails.patientCase.id}`)
  //     }

  //     this.userObjFromToken = this.svcLocalstorage.GetData(environment.AuthTokenKeyLSKey);

  //     // if (this.userObjFromToken) {
  //     //   forkJoin([
  //     //     this.svcdoctor.CreatePrescription(this.patientCaseDetailId)
  //     //   ]).subscribe({
  //     //     next: (data: any) => {
  //     //       this.loading=false
  //     //       console.log(data,'CreatePrescription')
  //     //       this.openPrescriptionData=data;
  //     //       //console.log(this.openPrescriptionData[0].prescriptionFilePath,'CreatePrescription')
  //     //       if(this.openPrescriptionData[0].prescriptionFilePath=='pending')
  //     //       {
  //     //         Swal.fire({
  //     //           title: 'Warning',
  //     //           text: `Prescription is in-progress, please try after some time`,
  //     //           icon: 'warning',
  //     //         })
  //     //         this.loading =  false
  //     //       }
  //     //       else if(this.openPrescriptionData[0].prescriptionFilePath=='consultationpending')
  //     //       {
  //     //         Swal.fire({
  //     //           title: 'Warning',
  //     //           text: `Consultation pending`,
  //     //           icon: 'warning',
  //     //         })
  //     //         this.loading =  false
  //     //       }
  //     //       else
  //     //       {
  //     //         window.open(this.ImagesHeader+this.openPrescriptionData[0].prescriptionFilePath,'_blank');
  //     //         //window.open('https://tele-med-dev.azurewebsites.net/MyFiles/CaseDocuments/62993c1c-ed5a-429b-8353-918c006dc32a.pdf','_blank');
  //     //         this.loading = false;
  //     //       }

  //     //     },

  //     //     error: (err) => {
  //     //       this.loading=false
  //     //       this._sweetAlert.sweetAlert('Network Issue,Please Try Again','error')
  //     //     },
  //     //     complete:() =>{
  //     //       this.loading=false
  //     //     }

  //     //   });
  //     // }
  //     }
  //   }

  // openPrescription()
  // {
  //   const path=this.caseDetails.prescription
  //   const storage=this.caseDetails.patientCase.storageSource==null?0:this.caseDetails.patientCase.storageSource
  //   if(this.caseDetails.prescription.includes('.pdf'))
  //   {
  //    window.open(`${environment.ApiEndPoint}${environment.EndPoints.Doctor.Endpoint}${environment.EndPoints.Doctor.methods.GetPrescriptionFile}?filePath=${path}&StorageSource=${storage}`)

  //   }
  //   else{
  //     window.open(environment.AngEndPoint+`/download-prescription?patientcaseid=${this.caseDetails.patientCase.id}`)

  //   }
  // }

  disablebutton: boolean;
  openPrescription() {
    if (this.disablebutton) {
      var swalClose: any = this._sweetAlert.sweetAlert(
        'Your download is in progress please wait',
        'info'
      );
      return;
    }

    if (
      new Date(this.CaseDate).toLocaleDateString() !=
      new Date(this.serverTime).toLocaleDateString()
    ) {
      this.loading = false;

      if (this.caseDetails.prescription.includes('.pdf')) {
        const path = this.caseDetails.prescription;
        const storage =
          this.caseDetails.patientCase.storageSource == null
            ? 0
            : this.caseDetails.patientCase.storageSource;
        window.open(
          `${environment.ApiEndPoint}${environment.EndPoints.Doctor.Endpoint}${
            environment.EndPoints.Doctor.methods.GetPrescriptionFile
          }?filePath=${path}&StorageSource=${storage == null ? 0 : storage}`
        );

        // this.svcdoctor.GetPrescriptionFile(this.caseDetails.patientCase.storageSource,this.caseDetails.prescription).subscribe((res:any)=>{
        //   console.log(res,'pppottttttttttttttttttttt');

        // })
        //window.open(this.ImagesHeader+this.caseDetails.prescription,'_blank');
        //window.open(environment.AngEndPoint+`download-prescription?patientcaseid=${this.caseDetails.patientCase.id}`)
      } else {
        this._sweetAlert.sweetAlert(
          'Prescription can be generated only for today',
          'error'
        );
      }
    } else {
      this.userObjFromToken = this.svcLocalstorage.GetData(
        environment.AuthTokenKeyLSKey
      );

      if (this.userObjFromToken) {
        //this.loading=true
        this.disablebutton = true;
        var swalClose: any = this._sweetAlert.sweetAlert(
          'Your download is in progress please wait',
          'info'
        );

        this.svcdoctor.CreatePrescription(this.patientCaseDetailId).subscribe({
          next: (data: any) => {
            this.loading = false;
            this.disablebutton = false;
            this.openPrescriptionData = data;
            //console.log(this.openPrescriptionData[0].prescriptionFilePath,'CreatePrescription')
            if (this.openPrescriptionData.prescriptionFilePath == 'pending') {
              Swal.fire({
                title: 'Warning',
                text: `Prescription is in-progress, please try after some time`,
                icon: 'warning',
              });
              this.loading = false;
            } else if (
              this.openPrescriptionData.prescriptionFilePath ==
              'consultationpending'
            ) {
              Swal.fire({
                title: 'Warning',
                text: `Consultation pending`,
                icon: 'warning',
              });
              this.loading = false;
            } else {
              const path = this.openPrescriptionData.prescriptionFilePath;
              const storage =
                this.openPrescriptionData.storageSource == null
                  ? 0
                  : this.openPrescriptionData.storageSource;
              window.open(
                `${environment.ApiEndPoint}${
                  environment.EndPoints.Doctor.Endpoint
                }${
                  environment.EndPoints.Doctor.methods.GetPrescriptionFile
                }?filePath=${path}&StorageSource=${
                  storage == null ? 0 : storage
                }`
              );

              //window.open(this.ImagesHeader+this.openPrescriptionData.prescriptionFilePath,'_blank');
              //window.open('https://tele-med-dev.azurewebsites.net/MyFiles/CaseDocuments/62993c1c-ed5a-429b-8353-918c006dc32a.pdf','_blank');
              this.loading = false;
            }
          },

          error: (err) => {
            this.loading = false;
            this.disablebutton = false;
            this._sweetAlert.sweetAlert(
              'Network Issue,Please Try Again',
              'error'
            );
          },
          complete: () => {
            this.loading = false;
            swalClose.close();
            this.disablebutton = false;
          },
        });
      }
    }
  }

  downloadFile(fileData: any) {
    if (typeof fileData.file == 'string') {
      this.loading = true;
      this.svcdoctor.downloadCaseFile(fileData.file).subscribe(
        (res: any) => {
          this.loading = false;
          const data = res;
          const blobUrl = URL.createObjectURL(data);
          window.open(blobUrl, '_blank');
        },
        (error: any) => {
          console.log(error);
          this.loading = false;
        }
      );
    }
  }

  newMedicineArray: any = [];
  filterMedicine(event) {
    console.log(event.target.value);
    console.log(this.drugList);

    //var aa=this.drugList.filter((res:any)=> res.name.startsWith(event.target.value))
    this.newMedicineArray = this.drugList.filter((option: any) =>
      option.name.toLowerCase().startsWith(event.target.value.toLowerCase())
    );
  }

  createPrescription() {
    this.svcdoctor
      .CreatePrescription(this.patientCaseDetailId)
      .subscribe((res: any) => {});
  }

  /////////////screen saver start //////////////////////

  idleTime = 60000; // 1 minute in milliseconds
  idleTimer: any;
  showScreenSaver = false;

  @HostListener('window:mousemove')
  @HostListener('window:keypress')
  @HostListener('window:KeyboardEvent')
  @HostListener('click', ['$event.target'])
  /* uncommnet to start screenaver
 resetIdleTimer() {
    clearTimeout(this.idleTimer);

    if (this.role == 'PHCUser' && this.isgoingvideo) {
      this.startIdleTimer();
      this.showScreenSaver = false;
    } else {
      clearTimeout(this.idleTimer);
      this.showScreenSaver = false;
    }
  }


  startIdleTimer() {
    this.idleTimer = setTimeout(() => {
      this._sweetAlert.closeSelectDropdownSubject.next(true);
      setTimeout(() => {
        this.showScreenSaver = true;
      }, 500);
      //this.modalService.open(ScreenSaverComponent)
    }, this.idleTime);
  }
    */
  callReceived() {
    /////when call received to accept
    this.svcNotification.onCallReceived.subscribe(
      (message: INotificationResponse) => {
        //alert('call received')
        if (message) {
          clearTimeout(this.idleTimer);
          this.showScreenSaver = false;
        }
      }
    );

    ///////////if user didnt pick the call
    /*  uncomment to start the screensaver and uncomment this startIdleTimer()
   this._sweetAlert.callNotReceived.subscribe((res: any) => {
      //alert('didnt pickup')
      if (res == true && this.role == 'PHCUser') {
        this.startIdleTimer();
      } else {
        clearTimeout(this.idleTimer);
        this.showScreenSaver = false;
      }
    });*/

    ///////if video call is on
    this._sweetAlert.getVideoCall().subscribe((res: any) => {
      if (res == false) {
        clearTimeout(this.idleTimer);
        // this.showScreenSaver = false;
      } else if (res == true && this.role == 'PHCUser') {
        //this.startIdleTimer();
      } else {
        clearTimeout(this.idleTimer);
        this.showScreenSaver = false;
      }
    });

    //////when participant exit

    this.svcNotification.onNotifyParticipientToExit.subscribe(
      (res: INotificationResponse) => {
        if (res) {
          if (this.role == 'PHCUser') {
            // this.startIdleTimer();
            this.isgoingvideo = true;
          } else {
            clearTimeout(this.idleTimer);
            this.showScreenSaver = false;
          }
        }
      }
    );

    ////////////call declined
    this.svcNotification.onCallRejected.subscribe(
      (res: INotificationResponse) => {
        if (res) {
          if (this.role == 'PHCUser') {
            // this.startIdleTimer();
          } else {
            clearTimeout(this.idleTimer);
            this.showScreenSaver = false;
          }
        }
      }
    );
  }
}
