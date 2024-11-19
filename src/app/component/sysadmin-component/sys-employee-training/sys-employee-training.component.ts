import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { SvclocalstorageService } from 'src/app/services/services/svclocalstorage.service';
import { environment } from 'src/environments/environment';
import { svc_dashboardService } from 'src/app/services/services/svc_dashboard.service';
import { DatePipe } from '@angular/common';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { SvcPhcGetPatientService } from 'src/app/services/services/svc-phc-get-patient.service';
import { SvcAuthenticationService } from 'src/app/services/services/svc-authentication.service';
import { SvcmainAuthserviceService } from 'src/app/services/services/svcmain-authservice.service';
import { ngxLoadingAnimationTypes } from 'ngx-loading';

@Component({
  selector: 'app-sys-employee-training',
  templateUrl: './sys-employee-training.component.html',
  styleUrls: ['./sys-employee-training.component.css']
})
export class SysEmployeeTrainingComponent implements OnInit {

  public ngxLoadingAnimationTypes = ngxLoadingAnimationTypes;
  public config = {
    animationType: ngxLoadingAnimationTypes.none,
    backdropBorderRadius: '3px',
  };

  invalidFileTypeError: boolean = false;
  maxDate = new Date();
  userObjFromToken: any;
  loading = false;
  error1 = false;
  err = false;
  EmployeeNameset = "";
  UserId = 0;
  getphcdetail: any = []
  //employeedetail: FormGroup;

  employeedetail = new FormGroup({
    PHCsName: new FormControl(''),
    employeenmame: new FormControl(''),
    trainingsubject: new FormControl(''),
    Quartername: new FormControl(''),
    yearname: new FormControl(''),
    trainingdate: new FormControl(''),
    employeefeedback: new FormControl(''),
    trainingby: new FormControl('')
  
  })
  router: any;
  max=new RegExp(/[1-5]/)
  constructor(private svcLocalstorage: SvclocalstorageService, private Svc_dashboardService: svc_dashboardService,
    public datepipe: DatePipe, private SvcPhcPatient: SvcPhcGetPatientService, private fb: FormBuilder, 
    private svcAuth: SvcAuthenticationService,private _sweetAlert:SvcmainAuthserviceService) {
    
                        //////////used to stop loader when their is error of 401 and 403////

                        this._sweetAlert.getLoader().subscribe((res:any)=>{
                          this.loading=res
                          console.log('med',this.loading)
                        })
                    
                        /////////////////////////////////////////////////////////////
  }

  ngOnInit(): void {
    this.GetAllPHC()
    this.employeedetail = this.fb.group({
      PHCsName: ['', [Validators.required]],
      employeenmame: ['', [Validators.required]],
      trainingsubject: ['', [Validators.required]],
      Quartername: ['', [Validators.required]],
      yearname: ['', [Validators.required]],
      trainingdate: ['', [Validators.required]],
      trainingby: ['', [Validators.required]],
      employeefeedback: ['', [Validators.required, Validators.pattern(this.max) ,Validators.max(10)]],
      file: new FormControl('', [this.fileValidator.bind(this), Validators.required]),
    });
  }
  fileValidator(control: FormControl): { [key: string]: boolean } | null {
    const file = control.value;
    if (file) {
        const allowedFormats = ['application/pdf', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'];
        if (!allowedFormats.includes(file.type)) {
            return { invalidFileFormat: true };
        }
    }
    return null;
}
  saveemployeetraningt() {

    if(this.employeedetail.invalid)
    {
      this._sweetAlert.sweetAlert('Please Fill All the required Details','error')
      this.employeedetail.markAllAsTouched()
    }
    else{
   
    this.validateAllFormFields(this.employeedetail);
    if (this.employeedetail.get('employeefeedback').value > 0 && this.employeedetail.get('employeefeedback').value <=5) {
      console.log(this.employeedetail.value.file);
      
      let obj: any = {};
      let currentDateTime = this.datepipe.transform((new Date), 'yyyy-MM-dd');
      let selectYear = this.employeedetail.get('yearname').value;
      let selectQatr = this.employeedetail.get('Quartername').value;
      obj.id = 0;
      obj.phcId = this.employeedetail.get('PHCsName').value;
      obj.employeeName = this.employeedetail.get('employeenmame').value;
      obj.trainingSubject = this.employeedetail.get('trainingsubject').value;
      //obj.traingPeriod = this.employeedetail.get('Quartername').value;
      //obj.traingPeriod = selectQatr + ' ' + selectYear;
      obj.traingPeriod = selectQatr;
     
      obj.traingDate = this.employeedetail.get('trainingdate').value;
    obj.traingDate= this.datepipe.transform(this.employeedetail.get('trainingdate').value, 'yyyy-MM-dd');
      //obj.traingDate = this.datepipe.transform((new Date), 'yyyy-MM-dd');
      obj.trainingBy = this.employeedetail.get('trainingby').value;
      obj.employeeFeedback = this.employeedetail.get('employeefeedback').value;
      obj.file=this.employeedetail.get('file').value
      obj.createdOn = currentDateTime;
      obj.updatedOn = currentDateTime;
      obj.createdBy = this.UserId;
      obj.updatedBy = this.UserId;

const form=new FormData()
form.set( 'phcId' , this.employeedetail.get('PHCsName').value)
form.set( 'employeeName' ,this.employeedetail.get('employeenmame').value)
form.set( 'trainingSubject' , this.employeedetail.get('trainingsubject').value)
form.set( 'traingPeriod' , selectQatr)
form.set( 'traingDate' , this.datepipe.transform(this.employeedetail.get('trainingdate').value, 'yyyy-MM-dd'))
form.set( 'trainingBy' , this.employeedetail.get('trainingby').value)
form.set( 'employeeFeedback' , this.employeedetail.get('employeefeedback').value)
form.set('file',this.employeedetail.get('file').value)
form.set('createdOn' , currentDateTime)
form.set('updatedOn',  currentDateTime)
form.set('createdBy' , this.UserId.toString())
form.set('updatedBy' , this.UserId.toString())
form.set('id' , '0')
      
      if (this.userObjFromToken) {
        this.loading=true;
        this.Svc_dashboardService.AddEmployeeTraining(form).subscribe((res: any) => {
          this.loading=false;
          if (res.id != 0) {
            Swal.fire(
              '',
              'Employee training details Saved Successfully.',
              'success'
            ).then(function () {
              // window.location.reload();
            })
            this.employeedetail.reset()

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
        );
      }
    }
    }
  }
  disableDate() {
    return false;
  }
  ListOfPHC: any;
  GetAllPHC() {
    this.userObjFromToken = this.svcLocalstorage.GetData(
      environment.AuthTokenKeyLSKey
    );
    if (this.userObjFromToken) {
      this.Svc_dashboardService.GetAllPHC().subscribe(
        (data: any) => {
          console.log(data, 'this is GetAllPHC data');
          this.ListOfPHC = data;
        }
      );
    }
  }
  GetPHCDetail() {
    this.SvcPhcPatient.getphcdetailById(this.employeedetail.get('PHCsName').value).subscribe(data => {
      this.getphcdetail = data
      this.EmployeeNameset = this.getphcdetail.employeeName;
    })
  }

  onOptionsSelected(event) {
    const value = event.target.value;
    this.SvcPhcPatient.getphcdetailById(this.employeedetail.get('PHCsName').value).subscribe(data => {
      this.getphcdetail = data
      let empName = this.getphcdetail.employeeName;
      this.UserId = this.getphcdetail.userId;
      this.SetEmployeename(empName);
    })
  }
  SetEmployeename(emp: any) {
    this.employeedetail.get('employeenmame').setValue(emp);
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
  // disableDate(){
  //   return false;
  // }
  onlyphabetkey(event: any) {
    var charCode = (event.which) ? event.which : event.keyCode;
    // Only Numbers 0-9
    if ((charCode > 64 && charCode < 91) || (charCode > 96 && charCode < 123) || (charCode == 32)) {
      return true;
    }
    else {
      return false;
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
  onFileChange(event: any) {
    const fileOne = event.target.files?.[0]; // Get the selected file
    if (fileOne) {
        const fileName: string = fileOne.name.toLowerCase(); // Get the file name in lower case
        const isPDF = fileName.endsWith('.pdf'); // Check if the file name ends with .pdf
        const isXLSX = fileName.endsWith('.xlsx'); // Check if the file name ends with .xlsx

        if (isPDF || isXLSX) {
            this.employeedetail.get('file').setValue(fileOne, {emitModelToViewChange: false});
        } else {
            this.employeedetail.get('file').setValue(null);
            // Handle error message or notification for invalid file format here if needed
        }
    }
    const fileInput = event.target as HTMLInputElement;
    const fileNew = fileInput.files?.[0];

    if (fileNew) {
        const allowedFormats = ['application/pdf', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'];
        const isValidFormat = allowedFormats.includes(fileNew.type);

        if (!isValidFormat) {
            this.employeedetail.get('file')?.setErrors({ invalidFileFormat: true });
        } else {
            this.employeedetail.get('file')?.setErrors(null);
            this.employeedetail.get('file')?.markAsTouched();
        }
    }
}
  onFileChangeX(event:any)
  {
    this.employeedetail.get('file').setValue(event.target.files[0], {emitModelToViewChange: false});

  }
}
