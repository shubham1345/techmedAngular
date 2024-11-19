import { Component, OnInit } from '@angular/core';
import { MdbModalRef } from 'mdb-angular-ui-kit/modal';
import { Svc_getdoctordetailService } from 'src/app/services/services/svc_getdoctordetail.service';
import { SvclocalstorageService } from 'src/app/services/services/svclocalstorage.service';
import { environment } from 'src/environments/environment';
import { ngxLoadingAnimationTypes } from 'ngx-loading';
import { SvcmainAuthserviceService } from 'src/app/services/services/svcmain-authservice.service';


@Component({
  selector: 'app-phc-hospitals-list',
  templateUrl: './phc-hospitals-list.component.html',
  styleUrls: ['./phc-hospitals-list.component.css']
})
export class PhcHospitalsListComponent implements OnInit {
  show:boolean=false

  public ngxLoadingAnimationTypes = ngxLoadingAnimationTypes;
  public config = {
    animationType: ngxLoadingAnimationTypes.none,
    backdropBorderRadius: '3px',
  };
  loading:boolean=false

  getListOfPHCHospital:any = [];
  data:any;
  userObjFromToken: any;
  constructor(
    public modalRef: MdbModalRef<PhcHospitalsListComponent>,
    private svcgetdoctordtls: Svc_getdoctordetailService,
    private svcLocalstorage: SvclocalstorageService,
    private _sweetAlert:SvcmainAuthserviceService
    ){ 
      this.getListOfPHCHospitalfunction()
    }

  ngOnInit(): void {
    this._sweetAlert.closeAllModalsOnLogout.subscribe((res:any)=>{
      if(res==true)
      {
        this.close()
      }
    })
  }

  getListOfPHCHospitalfunction(){
    this.userObjFromToken = this.svcLocalstorage.GetData(environment.AuthTokenKeyLSKey);
    //console.log(this.userObjFromToken)

    if (this.userObjFromToken)
    {
      this.loading=true
      this.svcgetdoctordtls.GetListOfPHCHospital().subscribe(data => {
      
        this.loading=false
        this.getListOfPHCHospital.push(data)
        this.show=true
        //console.log(this.getListOfPHCHospital,"list of hospital")
      },(err:any)=>{
        this.loading=false
      }
      )
    }
  }
  close(): void {
    const closeMessage = 'Modal closed';
    this.modalRef.close(closeMessage);
  }
}
