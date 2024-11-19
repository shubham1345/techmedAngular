import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ngxLoadingAnimationTypes } from 'ngx-loading';
import { Svc_MasterService } from 'src/app/services/services/svc_master.service';
import { SvcmainAuthserviceService } from 'src/app/services/services/svcmain-authservice.service';

@Component({
  selector: 'app-create-notification',
  templateUrl: './create-notification.component.html',
  styleUrls: ['./create-notification.component.css']
})
export class CreateNotificationComponent implements OnInit {

  public ngxLoadingAnimationTypes = ngxLoadingAnimationTypes;
  loading = false;
  public config = {
    animationType: ngxLoadingAnimationTypes.none,
    backdropBorderRadius: '3px',
  };


  createNotificationForm:FormGroup
  displayedColumns=['srno','heading','details','date','createdDate']
  constructor(private _fb:FormBuilder,private _svcMaster:Svc_MasterService,private _sweetAlert:SvcmainAuthserviceService) {
    this.createNotificationForm=this._fb.group({
      heading:['',[Validators.required]],
      details:['',[Validators.required]],
      date:['',[Validators.required]]
    })
   }

  ngOnInit(): void {
    this.GetNotification()
  }

  SaveNotification()
  {
    if(this.createNotificationForm.invalid)
    {
      this.createNotificationForm.markAllAsTouched()
    }
    else{
      this.loading=true
      this._svcMaster.addNotification(this.createNotificationForm.value).subscribe((res:any)=>{
        this.loading=false
        this._sweetAlert.sweetAlert('Notification Created Successfully','success')
        this.createNotificationForm.reset()
        this.createNotificationForm.updateValueAndValidity()
      },(err:any)=>{
        this.loading=false
        this._sweetAlert.sweetAlert('Something went wrong,please try again','error')

      })
    }
  }


notificationArray:any=[]
dataSource:any=[]
@ViewChild(MatPaginator) paginator: MatPaginator;
  GetNotification()
  {
    this._svcMaster.getNotification().subscribe((res:any)=>{
      this.notificationArray=res
      this.dataSource = new MatTableDataSource(this.notificationArray);
      this.dataSource.paginator = this.paginator;
    },(err:any)=>{
      this.notificationArray=[]
    })
  }

}
