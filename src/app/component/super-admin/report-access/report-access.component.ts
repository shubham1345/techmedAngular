import { Component, OnInit, ViewChild } from '@angular/core';
import { SuperadminService } from '../../../services/services/superadmin.service';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatSelect } from '@angular/material/select';
import { MatOption } from '@angular/material/core';
import { SvcmainAuthserviceService } from 'src/app/services/services/svcmain-authservice.service';
import { ngxLoadingAnimationTypes } from 'ngx-loading';

@Component({
  selector: 'app-report-access',
  templateUrl: './report-access.component.html',
  styleUrls: ['./report-access.component.css'],
})
export class ReportAccessComponent implements OnInit {
  reportAccess: FormGroup;
  allSelected = false;
  loading: boolean = false;
  public ngxLoadingAnimationTypes = ngxLoadingAnimationTypes;
  public config = {
    animationType: ngxLoadingAnimationTypes.none,
    backdropBorderRadius: '3px',
  };
  constructor(
    private _superadmin: SuperadminService,
    private fb: FormBuilder,
    private _sweetalert: SvcmainAuthserviceService
  ) {
    this.reportAccess = this.fb.group({
      UserType: ['', [Validators.required]],
      selectUser: ['', [Validators.required]],
      Reports: ['', [Validators.required]],
    });
  }
  @ViewChild('select') select: MatSelect;

  ngOnInit(): void {
    this.GetAllUserTypeMaster();
  }
  validateAllFormFields(formGroup: FormGroup) {         //{1}
    Object.keys(formGroup.controls).forEach(field => {  //{2}
      const control = formGroup.get(field);             //{3}
      if (control instanceof FormControl) {             //{4}
        control.markAsTouched({ onlySelf: true });
      } else if (control instanceof FormGroup) {        //{5}
        this.validateAllFormFields(control);            //{6}
      }
    });
  }
  searchUser(event) {
    console.log(event.target.value);

    return this.selectUserValue.filter((item) =>
      item.email.toLowerCase().includes(event.target.value.toLowerCase())
    );
  }
  displayUser(value?: any) {
    console.log(value, 'va');
this.loading=true
    if (value !== ''  &&  value.length !=0 ) {
      this.checkeddata=[];
      this._superadmin
        .GetReportAccessDetailsByUserID(value)
        .subscribe((data: any) => {
          this.checkeddata = data;
          this.loading=false
          if (this.checkeddata.length == 0) {
            this.checkeddata = this.reportName;
          }

          this.loading = false;
          this.allSelected = false;
          if (this.checkeddata) {
          
            var selecteddata = [];
            this.checkeddata.forEach((res: any) => {
              if (res.isChecked == true) {
                selecteddata.push(res.id);
              }
            });
            if(selecteddata.length==this.checkeddata.length){
              this.allSelected= true
            }

            this.reportAccess.patchValue({ Reports: selecteddata });
          }
          console.log(selecteddata);
          console.log(this.reportAccess.value);
        });
      return this.selectUserValue.find((res) => {
        return res.id === value;
      })?.email;
    }
    this.loading=false
    return value ? value : undefined;
  }

  UserType: any;
  GetAllUserTypeMaster() {
    this.loading = true;
    this.allSelected = false;
    this._superadmin.GetAllUserTypeMaster().subscribe((data: any) => {
      this.UserType = data;
      this.loading = false;
      this.UserType = this.UserType.filter(
        (user) =>
          user.userType === 'GovEmployee' || user.userType === 'SysAdmin'
      );
    }
    ,(err:any)=>{
      this.loading = false;
      this.reportAccess.reset();
      this.reportAccess.get('selectUser').setValue([]);
      this.allSelected=false;

      
      this._sweetalert.sweetAlert(`Something went wrong please try again `,'error')

    });
  }
  selectUserValue: any;
  checkUserDropdown($event) {
    this.loading = true;
    this.reportAccess.get('selectUser').setValue([]);
    this.reportAccess.get('Reports').setValue([]);
    this.checkeddata=[];
    this._superadmin.getUserById($event.target.value).subscribe((data: any) => {
      this.selectUserValue = data;
      this.loading = false;
      this.allSelected = false;
      
    
      
    }
    ,(err:any)=>{
      this.loading = false;
      this.reportAccess.reset();
      this.reportAccess.get('selectUser').setValue([]);
      this.reportAccess.get('Reports').setValue([]);
      
      this.reportAccess.patchValue({ Reports: '' });

      this.allSelected=false;

      
      this._sweetalert.sweetAlert(`Something went wrong please try again `,'error')

    });
  }
  checkeddata: any;
  selected: any;
  GetReportAccessDetailsByUserID($event) {
    this.loading = true;
    this._superadmin
      .GetReportAccessDetailsByUserID($event.target.value)
      .subscribe((data: any) => {
        this.checkeddata = data;

        if (this.checkeddata.length == 0) {
          this.checkeddata = this.reportName;
        }

        this.loading = false;
        this.allSelected = false;
      });
  }
  reportName: any;
  GetReportNameByUserTypeID($event) {
    this._superadmin
      .GetReportNameByUserTypeID($event.target.value)
      .subscribe((data: any) => {
        this.reportName = data;
        this.allSelected = false;
      }
      ,(err:any)=>{
        this.loading = false;
        this.reportAccess.reset();
        this.reportAccess.get('selectUser').setValue([]);
        this.reportAccess.get('Reports').setValue([]);

        this.allSelected=false;
  
        
        this._sweetalert.sweetAlert(`Something went wrong please try again `,'error')
  
      });
         let newStatus = true;
    this.select.options.forEach((item: MatOption) => {
      if (!item.selected) {
        newStatus = false;
      }
    });
    this.allSelected = newStatus;
    this.allSelected =false
  }
  toggleAllSelection() {
    if (this.allSelected) {
      this.select.options.forEach((item: MatOption) => item.select());
    } else {
      this.select.options.forEach((item: MatOption) => item.deselect());
    }
  }
  checkOptionsSelection() {
    // Check if any option is not selected (aria-selected="false")
    
    const anyUnselected = this.select.options.some(
      (item: MatOption) => item._getHostElement().getAttribute('ng-reflect-state') === 'unchecked'
    );

    this.allSelected = anyUnselected;
  }

  submit: any;

  AddReportAccessDetails() {
    if(this.reportAccess.invalid)
    {
      this.reportAccess.markAllAsTouched()
    }
    else{
      if (this.reportAccess.value){
    this.loading = true;
    let obj = {
      id: 0,
      reportMasterListID: this.reportAccess.get('Reports').value,
      userTypeID: this.reportAccess.get('UserType').value,
      userID: this.reportAccess.get('selectUser').value,
    };
    this._superadmin.AddReportAccessDetails(obj).subscribe((data: any) => {
      this.loading = false;
      this.submit = data;
      this._sweetalert.sweetAlert(`Access provided to the user successfully.  `, 'success').then((res: any) => {
        if (res) {
          this.reportAccess.reset();
          this.reportAccess.get('selectUser').setValue([]);
          this.allSelected=false;
          this.checkeddata=[];
          this.selectUserValue=[];
        }
      });
    }
    ,(err:any)=>{
      this.loading = false;
      this.reportAccess.reset();
      this.reportAccess.get('selectUser').setValue([]);
      this.allSelected=false;
      this.checkeddata=[];
      this.selectUserValue=[];
      
      this._sweetalert.sweetAlert(`Something went wrong please try again `,'error')

    })
  }
}
  }
}
