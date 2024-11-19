import { DatePipe, UpperCasePipe } from '@angular/common';
import {
  Component,
  ElementRef,
  HostListener,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { MdbModalRef, MdbModalService } from 'mdb-angular-ui-kit/modal';
import { environment } from 'src/environments/environment';
import { AccountRegisterComponent } from '../../shared-component/account-register/account-register.component';
import { PatientsSearchbarComponent } from '../../shared-component/patients-searchbar/patients-searchbar.component';
import { SvclocalstorageService } from 'src/app/services/services/svclocalstorage.service';
import { SvcPhcGetPatientService } from 'src/app/services/services/svc-phc-get-patient.service';
import { SvcAuthenticationService } from 'src/app/services/services/svc-authentication.service';
import { HttpParams } from '@angular/common/http';
import { IQueryString } from 'src/app/model/QueryStringModel';
import { EncryptData } from 'src/app/utils/utilityFn';
import { ngxLoadingAnimationTypes } from 'ngx-loading';
import { TwilioMiddlewareService } from '../../twilio-component/services/twilio-middleware.service';
import Swal from 'sweetalert2';
import { count, interval } from 'rxjs';
import { SvcAuthGuard } from 'src/app/services/auth/svc-auth.guard';
import { SvcmainAuthserviceService } from 'src/app/services/services/svcmain-authservice.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { NotificationHubService } from 'src/app/services/services/notification-hub.service';
import { INotificationResponse } from 'src/app/model/INotificationResponse';

@Component({
  selector: 'app-chc-center',
  templateUrl: './chc-center.component.html',
  styleUrls: ['./chc-center.component.css'],
})
export class ChcCenterComponent implements OnInit, OnDestroy {
  public ngxLoadingAnimationTypes = ngxLoadingAnimationTypes;
  loading = false;
  public config = {
    animationType: ngxLoadingAnimationTypes.none,
    backdropBorderRadius: '3px',
  };
  click: boolean = true;
  afterClick: boolean = false;
  istrue: boolean;
  selectedObject: any;
  searchedKeyword: any;
  modalRef: MdbModalRef<AccountRegisterComponent> | null = null;
  accountRegister: MdbModalRef<PatientsSearchbarComponent> | null = null;
  isSignOut: boolean;
  isYesterdayPatient = true;
  isAdvancePatient = false;
  imageSrc: string | undefined;
  issearchPatients = true;
  isadvancesearchPatients = false;
  Totalregistered: any;
  Totalconsulted: any = [];
  TotalPending: any = [];
  completedConsultation: any = [];
  todayspatient: any = [];
  phcdetail: any = {};
  page: number = 1;
  count: number = 0;
  tableSize: number = 7;
  tableSizes: any = [3, 6, 9, 12];
  phcName: any;
  defaultSelection = 'All';
  searchText: any;
  address: string;
  filterArgs: any = { type: '', address: '', car_type: '', amenity: '' };
  serachImg: boolean;
  PatientName = new FormControl('');
  PatientUID = new FormControl('');
  contactNumber = new FormControl('');
  FatherName = new FormControl('');
  date = new FormControl('');
  Age = new FormControl('');
  sex = new FormControl('');
  advanceform: FormGroup;
  phcForm = new FormGroup({
    PhcName: new FormControl(''),
    PhcZone: new FormControl(''),
    Phcaddress: new FormControl(''),
    PhcDistrict: new FormControl(''),
    PhcDivision: new FormControl(''),
    PhcCluster: new FormControl(''),
    PhcMOName: new FormControl(''),
    PhcCity: new FormControl(''),
    Phcstate: new FormControl(''),
    PhcPostal: new FormControl(''),
    PhcEmail: new FormControl(''),
    PhcMobile: new FormControl(''),
    PhcFirstName: new FormControl(''),
    PhcMiddleName: new FormControl(''),
    PhcLastName: new FormControl(''),
    file: new FormControl(''),
    fileSource: new FormControl(''),
    gender: new FormControl(''),
    flat: new FormControl(''),
    street: new FormControl(''),
  });
  todayDate: any = this.datepipe.transform(new Date(), 'yyyy-MM-dd');

  PhcID: any = this.svcLocalstorage.GetData(environment.PhcID);

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
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  dataSource: any = [];

  openTabValue = this._sweetAlert.openTabValue; ///////to store the current tab open

  genderArray = [
    {
      id: 2,
      gender: 'Female',
    },
    {
      id: 1,
      gender: 'Male',
    },
    {
      id: 3,
      gender: 'Others',
    },
  ];

  constructor(
    private modalService: MdbModalService,
    private fb: FormBuilder,
    private router: Router,
    private SvcTwilioMiddleware: TwilioMiddlewareService,
    private svcLocalstorage: SvclocalstorageService,
    private SvcPhcPatient: SvcPhcGetPatientService,
    private svcAuth: SvcAuthenticationService,
    private _sweetAlert: SvcmainAuthserviceService,
    private datepipe: DatePipe,
    private svcNotification: NotificationHubService
  ) {
    //////////used to stop loader when their is error of 401 and 403////

    this.advanceFormInit();

    this.callReceived();

    // this.startIdleTimer();
    this._sweetAlert.getLoader().subscribe((res: any) => {
      this.loading = res;
    });

    /////////////////////////////////////////////////////////////

    //this.autoRefresh()
  }
  ngOnDestroy(): void {
    clearTimeout(this.idleTimer);
    this._sweetAlert.closeAllModalsOnLogout.next(true);
  }
  ngAfterViewInit() {
    setTimeout(() => {
      // if (
      //   'nav-link active' ==
      //   document.getElementById('v-pills-patient-queue-tab').className
      // ) {
      //   this.pateintWaitList(this.svcLocalstorage.GetData(environment.PhcID));
      // }
    }, 1500);
  }
  isDoctor: boolean;
  ngOnInit(): void {
    let userType = this.svcLocalstorage.GetData(environment.Role);

    if (userType === 'Doctor') {
      this.isDoctor = true;
      //  this.UserName = this.svcLocalstorage.GetData(environment.doctorName);
      // this.DoctorEmail = this.svcLocalstorage.GetData(environment.doctorEmail);
    }

    if (localStorage.getItem(environment.pateintWaitRefereshtime) === null) {
    } else {
      var numDate = localStorage.getItem(environment.pateintWaitRefereshtime);

      this.counter = parseInt(numDate);
      if (this.counter < 1) {
        this.counter = 180;
        localStorage.setItem(
          environment.pateintWaitRefereshtime,
          this.counter.toString()
        );
      } else {
        this.disabled = true;
        this.Refreshhidden = true;
        var refreshIntervalId = setInterval(() => {
          this.counter = this.counter - 1;
          this.counterMessage =
            'Please Wait...' + this.counter.toString() + ' ';
          localStorage.setItem(
            environment.pateintWaitRefereshtime,
            this.counter.toString()
          );

          if (this.counter == 0) {
            this.Refreshhidden = false;
            this.disabled = false;
            this.counterMessage = '';
            clearInterval(refreshIntervalId);
          }
        }, 1000);
      }
    }

    this.TodaysPatientCount(this.svcLocalstorage.GetData(environment.PhcID));
    this.getConsultationPatient(
      this.svcLocalstorage.GetData(environment.PhcID)
    );
    this.getTodaysPatient(this.svcLocalstorage.GetData(environment.PhcID));
    //this.getsearchpatient(this.svcLocalstorage.GetData(environment.PhcID))
    // this.getavailableDoctor(1)
    // this.getPhcDetail(this.svcLocalstorage.GetData(environment.UserId));
    //this.getdronlineList(this.svcLocalstorage.GetData(environment.BlockID));
    //this.getTypeMasterGender()
    //   this.getcustomeadvabcesearch()
    //this.getTypeMasterGenderSearch()
    this.PHCNamefunction();
    this.phcForm = this.fb.group({
      PhcName: ['', [Validators.required]],
      PhcZone: ['', [Validators.required]],
      Phcaddress: ['', [Validators.required]],
      PhcDistrict: ['', [Validators.required]],
      PhcDivision: ['', [Validators.required]],
      PhcCluster: ['', [Validators.required]],
      PhcMOName: ['', [Validators.required]],
      PhcCity: ['', [Validators.required]],
      Phcstate: ['', [Validators.required]],
      PhcPostal: ['', [Validators.required]],
      PhcEmail: ['', [Validators.required]],
      PhcMobile: ['', [Validators.required]],
      PhcFirstName: ['', [Validators.required]],
      PhcMiddleName: ['', [Validators.required]],
      PhcLastName: ['', [Validators.required]],
      file: ['', [Validators.required]],
      fileSource: ['', [Validators.required]],
      gender: ['', [Validators.required]],
      flat: ['', [Validators.required]],
      street: ['', [Validators.required]],
    });

    this.backtoHistoryPage();
  }
  availabledoctor: any = null;

  advanceFormInit() {
    this.advanceform = this.fb.group({
      phcid: this.svcLocalstorage.GetData(environment.PhcID),
      patientName: ['', [Validators.required]],
      patientUID: ['', [Validators.required]],
      dateOfRegistration: ['', [Validators.required]],
      contactNo: ['', [Validators.required]],
      dateOfBirth: ['', [Validators.required]],
      genderId: ['', [Validators.required]],
    });
    this._sweetAlert.setPhcHistory(this.advanceform);
  }

  openplatform() {
    this.availabledoctor = null;
    this.getdronlineList(this.svcLocalstorage.GetData(environment.BlockID));
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
  PHCNamefunction() {
    setTimeout(() => {
      this.phcName = this.svcLocalstorage.GetData(environment.PhcName);
    }, 1000);
  }
  openModal() {
    const options: any = {
      ignoreBackdropClick: true, // This prevents the modal from closing when a user clicks outside the modal
    };
    this.modalRef = this.modalService.open(AccountRegisterComponent, options);
  }
  searchOpenModal() {
    this.accountRegister = this.modalService.open(PatientsSearchbarComponent);
  }
  searchadvancedPatient() {
    // this.getTypeMasterGender();
    this.getcustomeadvabcesearch(localStorage.getItem('PhcID'));
    this.isYesterdayPatient = false;
    this.isAdvancePatient = true;
    this.issearchPatients = false;
    this.isadvancesearchPatients = true;
    this.serachImg = true;

    this._sweetAlert.historyType = 'advanceHistory';
    (this._sweetAlert.phcHistoryForm.contact =
      this.advanceform.value.contactNo),
      (this._sweetAlert.phcHistoryForm.phcid = this.advanceform.value.phcid),
      (this._sweetAlert.phcHistoryForm.patientname =
        this.advanceform.value.patientName),
      (this._sweetAlert.phcHistoryForm.patientid =
        this.advanceform.value.patientUID),
      (this._sweetAlert.phcHistoryForm.dateOfBirth =
        this.advanceform.value.dateOfBirth),
      (this._sweetAlert.phcHistoryForm.gender =
        this.advanceform.value.genderId);
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
    this._sweetAlert.historyType = 'yesterdayData';
    this.searchback();
  }
  get f() {
    return this.phcForm.controls;
  }
  onFileChange(event: any) {
    const reader = new FileReader();

    if (event.target.files && event.target.files.length) {
      const [file] = event.target.files;
      reader.readAsDataURL(file);

      reader.onload = () => {
        this.imageSrc = reader.result as string;
        this.phcForm.patchValue({
          fileSource: reader.result,
        });
      };
    }
  }
  onSignOut() {
    this._sweetAlert.openTabValue = '1';
    this._sweetAlert.historyType = 'yesterdayData';
    this._sweetAlert.advanceHistoryArray = [];
    this._sweetAlert.pageIndex = 0;
    this._sweetAlert.phcHistoryForm = {
      patientid: '',
      patientname: '',
      contact: '',
      phcid: '',
      dateofRegistration: '',
      dateOfBirth: '',
      gender: 0,
    };

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
  submitphcdetails() {
    this.validateAllFormFields(this.phcForm);
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
  TodaysPatientCount(id: any) {
    this.loading = true;
    // this.Totalregistered = [];
    // this.TotalPending = [];
    // this.Totalconsulted = [];
    this.userObjFromToken = this.svcLocalstorage.GetData(
      environment.AuthTokenKeyLSKey
    );
    if (this.userObjFromToken)
      this.SvcPhcPatient.GetTodaysPatientCount(id).subscribe((data) => {
        this.loading = false;
        this.Totalregistered = data;
        // this.TotalPending.push(data);
        // this.Totalconsulted.push(data);
      });
  }
  getConsultationPatient(id: any) {
    this.loading = true;
    this.completedConsultation = [];
    this.userObjFromToken = this.svcLocalstorage.GetData(
      environment.AuthTokenKeyLSKey
    );
    if (this.userObjFromToken)
      this.SvcPhcPatient.GetConsultedPatient(id).subscribe((data) => {
        this.loading = false;
        this.completedConsultation.push(data);
      });
  }
  p: any;
  getTodaysPatient(id: any) {
    this.loading = true;
    this.todayspatient = [];
    this.userObjFromToken = this.svcLocalstorage.GetData(
      environment.AuthTokenKeyLSKey
    );
    if (this.userObjFromToken)
      this.p = this.svcLocalstorage.GetData(environment.PhcID);

    this.SvcPhcPatient.GetTodayPatient(id).subscribe((data) => {
      this.loading = false;
      this.todayspatient.push(data);
    });
  }
  yesterdayPatient: any = [];
  getyesterday(id: any) {
    this.loading = true;
    this.yesterdayPatient = [];
    this.userObjFromToken = this.svcLocalstorage.GetData(
      environment.AuthTokenKeyLSKey
    );
    if (this.userObjFromToken)
      this.SvcPhcPatient.GetYesterdayPatient(id).subscribe((data: any) => {
        this.loading = false;
        this.yesterdayPatient = data;
        this._sweetAlert.yesterdayHostoryArray = data;
      });
  }
  searchpatient: any = {};

  getsearchpatient(phcId: any) {
    this.loading = true;
    let Obj: any = {};

    ////////phc can serach any patient so thats why  we send phc id=0 //////////
    Obj.phcid = this.advanceform.value.phcid;
    Obj.patientName = '';
    Obj.patientUID = 0;
    Obj.dateOfRegistration = null;
    Obj.contactNo = '';
    Obj.genderId = 0;
    Obj.dateOfBirth = null;

    this.searchpatient = [];
    this.userObjFromToken = this.svcLocalstorage.GetData(
      environment.AuthTokenKeyLSKey
    );
    if (this.userObjFromToken) {
      this.loading = true;
      this.SvcPhcPatient.getAdvancessearch(Obj).subscribe(
        (data: any) => {
          this.searchpatient.push(data);
          this.dataSource = new MatTableDataSource(this.searchpatient[0]);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
          this.loading = false;
          this._sweetAlert.advanceHistoryArray = data;
        },
        (err: any) => {
          this.loading = false;
        }
      );
    }
  }
  // createdOn: any
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

  phcEmployeeName: any;
  getPhcDetail(userId: any) {
    this.loading = true;
    this.phcdetail = {};
    this.userObjFromToken = this.svcLocalstorage.GetData(
      environment.AuthTokenKeyLSKey
    );
    if (this.userObjFromToken) {
      this.loading = true;
      this.SvcPhcPatient.getphcdetail(userId).subscribe(
        (data) => {
          this.loading = false;
          this.phcdetail = data;

          this.phcEmployeeName =
            this.phcdetail.firstName &&
            this.phcdetail.middleName &&
            this.phcdetail.lastName;
          if (this.phcEmployeeName === null) {
            this.phcEmployeeName == '';
          }

          this.svcLocalstorage.phcDetail = data;
        },
        (err: any) => {
          this.loading = false;
        }
      );
    }
  }

  drlist: any = [];
  imgavailable;
  drdec: any;
  getdronlineList(doctorID: any) {
    // this.drlist=[]
    this.loading = true;
    this.userObjFromToken = this.svcLocalstorage.GetData(
      environment.AuthTokenKeyLSKey
    );
    if (this.userObjFromToken)
      this.SvcPhcPatient.getonlinedrlist(doctorID).subscribe(
        (data) => {
          this.loading = false;
          this.drlist = data;
          this.imgavailable = environment.ImagesHeader;
          this.istrue = false;

          //  this.filtered = this.drlist.filter(t=>t.value ==this.selectedObject);
          // for(let i=0; i<this.drlist.length; i++){
          //   let dr = this.drlist[i]
          //   if(dr.doctorFName === sdsdfgfd){

          //   }
          //   this.drdec.push(dr.doctorFName)
          // }
        },
        (err: any) => {
          this.drlist = [];
          // if(err.status==404)
          // {
          //   this._sweetAlert.showAlert('No Doctors are logged into the system !','info')
          // }
        }
      );
  }

  filtered: [];
  deshow: any;
  detaildoctorFName: any;
  detaildoctorspeciality: any;
  detaildoctorphoto: any;
  onOptionsSelected(event: any) {
    this.istrue = true;
    this.filtered = event.value;
    let a = this.drlist;

    for (let i = 0; i < a.length; i++) {
      let dr = this.drlist[i];
      if (this.filtered == dr.doctorID) {
        this.detaildoctorFName = this.drlist[i].doctorFName;
        this.detaildoctorspeciality = this.drlist[i].specialty;
        this.detaildoctorphoto = this.drlist[i].photo;
        break;
      }
    }
  }
  gender: any = [];
  getTypeMasterGender() {
    this.userObjFromToken = this.svcLocalstorage.GetData(
      environment.AuthTokenKeyLSKey
    );
    if (this.userObjFromToken)
      this.SvcPhcPatient.setGenderMaster().subscribe((data) => {
        this.gender.push(data);
      });
  }
  // onTableDataChange(event: any) {
  //   this.page = event;
  //   this.todayspatient();
  // }
  // onTableSizeChange(event: any): void {
  //   this.tableSize = event.target.value;
  //   this.page = 1;
  //   this.todayspatient();
  // }

  // genderseacrh: any = []
  // getTypeMasterGenderSearch() {
  //   this.userObjFromToken = this.svcLocalstorage.GetData(environment.AuthTokenKeyLSKey);
  //   if (this.userObjFromToken)
  //     this.SvcPhcPatient.setGenderMaster().subscribe(data => {
  //       this.genderseacrh.push(data)
  //     });
  // }
  // searchedKeyword1() {
  //   if (this.searchedKeyword) {
  //     return this.searchedKeyword.trim();
  //   } else return '';
  // }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  advcanccustom: any;
  getcustomeadvabcesearch(phcid) {
    (this._sweetAlert.phcHistoryForm.contact =
      this.advanceform.value.contactNo),
      (this._sweetAlert.phcHistoryForm.phcid = this.advanceform.value.phcid),
      (this._sweetAlert.phcHistoryForm.patientname =
        this.advanceform.value.patientName),
      (this._sweetAlert.phcHistoryForm.patientid =
        this.advanceform.value.patientUID),
      (this._sweetAlert.phcHistoryForm.dateOfBirth =
        this.advanceform.value.dateOfBirth),
      (this._sweetAlert.phcHistoryForm.gender =
        this.advanceform.value.genderId);

    this._sweetAlert.pageIndex = 0;

    this.afterClick = true;
    this.click = false;
    let data: any = {};
    if (
      this.svcLocalstorage.GetData(environment.PhcID) != null &&
      this.svcLocalstorage.GetData(environment.PhcID) != ''
    ) {
      // data.phcid = this.svcLocalstorage.GetData(environment.PhcID);
      //// if phc searach by any filed phcid should pe zero
      data.phcid = this.advanceform.value.phcid;
    } else {
      data.phcid = this.advanceform.value.phcid;
    }
    if (
      this.advanceform.get('patientName').value != null &&
      this.advanceform.get('patientName').value != ''
    ) {
      data.patientName = this.advanceform.get('patientName').value;
    } else {
      data.patientName = '';
    }
    if (
      this.advanceform.get('patientUID').value != null &&
      this.advanceform.get('patientUID').value != ''
    ) {
      data.patientUID = this.advanceform.get('patientUID').value;
    } else {
      data.patientUID = 0;
    }
    if (
      this.advanceform.get('dateOfRegistration').value != null &&
      this.advanceform.get('dateOfRegistration').value != ''
    ) {
      data.dateOfRegistration =
        this.advanceform.get('dateOfRegistration').value;
    } else {
      data.dateOfRegistration = null;
    }
    if (
      this.advanceform.get('contactNo').value != null &&
      this.advanceform.get('contactNo').value != ''
    ) {
      data.contactNo = this.advanceform.get('contactNo').value;
    } else {
      data.contactNo = '';
    }
    if (
      this.advanceform.get('dateOfBirth').value != null &&
      this.advanceform.get('dateOfBirth').value != ''
    ) {
      data.dateOfBirth = new Date(this.advanceform.get('dateOfBirth').value);
    } else {
      data.dateOfBirth = null;
    }

    if (
      this.advanceform.get('genderId').value != null &&
      this.advanceform.get('genderId').value != ''
    ) {
      data.genderId = this.advanceform.get('genderId').value;
    } else {
      data.genderId = 0;
    }
    if (
      data.patientName == '' &&
      data.patientUID == 0 &&
      data.dateOfBirth == null &&
      data.dateOfRegistration == null &&
      data.genderId == 0 &&
      data.contactNo == ''
    ) {
      this.getsearchpatient(phcid);
    } else {
      this.userObjFromToken = this.svcLocalstorage.GetData(
        environment.AuthTokenKeyLSKey
      );
      if (this.userObjFromToken) {
        this.loading = true;
        this.SvcPhcPatient.getAdvancessearch(data).subscribe(
          (data: any) => {
            this.loading = false;
            //       this.afterClick=false;
            // this.click=true;
            this.searchpatient = [];
            this.searchpatient.push(data);
            this._sweetAlert.advanceHistoryArray = data;
            this.dataSource = new MatTableDataSource(this.searchpatient[0]);

            this.dataSource.paginator = this.paginator;
            this.dataSource.paginator.pageIndex = 0;
            this.dataSource.sort = this.sort;
            //
          },
          (err: any) => {
            this.loading = false;
          }
        );
      }
    }
  }

  getDiffYears(startDate, endDate) {
    return Math.ceil(
      Math.abs(startDate - endDate) / (1000 * 60 * 60 * 24 * 365)
    );
  }
  onsubmitAdvanceClick() {
    console.log(this.advanceform.value, 'form');

    this.getcustomeadvabcesearch(0);
  }
  onclickname(patientId: any, phcid: any) {
    let qs: IQueryString = {
      patientId: patientId,
      phcId: this.svcLocalstorage.GetData(environment.PhcID),
    };
    let strEncText = EncryptData(JSON.stringify(qs));
    this.router.navigate(['/case-details'], {
      queryParams: { src: strEncText },
    });

    // phcid = this.svcLocalstorage.GetData(environment.PhcID)
    // this.router.navigate(["/case-details"], { queryParams: { patientId, phcid } });
  }
  refreshClick() {
    this.loading = true;
    this.TodaysPatientCount(this.svcLocalstorage.GetData(environment.PhcID));
    this.getConsultationPatient(
      this.svcLocalstorage.GetData(environment.PhcID)
    );
    this.getTodaysPatient(this.svcLocalstorage.GetData(environment.PhcID));
    // this.getyesterday(this.svcLocalstorage.GetData(environment.PhcID));
    //this.getsearchpatient(this.svcLocalstorage.GetData(environment.PhcID));
    // this.getavailableDoctor(1)
    //this.getPhcDetail(this.svcLocalstorage.GetData(environment.UserId));
    //this.getdronlineList(this.svcLocalstorage.GetData(environment.BlockID));

    //   this.getcustomeadvabcesearch()

    this.PHCNamefunction();
    setTimeout(() => {
      this.loading = false;
    }, 2000);
    //window.location.reload();
  }
  imgVideoCall = '../../../../assets/Images/smaill-icon/black-video-icon.png';
  patientWailtListQueue: any;
  errorListQueue: any;
  pateintWaitList(phcid) {
    this.userObjFromToken = this.svcLocalstorage.GetData(
      environment.AuthTokenKeyLSKey
    );
    if (this.userObjFromToken) {
      this.loading = true;
      this.SvcPhcPatient.GetPatientQueue(phcid).subscribe(
        (data) => {
          this.patientWailtListQueue = data;
          this.loading = false;
        },
        (error) => {
          this.loading = false;
          this.errorListQueue = error;
        }
      );
    }
  }
  changeQueueList: any;
  changeQueue(patientCaseID) {
    this.userObjFromToken = this.svcLocalstorage.GetData(
      environment.AuthTokenKeyLSKey
    );
    if (this.userObjFromToken) {
      this.SvcPhcPatient.RemovePatientFromDoctorsQueue(patientCaseID).subscribe(
        (data) => {
          let qs: IQueryString = {
            patientId: data['patientID'],
          };
          let strEncText = EncryptData(JSON.stringify(qs));

          this.router.navigate(['case-details'], {
            queryParams: { src: strEncText },
          });
          this.changeQueueList = data;
        }
      );
    }
  }
  disabled: any;
  counter: number;
  counterMessage: string;
  Refreshhidden: any = false;
  refreshButton() {
    this.loading = true;
    this.disabled = true;
    this.Refreshhidden = true;

    this.counterMessage = 'Please Wait...';
    // //this.ngOnInit();
    if (localStorage.getItem(environment.pateintWaitRefereshtime) === null) {
      //...
      //add time
      this.counter = 180;
      localStorage.setItem(
        environment.pateintWaitRefereshtime,
        this.counter.toString()
      );
    } else {
      var numDate = localStorage.getItem(environment.pateintWaitRefereshtime);

      this.counter = parseInt(numDate);
      if (this.counter < 1) {
        this.counter = 180;
        localStorage.setItem(
          environment.pateintWaitRefereshtime,
          this.counter.toString()
        );
      }
    }

    this.pateintWaitList(this.svcLocalstorage.GetData(environment.PhcID));
    setTimeout(() => {
      this.loading = false;
    }, 2000);

    var refreshIntervalId = setInterval(() => {
      this.counter = this.counter - 1;
      this.counterMessage = 'Please Wait...' + this.counter.toString() + ' ';
      localStorage.setItem(
        environment.pateintWaitRefereshtime,
        this.counter.toString()
      );
      if (this.counter == 0) {
        this.Refreshhidden = false;
        this.disabled = false;
        this.counterMessage = '';
        clearInterval(refreshIntervalId);
      }
    }, 1000);
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
  isQueueTabActive: boolean = false;

  menu: any;
  MenuClick(tabName: string) {
    this.menu = tabName;
    if (tabName == 'queue' && this.isQueueTabActive == false) {
      this.isQueueTabActive = true;
      this.pateintWaitList(this.svcLocalstorage.GetData(environment.PhcID));
    } else if (tabName != 'queue') {
      this.isQueueTabActive = false;
      switch (tabName) {
        case 'account': {
          this.getPhcDetail(this.svcLocalstorage.GetData(environment.UserId));
          // this.getPhcDetail(this.svcLocalstorage.GetData(environment.UserId));
          break;
        }
        case 'history': {
          this.searchpatient = [];
          this.yesterdayPatient = [];
          this.getyesterday(this.svcLocalstorage.GetData(environment.PhcID));

          break;
        }
        case 'dashboard': {
          this.TodaysPatientCount(
            this.svcLocalstorage.GetData(environment.PhcID)
          );
          this.getConsultationPatient(
            this.svcLocalstorage.GetData(environment.PhcID)
          );
          this.getTodaysPatient(
            this.svcLocalstorage.GetData(environment.PhcID)
          );
        }
      }
    }

    switch (tabName) {
      case 'dashboard': {
        this._sweetAlert.openTabValue = '1';
        break;
      }
      case 'account': {
        this._sweetAlert.openTabValue = '2';
        break;
      }
      case 'history': {
        this._sweetAlert.openTabValue = '3';
        break;
      }
      case 'queue': {
        this._sweetAlert.openTabValue = '4';
        break;
      }
    }
  }
  RefreshpateintWaitList() {
    this.pateintWaitList(this.svcLocalstorage.GetData(environment.PhcID));
  }
  autoRefresh() {
    setInterval(() => {
      this.pateintWaitList(this.svcLocalstorage.GetData(environment.PhcID));
    }, 30000);
  }

  /////////////screen saver start //////////////////////

  idleTime = 60000; // 1 minute in milliseconds
  idleTimer: any;
  showScreenSaver = false;

  @HostListener('window:mousemove')
  @HostListener('window:keypress')
  @HostListener('window:KeyboardEvent')
  @HostListener('click', ['$event.target'])
  /*
   uncomment to start screensaver
  resetIdleTimer() {
    clearTimeout(this.idleTimer);
    if(this.screenSavertimer)
    {
      clearInterval(this.screenSavertimer)
    }
    if(this.showScreenSaver)
    {
        this.backtoHistoryPage() 
        
    }
    this.startIdleTimer();
    this.showScreenSaver = false;
  } 
  async startIdleTimer() {
    this.idleTimer = setTimeout(() => {
      if (this.menu == 'history' && this.isAdvancePatient) {
        // this.genderdropdown.nativeElement.blur()
        this.phcdropdown.nativeElement.blur();
        this.dateOfRegistrationdropdown.nativeElement.blur();
        this.dateofbirthdropdown.nativeElement.blur();
      }

      this._sweetAlert.closeSelectDropdownSubject.next(true);
      // this.closedropdown()

      setTimeout(() => {
      this.showScreenSaver = true
      this.startScreenSaver()
      }, 300);

      /////////used settimeout so that all the dropdown close first/////////////
      // this.modalService.open(ScreenSaverComponent)
    }, this.idleTime);
  }
  */
  callReceived() {
    this.svcNotification.onCallReceived.subscribe(
      (message: INotificationResponse) => {
        if (message) {
          clearTimeout(this.idleTimer);
          clearInterval(this.screenSavertimer);
          this.showScreenSaver = false;
        }
      }
    );

    this._sweetAlert.callNotReceived.subscribe((res: any) => {
      if (res == true) {
        // this.startIdleTimer();
      }
    });
  }

  @ViewChild('phcdropdown') phcdropdown: ElementRef;
  @ViewChild('dateOfRegistrationdropdown')
  dateOfRegistrationdropdown: ElementRef;
  @ViewChild('dateofbirthdropdown') dateofbirthdropdown: ElementRef;
  @ViewChild('genderdropdown') genderdropdown: ElementRef;

  imageArray: any = [
    '../../assets/screensaver/screensaver.png',
    '../../assets/screensaver/screensaver1.png',
    '../../assets/screensaver/screensaver2.png',
    '../../assets/screensaver/screensaver3.png',
    '../../assets/screensaver/screensaver4.png',
    '../../assets/screensaver/screensaver5.png',
    '../../assets/screensaver/screensaver6.png',
    '../../assets/screensaver/screensaver7.png',
    '../../assets/screensaver/screensaver8.png',
  ];

  // @HostListener('window:resize')
  // getWindowHeight() {
  //   return window.innerHeight;
  // }
  screensaverimg = this.imageArray[0];
  index = 0;
  screenSavertimer: any;

  // startScreenSaver()
  // {
  //   this.screenSavertimer=setInterval(()=>{
  //   this.index++
  //     this.screensaverimg=this.imageArray[this.index]
  //     if(this.index==7)
  //     {
  //       this.index=0
  //     }
  //   },5000)
  // }

  backtoHistoryPage() {
    this.loading = true;
    var data = this._sweetAlert.returnDataToHistoryPHC();
    this.openTabValue = data.openTabValue;
    this.yesterdayPatient = data.yesterdayHostoryArray;

    if (data.historyType == 'yesterdayData') {
      this.loading = false;
      this.getyesterday(this.svcLocalstorage.GetData(environment.PhcID));
    } else {
      this.isYesterdayPatient = false;
      this.isAdvancePatient = true;
      this.issearchPatients = false;
      this.isadvancesearchPatients = true;
      this.serachImg = true;

      this.advanceform.patchValue({
        phcid: data.phcHistoryForm.phcid,
        patientName: data.phcHistoryForm.patientname,
        patientUID: data.phcHistoryForm.patientid,
        dateOfRegistration: data.phcHistoryForm.dateofRegistration,
        contactNo: data.phcHistoryForm.contact,
        dateOfBirth: data.phcHistoryForm.dateOfBirth,
        genderId: data.phcHistoryForm.gender,
      });

      setTimeout(() => {
        // alert('set')
        this.dataSource = new MatTableDataSource(data.advanceHistoryArray);

        this.dataSource.sort = this.sort;
        this.paginator.pageIndex = this._sweetAlert.pageIndex;
        this.dataSource.paginator = this.paginator;
        this.loading = false;
      }, 500);
    }

    if (data.openTabValue == '4') {
      this.MenuClick('queue');
    }
  }

  pageChange(event: any) {
    this._sweetAlert.pageIndex = event.pageIndex;
  }
}
