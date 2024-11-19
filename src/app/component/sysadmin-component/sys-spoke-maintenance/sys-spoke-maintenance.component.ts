import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { environment } from 'src/environments/environment';
import { SvclocalstorageService } from 'src/app/services/services/svclocalstorage.service';
import { svc_dashboardService } from 'src/app/services/services/svc_dashboard.service';
import { SvcPhcGetPatientService } from 'src/app/services/services/svc-phc-get-patient.service';
import { Svc_MasterService } from 'src/app/services/services/svc_master.service';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { svc_PHCservice } from 'src/app/services/services/svc_PHC.service';
import { Svc_getdoctordetailService } from 'src/app/services/services/svc_getdoctordetail.service';
import { SvcAuthenticationService } from 'src/app/services/services/svc-authentication.service';
import { DatePipe } from '@angular/common';
import { SvcmainAuthserviceService } from 'src/app/services/services/svcmain-authservice.service';
import { ngxLoadingAnimationTypes } from 'ngx-loading';

@Component({
  selector: 'app-sys-spoke-maintenance',
  templateUrl: './sys-spoke-maintenance.component.html',
  styleUrls: ['./sys-spoke-maintenance.component.css']
})
export class SysSpokeMaintenanceComponent implements OnInit {
  invalidFileTypeError: boolean = false;
  maxDate = new Date();
  minDate = new Date();
  userObjFromToken: any;
  DoctorImagePath: string;
  imageSrc: string | undefined;
  getphcdetail: any = [];
  isShown = false;
  //selectedFile = File;
  selectedFile: any = new FormData();
  public ngxLoadingAnimationTypes = ngxLoadingAnimationTypes;
  loading = false;
  public config = {
    animationType: ngxLoadingAnimationTypes.none,
    backdropBorderRadius: '3px',
  };
  error1 = false;
  err = false;
  spokeMaintenance = new FormGroup({
    district: new FormControl(''),
    Block: new FormControl(''),
    selectPHC: new FormControl(''),
    maitenacedate: new FormControl(''),
    // selectPHCName: new FormControl(''),
    // selectMQ: new FormControl(''),
    docname: new FormControl('', [this.fileValidator.bind(this), Validators.required]),
  });
    

  router: any;
  constructor(
    private svcLocalstorage: SvclocalstorageService,
    private Svc_dashboardService: svc_dashboardService,
    private SvcPhcPatient: SvcPhcGetPatientService,
    private svc_masterServices: Svc_MasterService,
    private Svc_PHCservice: svc_PHCservice,
    private fb: FormBuilder,
    private Svc_getdoctordetailService: Svc_getdoctordetailService,
    private svcAuth: SvcAuthenticationService,
    public datepipe: DatePipe,
    public _sweetAlert: SvcmainAuthserviceService
  ) {

    //////////used to stop loader when their is error of 401 and 403////

    this._sweetAlert.getLoader().subscribe((res: any) => {
      this.loading = res
      console.log('med', this.loading)
    })

    /////////////////////////////////////////////////////////////

    // this.GetListOfPHCHospitalBlockWise();
    // this.openFirstDropdown(event);
  }

  ngOnInit(): void {

    this.GetAllPHC();
    this.GetDistrict();
    this.GetAllBlock();
    this.GetBlocksByDistrictID();
    this.spokeMaintenance = this.fb.group({
      district: ["", [Validators.required]],
      Block: [{ value: null, disabled: true }, [Validators.required]],
      selectPHC: [{ value: null, disabled: true }, [Validators.required]],
      maitenacedate: ['', [Validators.required]],
      docname: new FormControl('', [this.fileValidator.bind(this), Validators.required]),
      selectPHCName: ["", [Validators.required]],
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
  event: any;
  selectPHCName: any;
  moname: any;
  onOptionsSelected(event) {

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
  onFileChange(event: any) {
    const file = event.target.files?.[0]; // Get the selected file
    if (file) {
        const fileName: string = file.name.toLowerCase(); // Get the file name in lower case
        const isPDF = fileName.endsWith('.pdf'); // Check if the file name ends with .pdf
        const isXLSX = fileName.endsWith('.xlsx'); // Check if the file name ends with .xlsx

        if (isPDF || isXLSX) {
            this.selectedFile = file; // Set the selected file only if it's .pdf or .xlsx
        } else {
            // Reset the selected file and possibly show an error message
            this.selectedFile = undefined;
            // You might want to handle an error message or notification here
        }
    }
    const fileInput = event.target as HTMLInputElement;
    const fileNew = fileInput.files?.[0];

    if (fileNew) {
        const allowedFormats = ['application/pdf', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'];
        const isValidFormat = allowedFormats.includes(fileNew.type);

        if (!isValidFormat) {
            this.spokeMaintenance.get('docname')?.setErrors({ invalidFileFormat: true });
        } else {
            this.spokeMaintenance.get('docname')?.setErrors(null);
            this.spokeMaintenance.get('docname')?.markAsTouched();
        }
    }
}
  onFileChangeX(event: any) {
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
  get f() {
    return this.spokeMaintenance.controls;
  }
  ListOfPHC: any;
  GetAllPHC() {
    this.userObjFromToken = this.svcLocalstorage.GetData(
      environment.AuthTokenKeyLSKey
    );
    if (this.userObjFromToken) {
      this.Svc_dashboardService.GetAllPHC().subscribe((data: any) => {
        console.log(data, 'this is GetAllPHC data');
        this.ListOfPHC = data;
      });
    }
  }
  date: Date
  savescopemaintenance() {

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
    fileData.append(`file`, this.selectedFile, this.selectedFile.name)
    this.date = new Date(this.spokeMaintenance.get('maitenacedate').value);
    let latest_date = this.datepipe.transform(this.date, 'yyyy-MM-dd');
    console.log(latest_date, "datem")
    fileData.append(`dateTime`, latest_date)
    if (this.userObjFromToken) {
      this.loading = true
      this.Svc_PHCservice.UploadPHCDoc(fileData).subscribe(
        (res: any) => {
          if (res.id != 0) {
            Swal.fire(
              '',
              'Scope Document upload Successfully.',
              'success'
            ).then(function () {
            });
          }
          this.spokeMaintenance.reset()
          this.divisionlist = []
          this.blockList = []
          this.spokeMaintenance.patchValue({'Block': 'null'})
          this.spokeMaintenance.patchValue({'selectPHC': 'null'})
          this.moname = 'null'
          this.selectPHCName = 'null'
          this.loading = false
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
  ListBlocksByDistrictID: any;
  GetBlocksByDistrictID() {

    this.userObjFromToken = this.svcLocalstorage.GetData(
      environment.AuthTokenKeyLSKey
    );
    if (this.userObjFromToken) {
      this.svc_masterServices.GetBlocksByDistrictID(1).subscribe((data: any) => {

        this.ListBlocksByDistrictID = data;
        console.log(this.ListBlocksByDistrictID, 'GetBlocksByDistrictID');
      });
    }
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
        console.log(this.ListDistrict, "district")
      });
    }
  }
  // ListPhc: any;
  // GetListOfPHCHospitalBlockWise() {

  //   this.userObjFromToken = this.svcLocalstorage.GetData(
  //     environment.AuthTokenKeyLSKey
  //   );
  //   if (this.userObjFromToken) {
  //     this.Svc_getdoctordetailService.GetListOfPHCHospitalBlockWise().subscribe((data: any) => {
  //       console.log(data, 'this is GetAllPHC data');
  //       this.ListDistrict = data;
  //       console.log(this.ListDistrict,"district")
  //     });
  //   }
  // }
  divisionlist: any

  openDropdown(event) {

    this.changeDropDownValue('district')



    this.svc_masterServices.GetBlocksByDistrictID(event.target.value.split(':')[1]).subscribe(data => {
      this.spokeMaintenance.controls.Block.enable();
      this.spokeMaintenance.controls.Block;

      this.divisionlist = data

    })
  }
  blockName: any
  filters: []
  isthistrue: boolean
  blockList: any = []
  block: any = []

  openFirstDropdown(event: any) {

    this.isthistrue = true
    this.filters = event.target.value
    console.log(this.filters, "filter value");
    let a = this.divisionlist
    this.changeDropDownValue('block')
    // for (let i = 0; i < a.length; i++) {
    //   // let fltr = this.divisionlist[i]
    //   // if (this.filters == fltr.id) {
    //   //   this.blockName = this.divisionlist[i].block;
    //   //   break;
    //   // }
    // }
    const blockID = event.target.value.split(':')[1];
    this.Svc_getdoctordetailService.GetListOfPHCHospitalBlockWise({
      "blockID": blockID.trim()
    })

      .subscribe(data => {
        console.log(data, "phc data");
        this.spokeMaintenance.controls.selectPHC.enable();
        this.blockList = data;
        this.block = this.divisionlist.selectPHC
      })

  }



  //   districtlist: any=[];
  //   checkFirstDropdown($event){
  //     
  //     this.svc_masterServices.GetBlocksByDistrictID($event.target.value).subscribe(data => {
  //       this.spokeMaintenance.controls.Block.enable();
  //       this.districtlist= data;


  //   })
  // }

  // blocklist: any
  // isalltrue: boolean
  // filter: []
  // districtList: any = []
  // blockName: any[]
  // onFirstOptionsSelected(event: any) {
  //   this.isalltrue = true
  //   this.filter = event.target.value
  //   let a = this.districtlist
  //   for (let i = 0; i < a.length; i++) {
  //     let fltr = this.districtlist[i]
  //     if (this.filter == fltr.id) {
  //       this.blocklist = this.districtlist[i].blockName;
  //       break;
  //     }
  //     this.svc_masterServices.GetBlocksByDistrictID(this.filter).subscribe(data => {
  //       this.spokeMaintenance.controls.block.enable();
  //       this.districtList = data;
  //       this.blockName = this.districtList.blockName

  //     })
  //   }
  // }


  ListBlock: any;
  GetAllBlock() {
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

  validateAllFormFields(formGroup: FormGroup) {
    //{1}
    Object.keys(formGroup.controls).forEach((field) => {
      //{2}
      const control = formGroup.get(field); //{3}
      if (control instanceof FormControl) {
        //{4}
        control.markAsTouched({ onlySelf: true });
      } else if (control instanceof FormGroup) {
        //{5}
        this.validateAllFormFields(control); //{6}
      }
    });
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

  changeDropDownValue(value) {
    switch (value) {
      case 'district':
        {
          this.divisionlist = []
          this.blockList = []
          this.spokeMaintenance.controls['Block'].reset()
          this.spokeMaintenance.controls['selectPHC'].reset()
          this.spokeMaintenance.controls['maitenacedate'].reset()
          this.spokeMaintenance.controls['docname'].reset()
          this.spokeMaintenance.controls['selectPHCName'].reset()
          this.moname = ''
          this.selectPHCName = ''
          break;
        }

      case 'block': {

        this.blockList = []
        this.spokeMaintenance.controls['selectPHC'].reset()
        this.spokeMaintenance.controls['maitenacedate'].reset()
        this.spokeMaintenance.controls['docname'].reset()
        this.spokeMaintenance.controls['selectPHCName'].reset()
        this.moname = ''
        this.selectPHCName = ''
        break;
      }
    }


  }

}
