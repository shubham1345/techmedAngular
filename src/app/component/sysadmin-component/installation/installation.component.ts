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
  selector: 'app-installation',
  templateUrl: './installation.component.html',
  styleUrls: ['./installation.component.css']
})
export class InstallationComponent implements OnInit {

  public ngxLoadingAnimationTypes = ngxLoadingAnimationTypes;
  public config = {
    animationType: ngxLoadingAnimationTypes.none,
    backdropBorderRadius: '3px',
  };
loading:boolean=false;

  router: any;
  installationForm:FormGroup
  userObjFromToken:any
  DistrictArray=[];
  blockArray:any=[]
  phcArray:any=[]
  constructor(
    private svcLocalstorage: SvclocalstorageService,
    private Svc_dashboardService: svc_dashboardService,
    private SvcPhcPatient: SvcPhcGetPatientService,
    private svc_masterServices: Svc_MasterService,
    private Svc_PHCservice: svc_PHCservice,
    private _fb: FormBuilder,
    private Svc_getdoctordetailService: Svc_getdoctordetailService,
    private svcAuth: SvcAuthenticationService,
    public datepipe: DatePipe,
    public _sweetAlert:SvcmainAuthserviceService
  ) {

  

    this.installationForm=this._fb.group({
      district:[null,Validators.required],
      block:[{ value: null, disabled: true },Validators.required],
            phcid:[{ value: null, disabled: true },Validators.required],
            date:['',Validators.required],
            file: ['', [this.fileValidator.bind(this), Validators.required]],
            moname1:[{value:'',disabled:true} ,Validators.compose([Validators.required])],
            //temp:[{value:null,disabled:true}]
           
          

    })
    
  
                      //////////used to stop loader when their is error of 401 and 403////

                      this._sweetAlert.getLoader().subscribe((res:any)=>{
                        this.loading=res
                        console.log('med',this.loading)
                      })
                  
                      /////////////////////////////////////////////////////////////
    

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

  ngOnInit(): void {
    this.GetDistrict()
    console.log(this.installationForm.value,'ppppppppppppp');
    
  }


  GetDistrict() {
    this.userObjFromToken = this.svcLocalstorage.GetData(
      environment.AuthTokenKeyLSKey
    );
    if (this.userObjFromToken) {
      this.loading=true;
      this.SvcPhcPatient.setdistrictMaster().subscribe((data: any) => {
        this.loading=false
        console.log(data, 'this is GetAllPHC data');
        this.DistrictArray = data;
      },(err:any)=>{
        this.loading=false
        this.DistrictArray=[]
      });
    }
  }

  selectDistrict(event:any)
  {
   
    this.clear('district')
    this.svc_masterServices.GetBlocksByDistrictID(event.target.value).subscribe(data => {
      this.blockArray = data
      this.installationForm.controls['block'].enable()
    },(err:any)=>{
      this.blockArray=[]
      this.installationForm.controls['block'].disable()
    })
  }

  selectBlock(event:any)
  {
    this.clear('block')
    this.Svc_getdoctordetailService.GetListOfPHCHospitalBlockWise({
      "blockID": event.target.value.trim()
    })

      .subscribe(data => {
        console.log(data, "phc data");
        this.installationForm.controls['phcid'].enable();
        this.phcArray = data;
        // this.block = this.divisionlist.selectPHC
      },(err:any)=>{
        this.phcArray=[]
        this.installationForm.controls['phcid'].disable();
        if(err.status==404)
        {
          this._sweetAlert.sweetAlert('No Phc is found','error')
        }
      })
  }



  selectPHC(event:any)
  {
   this.installationForm.controls.moname1.disable()

    let phcName=event.target.selectedOptions[0].outerText
      this.SvcPhcPatient.GetPHCDetailByName(phcName).subscribe((data:any) => {
   
this.installationForm.controls['moname1'].setValue(data.moname)
//this.installationForm.controls['temp'].setValue(data.moname)
console.log(this.installationForm.value,'ooooooo');

if(!data.moname)
{

  this.installationForm.controls.moname1.enable()
}

  
      })
  

  
    
  }
  onFileChange(event: any) {
    const fileOne = event.target.files?.[0]; // Get the selected file
    if (fileOne) {
        const fileName: string = fileOne.name.toLowerCase(); // Get the file name in lower case
        const isPDF = fileName.endsWith('.pdf'); // Check if the file name ends with .pdf
        const isXLSX = fileName.endsWith('.xlsx'); // Check if the file name ends with .xlsx

        if (isPDF || isXLSX) {
            this.installationForm.get('file').setValue(fileOne,{emitModelToViewChange: false});
        } else {
            this.installationForm.get('file').setValue(null);
            // Handle error message or notification for invalid file format here if needed
        }
    }
    const fileInput = event.target as HTMLInputElement;
    const fileNew = fileInput.files?.[0];

    if (fileNew) {
        const allowedFormats = ['application/pdf', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'];
        const isValidFormat = allowedFormats.includes(fileNew.type);

        if (!isValidFormat) {
            this.installationForm.get('file')?.setErrors({ invalidFileFormat: true });
        } else {
            this.installationForm.get('file')?.setErrors(null);
            this.installationForm.get('file')?.markAsTouched();
        }
    }
}
  onFileChangeX(event:any)
  {
    this.installationForm.get('file').setValue(event.target.files[0], {emitModelToViewChange: false});
    //this.installationForm.patchValue({file:event.target.files[0],{emitModelToViewChange: false}})
  }

  saveInstallation()
  {
console.log(this.installationForm.value);

    console.log(this.installationForm.getRawValue())
    console.log(this.installationForm.value.moname1)
  
    if(this.installationForm.invalid)
    {
      this.installationForm.markAllAsTouched()
    }
    else{
      this.loading=true
       this.Svc_PHCservice.uploadPhcDetails(this.installationForm.getRawValue()).subscribe((res:any)=>{
        this.loading=false
        this._sweetAlert.sweetAlert('File successfully uploaded','success');
        this.installationForm.reset()
       },(err:any)=>{
        this.loading=false
       if(err.status==400)
       {
        this._sweetAlert.sweetAlert('','error')
       }
       else{
        this._sweetAlert.sweetAlert('Network Error,Please Try Agian After Some Time','info')
       }
       })
    }
  }

  Date()
  {  
    return new Date()
  }

  clear(value:any)
  {
if(value=='district')
{
  this.blockArray=[]
  this.phcArray=[]
  this.installationForm.controls['block'].disable(),
  this.installationForm.controls['phcid'].disable(),
  this.installationForm.controls['moname1'].disable(),
  this.installationForm.controls['block'].reset(),
  this.installationForm.controls['phcid'].reset(),
  this.installationForm.controls['date'].reset(),
  this.installationForm.controls['moname1'].reset()
  this.installationForm.updateValueAndValidity()

  console.log(this.installationForm.value,'dis')

}
else if(value=='block')
{
  
  this.phcArray=[]
  this.installationForm.controls['moname1'].disable(),
  this.installationForm.controls['phcid'].disable()
  this.installationForm.controls['phcid'].reset(),
  this.installationForm.controls['date'].reset(),
  this.installationForm.controls['moname1'].reset()
  this.installationForm.updateValueAndValidity()
  console.log(this.installationForm.value,'bokc')

}
  }

 }
