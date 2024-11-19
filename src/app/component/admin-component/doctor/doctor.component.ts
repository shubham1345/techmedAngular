import {
  Component,
  OnInit,
  Input,
  Injectable,
  ChangeDetectorRef,
  HostListener,
  AfterViewInit,
  ViewChild,
} from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MdbModalRef, MdbModalService } from 'mdb-angular-ui-kit/modal';
import { SvclocalstorageService } from 'src/app/services/services/svclocalstorage.service';
import { environment } from 'src/environments/environment';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { PatientsSearchbarComponent } from '../../shared-component/patients-searchbar/patients-searchbar.component';
import { PhcHospitalsListComponent } from '../../shared-component/phc-hospitals-list/phc-hospitals-list.component';
import { Svc_getdoctordetailService } from 'src/app/services/services/svc_getdoctordetail.service';
import { Svc_MasterService } from 'src/app/services/services/svc_master.service';
import { DoctorSearchComponent } from '../../shared-component/doctor-search/doctor-search.component';
import { SvcPhcGetPatientService } from 'src/app/services/services/svc-phc-get-patient.service';
import { Subscription, windowWhen } from 'rxjs';

import { EncryptData } from 'src/app/utils/utilityFn';
import { TwilioMiddlewareService } from '../../twilio-component/services/twilio-middleware.service';
import Swal from 'sweetalert2';
import { SvcAuthenticationService } from 'src/app/services/services/svc-authentication.service';
import { IQueryString } from 'src/app/model/QueryStringModel';
import { ngxLoadingAnimationTypes } from 'ngx-loading';
import { SvcmainAuthserviceService } from 'src/app/services/services/svcmain-authservice.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { DatePipe } from '@angular/common';
import { NotificationHubService } from 'src/app/services/services/notification-hub.service';
import { JitsiService } from '../../twilio-component/services/jitsi.service';
@Component({
  selector: 'app-doctor',
  templateUrl: './doctor.component.html',
  styleUrls: ['./doctor.component.css'],
})
export class DoctorComponent implements OnInit, AfterViewInit {
  public ngxLoadingAnimationTypes = ngxLoadingAnimationTypes;
  loading = false;
  public config = {
    animationType: ngxLoadingAnimationTypes.none,
    backdropBorderRadius: '3px',
  };

  currentMonth: number;
  currentYear: number;
  calendarDays: Array<Array<number>> | undefined;
  disablenext:boolean
  daysOfWeek=['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday']
  months= ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
 public events: { [key: number]: string[] };


  imagespatient = environment.ImagesHeader;
  searchedKeyword: any;
  email: any;
  isChecked = true;
  userObjFromToken: any;
  showMsg: boolean = false;
  DoctorImagePath: string;
  page: number = 1;
  count: number = 0;
  isShowButton : boolean = false
  // notificationResponseData = [
  //   {
  //     "id": 2,
  //     "fromUser": "2",
  //     "createdOn": "2022-04-01T00:00:00",
  //     "message": "New patient assigned"
  //   }
  // ]
  getListOfMedicinevar: any = [];
  getListOfSpecializationMastervar: any = [];
  statemaster: any = [];
  getListOfSubSpecialization: any = [];
  UserName: string;
  DoctorEmail: string;
  LatestReferred: any=[];
  genderID: number;
  // _formGroup: FormGroup;
  formGroup: FormGroup;
  historyAdvanceSearch: FormGroup;
  modalRef: MdbModalRef<PhcHospitalsListComponent> | null = null;
  accountRegister: MdbModalRef<PatientsSearchbarComponent> | null = null;
  isSignOut: boolean;
  isYesterdayPatient = true;
  isAdvancePatient = false;
  imageSrc: string | undefined;
  issearchPatients = true;
  isadvancesearchPatients = false;
  isDoctorOffline:boolean = false;
  private isShowingSubscription: Subscription
  todayDate:any=this.datepipe.transform(new Date(),'yyyy-MM-dd')

  displayedColumns = [
    'sno',
    'name',
    'id',
    'gender',
    'age',
    'number',
    'date',
    'phcName',
  ];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  dataSource: any = [];

  doctorForm = new FormGroup({
    firstName: new FormControl(''),
    middleName: new FormControl(''),
    lastName: new FormControl(''),
    gender: new FormControl(''),
    spclztn: new FormControl(''),
    subspcalztn: new FormControl(''),
    designation: new FormControl(''),
    email: new FormControl(''),
    phNumber: new FormControl(''),
    city: new FormControl(''),
    state: new FormControl(''),
    postalCode: new FormControl(''),
  });
  JitsiService: any;

  constructor(
    private svcdoctor: Svc_getdoctordetailService,
    private modalService: MdbModalService,
    private fb: FormBuilder,
    private svcLocalstorage: SvclocalstorageService,
    private svcgetdoctordtls: Svc_getdoctordetailService,
    private Svc_MasterService: Svc_MasterService,
    private activatedRoute: ActivatedRoute,
    private cdRef: ChangeDetectorRef,
    private router: Router,
    private SvcPhcPatient: SvcPhcGetPatientService,
    private SvcTwilioMiddleware: TwilioMiddlewareService,
    private svcAuth: SvcAuthenticationService,
    private _sweetAlert: SvcmainAuthserviceService,
    private datepipe:DatePipe,
    private svcNotification: NotificationHubService,
    private jistiService : JitsiService
  ) {
   
    const now = new Date();
    this.currentMonth = now.getMonth();
    this.currentYear = now.getFullYear();
    //////
    ////used to stop loader when their is error of 401 and 403////

    this._sweetAlert.getLoader().subscribe((res: any) => {
      this.loading = res;
      console.log('chc-center', this.loading);
    });

    /////////////////////////////////////////////////////////////

    // this.getDoctorDetails({ "userEmailID": this.svcLocalstorage.GetData(environment.doctorEmail) })
    // this.pateintWaitList(this.svcLocalstorage.GetData(environment.doctorID))
    this.autoRefresh();
    // this.activatedRoute.queryParams.subscribe((res:any)=>{
    //   console.log(res,'res');

    //   if(res.patientqueue){
    //     setTimeout(() => {
    //       this.loadingPatientQueue()
    //     }, 1000);

    //     alert('if')

    //   }
    //   else{

    //     alert('else')
    //   }
    // }
    // )
  }

  async ngAfterViewInit() {
    setTimeout(() => {
      this.activatedRoute.queryParams.subscribe((res: any) => {
        if (res.patientqueue) {
          this.RefreshpateintWaitList();
          document
            .getElementById('v-pills-home-tab')
            .classList.remove('active');
          document.getElementById('v-pills-home').classList.remove('show');
          document.getElementById('v-pills-home').classList.remove('active');
          document
            .getElementById('v-pills-patient-queue-tab')
            .classList.add('active');
          document
            .getElementById('v-pills-patient-queue')
            .classList.add('show');
          document
            .getElementById('v-pills-patient-queue')
            .classList.add('active');
        }

        setTimeout(() => {
          if (res.patientqueue) {
            this.router.navigate(['/doctor-detail']);
          }
        }, 3000);
      });
    }, 0);
  }

  ngOnInit(): void {
    this.jistiService.isShowing.subscribe(state => {
      this.isShowButton = state.isShowButton;
      console.log('isShowButton value:', this.isShowButton);
    });
    //this.getAllState();
    this.getTypeMasterGender();
    this.jistiService.refreshPatientWaitList$.subscribe(() => {
      
      this.RefreshpateintWaitList();

    });

    //this.getTypeMasterGenderSearch()
    //this.getCDSSGuideLinesfunction();
    //this.getListOfMedicinefunction();
    //this.getListOfVitalfunction();
    //this.getListOfPHCHospitalfunction();
    // this.getListOfSpecializationMasterfunction();
    //this.getListOfSubSpecializationMasterfunction(1);
    // this.pateintWaitList( this.svcLocalstorage.GetData(environment.doctorID));
    //     this.updateDocDetails({
    //   "id": 3,
    //   "zoneId": 1,
    //   "clusterId": 1,
    //   "userId": 6,
    //   "specializationId": 1,
    //   "subSpecializationId": 1,
    //   "mciid": "132456",
    //   "registrationNumber": "2132JJKNK",
    //   "qualification": "MBBS",
    //   "designation": "HOD",
    //   "phoneNumber": "9266301380",
    //   "digitalSignature": "path",
    //   "panNo": "AEQPY7777F",
    //   "bankName": "HDFC",
    //   "branchName": "Gurgaon",
    //   "accountNumber": "12021050056733",
    //   "ifsccode": "HDFC001202",
    //   "updatedBy": 2,
    //   "detailsDTO": {
    //     "titleId": 1,
    //     "firstName": "John",
    //     "middleName": "Doe",
    //     "lastName": "Doe",
    //     "dob": "2000-01-01T00:00:00",
    //     "genderId": 1,
    //     "emailId": "Doejo@gamil.com",
    //     "countryId": 1,
    //     "stateId": 1,
    //     "city": "Indor",
    //     "pinCode": "110011",
    //     "photo": "Path of photo",
    //     "idproofTypeId": 1,
    //     "idproofNumber": "1235667890"
    //   }
    // })
    //console.log("abcd",this.svcLocalstorage.GetData(environment.doctorID))
    setTimeout(() => {
      // this.getNotification({ "userEmail": this.svcLocalstorage.GetData(environment.doctorEmail) });
      this.getTodayPatients({
        doctorID: this.svcLocalstorage.GetData(environment.doctorID),
      });
      this.GetCompletedConsultationPatientsHistory({
        doctorID: this.svcLocalstorage.GetData(environment.doctorID),
      });
      // this.GetYesterdayPatientsHistory({ "doctorID": this.svcLocalstorage.GetData(environment.doctorID) })
      // this.GetPastPatientsHistory({ "doctorID": this.svcLocalstorage.GetData(environment.doctorID) })
      this.IsDrOnline({
        doctorID: this.svcLocalstorage.GetData(environment.doctorID),
      });
    }, 0);

    this.svcNotification.connectionStatus$.subscribe(res=>{
      if(res && !this.isDoctorOffline) this.isChecked = true;
      else this.isChecked = false;
    })

    //this.GetPatientCaseDetailsAsync({"patientCaseID": 4})
    // this.PostTreatmentPlan(
    //   {
    //     "patientCaseID": 0,
    //     "diagnosis": "string",
    //     "instruction": "string",
    //     "test": "string",
    //     "findings": "string",
    //     "prescription": "string",
    //     "medicineVMs": [
    //       {
    //         "medicine": "string",
    //         "dose": "string"
    //       }
    //     ]
    //   }
    // )
    //this.DeleteNotification(4)
    //this.PatientAbsent(
    //   {
    //     "caseID": 0,
    //     "doctorID": 0,
    //     "comment": "string"
    //   }
    // )
    // this.ReferHigherFacility({
    //   "caseID": 0,
    //   "doctorID": 0,
    //   "comment": "string"
    // })
    // this.GetCaseLabel({
    //   "patientID": 1
    // })
    // this.SearchPatientDrDashBoard({
    //   "patientName": "a",
    //   "doctorID": 3
    // })
    // this.SearchPatientDrHistory({
    //   "patientName": "r",
    //   "doctorID": 3
    // })
    // this.GetListOfPHCHospitalZoneWise(
    // {
    //   "zoneID": 1
    // })

    // this.GetLatestReferred(
    //   {
    //     "doctorID": 1
    //   }
    // )
    this.GetLatestReferredCount({
      doctorID: this.svcLocalstorage.GetData(environment.doctorID),
    });
    // this.UpdateIsDrOnline
    // ({
    //   "doctorID": 3,
    //   "isOnline": true
    // })

    // this.OnlineDrList(
    //   {
    //     "zoneID": 1
    //   }
    // )

    // )
    //this.getAllphcfun(this);
    this.getdistrictmasterfun();
    this.DoctorNamefunction();
    this.historyAdvanceSearch = this.fb.group({
      phcid: this.svcLocalstorage.GetData(environment.PhcID),
      patientName: ['', [Validators.required]],
      patientUID: ['', [Validators.required]],
      dateOfRegistration: ['', [Validators.required]],
      contactNo: ['', [Validators.required]],
      dateOfBirth: ['', [Validators.required]],
      genderId: ['', [Validators.required]],
    });

    //     const patientQueue=window.localStorage.getItem('patient-queue')
    //     if(patientQueue==='1'){
    // this.loadingPatientQueue();
    //     }
    //     setTimeout(() => {
    //       if(localStorage.getItem('patient-queue')){
    //         localStorage.removeItem('patient-queue')
    //       }
    //     }, 7000);
  }
  autoRefreshID: any;
  ngOnDestroy() {
    if (this.autoRefreshID) {
      clearInterval(this.autoRefreshID);
    }
    this._sweetAlert.closeAllModalsOnLogout.next(true)
  }
  initMain(): void {
    // this.getDoctorDetail
  }
  CookiesUserName: string;
  DoctorNamefunction() {
    setTimeout(() => {
      this.UserName = this.svcLocalstorage.GetData(environment.doctorName);
      var re = /null/gi;
      var str = this.UserName;
      this.CookiesUserName = str.replace(re, '');
      console.log(this.CookiesUserName);
      this.DoctorEmail = this.svcLocalstorage.GetData(environment.doctorEmail);
    }, 1000);
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

  openModal() {
    this.modalRef = this.modalService.open(PhcHospitalsListComponent);
  }
  searchOpenModal() {
    this.accountRegister = this.modalService.open(DoctorSearchComponent);
  }
  // searchadvancedPatient() {
  //   this.isYesterdayPatient = false;
  //   this.isAdvancePatient = true;
  //   this.issearchPatients = false;
  //   this.isadvancesearchPatients = true;
  // }
  get f() {
    return this.doctorForm.controls;
  }
  onFileChange(event: any) {
    const reader = new FileReader();

    if (event.target.files && event.target.files.length) {
      const [file] = event.target.files;
      reader.readAsDataURL(file);

      reader.onload = () => {
        this.imageSrc = reader.result as string;
        //this.DoctorDetails.detailsDTO.photo=this.imageSrc.replace("/^data:image\/[a-z]+;base64,/","")
        this.DoctorDetails.detailsDTO.photoNewUpdate =
          this.imageSrc.split(',')[1];
        this.doctorForm.patchValue({
          fileSource: reader.result,
        });
      };
    }
  }

  onSpecializationChange(event) {
    const value = event.target.value;
    this.DoctorDetails.specializationId = value;
  }
  onSubSpecializationChange(event) {
    const value = event.target.value;
    this.DoctorDetails.subSpecializationId = value;
  }
  onStateChange(event) {
    const value = event.target.value;
    this.DoctorDetails.detailsDTO.stateId = value;
  }
  // this.AddDoctor(
  //   {
  //     "zoneId": 1,
  //     "clusterId": 1,
  //     "specializationId": 1,
  //     "subSpecializationId": null,
  //     "mciid": "MC1234435",
  //     "registrationNumber": "R324242",
  //     "qualification": "MBBS",
  //     "designation": "HOD",
  //     "phoneNumber": "0984654121",
  //     "digitalSignature": "Signature.jpg",
  //     "panNo": "AEQPY9552F",
  //     "bankName": "HDFC",
  //     "branchName": "Delhi",
  //     "accountNumber": "11221232133231212",
  //     "ifsccode": "HDFC001202",
  //     "createdBy": 2,
  //     "detailsDTO": {
  //       "titleId": 1,
  //       "firstName": "Jitendra",
  //       "middleName": "k",
  //       "lastName": "yadav",
  //       "dob": "2022-04-14T11:36:25.133Z",
  //       "genderId": 1,
  //       "emailId": "jitendra1@gmail.com",
  //       "countryId": 1,
  //       "stateId": 1,
  //       "city": "Indor",
  //       "pinCode": "122002",
  //       "photo": "Photo",
  //       "idproofTypeId": 1,
  //       "idproofNumber": "JUDMSK67789876",
  //       "Address": "Indor"
  //     }
  //   }

  ImageBaseData: string | ArrayBuffer = null;
  handleFileInput(files: FileList) {
    let me = this;
    let file = files[0];
    let reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function () {
      me.ImageBaseData = reader.result;
    };
    reader.onerror = function (error) {};
  }

  submitdoctordetails() {
    if (this.doctorForm.value) {
      let obj: any = {};
      name: String = this.DoctorDetails.detailsDTO.firstName;

      // obj.specializationId = this.doctorForm.get('spclztn').value;
      // obj.subSpecializationId = this.doctorForm.get('subspcalztn').value;
      // obj.gender="Male";
      //obj.stateId = this.doctorForm.get('state').value;

      //this.DoctorDetails.detailsDTO.photo = "R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==";//this.doctorForm.get('photo').value;
      if (this.DoctorDetails.detailsDTO.photoNewUpdate == null) {
        this.DoctorDetails.detailsDTO.photoNewUpdate = '';
      }
      this.DoctorDetails.digitalSignatureNewUpdate = ''; //this.doctorForm.get('digitalSignature').value;
      this.userObjFromToken = this.svcLocalstorage.GetData(
        environment.AuthTokenKeyLSKey
      );
      if (this.userObjFromToken) {
        this.svcgetdoctordtls
          .UpdateDoctorDetails(this.DoctorDetails)
          .subscribe((data) => {
            this.showMsg = true;
            this.getDoctorDetails({
              userEmailID: this.svcLocalstorage.GetData(
                environment.doctorEmail
              ),
            });
            this.imageSrc = '';
          });
      }

      // this.SvcPhcPatient.SetregisterPatient(obj)

      this.validateAllFormFields(this.doctorForm);
    }
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

  getAllState() {
    this.userObjFromToken = this.svcLocalstorage.GetData(
      environment.AuthTokenKeyLSKey
    );
    if (this.userObjFromToken) {
      this.Svc_MasterService.GetAllStateMaster().subscribe((data) => {
        this.statemaster.push(data);
      });
    }
  }

  getNotify: any;
  getNotification(doctorId) {
    this.getNotify = [];
    this.userObjFromToken = this.svcLocalstorage.GetData(
      environment.AuthTokenKeyLSKey
    );
    if (this.userObjFromToken) {
      this.loading = true;
      this.svcgetdoctordtls.GetListOfNotification(doctorId).subscribe(
        (data) => {
          this.loading = false;
          //console.log(data, "this is notification data")
          this.getNotify = data;
        },
        (err: any) => {
          this.loading = false;
        }
      );
    }
  }

  getCDSSGuideLinesfunction() {
    this.userObjFromToken = this.svcLocalstorage.GetData(
      environment.AuthTokenKeyLSKey
    );

    if (this.userObjFromToken)
      this.svcgetdoctordtls.getCDSSGuideLines().subscribe((data) => {
        //console.log(data);
      });
  }

  getListOfMedicinefunction() {
    this.getListOfMedicinevar = [];
    this.userObjFromToken = this.svcLocalstorage.GetData(
      environment.AuthTokenKeyLSKey
    );

    if (this.userObjFromToken)
      this.svcgetdoctordtls.GetListOfMedicine().subscribe((data) => {
        //console.log(data)
      });
  }

  getListOfVitalfunction() {
    this.userObjFromToken = this.svcLocalstorage.GetData(
      environment.AuthTokenKeyLSKey
    );

    if (this.userObjFromToken)
      this.svcgetdoctordtls.GetListOfVital().subscribe((data) => {
        //console.log(data)
      });
  }

  getListOfPHCHospitalfunction() {
    this.userObjFromToken = this.svcLocalstorage.GetData(
      environment.AuthTokenKeyLSKey
    );

    if (this.userObjFromToken)
      this.svcgetdoctordtls.GetListOfPHCHospital().subscribe((data) => {
        //console.log(data)
      });
  }

  getListOfSpecializationMasterfunction() {
    this.userObjFromToken = this.svcLocalstorage.GetData(
      environment.AuthTokenKeyLSKey
    );

    if (this.userObjFromToken)
      this.svcgetdoctordtls
        .GetListOfSpecializationMaster()
        .subscribe((data) => {
          this.getListOfSpecializationMastervar.push(data);
          //console.log(data)
        });
  }

  // getTodaysPatients(id){
  //   //console.log("this is tiwari")
  //   this.userObjFromToken = this.svcLocalstorage.GetData(environment.AuthTokenKeyLSKey);
  //   if(this.userObjFromToken){
  //     this.svcgetdoctordtls.GetTodaysPatients(id).subscribe(data => {
  //       //console.log(data)
  //     })
  //   }
  // }

  getListOfSubSpecializationMasterfunction(SpecializationId) {
    this.userObjFromToken = this.svcLocalstorage.GetData(
      environment.AuthTokenKeyLSKey
    );

    if (this.userObjFromToken) {
      this.svcgetdoctordtls
        .GetListOfSubSpecializationMaster(SpecializationId)
        .subscribe((data) => {
          this.getListOfSubSpecialization.push(data);
          //console.log(data)
        });
    }
  }
  updateDocDetails(doctorDetail: any) {
    this.userObjFromToken = this.svcLocalstorage.GetData(
      environment.AuthTokenKeyLSKey
    );

    if (this.userObjFromToken) {
      this.svcgetdoctordtls
        .UpdateDoctorDetails(doctorDetail)
        .subscribe((data) => {
          //console.log(data)
        });
    }
  }

  todayPatients: any;
  getTodayPatients(doctorId: any) {
    this.userObjFromToken = this.svcLocalstorage.GetData(
      environment.AuthTokenKeyLSKey
    );
    if (this.userObjFromToken) {
      this.svcgetdoctordtls.GetTodaysPatients(doctorId).subscribe((data) => {
        //console.log(data)
        // this.todayPatients.push(data)
        this.todayPatients = data;
        // //console.log(this.todayPatients[0].patientCaseID, "===========patientcaseid=============")
      });
    }
  }

  completedcons: any;
  GetCompletedConsultationPatientsHistory(doctorId: any) {
    this.userObjFromToken = this.svcLocalstorage.GetData(
      environment.AuthTokenKeyLSKey
    );
    if (this.userObjFromToken) {
      this.svcgetdoctordtls
        .GetCompletedConsultationPatientsHistory(doctorId)
        .subscribe((data) => {
          this.completedcons = data;
          //console.log(data)
        });
    }
  }
  yesterdaypatient: any;
  GetYesterdayPatientsHistory(doctorId: any) {
    this.userObjFromToken = this.svcLocalstorage.GetData(
      environment.AuthTokenKeyLSKey
    );
    if (this.userObjFromToken) {
      this.svcgetdoctordtls
        .GetYesterdayPatientsHistory(doctorId)
        .subscribe((data) => {
          this.yesterdaypatient = data;
          // var today = new Date();
          // var date = today.getDate() + '-' + (today.getMonth() + 1) + '-' + today.getFullYear();
          // this.createdOn = date
          // console.log(this.createdOn)
        });
    }
  }

  imgprofile: any;
  signature:any;

  DoctorDetails: any;
  getDoctorDetails(doctorEmail: any) {
    this.userObjFromToken = this.svcLocalstorage.GetData(
      environment.AuthTokenKeyLSKey
    );
    if (this.userObjFromToken) {
      this.loading = true;
      this.svcgetdoctordtls.GetDoctorDetails(doctorEmail).subscribe(
        (data) => {
          this.DoctorDetails = data;
          if (this.DoctorDetails.specializationId == 1) {
            this.DoctorDetails.specializationId = 'General Medicine';
          } else if (this.DoctorDetails.specializationId == 2) {
            this.DoctorDetails.specializationId = 'Obstetrics and Gyne';
          } else if (this.DoctorDetails.specializationId == 3) {
            this.DoctorDetails.specializationId = 'Pediatrics';
          }

          if (this.DoctorDetails.detailsDTO.stateId == 1) {
            this.DoctorDetails.detailsDTO.stateId = 'Madhya Pradesh';
          }
          console.log(this.DoctorDetails.specializationId);
          //console.log("doctor data: ", data)
           this.showImage(this.DoctorDetails.detailsDTO.photo)
          this.showSignature(this.DoctorDetails.digitalSignature)

          this.doctorForm.patchValue({
            firstName: this.DoctorDetails.detailsDTO.firstName,
            middleName: this.DoctorDetails.detailsDTO.middleName,
            lastName: this.DoctorDetails.detailsDTO.lastName,
            gender: this.DoctorDetails.detailsDTO.genderId,
            spclztn: this.DoctorDetails.specializationId,
            subspcalztn: this.DoctorDetails.qualification,
            designation: this.DoctorDetails.designation,
            email: this.DoctorDetails?.detailsDTO.emailId,
            phNumber: this.DoctorDetails.phoneNumber,
            city: this.DoctorDetails?.detailsDTO.city,
            state: this.DoctorDetails?.detailsDTO.stateId,
            postalCode: this.DoctorDetails?.detailsDTO.pinCode,
          });

          this.loading = false;
        },
        (err: any) => {
          this.loading = false;
        }
      );
    }
  }
  showImage(image){
    this.svcgetdoctordtls.image(image).subscribe((res: any) => {
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
    })
  }
  showSignature(image){
    this.svcgetdoctordtls.image(image).subscribe((res: any) => {
      // this.imgprofile=res
      const reader = new FileReader();
      const url = reader.readAsDataURL(res);
      reader.onloadend = () => (this.signature = reader.result);

      // let objectURL = URL.createObjectURL(res);
      // this.imgprofile = this.sanitizer.bypassSecurityTrustUrl(objectURL);
    },
    (err: any) => {},
    () => {
      //this.loading=false
    })
  }


  consultedCompletion: any = [];
  getConsultedCompletion(doctorId: any) {
    this.userObjFromToken = this.svcLocalstorage.GetData(
      environment.AuthTokenKeyLSKey
    );
    if (this.userObjFromToken) {
      this.svcgetdoctordtls
        .GetCompletedConsultationPatientsHistory(doctorId)
        .subscribe((data) => {
          this.consultedCompletion.push(data);
        });
    }
  }
  // YesterdayPatients: any = []
  // getYesterdayPatients(doctorId: any) {
  //   this.userObjFromToken = this.svcLocalstorage.GetData(environment.AuthTokenKeyLSKey);
  //   if (this.userObjFromToken) {
  //     this.svcgetdoctordtls.GetYesterdayPatientsHistory(doctorId).subscribe(data => {
  //       this.YesterdayPatients.push(data)
  //     })
  //   }
  // }
  Pastpatients: any;
  GetPastPatientsHistory(doctorId: any) {
    this.userObjFromToken = this.svcLocalstorage.GetData(
      environment.AuthTokenKeyLSKey
    );
    if (this.userObjFromToken) {
      this.loading = true;
      this.svcgetdoctordtls.GetPastPatientsHistory(doctorId).subscribe(
        (data) => {
          this.Pastpatients = data;
          this.loading = false;
          //console.log(this.Pastpatients)
        },
        (err: any) => {
          this.loading = false;
        }
      );
    }
  }

  GetPatientCaseDetailsAsync(doctorId: any) {
    this.userObjFromToken = this.svcLocalstorage.GetData(
      environment.AuthTokenKeyLSKey
    );
    if (this.userObjFromToken) {
      this.svcgetdoctordtls
        .GetPatientCaseDetailsAsync(doctorId)
        .subscribe((data) => {
          //console.log(data)
        });
    }
  }

  PostTreatmentPlan(request: any) {
    this.userObjFromToken = this.svcLocalstorage.GetData(
      environment.AuthTokenKeyLSKey
    );
    if (this.userObjFromToken) {
      this.svcgetdoctordtls.PostTreatmentPlan(request).subscribe((data) => {
        //console.log(data)
      });
    }
  }

  DeleteNotification(request: number) {
    this.userObjFromToken = this.svcLocalstorage.GetData(
      environment.AuthTokenKeyLSKey
    );
    if (this.userObjFromToken) {
      this.loading = true;
      this.svcgetdoctordtls.DeleteNotification(request).subscribe(
        (data) => {
          this.loading = false;
          const index1: number = this.getNotify.findIndex(
            (elem) => elem.id === request
          );
          let obj = this.getNotify.find((item) => item.id === request);
          const index: number = this.getNotify.indexOf(obj);
          if (index >= 0) {
            this.getNotify.splice(index, 1);
          }
          //console.log(data)
        },
        (err: any) => {
          this.loading = false;
        }
      );
    }
  }
  PatientAbsent(request: any) {
    this.userObjFromToken = this.svcLocalstorage.GetData(
      environment.AuthTokenKeyLSKey
    );
    if (this.userObjFromToken) {
      this.svcgetdoctordtls.PatientAbsent(request).subscribe((data) => {
        //console.log(data)
      });
    }
  }

  ReferHigherFacility(request: any) {
    this.userObjFromToken = this.svcLocalstorage.GetData(
      environment.AuthTokenKeyLSKey
    );
    if (this.userObjFromToken) {
      this.svcgetdoctordtls.ReferHigherFacility(request).subscribe((data) => {
        //console.log(data)
      });
    }
  }

  GetCaseLabel(request: any) {
    this.userObjFromToken = this.svcLocalstorage.GetData(
      environment.AuthTokenKeyLSKey
    );
    if (this.userObjFromToken) {
      this.svcgetdoctordtls.GetCaseLabel(request).subscribe((data) => {
        //console.log(data)
      });
    }
  }

  // SearchPatientDrDashBoard(request: any) {
  //   this.userObjFromToken = this.svcLocalstorage.GetData(environment.AuthTokenKeyLSKey);
  //   if (this.userObjFromToken) {
  //     this.svcgetdoctordtls.SearchPatientDrDashBoard(request).subscribe(data => {
  //       //console.log(data)
  //     })
  //   }
  // }
  SearchPatientDrHistory(request: any) {
    this.userObjFromToken = this.svcLocalstorage.GetData(
      environment.AuthTokenKeyLSKey
    );
    if (this.userObjFromToken) {
      this.svcgetdoctordtls
        .SearchPatientDrHistory(request)
        .subscribe((data) => {
          //console.log(data)
        });
    }
  }

  GetListOfPHCHospitalBlockWise(request: any) {
    this.userObjFromToken = this.svcLocalstorage.GetData(
      environment.AuthTokenKeyLSKey
    );
    if (this.userObjFromToken) {
      this.svcgetdoctordtls
        .GetListOfPHCHospitalBlockWise(request)
        .subscribe((data) => {
          //console.log(data)
        });
    }
  }
  GetLatestReferred(request: any) {
    this.userObjFromToken = this.svcLocalstorage.GetData(
      environment.AuthTokenKeyLSKey
    );
    if (this.userObjFromToken) {
      this.svcgetdoctordtls.GetLatestReferred(request).subscribe((data) => {
        //console.log(data)
      });
    }
  }
  GetLatestReferredCount(request: any) {
    this.userObjFromToken = this.svcLocalstorage.GetData(
      environment.AuthTokenKeyLSKey
    );
    if (this.userObjFromToken) {
      this.svcgetdoctordtls
        .GetLatestReferredCount(request)
        .subscribe((data) => {
          this.LatestReferred = data;
          //console.log("latets"+data)
        });
    }
  }
  requestDoctorID: string;
  UpdateIsDrOnline(isChecked: boolean) {
    this.userObjFromToken = this.svcLocalstorage.GetData(
      environment.AuthTokenKeyLSKey
    );
    this.requestDoctorID = this.svcLocalstorage.GetData(environment.doctorID);
    if (this.userObjFromToken) {
      this.svcgetdoctordtls
        .UpdateIsDrOnline({
          doctorID: this.requestDoctorID,
          isOnline: isChecked,
        })
        .subscribe((data) => {
          this.isDoctorOffline = !isChecked
          //console.log(data)
        });
    }
  }

  IsDrOnline(request: any) {
    this.userObjFromToken = this.svcLocalstorage.GetData(
      environment.AuthTokenKeyLSKey
    );
    if (this.userObjFromToken) {
      this.svcgetdoctordtls.IsDrOnline(request).subscribe((data) => {
        //console.log(data)
        this.isChecked = Boolean(data).valueOf();
      });
    }
  }
  OnlineDrList(request: any) {
    console.error('online doctor yha!!!!!!!!!!!!!!!!!!!!!!!');

    this.userObjFromToken = this.svcLocalstorage.GetData(
      environment.AuthTokenKeyLSKey
    );
    if (this.userObjFromToken) {
      this.svcgetdoctordtls.OnlineDrList(request).subscribe((data) => {
        //console.log(data)
      });
    }
  }

  gender: any = [];
  getTypeMasterGender() {
    this.userObjFromToken = this.svcLocalstorage.GetData(
      environment.AuthTokenKeyLSKey
    );
    //console.log(this.userObjFromToken)
    if (this.userObjFromToken)
      this.Svc_MasterService.GetAllGenderMaster().subscribe((data) => {
        this.gender.push(data);
        //console.log(data)
      });
  }
  radiochangeHandler(event: any) {
    //console.log(event);
    this.DoctorDetails.detailsDTO.genderId = event;
  }
  onSignOut() {
    this.svcAuth.LogOutUser().subscribe({
      next: () => {
        this.svcLocalstorage.DeleteAll();
        this.router.navigate(['/login']);
        this.checkSignOut();
      },
    });
  }

  checkSignOut() {
    if (this.svcLocalstorage.GetData(environment.AuthTokenKeyLSKey) != null) {
      this.isSignOut = true;
    } else {
      this.isSignOut = false;
    }
  }
  // updateDocDetails(){
  //   this.userObjFromToken = this.svcLocalstorage.GetData(environment.AuthTokenKeyLSKey);

  //   let form_value = this.doctorForm.getRawValue()
  //   let bodyparams : any = {
  //     id: 3,
  //     zoneId: 1,
  //     clusterI: 1,
  //     userId: 6,
  //     specializationId : form_value.spclztn,
  //     subSpecializationId : form_value.subspcalztn,
  //     mciid: 132456,
  //     registrationNumber: "2132JJKNK",
  //     qualification: "MBBS",
  //     designation : form_value.designation,
  //     phoneNumber : form_value.phNumber,
  //     digitalSignature: "path",
  //     panNo: "AEQPY7777F",
  //     bankName: "HDFC",
  //     branchName: "Gurgaon",
  //     accountNumber: "12021050056733",
  //     ifsccode: "HDFC001202",
  //     updatedBy: 2,
  //     detailsDTO: {
  //       titleId: 1,
  //       firstName: form_value.firstName,
  //       middleName: form_value.middleName,
  //       lastName: form_value.lastName,
  //       dob: "2000-01-01T00:00:00",
  //       genderId: 1,
  //       emailId: form_value.email,
  //       countryId: 1,
  //       stateId: form_value.state,
  //       city: form_value.city,
  //       pinCode: form_value.postalCode,
  //       "photo": "Path of photo",
  //       "idproofTypeId": 1,
  //       "idproofNumber": "1235667890"
  //     }
  //   }
  //   //console.log(form_value,"dsafsdffsd")
  //   //console.log(bodyparams,"this si param")
  //   if(this.userObjFromToken){
  //       this.svcgetdoctordtls.UpdateDoctorDetails(bodyparams).subscribe((data:any) => {
  //         //console.log(data.result)
  //       })
  //   }
  // }
  onclickvideoIcons(request: any, res: any, referredbyPHCName: any) {
    //console.log(request ,res)
    // this.router.navigate(["/case-details-doc"], {queryParams: {res}});
  }

  // @HostListener('window:beforeunload', ['$event'])
  // public onPageUnload($event: BeforeUnloadEvent) {

  //   $event.returnValue = true;

  // }
  onclickvideoIcon(patientId: any) {
    // id =this.svcLocalstorage.GetData(environment.doctorID)
    let qs: IQueryString = {
      patientId: patientId,
    };
    let strEncText = EncryptData(JSON.stringify(qs));

    this.router.navigate(['/case-details-doc'], {
      queryParams: { src: strEncText },
    });

    //this.router.navigate(["/case-details-doc"], { queryParams: { patientId } },);
    // this.myCompOneObj.getdetailphc(patientId,phcid)
  }

  onclickvideocall() {
    this.router.navigate(['/video-call']);
    //, { queryParams: { Id: this.svcLocalstorage.GetData(environment.doctorID)} }
  }
  currentDate(createdOn) {
    var today = new Date(createdOn.dateOfRegistration);
    var date =
      today.getDate() +
      '-' +
      (today.getMonth() + 1) +
      '-' +
      today.getFullYear();
    return date;
  }
  advanceSearchClick() {
    let obj: any = {};
    if (
      this.svcLocalstorage.GetData(environment.PhcID) != null &&
      this.svcLocalstorage.GetData(environment.PhcID) != ''
    ) {
      obj.phcid = this.svcLocalstorage.GetData(environment.PhcID);
    } else {
      obj.phcid = 0;
    }
    if (
      this.historyAdvanceSearch.get('patientName').value != null &&
      this.historyAdvanceSearch.get('patientName').value != ''
    ) {
      obj.patientName = this.historyAdvanceSearch.get('patientName').value;
    } else {
      obj.patientName = '';
    }
    if (
      this.historyAdvanceSearch.get('patientUID').value != null &&
      this.historyAdvanceSearch.get('patientUID').value != ''
    ) {
      obj.patientUID = this.historyAdvanceSearch.get('patientUID').value;
    } else {
      obj.patientUID = 0;
    }
    if (
      this.historyAdvanceSearch.get('dateOfRegistration').value != null &&
      this.historyAdvanceSearch.get('dateOfRegistration').value != ''
    ) {
      obj.dateOfRegistration =
        this.historyAdvanceSearch.get('dateOfRegistration').value;
    } else {
      obj.dateOfRegistration = null;
    }
    if (
      this.historyAdvanceSearch.get('contactNo').value != null &&
      this.historyAdvanceSearch.get('contactNo').value != ''
    ) {
      obj.contactNo = this.historyAdvanceSearch.get('contactNo').value;
    } else {
      obj.contactNo = '';
    }

    if (
      this.historyAdvanceSearch.get('dateOfBirth').value != null &&
      this.historyAdvanceSearch.get('dateOfBirth').value != ''
    ) {
      obj.dateOfBirth = this.historyAdvanceSearch.get('dateOfBirth').value;
    } else {
      obj.dateOfBirth = null;
    }
    if (
      this.historyAdvanceSearch.get('genderId').value != null &&
      this.historyAdvanceSearch.get('genderId').value != ''
    ) {
      obj.genderId = this.historyAdvanceSearch.get('genderId').value;
    } else {
      obj.genderId = 0;
    }
    if (
      this.svcLocalstorage.GetData(environment.doctorID) != null &&
      this.svcLocalstorage.GetData(environment.doctorID) != ''
    ) {
      obj.doctorId = this.svcLocalstorage.GetData(environment.doctorID);
    } else {
      obj.doctorId = 0;
    }
    // if (obj.contactNo == "" && obj.genderId == 0 && obj.dateOfBirth == null && obj.dateOfRegistration == null && obj.patientUID == 0 && obj.patientName == "") {
    //   this.GetPastPatientsHistory({ "doctorID": this.svcLocalstorage.GetData(environment.doctorID) });
    // }
    // else {
    this.userObjFromToken = this.svcLocalstorage.GetData(
      environment.AuthTokenKeyLSKey
    );
    if (this.userObjFromToken) {
      this.loading = true;
      this.svcgetdoctordtls.AdvanceSearchResult(obj).subscribe(
        (data) => {
          this.loading = false;
          this.Pastpatients = [];
          this.Pastpatients = data;

          this.dataSource = new MatTableDataSource(this.Pastpatients);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        },
        (err: any) => {
          this.loading = false;
        }
      );
    }

    //}
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  genderseacrh: any = [];
  getTypeMasterGenderSearch() {
    this.userObjFromToken = this.svcLocalstorage.GetData(
      environment.AuthTokenKeyLSKey
    );
    if (this.userObjFromToken)
      this.SvcPhcPatient.setGenderMaster().subscribe((data) => {
        this.genderseacrh.push(data);
      });
  }
  serachImg: boolean;
  searchadvancedPatient() {
    this.isYesterdayPatient = false;
    this.isAdvancePatient = true;
    this.issearchPatients = false;
    this.isadvancesearchPatients = true;
    this.serachImg = true;
    this.advanceSearchClick();
    // this.GetPastPatientsHistory({ "doctorID": this.svcLocalstorage.GetData(environment.doctorID) })
  }
  searchback() {
    this.isYesterdayPatient = true;
    this.isAdvancePatient = false;
    this.issearchPatients = true;
    this.isadvancesearchPatients = false;
    this.serachImg = false;
  }
  advancessearch() {
    this.serachImg = true;
  }
  imgOnclick() {
    this.searchback();
  }

  allphcdetail: any = [];
  getAllphcfun(districtId: any) {
    this.userObjFromToken = this.svcLocalstorage.GetData(
      environment.AuthTokenKeyLSKey
    );
    if (this.userObjFromToken) this.allphcdetail = [];
    this.svcgetdoctordtls.GetAllPHC(districtId).subscribe((data) => {
      this.allphcdetail = data;
    });
  }
  districtmaster: any = [];
  getdistrictmasterfun() {
    this.userObjFromToken = this.svcLocalstorage.GetData(
      environment.AuthTokenKeyLSKey
    );
    if (this.userObjFromToken)
      this.SvcPhcPatient.setdistrictMaster().subscribe((data) => {
        this.districtmaster = data;
      });
  }

  form = new FormGroup({
    districtName: new FormControl(),
    phclist: new FormControl(),
  });
  phcListfilter: any = [];
  checkFirstDropdown($event) {
    this.svcgetdoctordtls.GetAllPHC($event.target.value).subscribe((data) => {
      this.phcListfilter = data;
    });

    // this.phcListfilter=this.allphcdetail.filter(c=>c.districtId===$event.target.value);
    //  let  itm=this.phcListfilter[0];
    //  this.form.controls['phclist'].setValue(itm.districtId);
    // console.log($event);
  }

  refreshClick() {
    this.loading = true;

    setTimeout(() => {
      this.ngOnInit();
      this.loading = false;
    }, 2000);
    //window.location.reload();
  }

  filtered: [];
  deshow: any;
  detaildoctorFName: any;
  detaildoctorspeciality: any;
  detaildoctorphoto: any;
  istrue: boolean;
  getphcdetail: any = [];
  getmoname: any = [];
  onOptionsSelected(event: any) {
    this.istrue = true;
    this.filtered = event.target.value;
    //  console.log(this.filtered)
    let a = this.phcListfilter;
    for (let i = 0; i < a.length; i++) {
      let dr = this.phcListfilter[i];
      if (this.filtered == dr.id) {
        this.detaildoctorFName = this.phcListfilter[i].phcName;
        break;
      }
      this.SvcPhcPatient.getphcdetailById(this.filtered).subscribe((data) => {
        this.getphcdetail = data;
        this.getmoname = this.getphcdetail.moname;
      });
    }
  }

  onInitiateMeeting(patient: any) {
    this.SvcTwilioMiddleware.CallingByPatientCaseId(
      patient.patientCaseID
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
  refreshButton() {
    this.loading = true;
    // this.ngOnInit();
    this.pateintWaitList(this.svcLocalstorage.GetData(environment.doctorID));

    setTimeout(() => {
      this.loading = false;
    }, 2000);
  }
  imgVideoCall = '../../../../assets/Images/smaill-icon/black-video-icon.png';
  patientWailtListQueue: any;
  errorListQueue: any;
  pateintWaitList(doctorID) {
    this.userObjFromToken = this.svcLocalstorage.GetData(
      environment.AuthTokenKeyLSKey
    );
    if (this.userObjFromToken) {
      this.loading = true;
      this.SvcPhcPatient.GetPatientQueueByDoctorID(doctorID).subscribe(
        (data: any) => {
          this.loading = false;
          this.patientWailtListQueue = data
          //  console.log(this.patientWailtListQueue,'queueeeeeeeee')
        },
        (error) => {
          this.loading = false;
          this.errorListQueue = error;
          console.log(error, 'err');
        }
      );
    }
  }

  isPatientQueueTab = false;
  RefreshpateintWaitList() {
    console.log("RefreshpateintWaitList");
    this.isPatientQueueTab = true;
    
    this.pateintWaitList(this.svcLocalstorage.GetData(environment.doctorID));
  }
  menuClick(value: any) {
    switch (value) {
      case 'Calendar': {
        if(this.currentYear===new Date().getFullYear() && new Date().getMonth()-1===this.currentMonth-1)
        {
          this.disablenext=true
        }
        this.generateCalendar();
        break;
      }
      
      case 'notification': {
        this.getNotification({
          userEmail: this.svcLocalstorage.GetData(environment.doctorEmail),
        });
        break;
      }
      case 'account': {
        this.getDoctorDetails({
          userEmailID: this.svcLocalstorage.GetData(environment.doctorEmail),
        });
        break;
      }

      case 'history': {
        this.GetYesterdayPatientsHistory({
          doctorID: this.svcLocalstorage.GetData(environment.doctorID),
        });
        break;
      }

      case 'dashboard': {
        this.getTodayPatients({
          doctorID: this.svcLocalstorage.GetData(environment.doctorID),
        });
        this.GetCompletedConsultationPatientsHistory({
          doctorID: this.svcLocalstorage.GetData(environment.doctorID),
        });
        this.IsDrOnline({
          doctorID: this.svcLocalstorage.GetData(environment.doctorID),
        });
        this.GetLatestReferredCount({
          doctorID: this.svcLocalstorage.GetData(environment.doctorID),
        });

        break;
      }


    }

    this.isPatientQueueTab = false;
  }
  autoRefresh() {
    this.autoRefreshID = setInterval(() => {
      if (this.isPatientQueueTab) {
        this.pateintWaitList(
          this.svcLocalstorage.GetData(environment.doctorID)
        );
      }
    }, 60000);
  }
  loadingPatientQueue() {
    this.RefreshpateintWaitList();
    document.getElementById('v-pills-home-tab').classList.remove('active');
    document.getElementById('v-pills-home').classList.remove('show');
    document.getElementById('v-pills-home').classList.remove('active');
    document
      .getElementById('v-pills-patient-queue-tab')
      .classList.add('active');
    document.getElementById('v-pills-patient-queue').classList.add('show');
    document.getElementById('v-pills-patient-queue').classList.add('active');
  }

  generateCalendar() {
    const firstDay = new Date(this.currentYear, this.currentMonth, 1);
    const lastDay = new Date(this.currentYear, this.currentMonth + 1, 0);
    const numDays = lastDay.getDate();
    const startingDay = firstDay.getDay();

    this.GetDoctorCalendar();
        if(this.currentYear===new Date().getFullYear() && new Date().getMonth()-1===this.currentMonth-1)
    {
      this.disablenext=true
    }
    

    this.calendarDays = [];
    let dayCounter = 1;

    for (let i = 0; i < 6; i++) {
      const week: Array<number> = [];

      for (let j = 0; j < 7; j++) {
        if ((i === 0 && j < startingDay) || dayCounter > numDays) {
          week.push(0);
        } else {
          week.push(dayCounter);
          dayCounter++;
        }
      }

      this.calendarDays.push(week);
      if (dayCounter > numDays) {
        break;
      }
    }
   

    
  }

  hasPreviousMonthClicked:boolean
  previousMonth() {
    if (!this.hasPreviousMonthClicked) {
      this.currentMonth--;
      if (this.currentMonth < 0) {
        this.currentMonth = 11;
        this.currentYear--;
      }
      this.generateCalendar();
      this.disablenext=false
      this.hasPreviousMonthClicked = true;
  
     
    }
  }
  
  

  nextMonth() {
    this.currentMonth++; 
    if (this.currentMonth > 11) {
      this.currentMonth = 0;
      this.currentYear++;
    }
    this.generateCalendar();
    this.hasPreviousMonthClicked = false
  }
  totalAbsent:any;
  totalConsultation:any;
  GetDoctorCalendarData:any;
  GetDoctorCalendar(){
    this.loading=true;
    let month=this.currentMonth+1;
    let year=this.currentYear;
   
    let AssignedDoctorID=this.svcLocalstorage.GetData(environment.doctorID);
    this.svcdoctor.GetDoctorCalendar(month,year,AssignedDoctorID).subscribe(data=>{
     this.GetDoctorCalendarData=data;
     this.loading=false;
     console.log(this.GetDoctorCalendarData);
     this.totalConsultation = this.GetDoctorCalendarData.reduce((total, item) => total + item.totalConsultation, 0);
     this.totalAbsent = this.GetDoctorCalendarData.reduce((total, item) => total + item.totalAbsent, 0);

    })
  }

  public getEventsForDay(day: number) {
    return this.GetDoctorCalendarData.filter(event => event.adate === day) ||[];
  }
}
