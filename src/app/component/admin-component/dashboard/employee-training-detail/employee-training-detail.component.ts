import { Component, OnInit ,Output} from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { SvclocalstorageService } from 'src/app/services/services/svclocalstorage.service';
import { environment } from 'src/environments/environment';
import { svc_dashboardService } from 'src/app/services/services/svc_dashboard.service';
import { DatePipe } from '@angular/common';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { SvcPhcGetPatientService } from 'src/app/services/services/svc-phc-get-patient.service';

@Component({
  selector: 'app-employee-training-detail',
  templateUrl: './employee-training-detail.component.html',
  styleUrls: ['./employee-training-detail.component.css']
})
export class EmployeeTrainingDetailComponent implements OnInit {
  userObjFromToken: any;
  loading=false;
  error1=false;
  err =false;
  EmployeeNameset="";
  UserId=0;
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
  constructor(private svcLocalstorage: SvclocalstorageService,private Svc_dashboardService: svc_dashboardService,
    public datepipe: DatePipe,private SvcPhcPatient: SvcPhcGetPatientService,private fb: FormBuilder) {
    this.GetAllPHC()
   }
   
  ngOnInit(): void {
    this.employeedetail = this.fb.group({
      PHCsName: ['', [Validators.required]],
      employeenmame: ['', [Validators.required]],
      trainingsubject: ['', [Validators.required]],
      Quartername: ['', [Validators.required]],
      yearname: ['', [Validators.required]],
      trainingdate: ['', [Validators.required]],
      trainingby: ['', [Validators.required]],
      employeefeedback: ['', [Validators.required]]
    });
  }
  saveemployeetraningt(){
    debugger
    this.validateAllFormFields(this.employeedetail);
    let obj: any = {};
    let currentDateTime =this.datepipe.transform((new Date), 'yyyy-MM-dd');
    let selectYear =this.employeedetail.get('yearname').value;
    let selectQatr= this.employeedetail.get('Quartername').value;
    obj.id=0;
    obj.phcId = this.employeedetail.get('PHCsName').value;
    obj.employeeName = this.employeedetail.get('employeenmame').value;
    obj.trainingSubject = this.employeedetail.get('trainingsubject').value;
    //obj.traingPeriod = this.employeedetail.get('Quartername').value;
    obj.traingPeriod = selectQatr+' '+selectYear;
    obj.traingDate = this.employeedetail.get('trainingdate').value;
    //obj.traingDate = this.datepipe.transform((new Date), 'yyyy-MM-dd');
    obj.trainingBy = this.employeedetail.get('trainingby').value;
    obj.employeeFeedback = this.employeedetail.get('employeefeedback').value;
    obj.createdOn = currentDateTime;
    obj.updatedOn = currentDateTime;
    obj.createdBy =this.UserId;
    obj.updatedBy =this.UserId;

    this.Svc_dashboardService.AddEmployeeTraining(obj).subscribe((res: any) => {
      if(res.id !=0){
         Swal.fire(
           '',
           'Employee training details Saved Successfully.',
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
  disableDate(){
    return false;
  }
  ListOfPHC: any;
  GetAllPHC() {
    debugger
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
  GetPHCDetail(){
    this.SvcPhcPatient.getphcdetailById(this.employeedetail.get('PHCsName').value).subscribe(data => {
      this.getphcdetail= data
      this.EmployeeNameset=this.getphcdetail.employeeName;
     })
  }

  onOptionsSelected(event){
    const value = event.target.value;
    this.SvcPhcPatient.getphcdetailById(this.employeedetail.get('PHCsName').value).subscribe(data => {
      this.getphcdetail= data
      let empName = this.getphcdetail.employeeName;
      this.UserId =this.getphcdetail.userId;
      this.SetEmployeename(empName);
     })
  }
  SetEmployeename(emp:any){
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
}
