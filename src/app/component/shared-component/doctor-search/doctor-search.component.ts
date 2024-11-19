import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MdbModalRef } from 'mdb-angular-ui-kit/modal';
import { SvcPhcGetPatientService } from 'src/app/services/services/svc-phc-get-patient.service';
import { SvclocalstorageService } from 'src/app/services/services/svclocalstorage.service';
import { Svc_getdoctordetailService } from 'src/app/services/services/svc_getdoctordetail.service';
import { environment } from 'src/environments/environment';
import { IQueryString } from 'src/app/model/QueryStringModel';
import { EncryptData } from 'src/app/utils/utilityFn';
import { debounceTime, distinctUntilChanged, map, Subject, switchMap, throttleTime } from 'rxjs';
import { ngxLoadingAnimationTypes } from 'ngx-loading';
import { SvcmainAuthserviceService } from 'src/app/services/services/svcmain-authservice.service';

@Component({
  selector: 'app-doctor-search',
  templateUrl: './doctor-search.component.html',
  styleUrls: ['./doctor-search.component.css']
})
export class DoctorSearchComponent implements OnInit {
  private readonly searchSubject = new Subject<string | undefined>();
  searchedKeyword: any
  searchpatient: any = []
  searchSubscription:any

  public ngxLoadingAnimationTypes = ngxLoadingAnimationTypes;
  loading = false;
  public config = {
    animationType: ngxLoadingAnimationTypes.none,
    backdropBorderRadius: '3px',
  };
  constructor(public modalRef: MdbModalRef<DoctorSearchComponent>, private svcLocalstorage: SvclocalstorageService
    , private SvcPhcPatient: SvcPhcGetPatientService,
    private _sweetAlert:SvcmainAuthserviceService, private router : Router, private svcdoc : Svc_getdoctordetailService) {
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
  
  // searchbar(){
    
  //   var inputValue = (<HTMLInputElement>document.getElementById('myText')).value;
  //   console.log(inputValue)
  //  // inputValue = '';
  //   this.getsearchpatient(inputValue,this.svcLocalstorage.GetData)
  // }
  userObjFromToken: any
  // p: number
  getsearchpatient(value:any){
    this.loading=true
    this.searchpatient = [];

    this.userObjFromToken = this.svcLocalstorage.GetData(environment.AuthTokenKeyLSKey);
    if (this.userObjFromToken)
   var p = this.svcLocalstorage.GetData(environment.doctorID)

      this.svcdoc.SearchPatientDrDashBoard({
        "patientName": value,
        "doctorID": p
      }).subscribe(data => {
        this.loading=false
        this.searchpatient.push(data)
      },(err:any)=>{
        this.loading=false
      });
  }
  
  onclickvideoIcon(patientId: any){
  
   // id =this.svcLocalstorage.GetData(environment.doctorID)
   let qs: IQueryString = {
    patientId: patientId 
  }
  let strEncText = EncryptData(JSON.stringify(qs));

  this.router.navigate(["/case-details-doc"], { queryParams: { src: strEncText } });
  
    //this.router.navigate(["/case-details-doc"], {queryParams: {patientId}},);
   // this.myCompOneObj.getdetailphc(patientId,phcid)
    this.close()
}

searchinput(value:any)
{
  const searchQuery = value.target.value;
  this.searchSubject.next(searchQuery?.trim());
}
  close(): void {
    const closeMessage = 'Modal closed';
    this.modalRef.close(closeMessage)
  }
}
