import { Component, OnInit } from '@angular/core';
import { MdbModalRef } from 'mdb-angular-ui-kit/modal';
import { Output, EventEmitter } from '@angular/core';
import { SvclocalstorageService } from 'src/app/services/services/svclocalstorage.service';
import { environment } from 'src/environments/environment';
import { SvcPhcGetPatientService } from 'src/app/services/services/svc-phc-get-patient.service';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { ngxLoadingAnimationTypes } from 'ngx-loading';


@Component({
  selector: 'app-pateint-feedback',
  templateUrl: './pateint-feedback.component.html',
  styleUrls: ['./pateint-feedback.component.css']
})
export class PateintFeedbackComponent implements OnInit {

  starRating: any;
  userObjFromToken: any;
  patientCaseId: any;
  disabled : boolean
  constructor(public modalRef: MdbModalRef<PateintFeedbackComponent>,
    private svcLocalstorage: SvclocalstorageService,
    private SvcPhcPatient: SvcPhcGetPatientService) { }

  ngOnInit(): void {
    this.disabled = false
  }
  public ngxLoadingAnimationTypes = ngxLoadingAnimationTypes;
  loading = false;
  public config = {
    animationType: ngxLoadingAnimationTypes.none,
    backdropBorderRadius: '3px',
  };
  feedbackStar() {
    let objt: any = {}
    objt.rating = this.starRating;
    objt.patientCaseId = this.patientCaseId
    this.userObjFromToken = this.svcLocalstorage.GetData(environment.AuthTokenKeyLSKey);
    if (this.userObjFromToken) {
      this.SvcPhcPatient.postFeedback(objt).subscribe(data => {
        console.log(data)
        Swal.fire({
          title: 'Thanks',
          text: `Thanks for submitting feedback`,
          icon: 'success',
        }).then(result =>{
          this.close()
          this.loading = false;

        })
      },
      err => {
        this.loading = false;

        Swal.fire({
          title: 'Warning',
          text: `Something went wrong`,
          icon: 'warning',
        })
        console.log(err, "err")
      }
      )
    }
    this.loading = true;
  }
  close(): void {
    const closeMessage = 'Modal closed';
    this.modalRef.close(closeMessage)
  }
  stars(stars) {
    console.log(stars)
    this.starRating = stars;
    console.log(this.starRating)
    var element1 = document.getElementById("stars");

    var element2 = document.getElementById("twoStar");

    var element3 = document.getElementById("threeStar");

    var element4 = document.getElementById("fourStar");

    var element5 = document.getElementById("fiveStar");
    element1.classList.remove("textdangerSelectionOne");
    element2.classList.remove("textdangerSelectionTwo");
    element3.classList.remove("textdangerSelectionThree");
    element4.classList.remove("textdangerSelectionFour");
    element5.classList.remove("textdangerSelectionFive");

    if (this.starRating == 1) {
      element1.classList.add("textdangerSelectionOne");
      this.disabled = true
    }
    if (this.starRating == 2) {
      element2.classList.add("textdangerSelectionTwo");
      this.disabled = true
    }
    if (this.starRating == 3) {
      element3.classList.add("textdangerSelectionThree");
      this.disabled = true
    }
    if (this.starRating == 4) {
      element4.classList.add("textdangerSelectionFour");
      this.disabled = true
    }
    if (this.starRating == 5) {
      element5.classList.add("textdangerSelectionFive");
      this.disabled = true
    }
    
    this.feedbackStar()
  }

}
