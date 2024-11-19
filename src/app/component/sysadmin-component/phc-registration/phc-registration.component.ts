import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { SvclocalstorageService } from 'src/app/services/services/svclocalstorage.service';
import { environment } from 'src/environments/environment';
import { svc_dashboardService } from 'src/app/services/services/svc_dashboard.service';
import { DatePipe, formatCurrency } from '@angular/common';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { svc_HolidayCalenderService } from 'src/app/services/services/svc_HolidayCalender.service';
import { SvcPhcGetPatientService } from 'src/app/services/services/svc-phc-get-patient.service';
import { svc_PHCservice } from 'src/app/services/services/svc_PHC.service';
import { Svc_MasterService } from 'src/app/services/services/svc_master.service';
import { HttpParams } from '@angular/common/http';
import { Svc_getdoctordetailService } from 'src/app/services/services/svc_getdoctordetail.service'
import { SvcAuthenticationService } from 'src/app/services/services/svc-authentication.service';
import { map, Observable, startWith } from 'rxjs';
import { MdbModalRef, MdbModalService } from 'mdb-angular-ui-kit/modal';

import { RegisterSuccesfulPopupComponent } from 'src/app/component/shared-component/register-succesful-popup/register-succesful-popup.component';
import { ngxLoadingAnimationTypes } from 'ngx-loading';
import { SvcmainAuthserviceService } from 'src/app/services/services/svcmain-authservice.service';



@Component({
  selector: 'app-phc-registration',
  templateUrl: './phc-registration.component.html',
  styleUrls: ['./phc-registration.component.css']
})
export class PHCRegistrationComponent implements OnInit {
  public ngxLoadingAnimationTypes = ngxLoadingAnimationTypes;
  dropdownList = [];
  selectedItems = [];
  dropdownSettings = {};
  sucessRegister: MdbModalRef<RegisterSuccesfulPopupComponent> | null = null;
  loading = false;
  public config = {
    animationType: ngxLoadingAnimationTypes.none,
    backdropBorderRadius: '3px',
  };
  isphcregistrationInput: boolean = false
  isphcregistrationSelection: boolean = true
  isInput: boolean = false
  isSelection: boolean = true
  myControl = new FormControl('');
  options: string[] = ['One', 'Two', 'Three'];
  maxDate = new Date();

  year = 0;
  month = 0;
  userObjFromToken: any;

  error1 = false;
  err = false;
  EmployeeNameset = "";
  UserId = 0;
  isShown = false;
  getphcdetail: any = [];
  ProfileDP = '';
  emailRegex=new RegExp( /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i)

  
  phcregistration:FormGroup
  router: any;

  constructor(private svcLocalstorage: SvclocalstorageService,
    private Svc_dashboardService: svc_dashboardService,
    public datepipe: DatePipe,
    private SvcPhcPatient: SvcPhcGetPatientService,
    private svc_masterServices: Svc_MasterService,
    private Svc_PHCservice: svc_PHCservice,
    private fb: FormBuilder,
    private Svc_HolidayCalenderService: svc_HolidayCalenderService,
    private Svc_getdoctordetailService: Svc_getdoctordetailService,
    private svcAuth: SvcAuthenticationService,
    private _sweetAlert:SvcmainAuthserviceService) {

                        //////////used to stop loader when their is error of 401 and 403////

                        this._sweetAlert.getLoader().subscribe((res:any)=>{
                          this.loading=res
                          console.log('med',this.loading)
                        })
                    
                        /////////////////////////////////////////////////////////////

    // this.GetAllPHC();
    // this.GetDistrict();
    // this.GetAllBlock();
    // this.GetAllDivisionMaster();
    // this.GetAllStateMaster();
    // // this.GetAllSpecialization();
    // this.GetAllClusterMaster();
    // this.GetDistrictsByDivisionID();
    // this.GetBlocksByDistrictID();
    // this.GetListOfSubSpecializationMaster();
    // this.GetState();


  this.GetAllPHCName();

  }
  filteredOptions: Observable<string[]>;
  ngOnInit(): void {
    this.GetAllStateMaster();
    // this.GetAllSpecialization();
    this.GetAllClusterMaster();
    this.phcregistration = this.fb.group({
      phcname: ['', [Validators.required]],
      phczone: ['', [Validators.required]],
      state: ['', [Validators.required]],
      district: [{ value: null, disabled: true }, [Validators.required]],
      block: [{ value: null, disabled: true }, [Validators.required]],
      division: [{ value: null, disabled: true }, [Validators.required]],
      moname: ['', [Validators.required]],
      registeredemailid: ['', [Validators.pattern(this.emailRegex), Validators.required]],
      registeredmobilenumber: ['', [Validators.required]],
      employeename: ['', [Validators.required]],
    });
    this.filteredOptions = this.phcregistration.get("phcname").valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value || '')),
    );
  }
  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.phcValue.filter(option => option.toLowerCase().includes(filterValue));
  }
  // phc_Registration(){
  //   this.router.navigate(['PHC-Rgistration'])
  // }
  ListCluster: any = [];
  listClusterId: any
  GetAllClusterMaster() {

    this.userObjFromToken = this.svcLocalstorage.GetData(
      environment.AuthTokenKeyLSKey
    );
    if (this.userObjFromToken) {
      this.svc_masterServices.GetAllClusterMaster().subscribe((data: any) => {

        this.ListCluster = data;
        this.clusterlist = [];
        // this.ListCluster.forEach((element , i) => {
        //   this.ListCluster[i].id
        //   console.log(this.ListCluster[i].id)
        // });
        this.ListCluster.map((response) => {
          console.log(response.id, "============");
          this.listClusterId = response.id
          console.log(this.listClusterId, "listClusterId")
          //  return response.id
        })
        // this.GetDivisionsByClusterID(this.listClusterId);

        console.log(this.ListCluster, 'cluster');
      });
    }
  }
  clusterlist: any = [];
  eventdivisionList: boolean = true
  checkFirstDropdown($event) {

    this.svc_masterServices.GetDivisionsByClusterID($event.target.value).subscribe(data => {
      this.phcregistration.controls.division.enable();
      this.clusterlist = data;
      this.districtlist = [];
    })
  }
  districtlist: any
  istrue: boolean
  filtered: []
  divisionList: any = []
  districtName: any[]
  onFirstOptionsSelected(event: any) {




    this.istrue = true
    this.filtered = event.target.value
    this.svc_masterServices.GetDistrictsByDivisionID(this.filtered).subscribe(data => {
      this.phcregistration.controls.district.enable();
      this.divisionList = data;
      this.districtName = this.divisionList.districtName
      this.blocklist = [];
    })

    // let a = this.clusterlist
    // for (let i = 0; i < a.length; i++) {
    //   let fltr = this.clusterlist[i]
    //   if (this.filtered == fltr.id) {
    //     this.districtlist = this.clusterlist[i].districtName;
    //     break;
    //   }

    // }
  }

  blocklist: any
  isalltrue: boolean
  filter: []
  districtList: any = []
  blockName: any[]
  onSecondOptionsSelected(event: any) {
    this.isalltrue = true
    this.filter = event.target.value
    this.svc_masterServices.GetBlocksByDistrictID(this.filter).subscribe(data => {
      this.phcregistration.controls.block.enable();
      this.districtList = data;
      this.blockName = this.districtList.blockName

    })
    // let a = this.divisionList
    // for (let i = 0; i < a.length; i++) {
    //   let fltr = this.divisionList[i]
    //   if (this.filter == fltr.id) {
    //     this.blocklist = this.divisionList[i].blockName;
    //     break;
    //   }

    // }
  }
  ListState: any;
  GetAllStateMaster() {

    this.userObjFromToken = this.svcLocalstorage.GetData(
      environment.AuthTokenKeyLSKey
    );
    if (this.userObjFromToken) {
      this.svc_masterServices.GetAllStateMaster().subscribe((data: any) => {

        this.ListState = data;
        console.log(this.ListState, 'state');
      });
    }
  }
  event: any;
  selectPHCName: any;
  moname: any;
  keyPress(event: any) {
    var charCode = (event.which) ? event.which : event.keyCode;
    // Only Numbers 0-9
    if ((charCode < 48 || charCode > 57)) {
      event.preventDefault();
      return false;
    } else {
      return true;
    }
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
  UpdatePHCRegistration() {

    if(this.phcregistration.invalid)
    {
      this.phcregistration.markAllAsTouched()
    }
    else{

    if (this.phcregistration.value) {


      let updatePHCDTO
      = {
        "id": this.searchlist.phcId,
        "clusterId": this.phcregistration.controls['phczone'].touched ? this.phcregistration.get('phczone').value : this.searchlist.clusterId,
        "divisionId": this.phcregistration.controls['division'].touched ? this.phcregistration.get('division').value : this.searchlist.divisionID,
        "districtId": this.phcregistration.controls['district'].touched ? this.phcregistration.get('district').value : this.searchlist.districtID,
        "blockId": this.phcregistration.controls['block'].touched ? this.phcregistration.get('block').value : this.searchlist.bLockID,
        "phoneNo": this.phcregistration.get('registeredmobilenumber').value,
        "moname": this.phcregistration.get('moname').value,
        "updatedBy": 11,
        "employeeName": this.phcregistration.get('employeename').value,
      }

      // let formval= this.phcregistration.value
      // formval.phcname

      // obj.phcname = this.phcregistration.get('phcname').value;
      // obj.clusterId = this.phcregistration.get('phczone').value;
      // obj.divisionId = this.phcregistration.get('division').value;
      // obj.districtId = this.phcregistration.get('district').value;
      // obj.blockId = this.phcregistration.get('block').value;
      // obj.moname = this.phcregistration.get('moname').value;
      // obj.mailId = this.phcregistration.get('registeredemailid').value;
      // obj.phoneNo = this.phcregistration.get('registeredmobilenumber').value;
      // obj.employeeName = this.phcregistration.get('employeename').value;
      // obj.stateId = 1
      // obj.address = "abc"
      // obj.userId = 1

      // obj.id = this.phcregistration.get('phcname').value;
      // obj.clusterId = this.phcregistration.get('phczone').value;
      // obj.divisionId = this.phcregistration.get('division').value;
      // obj.districtId = this.phcregistration.get('district').value;
      // obj.blockId = this.phcregistration.get('block').value;
      // obj.phoneNo = this.phcregistration.get('registeredmobilenumber').value;
      // obj.moname = this.phcregistration.get('moname').value;
      // obj.updatedBy = 11;
      // obj.employeeName = this.phcregistration.get('employeename').value;
      this.loading = true;
      console.log(updatePHCDTO);
      JSON.stringify(updatePHCDTO);
      console.log(JSON.stringify(updatePHCDTO), 'JSON');

      this.SvcPhcPatient.UpdatePHCDetails(updatePHCDTO).subscribe((res: any) => {
        this.loading = false;
        Swal.fire({
          title: 'Success',
          text: `You submitted succesfully`,
          icon: 'success',
        }).then(function () {
          window.location.reload();
        })
        console.log(res, "res")
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
          else if (error.errorMessage = true) {
            this.iserrorPhone = true;
            Swal.fire({
              title: 'Already in system',
              text: `PHC name and Email is already in system!`,
              icon: 'warning',
            })
            //  alert(error.errorMessage);
          }

        }
      )

    }
    else {
      Swal.fire({
        title: 'PHC Already Registered',
        text: `Something went wrong`,
        icon: 'warning',
      })
    }
  }
  }




  iserrorPhone: boolean
  phcRegistration() {


    // this.userObjFromToken = this.svcLocalstorage.GetData(
    //   environment.AuthTokenKeyLSKey
    // );

    if(this.phcregistration.invalid)
    {
      this.phcregistration.markAllAsTouched()
    
    }
    else{


    this.validateAllFormFields(this.phcregistration);

    if (this.phcregistration.value) {

      let obj: any = {};

      // let formval= this.phcregistration.value
      // formval.phcname

      obj.phcname = this.phcregistration.get('phcname').value;
      obj.clusterId = this.phcregistration.get('phczone').value;
      obj.divisionId = this.phcregistration.get('division').value;
      obj.districtId = this.phcregistration.get('district').value;
      obj.blockId = this.phcregistration.get('block').value;
      obj.moname = this.phcregistration.get('moname').value;
      obj.mailId = this.phcregistration.get('registeredemailid').value;
      obj.phoneNo = this.phcregistration.get('registeredmobilenumber').value;
      obj.employeeName = this.phcregistration.get('employeename').value;
      obj.stateId = 1
      obj.address = "abc"
      obj.userId = 1


      console.log(obj)
      if (obj.phcname == ""||obj.clusterId == "" ||  obj.divisionId == ""|| obj.blockId == ""||  obj.moname == ""||  obj.mailId== "" ||  obj.phoneNo== "" ||  obj.employeeName  == "") {
        return false
      }
      this.loading = true;
      this.SvcPhcPatient.phcRegister(obj).subscribe((res: any) => {
        this.loading = false;
        Swal.fire({
          title: 'Success',
          text: `You submitted succesfully`,
          icon: 'success',
        }).then(function () {
          window.location.reload();
        })
        console.log(res, "res")
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
          else if (error.errorMessage = true) {
            this.iserrorPhone = true;
            Swal.fire({
              title: 'Already in system',
              text: `PHC name and Email is already in system!`,
              icon: 'warning',
            })
            //  alert(error.errorMessage);
          }

        }
      )

    }
    else {
      Swal.fire({
        title: 'PHC Already Registered',
        text: `Something went wrong`,
        icon: 'warning',
      })
    }
  }
  }
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
  emailkey(event: any) {
    var charCode = (event.which) ? event.which : event.keyCode;
    // Only Numbers 0-9
    if ((charCode > 47 && charCode < 58) || (charCode > 63 && charCode < 91) || (charCode > 96 && charCode < 123) || (charCode == 46)) {
      return true;
    }
    else {
      return false;
    }
  }
  keyUpphone(event: any) {
    if (event.target.value == '') {
      this.iserrorPhone = false;
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
  onSearchPhcName() {
    this.GetAllPHCName();
  }
  phcValue: any = [];
  GetAllPHCName() {

    // let obj: any = {}
    // console.log(this.phcregistration.get('phcname').value);

    // obj.emailSearch = this.phcregistration.get('phcname').value;
    this.userObjFromToken = this.svcLocalstorage.GetData(environment.AuthTokenKeyLSKey);
    if (this.userObjFromToken) {
      this.SvcPhcPatient.GetAllPHCName().subscribe(data => {
        this.phcValue = data
        console.log(this.phcValue, "lkioo");
        return this.phcValue
      })
    }

  }
  searchlist: any = [];
  firstName: any;
  searchname($event) {
  
    this.SvcPhcPatient.GetPHCDetailByName($event).subscribe(data => {
      this.searchlist = data;
      console.log(this.searchlist, 'search')
      if (data) {
        this.isphcregistrationInput = true
        this.isphcregistrationSelection = false

        this.isInput = true;
        this.isSelection = false;
        this.phcregistration.patchValue({
          // firstname: this.searchlist.detailsDTO.firstName,
          employeename: this.searchlist.employeeName,
          phcname: this.searchlist.phcname,
          phczone: this.searchlist.clusterName,
          state: this.searchlist.state,
          district: this.searchlist.district,
          block: this.searchlist.bLockName,
          division: this.searchlist.division,
          moname: this.searchlist.moname,
          registeredemailid: this.searchlist.mailId,
          registeredmobilenumber: this.searchlist.phoneNo,
          // employeename: this.searchlist.employeeName,

        })
      }

    })


  }
  onSelection($event) {

    this.searchname($event.source.value)

  }
  clear() {

    this.isphcregistrationInput = false;
    this.isphcregistrationSelection = true;

    // this.phcregistration.reset();
    this.phcregistration.patchValue({
      // firstname: this.searchlist.detailsDTO.firstName,
      employeename: '',
      phcname: '',
      phczone: '',
      state: '',
      district: '',
      block: '',
      division: '',
      moname: '',
      registeredemailid: '',
      registeredmobilenumber: '',
      // employeename: this.searchlist.employeeName,

    })
  }
  click() {
    this.isInput = false;
    this.isSelection = true;

  }

}
