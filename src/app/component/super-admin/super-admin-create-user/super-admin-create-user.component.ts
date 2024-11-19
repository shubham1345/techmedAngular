import { Component, OnInit } from '@angular/core';
import { SvclocalstorageService } from 'src/app/services/services/svclocalstorage.service';
import { environment } from 'src/environments/environment';
import { SvcAuthenticationService } from 'src/app/services/services/svc-authentication.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { validateVerticalPosition } from '@angular/cdk/overlay';
import {SuperadminService} from '../../../services/services/superadmin.service'
import {SvcmainAuthserviceService} from 'src/app/services/services/svcmain-authservice.service'
import { delay, retry } from 'rxjs';
import { ngxLoadingAnimationTypes } from 'ngx-loading';



@Component({
  selector: 'app-super-admin-create-user',
  templateUrl: './super-admin-create-user.component.html',
  styleUrls: ['./super-admin-create-user.component.css']
})
export class SuperAdminCreateUserComponent implements OnInit {
  router: any;
  createUser:FormGroup
  rolesArray:any

  public ngxLoadingAnimationTypes = ngxLoadingAnimationTypes;
  public config = {
    animationType: ngxLoadingAnimationTypes.none,
    backdropBorderRadius: '3px',
  };

  loading:boolean=false

emailregex=new RegExp(/^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/)

  constructor(private svcLocalstorage: SvclocalstorageService,private _superadmin:SuperadminService, private _sweetalert:SvcmainAuthserviceService,
    private svcAuth : SvcAuthenticationService,private _fb:FormBuilder) { 
      this.createUser=this._fb.group({
        userid:[null,Validators.required],
        username:['',Validators.required],
        email:['',[Validators.required,Validators.pattern(this.emailregex),Validators.email]],
        mobile:['',Validators.required]
      })

      this._sweetalert.getLoader().subscribe((res:any)=>{
        this.loading=res
        console.log('create user',this.loading)
      })
    }

  ngOnInit(): void {
    this.getRolesList()
  }

  getRolesList()
 {
  this.loading=true
  this._superadmin.getRoles().pipe(retry(2),delay(3000)).subscribe({next:(res:any)=>{
    
    this.rolesArray=res.filter((res:any)=>res.userType=='GovEmployee'||res.userType=='SysAdmin')
    this.loading=false
  },
  error:(err:any)=>{
    this.rolesArray=[]
    this.loading=false
    this._sweetalert.sweetAlert('SomeThing Went Wrong,Please refresh the page or check your Internet connection','error')
  }})
 } 

 roleChange()
 {
  this.createUser.controls['username'].reset()
  this.createUser.controls['email'].reset()
  this.createUser.controls['mobile'].reset()
  this.createUser.updateValueAndValidity()
 }

 reset()
 {
  this.createUser.reset()
 }

 submit()
 {
if(this.createUser.invalid)
{
  this.createUser.markAllAsTouched()
}
else{
  if(this.svcLocalstorage.GetData(environment.AuthTokenKeyLSKey))
  {
  this.loading=true

  var successMsg=''
  switch(this.createUser.value.userid.toString())
  {
    case '2':{
      successMsg='SysAdmin User Has Been Created Successfully'
      break;
    }
    case '7':{
      successMsg='GovEmployee User Has Been Created Successfully'
      break;
    }
    default:
      {
        successMsg='User Has Been Created Successfully'
        break;
      }
  }

this._superadmin.createUser(this.createUser.value).subscribe({next:(res:any)=>{
      this.loading=false
  this._sweetalert.sweetAlert(successMsg,'success').then((res:any)=>{
    if(res)
    {
      this.createUser.reset()
    }
})
},error:(err:any)=>{

    this.loading=false
if(err.status==404)
{
  this._sweetalert.sweetAlert(err.error.AddUser.errors[0].errorMessage,'error')

}
else{
  this._sweetalert.sweetAlert('SomeThing Went Wrong,Please try Again After SomeTime','error')

}
}})
}


}
 }

}
