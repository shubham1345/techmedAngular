import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { SvclocalstorageService } from 'src/app/services/services/svclocalstorage.service';
import { environment } from 'src/environments/environment';
import { svc_dashboardService } from 'src/app/services/services/svc_dashboard.service';
import { DatePipe, formatCurrency } from '@angular/common';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { svc_HolidayCalenderService } from 'src/app/services/services/svc_HolidayCalender.service';
import { SvcPhcGetPatientService } from 'src/app/services/services/svc-phc-get-patient.service';
import { svc_PHCservice } from 'src/app/services/services/svc_PHC.service';
import { Svc_MasterService } from 'src/app/services/services/svc_master.service';
import { HttpParams } from '@angular/common/http';
import { Svc_getdoctordetailService } from 'src/app/services/services/svc_getdoctordetail.service';
import { Router } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import { SvcAuthenticationService } from 'src/app/services/services/svc-authentication.service';
import { map, Observable, startWith } from 'rxjs';
import { MdbModalRef, MdbModalService } from 'mdb-angular-ui-kit/modal';

import { RegisterSuccesfulPopupComponent } from 'src/app/component/shared-component/register-succesful-popup/register-succesful-popup.component';
import { ngxLoadingAnimationTypes } from 'ngx-loading';
import { SvcmainAuthserviceService } from 'src/app/services/services/svcmain-authservice.service';

@Component({
  selector: 'app-doctor-registration',
  templateUrl: './doctor-registration.component.html',
  styleUrls: ['./doctor-registration.component.css'],
})
export class DoctorRegistrationComponent implements OnInit {
  public ngxLoadingAnimationTypes = ngxLoadingAnimationTypes;
  dropdownList = [];
  selectedItems = [];
  dropdownSettings = {};
  sucessRegister: MdbModalRef<RegisterSuccesfulPopupComponent> | null = null;
  loading = false;
  public config = {
    animationType: ngxLoadingAnimationTypes.none,
    backdropBorderRadius: '3px',
  };
  isdoctorregistrationInput: boolean = false;
  isdoctorregistrationselected: boolean = true;
  isthisclickInput: boolean = false;
  isthisselectedInput: boolean = true;

  imageUrl = environment.ImagesHeader;
  fname = '';
  mname = '';
  lname = '';
  search = '';
  dob = '';
  sex = '';
  address = '';
  mci = '';
  email = '';
  phone = '';
  specialization = '';
  qualification = '';
  govtidtype = '';
  govtidno = '';
  profile = '';
  signature = '';
  maxDate = new Date();
  year = 0;
  month = 0;
  userObjFromToken: any;
  // loading = false;
  error1 = false;
  err = false;
  EmployeeNameset = '';
  UserId = 0;
  isShown = false;
  getphcdetail: any = [];
  ProfileDP = '';
  isAdharCard = true;
  isdrivinglicense: any;
  isPanCard: any;
  isPassport: any;
  isElectionId: any;
  isOthers: any;
  isABHAID: any;
  base64Image: string;
  doctorregistration = new FormGroup({
    firstname: new FormControl(''),
    specialization: new FormControl(''),
    middlename: new FormControl(''),
    subspecialization: new FormControl(''),
    lastname: new FormControl(''),
    pancardnumber: new FormControl(''),
    age: new FormControl(''),
    sex: new FormControl(''),
    bankname: new FormControl(''),
    address: new FormControl(''),
    branch: new FormControl(''),
    mciregistrationid: new FormControl(''),
    accountnumber: new FormControl(''),
    qualification: new FormControl(''),
    ifsccode: new FormControl(''),
    emailid: new FormControl(''),
    govtidtype: new FormControl(''),
    phonenumber: new FormControl(''),
    idnumber: new FormControl(''),
    profilePicture: new FormControl(''),
    signature: new FormControl(''),
    emailsearch: new FormControl(''),
  });
  router: any;

  constructor(
    private svcLocalstorage: SvclocalstorageService,
    private Svc_dashboardService: svc_dashboardService,
    public datepipe: DatePipe,
    private SvcPhcPatient: SvcPhcGetPatientService,
    private svc_masterServices: Svc_MasterService,
    private Svc_PHCservice: svc_PHCservice,
    private fb: FormBuilder,
    private Svc_HolidayCalenderService: svc_HolidayCalenderService,
    private Svc_getdoctordetailService: Svc_getdoctordetailService,
    private domSanitizer: DomSanitizer,
    private svcAuth: SvcAuthenticationService,
    private _sweetAlert: SvcmainAuthserviceService
  ) {
    //////////used to stop loader when their is error of 401 and 403////

    this._sweetAlert.getLoader().subscribe((res: any) => {
      this.loading = res;
      console.log('med', this.loading);
    });

    /////////////////////////////////////////////////////////////
  }
  filteredOptions: Observable<string[]>;
  ngOnInit(): void {
    this.GetAllSpecialization();
    this.getTypeMasterIdproof();
    this.GetAllDoctorEmails();

    this.doctorregistration = this.fb.group({
      firstname: ['', [Validators.required]],
      specialization: ['', [Validators.required]],
      middlename: [''],
      subspecialization: [
        { value: null, disabled: true },
        [Validators.required],
      ],
      lastname: ['', [Validators.required]],
      pancardnumber: ['', [Validators.required]],
      age: [''],
      sex: ['2', [Validators.required]],
      bankname: ['', [Validators.required]],
      address: ['', [Validators.required]],
      branch: ['', [Validators.required]],
      mciregistrationid: ['', [Validators.required]],
      accountnumber: ['', [Validators.required]],
      qualification: ['', [Validators.required]],
      ifsccode: ['', [Validators.required]],
      emailid: ['', [Validators.email, Validators.required]],
      govtidtype: [''],
      phonenumber: ['', [Validators.required]],
      idnumber: [''],
      profilePicture: ['', [Validators.required]],
      signature: ['', [Validators.required]],
      emailsearch: [''],
    });

    this.filteredOptions = this.doctorregistration
      .get('emailsearch')
      .valueChanges.pipe(
        startWith(''),
        map((value) => this._filter(value || ''))
      );
  }
  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.emailSearchValue.filter((option) =>
      option.toLowerCase().includes(filterValue)
    );
  }
  // phc_Registration(){
  //   this.routerLink.nav(['PHC-Registration'])
  // }
  // Doctor_registration(){
  //   this.router.navigate(['Doctor-Registration'])
  // }
  phcRegister() {
    this.router.navigate(['PHC-Registration']);
  }

  ListSpecialization: any;
  GetAllSpecialization() {
    this.userObjFromToken = this.svcLocalstorage.GetData(
      environment.AuthTokenKeyLSKey
    );
    if (this.userObjFromToken) {
      this.svc_masterServices.GetAllSpecialization().subscribe((data: any) => {
        this.ListSpecialization = data;
        console.log(this.ListSpecialization, 'specialization');
      });
    }
  }
  subspecializationlist: any;

  openDropdown($event) {
    this.Svc_getdoctordetailService.GetListOfSubSpecializationMaster(
      $event.target.value
    ).subscribe((data) => {
      this.doctorregistration.controls.subspecialization.enable();

      this.subspecializationlist = data;
    });
  }
  subSpecializationName: any;
  filters: [];
  isthistrue: boolean;
  subSpecializationList: any = [];
  subSpecialization: any = [];

  openFirstDropdown(event: any) {
    // debugger
    this.isthistrue = true;
    this.filters = event.target.value;
    this.subSpecializationId = parseInt(event.target.value);
    let a = this.subspecializationlist;
    for (let i = 0; i < a.length; i++) {
      let fltr = this.subspecializationlist[i];
      if (this.filters == fltr.id) {
        this.subSpecializationName =
          this.subspecializationlist[i].subSpecialization;
        break;
      }
      this.Svc_getdoctordetailService.GetListOfSubSpecializationMaster(
        this.filters
      ).subscribe((data) => {
        this.subSpecializationList = data;
        this.subSpecialization = this.subSpecialization.subSpecialization;
      });
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
  DataURIToBlob(dataURI: string) {
    const splitDataURI = dataURI.split(',');
    const byteString =
      splitDataURI[0].indexOf('base64') >= 0
        ? atob(splitDataURI[1])
        : decodeURI(splitDataURI[1]);
    const mimeString = splitDataURI[0].split(':')[1].split(';')[0];

    const ia = new Uint8Array(byteString.length);
    for (let i = 0; i < byteString.length; i++)
      ia[i] = byteString.charCodeAt(i);

    return new Blob([ia], { type: mimeString });
  }
  keyUpphone(event: any) {
    if (event.target.value == '') {
      this.iserrorPhone = false;
    }
  }
  UpdateDoctorRegistration() {
    let captureSignValue = this.srcs;
    let imgSignValue = captureSignValue?.split(',')[1];
    // let updateimgsignvalue = this.doctorregistration.controls['profilePicture'].touched ? imgSignValue:'';
    let updateimgsignvalue = imgSignValue ? imgSignValue : '';
    console.log(updateimgsignvalue, 'updateimgsignvalue');

    let captureValue = this.src;
    let imgValue = captureValue?.split(',')[1];
    let updateimgvalue = imgValue ? imgValue : '';
    console.log(imgValue);

    this.validateAllFormFields(this.doctorregistration);
    // debugger
    if (this.doctorregistration.value) {
      let myobj = {
        id: this.searchlist.id,
        blockID: 1,
        clusterId: 1,
        userId: 0,
        specializationId: this.doctorregistration.get('specialization').value,
        specialization: 'string',
        // "subSpecializationId": this.doctorregistration.controls['subspecialization'].touched? this.doctorregistration.get('subspecialization').value: this.searchlist.subSpecializationId,
        subSpecializationId: this.subSpecializationId,
        subSpecialization: 'string',
        mciid: this.doctorregistration.get('mciregistrationid').value,
        registrationNumber: 'NA',
        qualification: 'NA',
        designation: 'NA',
        phoneNumber: this.doctorregistration.get('phonenumber').value,
        digitalSignature:
          'R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==',
        digitalSignatureNewUpdate: updateimgvalue,
        panNo: '',
        bankName: '',
        branchName: '',
        accountNumber: '',
        ifsccode: '',
        updatedBy: 1,
        detailsDTO: {
          titleId: 1,
          firstName: this.doctorregistration.get('firstname').value,
          middleName: this.doctorregistration.get('middlename').value,
          lastName: this.doctorregistration.get('lastname').value,
          dob: this.doctorregistration.get('age').value,
          genderId: this.searchlist.detailsDTO.genderId,
          gender: 'string',
          emailId: this.doctorregistration.get('emailid').value,
          countryId: 1,
          stateId: 1,
          city: '',
          pinCode: '',
          photo: 'R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==',
          photoNewUpdate: updateimgsignvalue,
          idproofTypeId: this.doctorregistration.get('govtidtype').value,
          idproofNumber: this.doctorregistration.get('idnumber').value,
          address: this.doctorregistration.get('address').value,
        },
      };
      this.loading = true;
      console.log(this.subSpecializationId, ':this.subSpecializationId');

      console.log(myobj);
      JSON.stringify(myobj);
      console.log(JSON.stringify(myobj), 'json');

      this.Svc_getdoctordetailService.UpdateDoctorDetails(myobj).subscribe(
        (res: any) => {
          this.loading = false;
          Swal.fire({
            title: 'Success',
            text: `You submitted succesfully`,
            icon: 'success',
          }).then(function () {
            window.location.reload();
          });
          console.log(res, 'res');
        },
        (error) => {
          this.loading = false;

          if (error.status === 500) {
            this.loading = false;

            this.error1 = true;
          } else if (error.status === 401) {
            this.loading = false;

            this.error1 = true;
          } else if (error.status === 400) {
            this.err = true;
            this.loading = false;
          } else if ((error.errorMessage = true)) {
            this.iserrorPhone = true;
            Swal.fire({
              title: 'Already in system',
              text: `Mobile Number and Email is already in system!`,
              icon: 'warning',
            });
            //  alert(error.errorMessage);
          }
        }
      );
    } else {
      Swal.fire({
        title: ' Already Registered',
        text: `Something went wrong`,
        icon: 'warning',
      });
    }

    // else {
    //   Swal.fire({
    //     title: ' Already Registered',
    //     text: `Something went wrong!`,
    //     icon: 'warning',
    //   })
    // }
  }

  iserrorPhone: boolean;
  DoctorRegistration() {
    // const file = this.DataURIToBlob(this.url)
    // console.log(file)

    var age: any;
    let captureValue = this.url;
    let imgValue = captureValue?.split(',')[1];
    console.log(imgValue);

    let captureSignValue = this.urls;
    let imgSignValue = captureSignValue?.split(',')[1];
    console.log(imgSignValue);
    this.validateAllFormFields(this.doctorregistration);

    if (!this.doctorregistration.value.age) {
      age = '2000-01-01';
    } else {
      age = this.doctorregistration.value.age;
    }
    // debugger
    if (this.doctorregistration.value) {
      let myobj = {
        blockId: 1,
        clusterId: 1,
        specializationId: this.doctorregistration.get('specialization').value,
        subSpecializationId:
          this.doctorregistration.get('subspecialization').value,
        mciid: this.doctorregistration.get('mciregistrationid').value,
        registrationNumber: 'NA',
        qualification: 'NA',
        designation: 'NA',
        phoneNumber: this.doctorregistration.get('phonenumber').value,
        // "digitalSignature": "R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==",
        digitalSignature: imgSignValue,
        panNo: '',
        bankName: '',
        branchName: '',
        accountNumber: '',
        ifsccode: '',
        createdBy: 1,
        detailsDTO: {
          titleId: 1,
          firstName: this.doctorregistration.get('firstname').value,
          middleName: this.doctorregistration.get('middlename').value,
          lastName: this.doctorregistration.get('lastname').value,
          dob: age,
          genderId: this.doctorregistration.get('sex').value,
          emailId: this.doctorregistration.get('emailid').value,
          countryId: 1,
          stateId: 1,
          city: '',
          pinCode: '',
          address: this.doctorregistration.get('address').value,
          // "photo": "R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==",
          photo: imgValue,
          idproofTypeId:
            this.doctorregistration.get('govtidtype').value != ''
              ? this.doctorregistration.get('govtidtype').value
              : null,
          idproofNumber: this.doctorregistration.get('idnumber').value,
        },
      };
      this.loading = true;
      console.log(myobj);

      JSON.stringify(myobj);
      console.log(JSON.stringify(myobj));
      //debugger;
      this.Svc_getdoctordetailService.DoctorRegistration(myobj).subscribe(
        (res: any) => {
          (this.loading = false),
            Swal.fire({
              title: 'Success',
              text: `You submitted succesfully`,
              icon: 'success',
            }).then(function () {
              window.location.reload();
            });
          console.log(res, 'res');
        },
        (error) => {
          this.loading = false;

          if (error.status === 500) {
            this.loading = false;

            this.error1 = true;
          } else if (error.status === 401) {
            this.loading = false;

            this.error1 = true;
          } else if (error.status === 400) {
            this.err = true;
            this.loading = false;
          } else if (error.status === 404) {
            this.iserrorPhone = true;
            this.loading = false;
            Swal.fire({
              title: 'Already in system!',
              text: `Mobile Number and Email is already in system`,
              icon: 'warning',
            });
          }
          // else if (error.errorMessage = true) {
          //   this.iserrorPhone = true;
          //   Swal.fire({
          //     title: 'Already in system!',
          //     text: `Mobile Number and Email is already in system!`,
          //     icon: 'warning',
          //   })
          //   //  alert(error.errorMessage);
          // }
        }
      );
    } else {
      Swal.fire({
        title: ' Already Registered',
        text: `Something went wrong`,
        icon: 'warning',
      });
    }
  }
  ImageUpload($event) {}
  onlyphabetkey(event: any) {
    var charCode = event.which ? event.which : event.keyCode;
    // Only Numbers 0-9
    if (
      (charCode > 64 && charCode < 91) ||
      (charCode > 96 && charCode < 123) ||
      charCode == 32
    ) {
      return true;
    } else {
      return false;
    }
  }
  emailkey(event: any) {
    var charCode = event.which ? event.which : event.keyCode;
    // Only Numbers 0-9
    if (
      (charCode > 47 && charCode < 58) ||
      (charCode > 63 && charCode < 91) ||
      (charCode > 96 && charCode < 123) ||
      charCode == 46
    ) {
      return true;
    } else {
      return false;
    }
  }
  allcharkey(event: any) {
    var charCode = event.which ? event.which : event.keyCode;
    // Only Numbers 0-9
    if (
      (charCode > 43 && charCode < 57) ||
      (charCode > 64 && charCode < 91) ||
      (charCode > 96 && charCode < 123) ||
      charCode == 32
    ) {
      return true;
    } else {
      return false;
    }
  }
  onEnterKey(event: Event): void {
    event.preventDefault(); // Prevent form submission on Enter key press
  }
  onlyphabetskey(event: any) {
    var charCode = event.which ? event.which : event.keyCode;
    // Only Numbers 0-9
    if (
      (charCode > 43 && charCode < 46) ||
      (charCode > 46 && charCode < 58) ||
      (charCode > 64 && charCode < 91) ||
      (charCode > 96 && charCode < 123) ||
      charCode == 32
    ) {
      return true;
    } else {
      return false;
    }
  }
  keyPress(event: any) {
    var charCode = event.which ? event.which : event.keyCode;
    // Only Numbers 0-9
    if (charCode < 48 || charCode > 57) {
      event.preventDefault();
      return false;
    } else {
      return true;
    }
  }
  govermentIdTypes: any = [];
  getTypeMasterIdproof() {
    this.userObjFromToken = this.svcLocalstorage.GetData(
      environment.AuthTokenKeyLSKey
    );
    //console.log(this.userObjFromToken)
    if (this.userObjFromToken)
      this.SvcPhcPatient.setidProofMaster().subscribe((data) => {
        this.govermentIdTypes.push(data);
        //console.log(data)
      });
  }
  required = 'Aadhar Card';
  limitnumber: any;
  isrequired: any;
  lengthcheck = '12';
  minlength: any;
  to: any;
  showmessage: boolean;
  allshowmessage: boolean;
  chnageGovernmentId(e: any) {
    // if(e.target.value = "5"){
    //   this.minlength = "8"
    //   this.to = "to"
    // }
    this.isABHAID = false;
    this.isAdharCard = false;
    this.isdrivinglicense = false;
    this.isPanCard = false;
    this.isPassport = false;
    this.isElectionId = false;
    this.isOthers = false;
    this.showmessage = false;
    this.allshowmessage = true;
    if (e.target.value == '1') {
      this.isAdharCard = true;
      this.required = 'Aadhar Card';
      this.lengthcheck = '12';
    } else if (e.target.value == '2') {
      this.isdrivinglicense = true;
      this.required = 'Driving License';
      this.lengthcheck = '18';
    } else if (e.target.value == '3') {
      this.isPanCard = true;
      this.required = 'Pan Card';
      this.lengthcheck = '10';
    } else if (e.target.value == '4') {
      this.isPassport = true;
      this.required = 'Passport';
      this.lengthcheck = '8';
    } else if (e.target.value == '5') {
      this.showmessage = true;
      this.isElectionId = true;
      this.required = 'Election ID';
      this.lengthcheck = '16';
      this.minlength = '8';
      this.to = 'to';
      this.allshowmessage = false;
    } else if (e.target.value == '7') {
      this.isABHAID = true;
      this.required = 'ABHA ID';
      this.lengthcheck = '14';
    } else {
      this.isOthers = true;
      this.required = 'Others';
      this.lengthcheck = '20';
    }
  }
  onCancel(): void {
    this.doctorregistration.controls['idnumber'].reset();
    // this.doctorregistration.controls['idnumber'].setErrors(null);
    // this.registrationForm.controls['email'].setErrors(null);
  }
  // onselect(): void{
  //   this.doctorregistration.controls['subspecialization'].reset();
  // }

  readThis(inputValue: any): void {
    var file: File = inputValue.files[0];
    var myReader: FileReader = new FileReader();

    myReader.onloadend = (e) => {
      // this.base64Image = myReader.result;
      console.log(this.base64Image);
    };
    myReader.readAsDataURL(file);
  }
  onSignOut() {
    this.svcAuth.LogOutUser().subscribe({
      next: () => {
        this.svcLocalstorage.DeleteAll();

        this.router?.navigate(['/login']);

        this.checkSignOut();
      },
    });
  }
  isSignOut: boolean;
  checkSignOut() {
    if (this.svcLocalstorage.GetData(environment.AuthTokenKeyLSKey) != null) {
      this.isSignOut = true;
    } else {
      this.isSignOut = false;
    }
  }
  isnotshow: boolean;
  keyPressNumbers1(event: any) {
    var charCode = event.which ? event.which : event.keyCode;
    // Only Numbers 0-9
    if (charCode < 48 || charCode > 57) {
      event.preventDefault();
      return false;
    }
  }
  url = '../../../../assets/Doctor.jpg';
  urls = '../../../../assets/signature.png';

  onselectfile(e) {
    if (e.target.files) {
      var reader = new FileReader();
      reader.readAsDataURL(e.target.files[0]);
      reader.onload = (event: any) => {
        this.url = event.target.result;
        console.log(this.url);
      };
    }
  }

  onselectedfile(e) {
    if (e.target.files) {
      var reader = new FileReader();
      reader.readAsDataURL(e.target.files[0]);
      reader.onload = (event: any) => {
        this.urls = event.target.result;
        console.log(this.urls);
      };
    }
  }

  // patchValue(){
  //   this.doctorregistration.patchValue({firstname:this.emailSearchValue.firstname,specialization:this.emailSearchValue.specialization,middlename:this.emailSearchValue.middlename,subspecialization:this.emailSearchValue.subspecialization,lastname:this.emailSearchValue.lastname,age:this.emailSearchValue.age,sex:this.emailSearchValue.sex,address:this.emailSearchValue.address,mciregistrationid:this.emailSearchValue.mciregistrationid,qualification:this.emailSearchValue.qualification,emailid:this.emailSearchValue.emailid,govtidtype:this.emailSearchValue.govtidtype,phonenumber:this.emailSearchValue.phonenumber,idnumber:this.emailSearchValue.idnumber,profilePicture:this.emailSearchValue.profilePicture,signature:this.emailSearchValue.signature})
  // }
  onSearchEmailValue() {
    this.GetAllDoctorEmails();
  }
  emailSearchValue: any = [];
  GetAllDoctorEmails() {
    let obj: any = {};
    console.log(this.doctorregistration.get('emailsearch').value);

    obj.emailSearch = this.doctorregistration.get('emailsearch').value;
    this.userObjFromToken = this.svcLocalstorage.GetData(
      environment.AuthTokenKeyLSKey
    );
    if (this.userObjFromToken) {
      this.Svc_getdoctordetailService.GetAllDoctorEmails(obj).subscribe(
        (data) => {
          this.emailSearchValue = data;
          return this.emailSearchValue;
        }
      );
    }
  }
  searchlist: any = [];
  firstName: any;
  subSpecializationId: number;
  searchname($event) {
    // debugger
    this.Svc_getdoctordetailService.GetDoctorDetails1({
      userEmailID: $event,
    }).subscribe((data) => {
      this.searchlist = data;
      console.log(this.searchlist, 'search');
      console.log(
        this.imageUrl + '/' + this.searchlist.digitalSignature,
        'oooo'
      );
      console.log(
        this.imageUrl + '/' + this.searchlist.detailsDTO.photo,
        'profile'
      );
      this.src = this.imageUrl + '/' + this.searchlist.digitalSignature;
      this.srcs = this.imageUrl + '/' + this.searchlist.detailsDTO.photo;

      if (data) {
        this.isdoctorregistrationInput = true;
        this.isdoctorregistrationselected = false;
        this.isthisclickInput = true;
        this.isthisselectedInput = false;
        //debugger
        this.subSpecializationId = this.searchlist.subSpecializationId;
        this.Svc_getdoctordetailService.GetListOfSubSpecializationMaster(
          this.searchlist.specializationId
        ).subscribe((data) => {
          //debugger
          this.doctorregistration.controls.subspecialization.enable();

          this.subspecializationlist = data;
        });
        this.doctorregistration.patchValue({
          firstname: this.searchlist.detailsDTO.firstName,

          specialization: this.searchlist.specializationId,
          middlename: this.searchlist.detailsDTO.middleName,
          // subspecialization: this.searchlist.detailsDTO.subSpecializationId,
          lastname: this.searchlist.detailsDTO.lastName,
          // pancardnumber: this.searchlist.detailsDTO.firstName,
          age: this.searchlist.detailsDTO.dob,
          sex: this.searchlist.detailsDTO.gender,
          // bankname: this.searc/hlist.detailsDTO.firstName,
          address: this.searchlist.detailsDTO.address,
          // branch: this.searchlist.detailsDTO.firstName,
          mciregistrationid: this.searchlist.mciid,
          // accountnumber: this.searchlist.detailsDTO.firstName,
          subspecialization: this.searchlist.subSpecialization,
          // ifsccode: this.searchlist.detailsDTO.firstName,
          emailid: this.searchlist.detailsDTO.emailId,
          govtidtype: this.searchlist.detailsDTO.idproofTypeId,
          phonenumber: this.searchlist.phoneNumber,
          idnumber: this.searchlist.detailsDTO.idproofNumber,
          profilePicture:
            this.imageUrl + '/' + this.searchlist.detailsDTO.photo,
          signature: this.imageUrl + '/' + this.searchlist.digitalSignature,
        });
      }
    });
  }
  src = '{{ imageUrl }}{{searchlist.digitalSignature}}';
  updatesignature(e) {
    // debugger
    if (e.target.files) {
      var reader = new FileReader();
      reader.readAsDataURL(e.target.files[0]);
      reader.onload = (event: any) => {
        this.src = event.target.result;
        console.log(this.src, 'mmm');
      };
    }
  }
  srcs = '{{ imageUrl }}{{searchlist.detailsDTO.photo}}';
  updateprofile(e) {
    //debugger
    if (e.target.files) {
      var reader = new FileReader();
      reader.readAsDataURL(e.target.files[0]);
      reader.onload = (event: any) => {
        this.srcs = event.target.result;
        console.log(this.srcs, 'nnn');
      };
    }
  }

  onSelection($event) {
    this.searchname($event.source.value);
  }

  // setValue(){
  //   this.doctorregistration.setValue({firstname:this.emailSearchValue.firstname,specialization:this.emailSearchValue.specialization,middlename:this.emailSearchValue.middlename,subspecialization:this.emailSearchValue.subspecialization,lastname:this.emailSearchValue.lastname,age:this.emailSearchValue.age,sex:this.emailSearchValue.sex,address:this.emailSearchValue.address,mciregistrationid:this.emailSearchValue.mciregistrationid,qualification:this.emailSearchValue.qualification,emailid:this.emailSearchValue.emailid,govtidtype:this.emailSearchValue.govtidtype,phonenumber:this.emailSearchValue.phonenumber,idnumber:this.emailSearchValue.idnumber,profilePicture:this.emailSearchValue.profilePicture,signature:this.emailSearchValue.signature})
  // }
  handleClear() {
    this.isdoctorregistrationInput = false;
    this.isdoctorregistrationselected = true;
    this.isthisclickInput = false;
    this.isthisselectedInput = true;
    this.search = ' ';
    //   this.fname = '';
    //  this. mname = '';
    //  this. lname = '';
    //   this.search = '';
    //   this.dob = '';
    //   this.sex = '';
    //   this.address = '';
    // this.  mci = '';
    //  this. email = '';
    //  this. phone = '';
    //   this.specialization = '';
    //  this. qualification = '';
    //  this. govtidtype = '';
    //  this. govtidno = '';
    //  this. profile = '';;
    //  this. signature = ''
    // this.doctorregistration.reset();
    this.doctorregistration.patchValue({
      firstname: '',

      specialization: '',
      middlename: '',
      // subspecialization: this.searchlist.detailsDTO.subSpecializationId,
      lastname: '',
      // pancardnumber: this.searchlist.detailsDTO.firstName,
      age: '',
      sex: '',
      // bankname: this.searc/hlist.detailsDTO.firstName,
      address: '',
      // branch: this.searchlist.detailsDTO.firstName,
      mciregistrationid: '',
      // accountnumber: this.searchlist.detailsDTO.firstName,
      subspecialization: '',
      // ifsccode: this.searchlist.detailsDTO.firstName,
      emailid: '',
      govtidtype: '',
      phonenumber: '',
      idnumber: '',
      profilePicture: '',
      signature: '',
    });
  }
  click() {
    // this.isdoctorregistrationInput= false;
    // this.isdoctorregistrationselected = true;
    this.isthisclickInput = false;
    this.isthisselectedInput = true;
  }
}
