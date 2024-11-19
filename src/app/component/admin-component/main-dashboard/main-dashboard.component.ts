import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MdbModalService } from 'mdb-angular-ui-kit/modal';
import { SvclocalstorageService } from 'src/app/services/services/svclocalstorage.service';
import { Chart } from 'chart.js';
import { environment } from 'src/environments/environment';
import { svc_dashboardService } from 'src/app/services/services/svc_dashboard.service';
import { SvcAuthenticationService } from 'src/app/services/services/svc-authentication.service';
import { SvcmainAuthserviceService } from 'src/app/services/services/svcmain-authservice.service';
import { ngxLoadingAnimationTypes } from 'ngx-loading';
@Component({
  selector: 'app-main-dashboard',
  templateUrl: './main-dashboard.component.html',
  styleUrls: ['./main-dashboard.component.css'],
})
export class MainDashboardComponent implements OnInit {
  public ngxLoadingAnimationTypes = ngxLoadingAnimationTypes;
  public config = {
    animationType: ngxLoadingAnimationTypes.none,
    backdropBorderRadius: '3px',
  };

  loading: boolean = false;

  constructor(
    private modalService: MdbModalService,
    private fb: FormBuilder,
    private svcLocalstorage: SvclocalstorageService,
    private activatedRoute: ActivatedRoute,
    private Svc_dashboardService: svc_dashboardService,
    private svcAuth: SvcAuthenticationService,
    private router: Router,
    private _sweetAlert: SvcmainAuthserviceService
  ) {
    this._sweetAlert.getLoader().subscribe((res: any) => {
      this.loading = res;
      console.log('chc-center', this.loading);
    });
  }
  public chart: Chart;
  ngOnInit() {
    this.GetDashboardGraphWithRestrictedAccess();
    this.GetReportAccessDetailsByUserID();
    //this.GetDashboardGraph();
  }
  onSignOut() {
    this.svcAuth.LogOutUser().subscribe({
      next: () => {
        this.svcLocalstorage.DeleteAll();
        this.router.navigate(['/login']);
      },
    });
  }

  userObjFromToken: any;
  header: string[] = [];
  value: number[] = [];
  dataarr: any[];
  GetDashboardGraphWithRestrictedAccess() {
    this.userObjFromToken = this.svcLocalstorage.GetData(
      environment.AuthTokenKeyLSKey
    );
    // GetDashboardGraph() {
    //   this.userObjFromToken = this.svcLocalstorage.GetData(
    //     environment.AuthTokenKeyLSKey
    //   );
    if (this.userObjFromToken) {
      this.Svc_dashboardService.GetDashboardGraphWithRestrictedAccess().subscribe(
        (data: any) => {
          this.dataarr = data;
          // console.log(this.dataarr, 'this is GetDashboardGraphWithRestrictedAccess data');
          this.dataarr.forEach((element) => {
            // console.log(element.districtName, 'this is GetDashboardGraphWithRestrictedAccess data');

            this.header.push(element.districtName);
            this.value.push(element.patientCount);
          });
          // console.log(this.header);
          // console.log(this.value);
          this.chart = new Chart('canvas', {
            type: 'bar',
            data: {
              labels: this.header,
              datasets: [
                {
                  label: 'Patient Count',
                  data: this.value,
                  backgroundColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)',
                  ],
                  borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)',
                  ],
                  borderWidth: 1,
                },
              ],
            },
            options: {
              scales: {
                yAxes: {
                  ticks: {
                    //fbeginAtZero: true
                  },
                },
              },
            },
          });
        }
      );
      // this.Svc_dashboardService.GetDashboardGraph().subscribe(
      //   (data: any) => {
      //     this.dataarr=(data);
      //     console.log(this.dataarr, 'this is GetDashboardGraph data');
      //     this.dataarr.forEach(element => {
      //    // console.log(element.districtName, 'this is GetDashboardGraph data');

      //       this.header.push(element.districtName)
      //       this.value.push(element.patientCount)
      //     });
      //     // console.log(this.header);
      //     // console.log(this.value);
      //     this.chart = new Chart("canvas", {
      //       type: "bar",
      //       data: {
      //         labels: this.header,
      //         datasets: [
      //           {
      //             label: "Patient Count",
      //             data: this.value,
      //             backgroundColor: [
      //               "rgba(255, 99, 132, 1)",
      //               "rgba(54, 162, 235, 1)",
      //               "rgba(255, 206, 86, 1)",
      //               "rgba(75, 192, 192, 1)",
      //               "rgba(153, 102, 255, 1)",
      //               "rgba(255, 159, 64, 1)"
      //             ],
      //             borderColor: [
      //               "rgba(255, 99, 132, 1)",
      //               "rgba(54, 162, 235, 1)",
      //               "rgba(255, 206, 86, 1)",
      //               "rgba(75, 192, 192, 1)",
      //               "rgba(153, 102, 255, 1)",
      //               "rgba(255, 159, 64, 1)"
      //             ],
      //             borderWidth: 1
      //           }
      //         ]
      //       },
      //       options: {
      //         scales: {
      //           yAxes:
      //             {
      //               ticks: {
      //                 //fbeginAtZero: true
      //               }
      //             }
      //         }
      //       }
      //     });
      //   }
      // );
    }
  }
  reportAccessArray = [];
  GetReportAccessDetailsByUserID() {
    this.loading = true;
    this.Svc_dashboardService.GetReportAccessDetailsByUserID().subscribe(
      (res: any) => {
        this.loading = false;
        this.reportAccessArray = res;
      },
      (err: any) => {
        this.loading = false;
      }
    );
  }

  accessReport(accessRight, url, querykey, queryValue) {
    var dynamicQueryParams: any = {};

    if (accessRight == false) {
      this._sweetAlert.sweetAlert("Can't Access this report", 'info');
    } else {
      if (querykey) {
        dynamicQueryParams[querykey] = queryValue;
        this.router.navigate([url], { queryParams: dynamicQueryParams });
      } else {
        this.router.navigate([url]);
      }
    }
  }
}
