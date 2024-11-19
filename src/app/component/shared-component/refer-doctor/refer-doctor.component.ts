import {
  Component,
  ElementRef,
  OnInit,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MdbModalRef, MdbModalService } from 'mdb-angular-ui-kit/modal';
import { SvcPhcGetPatientService } from 'src/app/services/services/svc-phc-get-patient.service';
import { SvclocalstorageService } from 'src/app/services/services/svclocalstorage.service';
import { VideoCallComponent } from '../video-call/video-call.component';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import { ngxLoadingAnimationTypes } from 'ngx-loading';
import { TwilioCallButtonComponent } from '../../twilio-component/components/twilio-call-button/twilio-call-button.component';
import { TwilioMiddlewareService } from '../../twilio-component/services/twilio-middleware.service';
import { Roles } from 'src/app/utils/imp-utils';
import { SvcmainAuthserviceService } from 'src/app/services/services/svcmain-authservice.service';
import { MatDialog } from '@angular/material/dialog';
declare var $: any;
@Component({
  selector: 'app-refer-doctor',
  templateUrl: './refer-doctor.component.html',
  styleUrls: ['./refer-doctor.component.css'],
})
export class ReferDoctorComponent implements OnInit {
  @ViewChild('errordialog') errordialog: TemplateRef<any>;
  @ViewChild('referdoctordropdown') referdoctordropdown: ElementRef;
  public ngxLoadingAnimationTypes = ngxLoadingAnimationTypes;
  loading = false;
  userType = this.svcLocalstorage.GetData(environment.Role);

  public config = {
    animationType: ngxLoadingAnimationTypes.none,
    backdropBorderRadius: '3px',
  };
  answerCall: MdbModalRef<VideoCallComponent> | null = null;
  constructor(
    public modalRef: MdbModalRef<ReferDoctorComponent>,
    private modalService: MdbModalService,
    private fb: FormBuilder,
    private svcPatientService: SvcPhcGetPatientService,
    private svcLocalstorage: SvclocalstorageService,
    private svcVideo: TwilioMiddlewareService,
    private _sweetAlert: SvcmainAuthserviceService,
    private router: Router,
    public dialog: MatDialog
  ) {
    //this.GetPatientQueue()
  }
  referdoctorform!: FormGroup;
  doctorList: any;
  phcDetail: any;
  patientDetail: any;
  userObjFromToken: any;
  beginCall: any;
  isCallStart: boolean;
  // caseDetails:any;
  ngOnInit(): void {
    // let beginVideoCall = new TwilioCallButtonComponent(this.svcVideo)
    // this.beginCall = beginVideoCall.beginVideoCall();
    // if(this.patientDetail[0].patientCase.specializationID == 1){
    //       this.patientDetail[0].patientCase.specializationID = "General Practice"
    //     }
    //     else if(this.patientDetail[0].patientCase.specializationID == 2){
    //       this.patientDetail[0].patientCase.specializationID = "Obstetrics and Gyne"

    this._sweetAlert.closeAllModalsOnLogout.subscribe((res: any) => {
      if (res == true) {
        this.close();
      }
    });

    console.log(this.patientDetail, 'pateint');
    this.isQueueNumber = false;
    this.referdoctorform = this.fb.group({
      referDoctor: ['', [Validators.required]],
    });
    //  this.caseDetails = this.svcStorage.caseDetails;
    //this.getDoctorList(this.svcStorage.GetData(environment.doctorID));
    if (this.userType == 'SysAdmin') {
      this.isAddPatient();
    } else {
      this.getselectedDoctorList(this.patientDetail[0].patientCase.id);
    }

    this.closedropdown();
  }
  errorDoctorListbusy: boolean;
  changeQueueList: any;
  failedData: any = [];
  openAnswercallpopup() {
    if (this.referdoctorform.valid) {
      this.loading = true;
      //this.answerCall = this.modalService.open(VideoCallComponent);
      // document.getElementById("v-pills-profile-tab").classList.add("active");
      // document.getElementById("v-pills-home-tab").classList.remove("active");
      // document.getElementById("v-pills-home").classList.remove("show");
      // document.getElementById("v-pills-home").classList.remove("active");
      // document.getElementById("v-pills-profile").classList.add("show");
      // document.getElementById("v-pills-profile").classList.add("active");
      var refParam = [];
      this.patientDetail.forEach((element: any) => {
        refParam.push({
          patientCaseID: element.patientCase.id,
          assignedDocterID: parseInt(this.referdoctorform.value.referDoctor),
          phcid: element.phcId,
        });
      });

      ////////2 api calls to refer the doctor //////////
      //this.svcPatientService.AddReferDoctorInPatientCase(refParam).subscribe({

      this.svcPatientService.AddPatientInDoctorsQueue(refParam).subscribe({
        next: (data: any) => {
          //this.close();

          this.loading = false;

          if (this.userType === 'SysAdmin') {
            this.close();

            // Swal.fire({
            //   title: 'Success',
            //   text: `Referred to doctor successfully`,
            //   icon: 'success',
            //   allowOutsideClick: false
            // }).then((result => {
            //   this.isCallStart = false;
            //   this._sweetAlert.setQueueUpdate(true)

            // }))

            this.failedData = [];
            data.filter((element: any) => {
              if (element.status == 'Fail') {
                console.log(element, 'element');

                this.failedData.push(element);
              }
            });

            if (this.failedData.length == 0) {
              Swal.fire({
                title: 'Success',
                text: `Referred to doctor successfully`,
                icon: 'success',
                allowOutsideClick: false,
              }).then((result) => {
                this.isCallStart = false;
                this._sweetAlert.setQueueUpdate(true);
              });
            } else {
              var dialogRef = this.dialog.open(this.errordialog, {
                disableClose: true,
              });
              dialogRef.afterClosed().subscribe(() => {
                this._sweetAlert.setQueueUpdate(true);
              });
            }
          } else if (this.userType === 'PHCUser') {
            this.close();

            Swal.fire({
              title: 'Success',
              text: `Please refer the queue management screen for calling the doctor`,
              icon: 'success',
            }).then((result) => {
              this.isCallStart = false;
              this._sweetAlert.openTabValue = '4';
              this.router.navigate(['/chc-center']);

              //   .then((result) => {
              //     setTimeout(() => {
              //     document.getElementById("v-pills-home-tab").classList.remove("active");
              //     document.getElementById("v-pills-home").classList.remove("show");
              //     document.getElementById("v-pills-home").classList.remove("active");
              //     document.getElementById("v-pills-patient-queue-tab").classList.add("active");
              //     document.getElementById("v-pills-patient-queue").classList.add("show");
              //     document.getElementById("v-pills-patient-queue").classList.add("active");
              //  }, 1000);
              //  })
              // this.svcPatientService.RemovePatientFromDoctorsQueue(this.patientDetail[0].patientCase.id).subscribe(data1 => {
              //   this.changeQueueList = data1
              //   console.log(this.changeQueueList)
              // })
            });
          }
          // let closeFn = this.close
          // setTimeout(closeFn, 3000)

          // Swal.fire({
          //   title: 'Success',
          //   text: `Referred to doctor successfully!`,
          //   icon: 'success',
          // }

          // ).then((result) => {
          //   debugger
          //   this.isCallStart = true;
          //   //this.router.navigate(['chc-center']);
          // })
        },
        error: (err) => {
          if (err.error.status == 'Fail') {
            // this.errorDoctorListbusy = err.error.message
            // this.isDoctorBusy = true
            // this.isDoctorBusyMessage=err.error.message;

            this._sweetAlert.sweetAlert(err.error.message, 'error');
            this.isdrnotAvailable = true;
            this.close();

            console.log(err.error.message);
          }
          this.loading = false;

          // Swal.fire({
          //   title: 'Warning',
          //   text: `Something went wrong!!`,
          //   icon: 'warning',
          // })
          console.log(err, 'err');
        },
      });
    }
    // this.loading = true

    // this.close()
  }
  close(): void {
    const closeMessage = 'Modal closed';
    this.modalRef.close(closeMessage);
  }

  buttonToggle: boolean = false;

  buttonClick(): void {
    this.buttonToggle = !this.buttonToggle;
  }

  // private getDoctorList(doctorID) {
  //   this.svcPatientService.getonlinedrlist(doctorID).subscribe(data => {
  //     this.doctorList = data;
  //   });
  // }
  errorDoctorList: boolean;
  isdrnotAvailable: any;
  isdrnotavailablequeue: any;
  isSendReferral: boolean;
  private getselectedDoctorList(doctorID) {
    this.svcPatientService.getselectedonlinedrlist(doctorID).subscribe(
      (data) => {
        // this.doctorList =  data;
        console.log(data, 'docs');

        if (data['status'] == 'Success' && data['statusID'] == 0) {
          this.doctorList = data['onlineDoctors'];
          this.isSendReferral = true;
        }
      },
      (error) => {
        console.log(error);
        this.errorDoctorList = error.error.message;

        if (error.error.status == 'Fail' && error.error.statusID == 1) {
          // this.errorDoctorList = error.error.message
          this.isdrnotAvailable = true;
        } else if (error.error.status == 'Fail' && error.error.statusID == 2) {
          // this.errorDoctorList = error.error.message
          this.isdrnotavailablequeue = false;
          this.isokaydoctor = true;
        } else {
          // this.errorDoctorList = error.error.message
          this.isdrnotavailablequeue = false;
          this.isokaydoctor = true;
        }
      }
    );
  }
  availablespecialization: any;
  valueChange() {
    // if (this.doctorList.message) {
    //   this.availablespecialization = true
    // }
  }
  isAddInPatient: boolean;
  availbleInQueue: boolean;
  isAvailSend: boolean;
  isDoctorBusy: boolean;
  isDoctorBusyMessage: string;

  isAddPatient() {
    this.GetPatientQueueByDoctors(
      this.patientDetail[0].patientCase.specializationID
    );

    this.availbleInQueue = true;
    this.isQueueNumber = false;
    this.isDoctorBusy = false;
    this.isDoctorBusyMessage = '';
  }
  isQueueNumber: boolean;
  addQueueref: any;
  isaddPatientQueueRemove: boolean;
  isokaydoctor: boolean;

  selectedDoctorId: any;
  addInqueue() {
    this.availbleInQueue = false;
    this.isAvailSend = false;
    this.isDoctorBusy = false;
    this.isDoctorBusyMessage = '';

    this.userObjFromToken = this.svcLocalstorage.GetData(
      environment.AuthTokenKeyLSKey
    );
    if (this.userObjFromToken) {
      if (this.selectedDoctorId) {
        this.loading = true;

        var refParam: any = [];
        this.patientDetail.forEach((element) => {
          refParam.push({
            patientCaseID: element.patientCase.id,
            assignedDocterID: parseInt(this.selectedDoctorId),
            phcid: element.phcId,
            status: '',
            message: '',
          });
        });

        this.svcPatientService.AddPatientInDoctorsQueue(refParam).subscribe(
          (data: any) => {
            this.close();
            this.addQueueref = data;
            // this.isQueueNumber = true
            this.availbleInQueue = false;
            this.isAvailSend = false;
            this.isDoctorBusy = false;
            this.isDoctorBusyMessage = '';
            this.loading = false;
            //   if (this.userType === "SysAdmin") {
            //     this.close();

            //     Swal.fire({
            //       title: 'Success',
            //       text: `Referred to doctor successfully`,
            //       icon: 'success',
            //     }).then((result => {
            //       this.isCallStart = false;
            //       this.router.navigate(['/SysAdmin-Header'])
            //       // this.svcPatientService.RemovePatientFromDoctorsQueue(this.patientDetail[0].patientCase.id).subscribe(data1 => {
            //       //   this.changeQueueList = data1
            //       //   console.log(this.changeQueueList)
            //       // })
            //     }))
            //   }

            //   else
            //   {

            //   Swal.fire({
            //     title: 'Success',
            //     text: `Please refer the queue management screen for calling the doctor`,
            //     icon: 'success',
            //   }).then((result => {
            //     this.isCallStart = false;
            //     this.router.navigate(['/chc-center']).then((result) => {
            //       setTimeout(() => {
            //       document.getElementById("v-pills-home-tab").classList.remove("active");
            //       document.getElementById("v-pills-home").classList.remove("show");
            //       document.getElementById("v-pills-home").classList.remove("active");
            //       document.getElementById("v-pills-patient-queue-tab").classList.add("active");
            //       document.getElementById("v-pills-patient-queue").classList.add("show");
            //       document.getElementById("v-pills-patient-queue").classList.add("active");
            //    }, 1000);
            //     })
            //     // this.svcPatientService.RemovePatientFromDoctorsQueue(this.patientDetail[0].patientCase.id).subscribe(data1 => {
            //     //   this.changeQueueList = data1
            //     //   console.log(this.changeQueueList)
            //     // })
            //   }))
            // }

            if (this.userType === 'SysAdmin') {
              this.close();

              this.failedData = [];
              data.filter((element: any) => {
                if (element.status == 'Fail') {
                  console.log(element, 'element');

                  this.failedData.push(element);
                }
              });

              if (this.failedData.length == 0) {
                Swal.fire({
                  title: 'Success',
                  text: `Referred to doctor successfully`,
                  icon: 'success',
                  allowOutsideClick: false,
                }).then((result) => {
                  this.isCallStart = false;
                  this._sweetAlert.setQueueUpdate(true);
                });
              } else {
                var dialogRef = this.dialog.open(this.errordialog, {
                  disableClose: true,
                });
                dialogRef.afterClosed().subscribe(() => {
                  this._sweetAlert.setQueueUpdate(true);
                });
              }

              // Swal.fire({
              //   title: 'Success',
              //   text: `Referred to doctor successfully`,
              //   icon: 'success',
              //   allowOutsideClick: false
              // }).then((result => {
              //   this.isCallStart = false;

              //   this._sweetAlert.setQueueUpdate(true)

              //   // this.router.navigate(['/SysAdmin-Header']).then((res:any)=>{

              //   // })

              //   // this.svcPatientService.RemovePatientFromDoctorsQueue(this.patientDetail[0].patientCase.id).subscribe(data1 => {
              //   //   this.changeQueueList = data1
              //   //   console.log(this.changeQueueList)
              //   // })
              // }))
            } else if (this.userType === 'PHCUser') {
              this.close();

              Swal.fire({
                title: 'Success',
                text: `Please refer the queue management screen for calling the doctor`,
                icon: 'success',
              }).then((result) => {
                this.isCallStart = false;
                this._sweetAlert.openTabValue = '4';
                this.router.navigate(['/chc-center']);
                //   .then((result) => {
                //     setTimeout(() => {
                //     document.getElementById("v-pills-home-tab").classList.remove("active");
                //     document.getElementById("v-pills-home").classList.remove("show");
                //     document.getElementById("v-pills-home").classList.remove("active");
                //     document.getElementById("v-pills-patient-queue-tab").classList.add("active");
                //     document.getElementById("v-pills-patient-queue").classList.add("show");
                //     document.getElementById("v-pills-patient-queue").classList.add("active");
                //  }, 1000);
                //})
                // this.svcPatientService.RemovePatientFromDoctorsQueue(this.patientDetail[0].patientCase.id).subscribe(data1 => {
                //   this.changeQueueList = data1
                //   console.log(this.changeQueueList)
                // })
              });
            }

            this.loading = false;
          },
          (error) => {
            this.loading = false;
            console.log(error);
            // if (error.error.status == "Fail") {
            //   this.errorDoctorList = error.error.message
            //   this.isdrnotAvailable = true;
            // }

            if (error.status == 404) {
              this._sweetAlert.sweetAlert(error.error.message, 'error');
              this.isdrnotAvailable = true;
              this.close();
            }
          }
        );
      } else {
        this.availbleInQueue = true;
        alert('Please Select Doctor');
      }
    }
  }
  isOkay() {
    if (this.userType === 'SysAdmin') {
    } else {
      this.router.navigate(['case-details']);
    }
    this.close();
  }
  isbusyOkay() {
    this.close();
  }
  patientQueueByDoctor: any;
  doctorIdSpecialization: any;
  isdrnotAvailableInQueue: boolean;
  errorDoctorListInqueue: any;
  addButtonProceesList: boolean;
  GetPatientQueueByDoctors(specializationID) {
    this.userObjFromToken = this.svcLocalstorage.GetData(
      environment.AuthTokenKeyLSKey
    );
    if (this.userObjFromToken) {
      this.svcPatientService
        .GetPatientQueueByDoctors(specializationID)
        .subscribe(
          (data) => {
            this.patientQueueByDoctor = data;

            console.log(this.patientQueueByDoctor, '==============');
          },
          (error) => {
            console.log(error);
            if (error.status == '404') {
              this.errorDoctorListInqueue = error.error.message;
              this.isdrnotAvailableInQueue = true;
              this.addButtonProceesList = true;
              console.log(error.error.message);
              // this.doctorList = error.error.message
            }
          }
        );
    }
  }

  selectDoctor(event) {
    this.selectedDoctorId = event.target.value;
  }

  // GetPatientQueue(){

  //   this.userObjFromToken = this.svcLocalstorage.GetData(environment.AuthTokenKeyLSKey);
  //   if(this.userObjFromToken){
  //     this.svcPatientService.GetPatientQueue().subscribe(data=>{
  //       this.patientQueueByDoctor = data;
  //       console.log(this.patientQueueByDoctor)
  //     })
  //   }
  // }
  onCallInitiedFromButton(ev: any) {
    this.close();
  }

  closedropdown() {
    this._sweetAlert.closeSelectDropdownSubject.subscribe((res: any) => {
      if (res == true) {
        this.referdoctordropdown.nativeElement.blur();
      }
    });
  }
}
