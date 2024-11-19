import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { MdbModalRef, MdbModalService } from 'mdb-angular-ui-kit/modal';
import { RegisterSuccesfulPopupComponent } from '../register-succesful-popup/register-succesful-popup.component';
import {
  WebcamImage,
  WebcamInitError,
  WebcamUtil,
  WebcamComponent,
} from 'ngx-webcam';
import { EMPTY, Observable, Subject } from 'rxjs';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { SvcPhcGetPatientService } from 'src/app/services/services/svc-phc-get-patient.service';
import { environment } from 'src/environments/environment';
import { SvclocalstorageService } from 'src/app/services/services/svclocalstorage.service';
import { HttpClient } from '@angular/common/http';
import { ngxLoadingAnimationTypes } from 'ngx-loading';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import * as dayjs from 'dayjs';
import { Svc_MasterService } from 'src/app/services/services/svc_master.service';
import { SvcmainAuthserviceService } from 'src/app/services/services/svcmain-authservice.service';

@Component({
  selector: 'app-account-register',
  templateUrl: './account-register.component.html',
  styleUrls: ['./account-register.component.css'],
})
export class AccountRegisterComponent
  implements OnInit, OnDestroy, AfterViewInit
{
  // @ViewChild(WebcamComponent) webcamComponent: WebcamComponent;

  maxDate = new Date();
  isWebCamEnable: boolean;
  public showWebcam = true;
  public allowCameraSwitch = true;
  public multipleWebcamsAvailable = false;
  public deviceId: string;
  takeasnap: boolean = false;
  retake: boolean = true;
  // gvt = this.gvtIDNumber.validator.length
  public videoOptions: MediaTrackConstraints = {
    // width: {ideal: 1024},
    // height: {ideal: 576}
  };
  public errors: WebcamInitError[] = [];

  // latest snapshot
  public webcamImage: WebcamImage = null;

  // webcam snapshot trigger
  private trigger: Subject<void> = new Subject<void>();
  // switch to next / previous / specific webcam; true/false: forward/backwards, string: deviceId
  private nextWebcam: Subject<boolean | string> = new Subject<
    boolean | string
  >();

  public birthdate: any;
  public age: any;

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
  WIDTH = 150;
  HEIGHT = 150;
  WIDTHC = 150;
  HEIGHTC = 150;

  err = false;
  error1 = false;
  @ViewChild('video')
  public video!: ElementRef;

  @ViewChild('canvas')
  public canvas!: ElementRef;

  captures: string[] = [];
  error: any;
  isCaptured!: boolean;

  isAdharCard = true;
  isdrivinglicense: any;
  isPanCard: any;
  isPassport: any;
  isElectionId: any;
  isOthers: any;
  isABHAID: any;
  isVideoOpen = true;
  isopenwebcamera = true;

  phcpatientform: FormGroup;
  emailRegex = new RegExp(
    /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i
  );

  @ViewChild('CloseSelectDropdown') CloseSelectDropdown: ElementRef;
  @ViewChild('maritialstatus') maritialstatus: ElementRef;
  @ViewChild('blockdropdown') blockdropdown: ElementRef;
  @ViewChild('countrydropdown') countrydropdown: ElementRef;
  @ViewChild('govtdropdown') govtdropdown: ElementRef;

  constructor(
    private modalService: MdbModalService,
    public modalRef: MdbModalRef<AccountRegisterComponent>,
    private fb: FormBuilder,
    private SvcPhcPatient: SvcPhcGetPatientService,
    private http: HttpClient,
    private svcLocalstorage: SvclocalstorageService,
    private _sweetAlert: SvcmainAuthserviceService,
    private svc_masterServices: Svc_MasterService
  ) {
    this.getTypeMasterCountry();
    this.getTypeMasterDistrict();
    this.getTypeMasterIdproof();
    this.getTypeMasterGender();
    this.getmaritalstatus();
    this.getTypeMasterCity();
    this.dateFrom = dayjs('10.30.2021');
    //today = new Date();
  }
  // ngAfterViewInit(): void {
  //   // this.removeCurrent();
  //   // this.setupDevices();
  //   // throw new Error('Method not implemented.');
  // }

  ngAfterViewInit(): void {
    // this.closedropdown()
  }

  ngOnDestroy(): void {
    this.trigger.unsubscribe();
  }

  ngOnInit(): void {
    this._sweetAlert.closeAllModalsOnLogout.subscribe((res: any) => {
      if (res == true) {
        this.close();
      }
    });

    this.retake = false;

    WebcamUtil.getAvailableVideoInputs().then(
      (mediaDevices: MediaDeviceInfo[]) => {
        this.multipleWebcamsAvailable = mediaDevices && mediaDevices.length > 1;
      }
    );
    this.phcpatientform = this.fb.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      gender: ['', [Validators.required]],
      dateofbirth: ['', [Validators.required]],
      email: ['', [Validators.pattern(this.emailRegex)]],
      mobilenumber: [''],
      address: ['', [Validators.required]],
      city: ['', [Validators.required]],
      district: ['', [Validators.required]],
      country: [''],
      postalCode: [''],
      governmentIdtype: [1, [Validators.required]],
      gvtIDNumber: ['', [Validators.minLength, Validators.maxLength]],
      patientId: [0],
      stateId: [1],
      guardianName: [''],
      //photo: ["captures"],
      phcid: [this.svcLocalstorage.GetData(environment.PhcID)],
      patientStatusId: [2],
      createdBy: [this.svcLocalstorage.GetData(environment.PhcID)],
      maritalStatusID: ['', [Validators.required]],
      // hiddenField: ['', [Validators.required]],
    });

    this.dropdownSettings = {
      singleSelection: true,
      idField: 'id',
      textField: 'districtName',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 3,
      allowSearchFilter: true,
    };
  }
  dateTo = dayjs();
  dateFrom;
  datePickerConfig = {
    format: 'YYYY-MM-DD',
    monthFormat: 'MM, YYYY',
    startDate: '01.01.2012',
    disableKeypress: true,
    yearFormat: 'YYYY',
  };
  validatorsChanged() {}
  onItemSelect(item: any) {}
  onSelectAll(items: any) {}
  get email() {
    return this.phcpatientform.get('email');
  }
  get gvtIDNumber() {
    return this.phcpatientform.get('gvtIDNumber');
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
    this.isAdharCard = false;
    this.isdrivinglicense = false;
    this.isPanCard = false;
    this.isPassport = false;
    this.isElectionId = false;
    this.isOthers = false;
    this.isABHAID = false;
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
  phoneLength: boolean;
  isPhoneShow: boolean;
  keyPressNumbers(event: any) {
    var charCode = event.which ? event.which : event.keyCode;
    // Only Numbers 0-9
    if (charCode < 48 || charCode > 57) {
      event.preventDefault();
      return false;
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

  keyUpphone(event: any) {
    if (event.target.value.length < 10) {
      this.iserrorPhone = false;
    }
    console.log(this.phoneNumber, 'phoneNumber');
    console.log(event.target.value, 'phoneNumber');
  }
  close(): void {
    const closeMessage = 'Modal closed';
    this.modalRef.close(closeMessage);
    this.showWebcam = true;
    // this.stream.getTracks().forEach(function (track) {
    //   track.stop();
    // });
    this.trigger.next();
    // this.retake = true
    // this.takeasnap = false
  }

  // async ngAfterViewInit() {
  //   await this.setupDevices();
  // }

  // async videoOff () {
  //   if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
  //     try {
  //       const stream = await navigator.mediaDevices.getUserMedia({
  //         video: true
  //       });
  //       if (stream) {

  //         //console.log(stream)
  //         this.video.nativeElement.pause()
  //         this.video.nativeElement.srcObject = stream;
  //         stream.getVideoTracks()[0].stop();
  //         // stream.id

  //         this.video.nativeElement.srcObject = "";
  //         this.error = null;
  //       }

  //       else {
  //         this.error = "You have no output video device";
  //       }
  //     } catch (e) {
  //       this.error = e;
  //     }
  //   }
  // }

  stream: any;
  async setupDevices() {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      this.loading = true;
      this.takeasnap = false;
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
        });
        this.stream = stream;
        this.takeasnap = true;
        if (stream) {
          this.loading = false;
          this.takeasnap = true;
          this.video.nativeElement.srcObject = stream;
          this.video.nativeElement.play();

          this.error = null;
        } else {
          this.loading = false;
          this.error = 'You have no output video device';
        }
      } catch (e) {
        this.takeasnap = true;
        this.loading = false;
        this.error = e;
      }
    }
  }

  capture() {
    this.showWebcam = false;

    this.drawImageToCanvas(this.video.nativeElement);

    this.captures.push(this.canvas.nativeElement.toDataURL('image/png'));
    this.isCaptured = true;
    //   this.videoOff()
  }

  removeCurrent() {
    //this.isCaptured = false;
    //this.showWebcam = false;
    this.openWebcam = false;
    this.webcamImage = null;
    this.showWebcam = !this.showWebcam;
    this.isCaptureValue = false;
    //this.setupDevices();
  }

  setPhoto(idx: number) {
    this.isCaptured = true;
    var image = new Image();
    image.src = this.captures[idx];

    this.drawImageToCanvas(image);
  }

  drawImageToCanvas(image: any) {
    this.canvas.nativeElement
      .getContext('2d')
      .drawImage(image, 0, 0, this.WIDTH, this.HEIGHT);
  }

  get f() {
    return this.phcpatientform.controls;
  }

  country: any = [];
  userObjFromToken: any;
  getTypeMasterCountry() {
    this.userObjFromToken = this.svcLocalstorage.GetData(
      environment.AuthTokenKeyLSKey
    );

    if (this.userObjFromToken)
      this.SvcPhcPatient.setCountryMaster().subscribe((data) => {
        this.country.push(data);
        this.phcpatientform.patchValue({
          country: data[0].id,
        });
        //console.log(data)
      });
  }
  district: any = [];
  districtList: any = [];
  getTypeMasterMarriedstatus() {
    this.userObjFromToken = this.svcLocalstorage.GetData(
      environment.AuthTokenKeyLSKey
    );

    if (this.userObjFromToken)
      this.SvcPhcPatient.setCountryMaster().subscribe((data) => {
        this.country.push(data);
        //console.log(data)
      });
  }

  getTypeMasterDistrict() {
    this.userObjFromToken = this.svcLocalstorage.GetData(
      environment.AuthTokenKeyLSKey
    );
    //console.log(this.userObjFromToken)
    if (this.userObjFromToken) {
      this.SvcPhcPatient.setdistrictMaster().subscribe((data) => {
        this.district.push(data);
      });
    }
  }
  divisionlist: any;
  openDropdown(event) {
    this.svc_masterServices
      .GetBlocksByDistrictID(event.target.value)
      .subscribe((data) => {
        this.phcpatientform.controls.Block;
        this.divisionlist = data;
      });
  }
  city: any = [];
  //  cityName:any = []
  getTypeMasterCity() {
    this.userObjFromToken = this.svcLocalstorage.GetData(
      environment.AuthTokenKeyLSKey
    );
    //console.log(this.userObjFromToken)
    if (this.userObjFromToken) {
      this.svc_masterServices.GetAllBlockMaster().subscribe((data) => {
        this.city.push(data);
      });
    }
  }

  // getTypeMasterDistrict() {

  //   this.userObjFromToken = this.svcLocalstorage.GetData(environment.AuthTokenKeyLSKey);
  //   //console.log(this.userObjFromToken)
  //   if (this.userObjFromToken)

  //     this.SvcPhcPatient.setdistrictMaster().subscribe((data: any) => {
  //       this.districtList = data.map((dist: any) => {
  //         return {
  //           id: dist.id,
  //           districtName: dist.districtName,
  //         }

  //       })

  //       this.districtList.map((row: any ) => {
  //         this.district.push({
  //           id: row.id,
  //           districtName: row.districtName,
  //         })
  //       })

  //       console.log(data, "hfdddsfdsds")
  //     });
  // }
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
  gender: any = [];
  getTypeMasterGender() {
    this.userObjFromToken = this.svcLocalstorage.GetData(
      environment.AuthTokenKeyLSKey
    );
    //console.log(this.userObjFromToken)
    if (this.userObjFromToken)
      this.SvcPhcPatient.setGenderMaster().subscribe((data) => {
        this.gender.push(data);
        //console.log(data)
      });
  }

  radiochangeHandler(event: any, value: any) {
    if (value.gender == 'Others') {
      // Swal.fire({
      //   allowOutsideClick: false,
      //   allowEscapeKey: false,
      //   allowEnterKey: false,

      //   icon: 'info',
      //   title: "Please confirm if you want to select Others",
      //   showDenyButton: true,
      //   confirmButtonText: 'Yes',
      //   // denyButtonText: `No`,

      Swal.fire('', 'Please confirm if you want to select Others.', 'success');
      // })
    }
  }

  isCaptureValue: boolean;
  iserrorPhone: boolean;
  phoneNumber: any;
  succesOpenModal() {
    if (this.phcpatientform.invalid) {
      this.phcpatientform.markAllAsTouched();
      alert('Please fill the form correctly');
      return;
    }

    this.validateAllFormFields(this.phcpatientform);
    let isvalidEmail = this.Emailvalidate(this.phcpatientform);
    if (isvalidEmail) {
      if (this.phcpatientform.value) {
        let obj: any = {};

        console.log(this.phoneNumber);

        let captureValue = this.imgurl;
        if (captureValue == null) {
          this.isCaptureValue = true;
        } else {
          this.isCaptureValue = false;
        }
        console.log(this.phcpatientform.get('mobilenumber').value.length == '');

        //let imgValue = captureValue[0].split(',')[1];
        let imgValue = captureValue?.split(',')[1];
        obj.firstName = this.phcpatientform.get('firstName').value;
        obj.lastName = this.phcpatientform.get('lastName').value;
        obj.patientId = this.phcpatientform.get('patientId').value;
        obj.phoneNumber = this.phcpatientform.get('mobilenumber').value;
        this.phoneNumber = obj.phoneNumber;
        console.log(this.phoneNumber, 'this.phoneNumber.......');

        obj.idproofId = this.phcpatientform.get('governmentIdtype').value;
        obj.idproofNumber = this._sweetAlert.decryptdata(
          this.phcpatientform.get('gvtIDNumber').value
        );
        obj.genderId = this.phcpatientform.get('gender').value;
        obj.address = this.phcpatientform.get('address').value;
        obj.countryId = +this.phcpatientform.get('country').value;
        obj.stateId = this.phcpatientform.get('stateId').value;
        //   obj.districtId = this.phcpatientform.get('district').value[0].id;
        obj.districtId = this.phcpatientform.get('district').value;
        obj.blockID = this.phcpatientform.get('city').value;
        obj.pinCode = this.phcpatientform.get('postalCode').value;
        obj.photo = imgValue;
        obj.dob = this.phcpatientform.get('dateofbirth').value;
        obj.emailId = this.phcpatientform.get('email').value;
        obj.mobileNo = this.phcpatientform.get('mobilenumber').value;
        obj.phcid = this.phcpatientform.get('phcid').value;
        obj.patientStatusId = this.phcpatientform.get('patientStatusId').value;
        obj.createdBy = this.phcpatientform.get('createdBy').value;
        obj.maritalStatusID = this.phcpatientform.get('maritalStatusID').value;
        obj.guardianName = this.phcpatientform.get('guardianName').value;
        obj.age = '0';
        //console.log(imgValue,"==============================imgvalue======")

        //let file = this.convertBase64ToBlobData(captureValue[0]);

        // chrome
        //   const blob = new Blob([file], { type: 'image/png' });
        // const url = window.URL.createObjectURL(blob);
        // const link = document.createElement('a');
        // link.href = url;
        // link.download = "";
        // link.click();

        if (obj.dob == null) {
          return false;
        } else {
          obj.dob = this.phcpatientform.get('dateofbirth').value;
        }

        //console.log(obj)
        this.loading = true;

        // this.SvcPhcPatient.SetregisterPatient(obj)
        this.SvcPhcPatient.SetregisterPatient(obj).subscribe(
          (res: any) => {
            let patientRegister = res.patientMasterDTO;

            this.svcLocalstorage.setPatientDetail(patientRegister);
            Swal.fire({
              title: 'Thank You',
              text: `Patient Registered Successfully`,
              icon: 'success',
            }).then((result) => {
              this.close();
              this.sucessRegister = this.modalService.open(
                RegisterSuccesfulPopupComponent,
                { data: { patientDetail: patientRegister } }
              );
            });
          },

          (error) => {
            console.log(error);

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
            } else if (error.status === 405) {
              this.loading = false;
              this.close();
              this._sweetAlert.sweetAlert(error.error, 'info');
            } else if (error.error.message == 'Patient already in system.') {
              this.iserrorPhone = true;
              // alert(error.errorMessage);
            }
          }
        );
      } else {
        alert('no submit');
      }
    }
  }

  downloadBase64Data = (base64String, fileName) => {
    let file = this.convertBase64ToFile(base64String, fileName);
    //console.log(file, "=================file=================")
  };

  convertBase64ToFile = (captureValue, fileName) => {
    let arr = captureValue.split(',');
    let mime = arr[0].match(/:(.*?);/)[1];
    let bstr = atob(arr[1]);
    let n = bstr.length;
    let uint8Array = new Uint8Array(n);
    while (n--) {
      uint8Array[n] = bstr.charCodeAt(n);
    }
    let file = new File([uint8Array], fileName, { type: mime });
    return file;
  };

  convertBase64ToBlobData(
    base64Data: string,
    contentType: string = 'image/png',
    sliceSize = 512
  ) {
    const byteCharacters = window.atob(base64Data);
    const byteArrays = [];

    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      const slice = byteCharacters.slice(offset, offset + sliceSize);

      const byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }

      const byteArray = new Uint8Array(byteNumbers);

      byteArrays.push(byteArray);
    }

    const blob = new Blob(byteArrays, { type: contentType });
    //console.log(blob)

    return blob;
  }

  OnUploadFile(image) {
    this.http
      .post('../../../../assets/file-upload/', image)
      .subscribe((res: any) => {
        //console.log(res)
      });
  }
  openwebcamera() {
    this.isVideoOpen = true;
    this.isopenwebcamera = false;
  }

  maritalstatus: any = [];
  getmaritalstatus() {
    this.userObjFromToken = this.svcLocalstorage.GetData(
      environment.AuthTokenKeyLSKey
    );
    //console.log(this.userObjFromToken)
    if (this.userObjFromToken)
      this.SvcPhcPatient.getmaritalstatus().subscribe((data) => {
        this.maritalstatus.push(data);
      });
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
  Emailvalidate(formGroup: FormGroup) {
    let isValid;
    Object.keys(formGroup.controls).forEach((field) => {
      if (field == 'email') {
        const control = formGroup.get(field);
        if (control.status == 'VALID') {
          isValid = true;
        } else if (control.value == '' && control.status == 'INVALID') {
          isValid = true;
        } else {
          isValid = false;
        }
      }
    });
    return isValid;
  }
  iswebp: boolean;
  @ViewChild('hiddenInput') hiddenInput: ElementRef;
  public triggerSnapshot(): void {
    // alert('capture');
    this.showWebcam = true;
    this.trigger.next();
    this.retake = true;
    this.takeasnap = false;
    //this.hiddenInput.nativeElement.value;
    this.phcpatientform.invalid == false;
  }
  openWebcam: boolean = true;

  //////////when click on take another///
  public toggleWebcam(): void {
    this.webcamImage = null;
    this.showWebcam = !this.showWebcam;
    this.takeasnap = false;
    // this.takeasnap = true;
    this.retake = false;
  }

  //////////when click open web cams////////
  public toggleWebcams(): void {
    //this.setupDevices();

    this.openWebcam = false;
    this.webcamImage = null;
    this.showWebcam = !this.showWebcam;
    this.isCaptureValue = false;
  }
  public handleInitError(error: WebcamInitError): void {
    console.info(error, 'errors');

    this.errors.push(error);
  }

  public showNextWebcam(directionOrDeviceId: boolean | string): void {
    // true => move forward through device
    // false => move backwards through devices
    // string => move to device with given deviceId
    this.nextWebcam.next(directionOrDeviceId);
  }
  imgurl: any;
  public handleImage(webcamImage: WebcamImage): void {
    this.webcamImage = webcamImage;
    this.imgurl = webcamImage.imageAsDataUrl;
  }

  public cameraWasSwitched(deviceId: string): void {
    this.takeasnap = true;
    this.deviceId = deviceId;
  }

  //imageTrigger: Subject<void> = new Subject<void>();

  public get triggerObservable(): Observable<void> {
    return this.trigger;
  }

  public get nextWebcamObservable(): Observable<boolean | string> {
    return this.nextWebcam.asObservable();
  }
  disableDate() {
    // return false;
  }
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
  // onlyphabestkey(event: any) {
  //   var charCode = (event.which) ? event.which : event.keyCode;
  //   // Only Numbers 0-9
  //   if ((charCode > 64 && charCode < 91) || (charCode > 96 && charCode < 123)) {
  //     return true;
  //   }
  //   else if (/^(\w+\s?)*\s*$/.test(event)) {
  //     return event.replace(/\s+$/, '');
  // }
  // return false;

  // }
  public CalculateAge(event): void {
    //  if(this.birthdate){
    //     var timeDiff = Math.abs(Date.now() - this.birthdate);

    //     this.age = Math.floor((timeDiff / (1000 * 3600 * 24))/365);

    // }

    if (this.birthdate != undefined) {
      var todayDate = new Date();
      var ageyear = todayDate.getFullYear() - this.birthdate.getFullYear();
      var agemonth = todayDate.getMonth() - this.birthdate.getMonth();
      var ageday = todayDate.getDate() - this.birthdate.getDate();

      if (agemonth <= 0) {
        ageyear--;
        agemonth = 12 + agemonth;
      }
      // if (nowDay < this.birthdate) {
      //   agemonth--;
      //   ageday = 30 + ageday;
      // }
      if (agemonth == 12) {
        ageyear = ageyear + 1;
        agemonth = 0;
      }
    }
    var yDisplay = ageyear > 0 ? ageyear + ' Years' : ' ';
    var mDisplay = agemonth > 0 ? agemonth + ' Months' : ' ';
    var dDisplay = agemonth >= 1 ? ' ' : ageday > 0 ? ageday + ' Days' : ' ';
    this.age = yDisplay + ' ' + mDisplay + ' ' + dDisplay;

    // this.age= (  ageyear + 'Years' + ' ' + agemonth + 'Months' + ' ' + ageday + 'Days');
  }

  closedropdown() {
    this._sweetAlert.closeSelectDropdownSubject.subscribe((res: any) => {
      if (res == true) {
        this.CloseSelectDropdown.nativeElement.blur();
        this.maritialstatus.nativeElement.blur();
        this.blockdropdown.nativeElement.blur();
        this.countrydropdown.nativeElement.blur();
        this.govtdropdown.nativeElement.blur();
      }
    });
  }
}
