import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MdbModalRef, MdbModalService } from 'mdb-angular-ui-kit/modal';
import { SvcPhcGetPatientService } from 'src/app/services/services/svc-phc-get-patient.service';
import { SvclocalstorageService } from 'src/app/services/services/svclocalstorage.service';
import { environment } from 'src/environments/environment';
import { CaseDetailsComponent } from '../../admin-component/chc-center/case-details/case-details.component';
import { SvcGetmethodService } from 'src/app/services/services/svc-getmethod.service';
import { FormBuilder } from '@angular/forms';
import { SvccasedetailService } from 'src/app/services/services/svccasedetail.service';
import { DatePipe } from '@angular/common';
import { Svc_getdoctordetailService } from 'src/app/services/services/svc_getdoctordetail.service';
import { EncryptData } from 'src/app/utils/utilityFn';
import { IQueryString } from 'src/app/model/QueryStringModel';
import { debounceTime, distinctUntilChanged, map, Subject } from 'rxjs';
import { ngxLoadingAnimationTypes } from 'ngx-loading';
import { SvcmainAuthserviceService } from 'src/app/services/services/svcmain-authservice.service';
@Component({
  selector: 'app-patients-searchbar',
  templateUrl: './patients-searchbar.component.html',
  styleUrls: ['./patients-searchbar.component.css'],
})
export class PatientsSearchbarComponent implements OnInit {
  searchedKeyword: any='';
  searchpatient: any = [];
  searchSubscription:any
  private readonly searchSubject = new Subject<string | undefined>();
  //myCompOneObj = new CaseDetailsComponent(this.modalService, this.fb, this.svcLocalstorage, this.svcCasedetail, this.SvcPhcPatient, this.datepipe, this.svcdoctor, this.activatedRoute, this.router)

  loading = false;
  public ngxLoadingAnimationTypes = ngxLoadingAnimationTypes;
  public config = {
    animationType: ngxLoadingAnimationTypes.none,
    backdropBorderRadius: '3px',
  };

  constructor(
    public modalRef: MdbModalRef<PatientsSearchbarComponent>,
    private svcLocalstorage: SvclocalstorageService,
    private SvcPhcPatient: SvcPhcGetPatientService,
    private router: Router,
    private modalService: MdbModalService,
    private fb: FormBuilder,
    private svcCasedetail: SvccasedetailService,
    private datepipe: DatePipe,
    private svcdoctor: Svc_getdoctordetailService,
    private activatedRoute: ActivatedRoute,
    private _sweetAlert:SvcmainAuthserviceService
  ) {
    //  this.getsearchpatient(['sa'])
  }

  ngOnInit(): void {

    this._sweetAlert.closeAllModalsOnLogout.subscribe((res:any)=>{
      if(res==true)
      {
        this.close()
      }
    })


    this.searchSubscription = this.searchSubject
    .pipe(
      debounceTime
      (1000),map((event: any) => event),distinctUntilChanged()).subscribe((res:any)=>{

        this.getsearchpatient(res)
      })


  }
  async searchbar() {
    var inputValue = (<HTMLInputElement>document.getElementById('myText'))
      .value;

    // inputValue = '';
    if (inputValue) {
      if (inputValue.length==3) {
        await this.getsearchpatient([inputValue]);
      }
    } 
  }
  userObjFromToken: any;
  p: any;
  async getsearchpatient(strValue: any) {
 
    this.searchpatient = [];
    this.userObjFromToken = this.svcLocalstorage.GetData(
      environment.AuthTokenKeyLSKey
    );
    //console.log(this.userObjFromToken)
    if (this.userObjFromToken)
    {
      this.loading=true
      this.p = this.svcLocalstorage.GetData(environment.PhcID);

     this.SvcPhcPatient.GetSearchPatient(
      strValue
    ).subscribe(data => {
      this.loading=false
      this.searchpatient=data
      console.log(this.searchpatient);
      
    },(err:any)=>{
      this.loading=false
    });
  }
  }
  // getmethodd(){
  //       let myCompOneObj = new CaseDetailsComponent();
  //       myCompOneObj.getmethod();

  // }
  onclickvideoIcon(patientId: any, phcid: any) {
    let qs: IQueryString = {
      patientId: patientId,
      phcId: (phcid = this.svcLocalstorage.GetData(environment.PhcID)),
    };
    let strEncText = EncryptData(JSON.stringify(qs));

    this.router.navigate(['/case-details'], {
      queryParams: { src: strEncText },
    });

    // phcid = this.svcLocalstorage.GetData(environment.PhcID)

    // this.router.navigate(["/case-details"], { queryParams: { patientId, phcid } },);
    this.close();
  }

  searchinput(value:any)
{
  const searchQuery = value.target.value;
  this.searchSubject.next(searchQuery?.trim());
}

  close(): void {
    const closeMessage = 'Modal closed';
    this.modalRef.close(closeMessage);
  }
}
