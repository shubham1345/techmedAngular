import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { SvclocalstorageService } from 'src/app/services/services/svclocalstorage.service';
import { environment } from 'src/environments/environment';
import { svc_dashboardService } from 'src/app/services/services/svc_dashboard.service';
import { DatePipe } from '@angular/common';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { svc_HolidayCalenderService } from 'src/app/services/services/svc_HolidayCalender.service';
import { SvcPhcGetPatientService } from 'src/app/services/services/svc-phc-get-patient.service';
import { svc_PHCservice } from 'src/app/services/services/svc_PHC.service';
import { Svc_MasterService } from 'src/app/services/services/svc_master.service';
import { HttpParams } from '@angular/common/http';


@Component({
  selector: 'app-sys-admin-component',
  templateUrl: './sys-admin-component.component.html',
  styleUrls: ['./sys-admin-component.component.css']
})
export class SysAdminComponentComponent implements OnInit {


  maxDate = new Date();

  year = 0;
  month = 0;
  userObjFromToken: any;
  loading = false;
  error1 = false;
  err = false;
  EmployeeNameset = "";
  UserId = 0;
  isShown = false;
  getphcdetail: any = []
  //employeedetail: FormGroup;
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


  employeedetail = new FormGroup({
    PHCsName: new FormControl(''),
    employeenmame: new FormControl(''),
    trainingsubject: new FormControl(''),
    Quartername: new FormControl(''),
    yearname: new FormControl(''),
    trainingdate: new FormControl(''),
    employeefeedback: new FormControl(''),
    trainingby: new FormControl(''),



  })
  //  year:string;
  holidaycalendar = new FormGroup({
    holidaydate: new FormControl(''),
    holidaydiscrip: new FormControl(''),
    selectYear: new FormControl('2022')
  })
  spokeMaintenance = new FormGroup({
    district: new FormControl(''),
    Block: new FormControl(''),
    selectPHC: new FormControl(''),
    maitenacedate: new FormControl(''),
    selectPHCName: new FormControl(''),
    selectMQ: new FormControl(''),
    docname: new FormControl(''),
  });
  selectedFile: any;

  constructor
    (private svcLocalstorage: SvclocalstorageService,
      private Svc_dashboardService: svc_dashboardService,
      public datepipe: DatePipe,
      private SvcPhcPatient: SvcPhcGetPatientService,
      private svc_masterServices: Svc_MasterService,
      private Svc_PHCservice: svc_PHCservice,
      private fb: FormBuilder,
      private Svc_HolidayCalenderService: svc_HolidayCalenderService,

    ) 
    
    
    {
    this.GetAllPHC();
    this.GetDistrict();
    this.GetAllBlock();

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
    this.spokeMaintenance = this.fb.group({
      district: ['', [Validators.required]],
      Block: ['', [Validators.required]],
      selectPHC: ['', [Validators.required]],
      maitenacedate: ['', [Validators.required]],
      docname: ['', [Validators.required]],
      selectPHCName: ['', [Validators.required]],
    });
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
      employeefeedback: ['', [Validators.required]],
      Computer: ['', [Validators.required]]
    });

  }
  event: any;
  selectPHCName: any;
  moname: any;

  saveemployeetraningt() {
    debugger
    this.validateAllFormFields(this.employeedetail);
    let obj: any = {};
    let currentDateTime = this.datepipe.transform((new Date), 'yyyy-MM-dd');
    let selectYear = this.employeedetail.get('yearname').value;
    let selectQatr = this.employeedetail.get('Quartername').value;
    obj.id = 0;
    obj.phcId = this.employeedetail.get('PHCsName').value;
    obj.employeeName = this.employeedetail.get('employeenmame').value;
    obj.trainingSubject = this.employeedetail.get('trainingsubject').value;
    //obj.traingPeriod = this.employeedetail.get('Quartername').value;
    obj.traingPeriod = selectQatr + ' ' + selectYear;
    obj.traingDate = this.employeedetail.get('trainingdate').value;
    //obj.traingDate = this.datepipe.transform((new Date), 'yyyy-MM-dd');
    obj.trainingBy = this.employeedetail.get('trainingby').value;
    obj.employeeFeedback = this.employeedetail.get('employeefeedback').value;
    obj.createdOn = currentDateTime;
    obj.updatedOn = currentDateTime;
    obj.createdBy = this.UserId;
    obj.updatedBy = this.UserId;

    this.Svc_dashboardService.AddEmployeeTraining(obj).subscribe((res: any) => {
      if (res.id != 0) {
        Swal.fire(
          '',
          'Employee training details Saved Successfully.',
          'success'
        ).then(function () {
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
  get employeefeedback() {
    return this.employeedetail.get('employeefeedbacke')
  }

  keyPressNumber(event: any) {
    var charCode = (event.which) ? event.which : event.keyCode;
    // Only Numbers 0-9
    if ((charCode<48 ||charCode > 57)) {
      event.preventDefault();
      return false;
      
    } else {
      return true;
    }
  }
  // keyPress(event: any){
  //   if (charCode!.isEmpty) {
  //        return 'Please enter the Overall Rating';
  //        } else if (charCode < 1 ||  > 10) {
  //         return 'The rating must be between 1 and 10';
  //      }
  //       return null;
  // }

  
  // validator (value) {
  //   if (value!.isEmpty) {
  //     return 'Please enter the Overall Rating';
  //   } else if (parse(value) < 1 || int.parse(value) > 10) {
  //     return 'The rating must be between 1 and 10';
  //   }
  //   return null;
  // }

  validateAllFormFields(employeedetail: FormGroup) {
    Object.keys(employeedetail.controls).forEach(field => {  //{2}
      const control = employeedetail.get(field);             //{3}
      if (control instanceof FormControl) {             //{4}
        control.markAsTouched({ onlySelf: true });
      } else if (control instanceof FormGroup) {        //{5}
        this.validateAllFormFields(control);            //{6}
      }
    });
  }
  disableDate() {
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
  onOptionsSelectedto(event){
    debugger
    const value = event.target.value;
    this.SvcPhcPatient.getphcdetailById(this.systemReport.get('selectPHC').value).subscribe(data => {
      this.getphcdetail= data
      this.UserId =this.getphcdetail.userId;
     })
  }

  onOptionsSelected(event) {
    const value = event.target.value;
    this.SvcPhcPatient.getphcdetailById(this.employeedetail.get('PHCsName').value).subscribe(data => {
      this.getphcdetail = data
      let empName = this.getphcdetail.employeeName;
      this.UserId = this.getphcdetail.userId;
      this.employeedetail.patchValue({
        employeenmame:this.getphcdetail.employeeName
      })
      // this.EmployeeName(empName);
    })
  }
  onOptionSelected(event) {
    debugger;
    const value = event.target.value;
    const v1 = this.spokeMaintenance.get('selectPHC').value;
    this.SvcPhcPatient.getphcdetailById(
      this.spokeMaintenance.get('selectPHC').value
    ).subscribe((data) => {
      this.getphcdetail = data;
      let empName = this.getphcdetail.phcname;
      this.selectPHCName = empName;
      this.moname = this.getphcdetail.moname;
    });
  }

  ListDistrict: any;
  GetDistrict() {
    this.userObjFromToken = this.svcLocalstorage.GetData(
      environment.AuthTokenKeyLSKey
    );
    if (this.userObjFromToken) {
      this.SvcPhcPatient.setdistrictMaster().subscribe((data: any) => {
        console.log(data, 'this is GetAllPHC data');
        this.ListDistrict = data;
      });
    }
  }
  ListBlock: any;
  GetAllBlock() {
    debugger;
    this.userObjFromToken = this.svcLocalstorage.GetData(
      environment.AuthTokenKeyLSKey
    );
    if (this.userObjFromToken) {
      this.svc_masterServices.GetAllBlockMaster().subscribe((data: any) => {
        console.log(data, 'this is GetAllPHC data');
        this.ListBlock = data;
      });
    }
  }


  onFileChange(event: any) {
    debugger;
    this.selectedFile = event.target.files[0];

    // const reader = new FileReader();

    // if (event.target.files && event.target.files.length) {
    //   const [file] = event.target.files;
    //   reader.readAsDataURL(file);

    //   reader.onload = () => {

    //     this.imageSrc = reader.result as string;
    //     //this.DoctorDetails.detailsDTO.photo=this.imageSrc.replace("/^data:image\/[a-z]+;base64,/","")
    //     //this.DoctorDetails.detailsDTO.photoNewUpdate = this.imageSrc.split(',')[1];
    //     this.spokeMaintenance.patchValue({
    //       fileSource: reader.result
    //     });
    //   };
    //   this.isShown = this.isShown;

    // }
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
  savescopemaintenance() {
    debugger;
    this.userObjFromToken = this.svcLocalstorage.GetData(
      environment.AuthTokenKeyLSKey
    );
    this.validateAllFormFields(this.spokeMaintenance);
    let obj: any = {};
    obj.PhcId = this.spokeMaintenance.get('selectPHC').value;
    obj.file = this.selectedFile.name;
    const uploadImageData = new FormData();

    uploadImageData.append('File', this.selectedFile, this.selectedFile.name);
    obj.docname = this.spokeMaintenance.get('docname').value;

    let fileData = new FormData();
      fileData.append(`PhcId`, this.spokeMaintenance.get('selectPHC').value)
      fileData.append(`file`, this.selectedFile,this.selectedFile.name)
      fileData.append(`dateTime`, this.spokeMaintenance.get('maitenacedate').value)
      
    if (this.userObjFromToken) {
      this.Svc_PHCservice.UploadPHCDoc(fileData).subscribe(
        (res: any) => {
          if (res.id != 0) {
            Swal.fire(
              '',
              'Scope Document upload Successfully.',
              'success'
            ).then(function () {
              window.location.reload();
            });
          }
        },
        (error) => {
          this.loading = false;

          if (error.status === 500) {
            this.loading = false;

            this.error1 = true;
          } else if (error.status === 401) {
            this.loading = false;

            this.error1 = true;
          } else if (error.status === 400) {
            this.err = true;
            this.loading = false;
          }
        }
      );
    }
  }

  SetEmployeename(emp: any) {
    this.employeedetail.get('employeenmame').setValue(emp);
  }
  validateAllFormField(formGroup: FormGroup) {         //{1}
    Object.keys(formGroup.controls).forEach(field => {  //{2}
      const control = formGroup.get(field);             //{3}
      if (control instanceof FormControl) {             //{4}
        control.markAsTouched({ onlySelf: true });
      } else if (control instanceof FormGroup) {        //{5}
        this.validateAllFormFields(control);            //{6}
      }
    });

    function keyPressNumbers(event: Event, any: any) {
      throw new Error('Function not implemented.');
    }

  }
  ApiData: any[] = []
  GetHolidayList(params: any) {
    this.userObjFromToken = this.svcLocalstorage.GetData(
      environment.AuthTokenKeyLSKey
    );



    if (this.userObjFromToken) {
      this.Svc_HolidayCalenderService.GetHolidayList({ params }).subscribe(
        (data: any) => {
          this.ApiData = data;
          console.log(this.ApiData, 'this is GetHolidayList data');

        }
      );
    }
  }
  savesholidaycalendar() {
    let obj: any = {};
    obj.holidaydate = this.holidaycalendar.get('holidaydate').value;
    obj.holidaydiscrip = this.holidaycalendar.get('holidaydiscrip').value;

    let params = new HttpParams();
    params = params.append('holidayDate', obj.holidaydate);
    params = params.append('holidayName', obj.holidaydiscrip);

    console.log(obj, 'savesholidaycalendar clicked');

    this.userObjFromToken = this.svcLocalstorage.GetData(
      environment.AuthTokenKeyLSKey
    );
    if (this.userObjFromToken) {
      this.Svc_HolidayCalenderService.AddHoliday({ holidayDate: obj.holidaydate, holidayName: obj.holidaydiscrip }).subscribe(
        (data: any) => {

          console.log(data, 'this is AddHoliday data');
          let params2 = new HttpParams();
          params2 = params2.append('year', this.year);
          this.GetHolidayList(params2);

        }
      );
      (error) => {

        console.log("handal");

      }
    }

  }

  yearChange(value: any) {
    let params = new HttpParams();
    params = params.append('year', value);
    this.GetHolidayList(params);
    console.log(value);
    this.year = value;
  }
  value: any;
  SetMonthyear(value: any) {
    debugger
    let setmont = value.split('-')[0];
    this.year = value.split('-')[1]
    if (setmont == "Jan") {
      this.month = 1;
    }
    if (setmont == "Feb") {
      this.month = 1;
    }
    if (setmont == "Jan") {
      this.month = 2;
    }
    if (setmont == "Mar") {
      this.month = 3;
    }
    if (setmont == "Apr") {
      this.month = 4;
    }
    if (setmont == "May") {
      this.month = 5;
    }
    if (setmont == "Jun") {
      this.month = 6;
    }
    if (setmont == "Jul") {
      this.month = 7;
    }
    if (setmont == "Aug") {
      this.month = 8;
    }
    if (setmont == "Sep") {
      this.month = 9;
    }
    if (setmont == "Oct") {
      this.month = 10;
    }
    if (setmont == "Nov") {
      this.month = 12;
    }
    if (setmont == "Dec") {
      this.month = 12;
    }
  }



  months = [
    {
      "id": "Jan-2022",
      "name": "Jan-2022"
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
  savesystemreport() {
    debugger
    this.validateAllFormFields(this.systemReport);
    let obj: any = {};
    if (this.systemReport.get('month').value != null && this.systemReport.get('month').value != "") {
      this.SetMonthyear(this.systemReport.get('month').value);
    }
    let currentDateTime = this.datepipe.transform((new Date), 'yyyy-MM-dd');
    obj.id = 0;
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
    obj.createdOn = currentDateTime;
    obj.updatedOn = currentDateTime;
    obj.createdBy = this.UserId;
    obj.updatedBy = this.UserId;
    this.Svc_dashboardService.AddEquipmentUptimeReport(obj).subscribe((res: any) => {
      if (res.id != 0) {
        Swal.fire(
          '',
          'System Health Report Saved Successfully.',
          'success'
        ).then(function () {
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