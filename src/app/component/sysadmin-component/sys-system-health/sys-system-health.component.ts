import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { SvclocalstorageService } from 'src/app/services/services/svclocalstorage.service';
import { environment } from 'src/environments/environment';
import { svc_dashboardService } from 'src/app/services/services/svc_dashboard.service';
import { ngxLoadingAnimationTypes } from 'ngx-loading';
import { DatePipe } from '@angular/common';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { SvcPhcGetPatientService } from 'src/app/services/services/svc-phc-get-patient.service';
import { SvcAuthenticationService } from 'src/app/services/services/svc-authentication.service';
import { SvcmainAuthserviceService } from 'src/app/services/services/svcmain-authservice.service';



@Component({
  selector: 'app-sys-system-health',
  templateUrl: './sys-system-health.component.html',
  styleUrls: ['./sys-system-health.component.css']
})
export class SysSystemHealthComponent implements OnInit {

  loading = false;
  error1 = false;
  err = false;
  year = 0;
  month = 0;
  getphcdetail: any = [];
  UserId=0;
  userObjFromToken: any;
  systemReport = new FormGroup({
    OtoscopeNo: new FormControl(''),
    selectPHC: new FormControl(''),
    DermascopeNum: new FormControl(''),
    month: new FormControl(''),
    FetalDoppler: new FormControl(''),
    Headphone: new FormControl(''),
    Webcam: new FormControl(''),
    Printer: new FormControl(''),
    Inverter: new FormControl(''),
    Computer: new FormControl('')
  })
  router: any;
  
  constructor(private svcLocalstorage: SvclocalstorageService,private Svc_dashboardService: svc_dashboardService,
    public datepipe: DatePipe,private SvcPhcPatient: SvcPhcGetPatientService,
    private fb: FormBuilder,private svcAuth : SvcAuthenticationService,private _sweetAlert:SvcmainAuthserviceService) { 
    
                        //////////used to stop loader when their is error of 401 and 403////

                        this._sweetAlert.getLoader().subscribe((res:any)=>{
                          this.loading=res
                          console.log('med',this.loading)
                        })
                    
                        /////////////////////////////////////////////////////////////
  }

  ngOnInit(): void {
    this.GetAllPHC();
    this.systemReport = this.fb.group({
      OtoscopeNo: ['', [Validators.required]],
      selectPHC: ['', [Validators.required]],
      DermascopeNum: ['', [Validators.required]],
      month: ['', [Validators.required]],
      FetalDoppler: ['', [Validators.required]],
      Headphone: ['', [Validators.required]],
      Webcam: ['', [Validators.required]],
      Printer: ['', [Validators.required]],
      Inverter: ['', [Validators.required]],
      employeefeedback: [''],
      Computer: ['', [Validators.required]]
    });
  }
  savesystemreport(){

    if(this.systemReport.invalid)
    {
      this.systemReport.markAllAsTouched()
      // alert('if')
      console.log(this.systemReport)
    }
    else{
      // alert('else')
      console.log(this.systemReport)
    this.validateAllFormFields(this.systemReport);
    let obj: any = {};
    if(this.systemReport.get('month').value !=null && this.systemReport.get('month').value !=""){
      this.SetMonthyear(this.systemReport.get('month').value);
    }
    let currentDateTime =this.datepipe.transform((new Date), 'yyyy-MM-dd');
    obj.id=0;
    obj.otoScope = this.systemReport.get('OtoscopeNo').value;
    obj.phcId = this.systemReport.get('selectPHC').value;
    obj.dermascope = this.systemReport.get('DermascopeNum').value;
    obj.month = this.month;
    obj.year = this.year;
    obj.fetalDoppler = this.systemReport.get('FetalDoppler').value;
    obj.headPhone = this.systemReport.get('Headphone').value;
    obj.webcam = this.systemReport.get('Webcam').value;
    obj.printer = this.systemReport.get('Printer').value;
    obj.inverter = +(this.systemReport.get('Inverter').value);
    obj.computer = this.systemReport.get('Computer').value;
    obj.createdOn =currentDateTime;
    obj.updatedOn =currentDateTime;
    obj.createdBy =this.UserId;
    obj.updatedBy =this.UserId;
    this.Svc_dashboardService.AddEquipmentUptimeReport(obj).subscribe((res: any) => {
     if(res.id !=0){
        Swal.fire(
          '',
          'System Health Report Saved Successfully.',
          'success'
        ).then(function(){
          window.location.reload();
        })
       
     }
    },

      (error) => {
        this.loading = false;

        if (error.status === 500) {
          this.loading = false;

          this.error1 = true
        }
        else if (error.status === 401) {
          this.loading = false;

          this.error1 = true
        }
        else if (error.status === 400) {
          this.err = true
          this.loading = false;

        }
      }
    )
    }

  }
  value:any;
  SetMonthyear(value : any){
    
  let setmont=  value.split('-')[0];
  this.year=value.split('-')[1]
      if(setmont=="Jan"){
        this.month=1;
      }
      if(setmont=="Feb"){
        this.month=1;
      }
      if(setmont=="Jan"){
        this.month=2;
      }
      if(setmont=="Mar"){
        this.month=3;
      }
      if(setmont=="Apr"){
        this.month=4;
      }
      if(setmont=="May"){
        this.month=5;
      }
      if(setmont=="Jun"){
        this.month=6;
      }
      if(setmont=="Jul"){
        this.month=7;
      }
      if(setmont=="Aug"){
        this.month=8;
      }
      if(setmont=="Sep"){
        this.month=9;
      }
      if(setmont=="Oct"){
        this.month=10;
      }
      if(setmont=="Nov"){
        this.month=12;
      }
      if(setmont=="Dec"){
        this.month=12;
      }
  }

  months = [
    {
     "id": `Jan-2022`,
     "name": `Jan-2022`
    },
    {
     "id": "Feb-2022",
     "name": "Feb-2022"
    },
    {
      "id": "Mar-2022",
      "name": "Mar-2022"
     },
     {
      "id": "Apr-2022",
      "name": "Apr-2022"
     },
     {
      "id": "May-2022",
      "name": "May-2022"
     },
     {
      "id": "6",
      "name": "Jun-2022"
     },
     {
      "id": "Jul-2022",
      "name": "Jul-2022"
     },
     {
      "id": "Aug-2022",
      "name": "Aug-2022"
     },
     {
      "id": "Sep-2022",
      "name": "Sep-2022"
     },
     {
      "id": "Oct-2022",
      "name": "Oct-2022"
     },
     {
      "id": "Nov-2022",
      "name": "Nov-2022"
     },
     {
      "id": "Dec-2022",
      "name": "Dec-2022"
     },
     {
      "id": "Jan-2023",
      "name": "Jan-2023"
     },
     {
      "id": "Feb-2023",
      "name": "Feb-2023"
     },
     {
      "id": "Mar-2023",
      "name": "Mar-2023"
     },
     {
      "id": "Apr-2023",
      "name": "Apr-2023"
     }

  ];

  ListOfPHC: any; 
  GetAllPHC() { 
    this.userObjFromToken = this.svcLocalstorage.GetData(
      environment.AuthTokenKeyLSKey
    );
    if (this.userObjFromToken) {
      this.Svc_dashboardService.GetAllPHC().subscribe(
        (data: any) => {
          console.log(data, 'this is GetAllPHC data');
          this.ListOfPHC=data;
        }
      );
    }
  }

  onOptionsSelected(event){
    const value = event.target.value;
    this.SvcPhcPatient.getphcdetailById(this.systemReport.get('selectPHC').value).subscribe(data => {
      this.getphcdetail= data
      this.UserId =this.getphcdetail.userId;
     })
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
  keyPressNumbers(event: any) {
    var charCode = (event.which) ? event.which : event.keyCode;
    // Only Numbers 0-9
    if ((charCode < 48 || charCode > 57)) {
      event.preventDefault();
      return false;
    } else {
      return true;
    }
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
}
