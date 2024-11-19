import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SvclocalstorageService } from 'src/app/services/services/svclocalstorage.service';
import { SvcAuthenticationService } from 'src/app/services/services/svc-authentication.service';
import { SuperadminService } from '../../../services/services/superadmin.service'
import { environment } from 'src/environments/environment';
import { SvcmainAuthserviceService } from 'src/app/services/services/svcmain-authservice.service'
import { Svc_MasterService } from 'src/app/services/services/svc_master.service';
import { ngxLoadingAnimationTypes } from 'ngx-loading';
import { svc_dashboardService } from 'src/app/services/services/svc_dashboard.service';
import { MatSelect } from '@angular/material/select';
import { MatOption } from '@angular/material/core';

@Component({
  selector: 'app-super-admin-allow-access',
  templateUrl: './super-admin-allow-access.component.html',
  styleUrls: ['./super-admin-allow-access.component.css']
})
export class SuperAdminAllowAccessComponent implements OnInit {
  createReportAccess: FormGroup
  govUsers: any
  GovUserID: any
  govUserMobile: any
  govUserEmail: any
  clusterData: any
  divisionData: any
  districtData: any
  blockData: any
  showUserDetail: boolean = false
  filterListOfGov: any


  allSelected = false;
  allSelectedDivi = false;
  allSelectedDis = false;
  allSelectedBlo = false;

  loading: boolean = false
  public ngxLoadingAnimationTypes = ngxLoadingAnimationTypes;
  public config = {
    animationType: ngxLoadingAnimationTypes.none,
    backdropBorderRadius: '3px',
  };

  constructor(private svcLocalstorage: SvclocalstorageService, private _superadmin: SuperadminService, private _sweetalert: SvcmainAuthserviceService,
    private svcAuth: SvcAuthenticationService, private _fb: FormBuilder, private svcMaster: Svc_MasterService, private svcDashboard: svc_dashboardService) {
    this.createReportAccess = this._fb.group({
      userid: [null, Validators.required],
      clusterIDs: [[], Validators.required],
      divisionIDs: [],
      districtIDs: [],
      blockIDs: [],
    })

    this._sweetalert.getLoader().subscribe((res: any) => {
      this.loading = res
    })
  }


  ngOnInit(): void {
    this.getGovUsers()
    this.GetAllClusterMaster();

  }
  @ViewChild('select') select: MatSelect;
  @ViewChild('selectDivi') selectDivi: MatSelect;
  @ViewChild('selectDis') selectDis: MatSelect;
  @ViewChild('selectBlo') selectBlo: MatSelect;




  toggleAllSelection() {
    if (this.allSelected) {
      this.select.options.forEach((item: MatOption) => item.select());
    } else {
      this.select.options.forEach((item: MatOption) => item.deselect());
    }
    this.ClusterChange()

  }
  optionClick() {
    let newStatus = true;
    this.select.options.forEach((item: MatOption) => {
      if (!item.selected) {
        newStatus = false;
      }
    });
    this.allSelected = newStatus;
    this.ClusterChange()

  }
  ClusterChange() {
    let newDivisionIDs = [];

    this.svcMaster.GetDivisionsByClusterIDs(this.createReportAccess.value.clusterIDs).subscribe({
      next: (data: any) => {
        this.divisionData = data;
        Object.values(this.createReportAccess.value.divisionIDs).forEach(o => {
          this.divisionData.forEach(d => {
            if (d.id == o) {
              newDivisionIDs.push(o);
            }
          })
        });
        this.divisionData.length == newDivisionIDs.length ? (this.allSelectedDivi = true) : (this.allSelectedDivi = false)

        this.createReportAccess.get('divisionIDs').setValue(newDivisionIDs);
        this.DivisionChange()
      }, error: (err: any) => {
        this.loading = false
        this._sweetalert.sweetAlert('SomeThing Went Wrong,Please refresh the page or check your Internet connection', 'error')
      }
    })
  }

  toggleAllSelectionDivi() {
    if (this.allSelectedDivi) {
      this.selectDivi.options.forEach((item: MatOption) => item.select());
    } else {
      this.selectDivi.options.forEach((item: MatOption) => item.deselect());
    }
    this.DivisionChange()
  }
  optionClickDivi() {
    let newStatus = true;
    this.selectDivi.options.forEach((item: MatOption) => {
      if (!item.selected) {
        newStatus = false;
      }
    });
    this.allSelectedDivi = newStatus;
    this.DivisionChange()
  }
  DivisionChange() {
    let newDistrictIDs = [];

    this.svcMaster.GetDistrictsByDivisionIDs(this.createReportAccess.value.divisionIDs).subscribe({
      next: (data: any) => {
        this.districtData = data;

        Object.values(this.createReportAccess.value.districtIDs).forEach(obj => {
          this.districtData.forEach(dis => {
            if (dis.id == obj) {
              newDistrictIDs.push(obj);
            }
          })
        });
        this.districtData.length == newDistrictIDs.length ? (this.allSelectedDis = true) : (this.allSelectedDis = false)

        this.createReportAccess.get('districtIDs').setValue(newDistrictIDs);
        this.DistrictChange()
      }, error: (err: any) => {
        this.loading = false
        this._sweetalert.sweetAlert('SomeThing Went Wrong,Please refresh the page or check your Internet connection', 'error')
      }

    })
  }


  toggleAllSelectionDis() {
    if (this.allSelectedDis) {
      this.selectDis.options.forEach((item: MatOption) => item.select());
    } else {
      this.selectDis.options.forEach((item: MatOption) => item.deselect());
    }
    this.DistrictChange()
  }
  optionClickDis() {
    let newStatus = true;
    this.selectDis.options.forEach((item: MatOption) => {
      if (!item.selected) {
        newStatus = false;
      }
    });
    this.allSelectedDis = newStatus;
    this.DistrictChange()
  }
  DistrictChange() {
    let newBlockIDs = [];

    this.svcMaster.GetBlocksByDistrictIDs(this.createReportAccess.value.districtIDs).subscribe({
      next: (data: any) => {
        this.blockData = data;

        Object.values(this.createReportAccess.value.blockIDs).forEach(ob => {
          this.blockData.forEach(blo => {
            if (blo.id == ob) {
              newBlockIDs.push(ob);
            }
          })
        });
        this.blockData.length == newBlockIDs.length ? (this.allSelectedBlo = true) : (this.allSelectedBlo = false)

        this.createReportAccess.get('blockIDs').setValue(newBlockIDs);

        this.loading = false
      }, error: (err: any) => {
        this.loading = false
        this._sweetalert.sweetAlert('SomeThing Went Wrong,Please refresh the page or check your Internet connection', 'error')
      }
    })
  }

  toggleAllSelectionBlo() {
    if (this.allSelectedBlo) {
      this.selectBlo.options.forEach((item: MatOption) => item.select());

    } else {
      this.selectBlo.options.forEach((item: MatOption) => item.deselect());
    }
  }
  optionClickBlo() {
    let newStatus = true;
    this.selectBlo.options.forEach((item: MatOption) => {
      if (!item.selected) {
        newStatus = false;
      }
    });
    this.allSelectedBlo = newStatus;
  }

  displayFn(value?: any) {
    if (value != null || value != undefined) {
      this.loading = true;
      this.showUserDetail = true
      this.govUserMobile = value.mobile
      this.govUserEmail = value.email

      this.GovUserID = value.userID;

      this.svcMaster.GetPhcAccessMasterByUserID(value.userID).subscribe({
        next: (data: any) => {
          data.clusterIDs.length == 2 ? (this.allSelected = true) : (this.allSelected = false)

          if (data.clusterIDs.length > 0) {
            this.createReportAccess.get('clusterIDs').setValue(data.clusterIDs);
            this.createReportAccess.get('divisionIDs').setValue(data.divisionIDs);
            this.createReportAccess.get('districtIDs').setValue(data.districtIDs);
            this.createReportAccess.get('blockIDs').setValue(data.blockIDs);
            this.ClusterChange();
          }
          else {
            this.allSelected = false;
            this.allSelectedDivi = false;
            this.allSelectedDis = false;
            this.allSelectedBlo = false;

            this.divisionData = [];
            this.districtData = [];
            this.blockData = [];

            this.createReportAccess.get('clusterIDs').setValue([]);
            this.createReportAccess.get('divisionIDs').setValue([]);
            this.createReportAccess.get('districtIDs').setValue([]);
            this.createReportAccess.get('blockIDs').setValue([]);
            
            this.loading = false
          }
        }, error: (err: any) => {
          this.loading = false
          this._sweetalert.sweetAlert('SomeThing Went Wrong,Please refresh the page or check your Internet connection', 'error')
        }
      })
    }
    return value ? value.email : undefined
  }

  getGovUsers() {
    this.loading = true
    this._superadmin.GetAllGovUser().subscribe({

      next: (res: any) => {
        this.govUsers = res.filter((res: any) => res.name != null)
        this.loading = false
      },
      error: (err: any) => {
        this.govUsers = []
        this.loading = false
        this._sweetalert.sweetAlert('SomeThing Went Wrong,Please refresh the page or check your Internet connection', 'error')
      }
    })
  }

  GetAllClusterMaster() {
    this.svcMaster.GetAllClusterMaster().subscribe({
      next: (data: any) => {
        this.clusterData = data;
      }, error: (err: any) => {
        this.loading = false
        this._sweetalert.sweetAlert('SomeThing Went Wrong,Please refresh the page or check your Internet connection', 'error')
      }
    })
  }

  reset() {
    this.select.options.forEach((item: MatOption) => item.deselect());
    this.selectDivi.options.forEach((item: MatOption) => item.deselect());
    this.selectDis.options.forEach((item: MatOption) => item.deselect());
    this.selectBlo.options.forEach((item: MatOption) => item.deselect());

    this.allSelected = false;
    this.allSelectedDivi = false;
    this.allSelectedDis = false;
    this.allSelectedBlo = false;

    this.createReportAccess.controls['userid'].reset();

    //this.createReportAccess.get('userid').setValue(0);
    this.createReportAccess.get('clusterIDs').setValue([]);
    this.createReportAccess.get('divisionIDs').setValue([]);
    this.createReportAccess.get('districtIDs').setValue([]);
    this.createReportAccess.get('blockIDs').setValue([]);

    this.divisionData = [];
    this.districtData = [];
    this.blockData = [];

    this.showUserDetail = false;
  }

  filterGovUser(event) {
    const inputValue = event?.target?.value;
    if(!inputValue) {
      this.reset()
      this.createReportAccess.get('clusterIDs').reset();
    }
    this.filterListOfGov = this.govUsers.filter((option: any) => option.email.toLowerCase().includes(event.target.value.toLowerCase()))
  }

  submit() {

    if (this.createReportAccess.invalid) {
      this.createReportAccess.markAllAsTouched()
    }

    else {
      if (this.svcLocalstorage.GetData(environment.AuthTokenKeyLSKey)) {
        this.loading = true
        var successMsg = 'Access provided to the user successfully.';

        var obj = {
          userID: this.GovUserID,
          listOfData: [],
          dataType: ''
        }

        if (this.createReportAccess.value.blockIDs != null && this.createReportAccess.value.blockIDs.length > 0) {
          obj.listOfData = this.createReportAccess.value.blockIDs
          obj.dataType = 'blockLevel'
        }
        else if (this.createReportAccess.value.districtIDs != null && this.createReportAccess.value.districtIDs.length > 0) {
          obj.listOfData = this.createReportAccess.value.districtIDs
          obj.dataType = 'districtLevel'
        }
        else if (this.createReportAccess.value.divisionIDs != null && this.createReportAccess.value.divisionIDs.length > 0) {
          obj.listOfData = this.createReportAccess.value.divisionIDs
          obj.dataType = 'divisionLevel'
        }
        else {
          obj.listOfData = this.createReportAccess.value.clusterIDs
          obj.dataType = 'clusterLevel'
        }

        this.svcDashboard.AddPhcAccessMaster(obj).subscribe({
          next: (res: any) => {
            this.loading = false
            this._sweetalert.sweetAlert(successMsg, 'success').then((res: any) => {
              if (res) {
                this.reset();
              }
            })
          }, error: (err: any) => {
            this.loading = false
            if (err.status == 404) {
              this._sweetalert.sweetAlert(err.error.AddUser.errors[0].errorMessage, 'error')
            }
            else {
              this._sweetalert.sweetAlert('SomeThing Went Wrong,Please try Again After SomeTime', 'error')
            }
          }
        })
      }
    }
  }
}
