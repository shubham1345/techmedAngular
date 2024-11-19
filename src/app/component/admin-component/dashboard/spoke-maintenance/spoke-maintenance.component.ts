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

@Component({
  selector: 'app-spoke-maintenance',
  templateUrl: './spoke-maintenance.component.html',
  styleUrls: ['./spoke-maintenance.component.css'],
})
export class SpokeMaintenanceComponent implements OnInit {
  userObjFromToken: any;
  DoctorImagePath: string;
  imageSrc: string | undefined;
  getphcdetail: any = [];
  isShown = false;
  //selectedFile = File;
   selectedFile:any = new FormData();
  loading = false;
  error1 = false;
  err = false;
  spokeMaintenance = new FormGroup({
    district: new FormControl(''),
    Block: new FormControl(''),
    selectPHC: new FormControl(''),
    maitenacedate: new FormControl(''),
    selectPHCName: new FormControl(''),
    selectMQ: new FormControl(''),
    docname: new FormControl(''),
  });
  constructor(
    private svcLocalstorage: SvclocalstorageService,
    private Svc_dashboardService: svc_dashboardService,
    private SvcPhcPatient: SvcPhcGetPatientService,
    private svc_masterServices: Svc_MasterService,
    private Svc_PHCservice: svc_PHCservice,
    private fb: FormBuilder
  ) {
    this.GetAllPHC();
    this.GetDistrict();
    this.GetAllBlock();
  }

  ngOnInit(): void {
    this.spokeMaintenance = this.fb.group({
      district: ['', [Validators.required]],
      Block: ['', [Validators.required]],
      selectPHC: ['', [Validators.required]],
      maitenacedate: ['', [Validators.required]],
      docname: ['', [Validators.required]],
      selectPHCName: ['', [Validators.required]],
    });
  }
  event: any;
  selectPHCName: any;
  moname: any;
  onOptionsSelected(event) {
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
              'Scope Document upload Successfully',
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
}
