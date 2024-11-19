import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ThemePalette } from '@angular/material/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ngxLoadingAnimationTypes } from 'ngx-loading';
import { SuperadminService } from 'src/app/services/services/superadmin.service';
import { SvcmainAuthserviceService } from 'src/app/services/services/svcmain-authservice.service';

@Component({
  selector: 'app-delete-user',
  templateUrl: './delete-user.component.html',
  styleUrls: ['./delete-user.component.css']
})
export class DeleteUserComponent implements OnInit {
  public ngxLoadingAnimationTypes = ngxLoadingAnimationTypes;
  loading = false;
  public config = {
    animationType: ngxLoadingAnimationTypes.none,
    backdropBorderRadius: '3px',
  };

  color: ThemePalette = 'accent';
  dataSource:any=[]
  displayedColumns=['SrNo','name','id','email','createdDate','status']

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatSort,{static:false})sorter1:MatSort
  @ViewChild('input') input: ElementRef;
  userType:any=[]
  usertypeControl=new FormControl('')

  constructor(private _superadmin:SuperadminService,private _sweetAlert:SvcmainAuthserviceService) { }

  ngOnInit(): void {
    this.getUserType()    
  }

  getUserType()
  {
    this.loading=true
       this._superadmin.getRoles().subscribe((res:any)=>{
        this.userType=res
        this.loading=false
       },(err:any)=>{
        this.loading=false
        this.userType=[]
       })
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }


  usertypeSelected()
  {
    this.input.nativeElement.value = ''; 
    this.loading=true
    this._superadmin.getUserById(this.usertypeControl.value).subscribe((res:any)=>{
      this.dataSource=new MatTableDataSource(res)
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
  
      this.loading=false
    },(err:any)=>{
      this.dataSource=[]
      this.loading=false
    },()=>{
      this.loading=false
    })
    
  }

  

 async  statusChnage(event:any,userid,email)
  {
let message:any
   let status:any
   if(event.target.checked==false)
   {
    status='deactivate',
    message='Note : After deactivation , this user will be logout from the system.'
   }
   else
   {
    status='activate',
    message=''
   }


 
      this._sweetAlert.deletesweetAlertFooter(`Are you sure ? You want to  ${status}  the user ${email} `,` ${message}`,'info').then((res:any)=>{
        if(res.isConfirmed==true)
        {
              this.loading=true
        this._superadmin.changeStatusOfUser(userid,email,event.target.checked).subscribe((res:any)=>{
    this.loading=false
    this.usertypeSelected()
    },(err:any)=>{
      this.loading=false
      this._sweetAlert.sweetAlert('Something Went Wrong,please try again','error')
      event.source.checked = !event.target.checked;
    })
        }
        else{
          event.target.checked = !event.target.checked;
        }
        
      })
    


  }
}
