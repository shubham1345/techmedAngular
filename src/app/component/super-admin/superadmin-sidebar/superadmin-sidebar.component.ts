import { Component, OnInit } from '@angular/core';
import { SvclocalstorageService } from 'src/app/services/services/svclocalstorage.service';
import { environment } from 'src/environments/environment';
import { SvcAuthenticationService } from 'src/app/services/services/svc-authentication.service';
import { Router } from '@angular/router';
import { I } from '@angular/cdk/keycodes';

@Component({
  selector: 'app-superadmin-sidebar',
  templateUrl: './superadmin-sidebar.component.html',
  styleUrls: ['./superadmin-sidebar.component.css']
})
export class SuperadminSidebarComponent implements OnInit {


  constructor(
    private svcLocalstorage: SvclocalstorageService,
    private svcAuth : SvcAuthenticationService,
    private router :  Router,
  ) {

   }
   superadmin = this.svcLocalstorage.GetData(environment.Role);
  ngOnInit(): void {
  }

  onSignOut() {
   
    this.svcAuth.LogOutUser().subscribe({

      next: () => {

        this.svcLocalstorage.DeleteAll();

        this.router?.navigate(['/login'])

        this.checkSignOut();

      }

    });
}
isSignOut: boolean
checkSignOut() {

  if (this.svcLocalstorage.GetData(environment.AuthTokenKeyLSKey) != null) {

    this.isSignOut = true;

  }

  else {

    this.isSignOut = false;

  }

}
iscreateuser: boolean= true;
isreset: boolean= false;
isPending:boolean=false;
isAllowAccess:boolean=false;
isDeleteUser:boolean=false
isReportaccess:boolean=false
clickbutton(data){
  console.log(data,'data');
  
    if(data == 'Create user'){
      this.iscreateuser=true
      this.isreset=false
      this.isPending=false
      this.isAllowAccess=false
      this.isDeleteUser=false
      this.isReportaccess=false

    }
    else if(data == 'Reset Password'){
      this.iscreateuser=false
      this.isreset=true
      this.isPending=false
      this.isAllowAccess=false
      this.isDeleteUser=false
      this.isReportaccess=false

    }
    else if(data=='pendingCases')
    {

      this.iscreateuser=false
      this.isreset=false
      this.isPending=true
      this.isAllowAccess=false
      this.isDeleteUser=false
            this.isReportaccess=false

    }
    else if(data=='Allow Access')
    {

      this.iscreateuser=false
      this.isreset=false
      this.isPending=false
      this.isAllowAccess=true
      this.isDeleteUser=false
      this.isReportaccess=false

    }
    
    else if(data=='Delete User')
  {
    this.iscreateuser=false
    this.isreset=false
    this.isPending=false
    this.isAllowAccess=false
    this.isDeleteUser=true
    this.isReportaccess=false

  }
  else if(data=='report-access')
  {
    this.iscreateuser=false
    this.isreset=false
    this.isPending=false
    this.isAllowAccess=false
    this.isDeleteUser=false
    this.isReportaccess=true

  }
    
  }

}
