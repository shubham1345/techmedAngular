import { Component, NgModule } from '@angular/core';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from 'src/app/component/admin-component/login/login.component';
import { ChcCenterComponent } from 'src/app/component/admin-component/chc-center/chc-center.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CaseDetailsComponent } from 'src/app/component/admin-component/chc-center/case-details/case-details.component';
import { SvcAuthGuard } from 'src/app/services/auth/svc-auth.guard';
import { DoctorComponent } from 'src/app/component/admin-component/doctor/doctor.component';
import { HttpClientModule } from '@angular/common/http';
import { CaseDetailsDocComponent } from 'src/app/component/admin-component/doctor/case-details-doc/case-details-doc.component';
import { AdminMisComponent } from 'src/app/component/admin-component/dashboard/admin-mis/admin-mis.component';
import { ProgressGraphComponent } from 'src/app/component/admin-component/dashboard/progress-graph/progress-graph.component';
import { TabularReferralComponent } from 'src/app/component/admin-component/dashboard/tabular-referral/tabular-referral.component';
import { TabularVideoConsultationComponent } from 'src/app/component/admin-component/dashboard/tabular-video-consultation/tabular-video-consultation.component';
import { TabularCompletedConsultationComponent } from 'src/app/component/admin-component/dashboard/tabular-completed-consultation/tabular-completed-consultation.component';
import { TabularPatientInformationComponent } from 'src/app/component/admin-component/dashboard/tabular-patient-information/tabular-patient-information.component';
import { TabularCompletedConsultaionDoctorComponent } from 'src/app/component/admin-component/dashboard/tabular-completed-consultaion-doctor/tabular-completed-consultaion-doctor.component';
import { TabularCompletedConsultationPhcComponent } from 'src/app/component/admin-component/dashboard/tabular-completed-consultation-phc/tabular-completed-consultation-phc.component';
import { VideoCallComponent } from 'src/app/component/shared-component/video-call/video-call.component';
import { HomeComponent } from 'src/app/videocall/home/home.component';
import { VideoCompositionComponent } from 'src/app/videocall/video-composition/video-composition.component';
import { Roles } from 'src/app/utils/imp-utils';
import { MatDatepickerModule } from '@angular/material/datepicker';

import { MainDashboardComponent } from 'src/app/component/admin-component/main-dashboard/main-dashboard.component';
import { MaindashboardMedComponent } from 'src/app/component/admin-component/maindashboard-med/maindashboard-med.component';
import { MaindashboardReportsummarydailyComponent } from 'src/app/component/admin-component/maindashboard-reportsummarydaily/maindashboard-reportsummarydaily.component';
import { MaindashboardReportsummaryweeklyComponent } from 'src/app/component/admin-component/maindashboard-reportsummaryweekly/maindashboard-reportsummaryweekly.component';
import { MaindashboardReportsummarymonthlyComponent } from 'src/app/component/admin-component/maindashboard-reportsummarymonthly/maindashboard-reportsummarymonthly.component';
import { SystemHealthReportComponent } from 'src/app/component/admin-component/dashboard/system-health-report/system-health-report.component';
import { EmployeeTrainingDetailComponent } from 'src/app/component/admin-component/dashboard/employee-training-detail/employee-training-detail.component';
import { MaindashboardReportconsultationComponent } from 'src/app/component/admin-component/maindashboard-reportconsultation/maindashboard-reportconsultation.component';
import { MaindashboardPhcloginComponent } from 'src/app/component/admin-component/maindashboard-phclogin/maindashboard-phclogin.component';
import { MaindashboardPhcConsultationComponent } from 'src/app/component/admin-component/maindashboard-phc-consultation/maindashboard-phc-consultation.component';
import { MaindashboardPhcManpowerComponent } from 'src/app/component/admin-component/maindashboard-phc-manpower/maindashboard-phc-manpower.component';

import { MaindashboardPatientRegistrationComponent } from 'src/app/component/admin-component/maindashboard-patient-registration/maindashboard-patient-registration.component';
import { MaindashboardPatientReferredComponent } from 'src/app/component/admin-component/maindashboard-patient-referred/maindashboard-patient-referred.component';
import { MaindashboardPatientReviewComponent } from 'src/app/component/admin-component/maindashboard-patient-review/maindashboard-patient-review.component';

import { MaindashboardEmptrainingFeedbackComponent } from 'src/app/component/admin-component/maindashboard-emptraining-feedback/maindashboard-emptraining-feedback.component';
import { MaindashboardSpokemaintenanceComponent } from 'src/app/component/admin-component/maindashboard-spokemaintenance/maindashboard-spokemaintenance.component';
import { SpokeMaintenanceComponent } from 'src/app/component/admin-component/dashboard/spoke-maintenance/spoke-maintenance.component';
import { HolidayCalendarComponent } from 'src/app/component/admin-component/dashboard/holiday-calendar/holiday-calendar.component';

import { MaindashboardAppointmentComponent } from 'src/app/component/admin-component/maindashboard-appointment/maindashboard-appointment.component';
import { MaindashboardSystemhealthequipmentComponent } from 'src/app/component/admin-component/maindashboard-systemhealthequipment/maindashboard-systemhealthequipment.component';

import { MaindashboardDoctoravailabilityComponent } from 'src/app/component/admin-component/maindashboard-doctoravailability/maindashboard-doctoravailability.component';
import { MaindashboardDoctoravgtimeComponent } from 'src/app/component/admin-component/maindashboard-doctoravgtime/maindashboard-doctoravgtime.component';
import { TwilioConferenceModule } from 'src/app/component/twilio-component/twilio-conference.module';

import { MaindashboardDiagnosisComponent } from 'src/app/component/admin-component/maindashboard-diagnosis/maindashboard-diagnosis.component';
import { MaindashboardDiagnosticprescribedphcwiseComponent } from 'src/app/component/admin-component/maindashboard-diagnosticprescribedphcwise/maindashboard-diagnosticprescribedphcwise.component';
import { MaindashboardDiagnosticprescribedtestwiseComponent } from 'src/app/component/admin-component/maindashboard-diagnosticprescribedtestwise/maindashboard-diagnosticprescribedtestwise.component';
import { MaindashboardDiseaseprofileagewiseComponent } from 'src/app/component/admin-component/maindashboard-diseaseprofileagewise/maindashboard-diseaseprofileagewise.component';
import { MaindashboardDiseaseprofilephcwiseComponent } from 'src/app/component/admin-component/maindashboard-diseaseprofilephcwise/maindashboard-diseaseprofilephcwise.component';
import { MaindashboardFeedbackdetailsComponent } from 'src/app/component/admin-component/maindashboard-feedbackdetails/maindashboard-feedbackdetails.component';
import { MaindashboardFeedbacksummaryComponent } from 'src/app/component/admin-component/maindashboard-feedbacksummary/maindashboard-feedbacksummary.component';
import { MaindashboardMedprescribedgenericwiseComponent } from 'src/app/component/admin-component/maindashboard-medprescribedgenericwise/maindashboard-medprescribedgenericwise.component';
import { MaindashboardMedprescribedphcwiseComponent } from 'src/app/component/admin-component/maindashboard-medprescribedphcwise/maindashboard-medprescribedphcwise.component';
import { ResetPasswordComponent } from 'src/app/component/admin-component/reset-password/reset-password.component';
import { SysAdminComponentComponent } from 'src/app/component/sysadmin-component/sys-admin-component/sys-admin-component.component';
import { SysAdminHeaderComponent } from 'src/app/component/sysadmin-component/sys-admin-header/sys-admin-header.component';
import { PHCRegistrationComponent } from 'src/app/component/sysadmin-component/phc-registration/phc-registration.component';
import { DoctorRegistrationComponent } from 'src/app/component/sysadmin-component/doctor-registration/doctor-registration.component';
import { PatientQueueManagementComponent } from 'src/app/component/sysadmin-component/patient-queue-management/patient-queue-management.component';
import { SysHolidayCalendarComponent } from 'src/app/component/sysadmin-component/sys-holiday-calendar/sys-holiday-calendar.component';
import { SysSpokeMaintenanceComponent } from 'src/app/component/sysadmin-component/sys-spoke-maintenance/sys-spoke-maintenance.component';
import { SysEmployeeTrainingComponent } from 'src/app/component/sysadmin-component/sys-employee-training/sys-employee-training.component';
import { SysSystemHealthComponent } from 'src/app/component/sysadmin-component/sys-system-health/sys-system-health.component';
import { SuperAdminCreateUserComponent } from 'src/app/component/super-admin/super-admin-create-user/super-admin-create-user.component';
import { SuperAdminResetPasswordComponent } from 'src/app/component/super-admin/super-admin-reset-password/super-admin-reset-password.component';
import { SuperadminSidebarComponent } from 'src/app/component/super-admin/superadmin-sidebar/superadmin-sidebar.component';
// import { SysAdminHeaderComponent } from 'src/app/component/sysadmin-component/sys-admin-header/sys-admin-header.component';
// import { PHCRegistrationComponent } from 'src/app/component/sysadmin-component/phc-registration/phc-registration.component';
// import { DoctorRegistrationComponent } from 'src/app/component/sysadmin-component/doctor-registration/doctor-registration.component';
// import { PatientQueueManagementComponent } from 'src/app/component/sysadmin-component/patient-queue-management/patient-queue-management.component';
// import { SysHolidayCalendarComponent } from 'src/app/component/sysadmin-component/sys-holiday-calendar/sys-holiday-calendar.component';
// import { SysSpokeMaintenanceComponent } from 'src/app/component/sysadmin-component/sys-spoke-maintenance/sys-spoke-maintenance.component';
// import { SysEmployeeTrainingComponent } from 'src/app/component/sysadmin-component/sys-employee-training/sys-employee-training.component';
// import { SysSystemHealthComponent } from 'src/app/component/sysadmin-component/sys-system-health/sys-system-health.component';

import { MaindashboardRemotehealthComponent } from 'src/app/component/admin-component/maindashboard-remotehealth/maindashboard-remotehealth.component';
import { MaindashboardServerhealthComponent } from 'src/app/component/admin-component/maindashboard-serverhealth/maindashboard-serverhealth.component';
import { MaindashboardInstallationComponent } from 'src/app/component/admin-component/maindashboard-installation/maindashboard-installation.component';
import { InstallationComponent } from 'src/app/component/sysadmin-component/installation/installation.component';
import { DeletePendingCasesComponent } from 'src/app/component/super-admin/delete-pending-cases/delete-pending-cases.component';
import { DownloadPrescriptionComponent } from 'src/app/download-prescription/download-prescription.component';
import { MaindashboardNewReportconsultationComponent } from 'src/app/component/admin-component/maindashboard-new-reportconsultation/maindashboard-new-reportconsultation.component';
import { DoctorFeedbackComponent } from 'src/app/component/sysadmin-component/doctor-feedback/doctor-feedback.component';
import { MainDashboardNewAppointmentComponent } from 'src/app/component/admin-component/main-dashboard-new-appointment/main-dashboard-new-appointment.component';
import { LogGuard } from 'src/app/services/auth/log.guard';
import { MaindashboardPhcHRManpowerReportComponent } from 'src/app/component/admin-component/maindashboard-phc-hr-manpower-report/maindashboard-phc-hr-manpower-report.component';
import { PHCHRExecutiveProfileComponent } from 'src/app/component/admin-component/phc-hr-executive-profile/phc-hr-executive-profile.component';
import { ConsultationcalendarComponent } from 'src/app/component/admin-component/doctor/consultationcalendar/consultationcalendar.component';
import { ReportAccessComponent } from 'src/app/component/super-admin/report-access/report-access.component';
import { ConsultationcalenderComponent } from 'src/app/component/admin-component/doctor/consultationcalender/consultationcalender.component';

const appRoutes: Routes = [
  {
    path: '',
    component: LoginComponent,
    pathMatch: 'full',
    canActivate: [LogGuard],
  },
  //  { path:'', redirectTo:"/login", pathMatch:'full' },
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [LogGuard],
    data: {
      roleName: ['Phc', 'Doctor', 'SysAdmin'],
    },
  },
  {
    path: 'download-prescription',
    component: DownloadPrescriptionComponent,
  },

  { path: 'reset-password', component: ResetPasswordComponent },
  // { path: 'case-details', component:CaseDetailsComponent},
  // { path: 'doctor-detail', component:DoctorComponent},
  {
    path: 'case-details-doc',
    data: { role: Roles.DOCTOR },
    component: CaseDetailsDocComponent,
    canActivate: [SvcAuthGuard],
  },
  {
    path: 'chc-center',
    data: { role: Roles.PHC },
    component: ChcCenterComponent,
    canActivate: [SvcAuthGuard],
  },
  {
    path: 'case-details',
    data: { role: Roles.PHC },
    component: CaseDetailsComponent,
    canActivate: [SvcAuthGuard],
  },

  {
    path: 'doctor-detail',
    data: { role: Roles.DOCTOR },
    component: DoctorComponent,
    canActivate: [SvcAuthGuard],
  },
  // consultationcalender
  {
    path: 'consultation-calender',
    data: { role: Roles.DOCTOR },
    component: ConsultationcalendarComponent,
    canActivate: [SvcAuthGuard],
  },

  { path: 'video-call', component: HomeComponent },
  {
    path: 'compose-video-call',
    component: VideoCompositionComponent,
    canActivate: [SvcAuthGuard],
  },
  // { path: 'tabular-report', data: { role: Roles.ADMIN }, component: AdminMisComponent ,canActivate: [SvcAuthGuard]},
  // { path: 'progress-graph', data: { role: Roles.ADMIN }, component: ProgressGraphComponent ,canActivate: [SvcAuthGuard]},
  // { path: 'tabular-report-referral', data: { role: Roles.ADMIN }, component: TabularReferralComponent ,canActivate: [SvcAuthGuard]},
  // { path: 'tabular-video-consultaion', data: { role: Roles.ADMIN }, component: TabularVideoConsultationComponent ,canActivate: [SvcAuthGuard]},
  // { path: 'tabular-completed-consultaion', data: { role: Roles.ADMIN }, component: TabularCompletedConsultationComponent ,canActivate: [SvcAuthGuard]},
  // { path: 'tabular-patient-information', data: { role: Roles.ADMIN }, component: TabularPatientInformationComponent ,canActivate: [SvcAuthGuard]},
  // { path: 'tabular-complete-consultaion-doctor', data: { role: Roles.ADMIN }, component: TabularCompletedConsultaionDoctorComponent ,canActivate: [SvcAuthGuard]},
  // { path: 'tabular-complete-consultaion-phc', data: { role: Roles.ADMIN }, component: TabularCompletedConsultationPhcComponent ,canActivate: [SvcAuthGuard]},

  {
    path: 'main-dashboard',
    data: { role: Roles.GovEmployee },
    component: MainDashboardComponent,
    canActivate: [SvcAuthGuard],
  },
  {
    path: 'maindashboard-med',
    data: { role: Roles.GovEmployee },
    component: MaindashboardMedComponent,
    canActivate: [SvcAuthGuard],
  },
  {
    path: 'maindashboard-reportsummarydaily',
    data: { role: Roles.GovEmployee },
    component: MaindashboardReportsummarydailyComponent,
    canActivate: [SvcAuthGuard],
  },
  {
    path: 'maindashboard-reportsummaryweekly',
    data: { role: Roles.GovEmployee },
    component: MaindashboardReportsummaryweeklyComponent,
    canActivate: [SvcAuthGuard],
  },
  {
    path: 'maindashboard-reportsummarymonthly',
    data: { role: Roles.GovEmployee },
    component: MaindashboardReportsummarymonthlyComponent,
    canActivate: [SvcAuthGuard],
  },
  {
    path: 'system-health-report',
    component: SystemHealthReportComponent,
    canActivate: [SvcAuthGuard],
  },
  {
    path: 'employee-training-detail',
    data: { role: Roles.GovEmployee },
    component: EmployeeTrainingDetailComponent,
    canActivate: [SvcAuthGuard],
  },
  {
    path: 'maindashboard-reportconsultation',
    data: { role: Roles.GovEmployee },
    component: MaindashboardReportconsultationComponent,
    canActivate: [SvcAuthGuard],
  },
  {
    path: 'maindashboard-new-reportconsultation',
    data: { role: Roles.GovEmployee },
    component: MaindashboardNewReportconsultationComponent,
    canActivate: [SvcAuthGuard],
  },

  {
    path: 'maindashboard-Phclogin',
    data: { role: Roles.GovEmployee },
    component: MaindashboardPhcloginComponent,
    canActivate: [SvcAuthGuard],
  },
  {
    path: 'maindashboard-HR-Executive-profile',
    data: { role: Roles.GovEmployee },
    component: PHCHRExecutiveProfileComponent,
    canActivate: [SvcAuthGuard],
  },

  {
    path: 'maindashboard-PhcConsultation',
    data: { role: Roles.GovEmployee },
    component: MaindashboardPhcConsultationComponent,
    canActivate: [SvcAuthGuard],
  },
  {
    path: 'maindashboard-PhcManpower',
    data: { role: Roles.GovEmployee },
    component: MaindashboardPhcManpowerComponent,
    canActivate: [SvcAuthGuard],
  },

  {
    path: 'maindashboard-PatientRegistration',
    data: { role: Roles.GovEmployee },
    component: MaindashboardPatientRegistrationComponent,
    canActivate: [SvcAuthGuard],
  },
  {
    path: 'maindashboard-PatientReferred',
    data: { role: Roles.GovEmployee },
    component: MaindashboardPatientReferredComponent,
    canActivate: [SvcAuthGuard],
  },
  {
    path: 'maindashboard-PatientReview',
    data: { role: Roles.GovEmployee },
    component: MaindashboardPatientReviewComponent,
    canActivate: [SvcAuthGuard],
  },

  {
    path: 'maindashboard-EmptrainingFeedback',
    data: { role: Roles.GovEmployee },
    component: MaindashboardEmptrainingFeedbackComponent,
    canActivate: [SvcAuthGuard],
  },
  {
    path: 'maindashboard-Spokemaintenance',
    data: { role: Roles.GovEmployee },
    component: MaindashboardSpokemaintenanceComponent,
    canActivate: [SvcAuthGuard],
  },
  {
    path: 'spoke-maintenance',
    component: SpokeMaintenanceComponent,
    canActivate: [SvcAuthGuard],
  },
  {
    path: 'holiday-calendar',
    component: HolidayCalendarComponent,
    canActivate: [SvcAuthGuard],
  },
  {
    path: 'maindashboard-Appointment',
    data: { role: Roles.GovEmployee },
    component: MaindashboardAppointmentComponent,
    canActivate: [SvcAuthGuard],
  },
  {
    path: 'maindashboard-new-Appointment',
    data: { role: Roles.GovEmployee },
    component: MainDashboardNewAppointmentComponent,
    canActivate: [SvcAuthGuard],
  },

  {
    path: 'maindashboard-Systemhealthequipment',
    data: { role: Roles.GovEmployee },
    component: MaindashboardSystemhealthequipmentComponent,
    canActivate: [SvcAuthGuard],
  },

  {
    path: 'maindashboard-Doctoravailability',
    data: { role: Roles.GovEmployee },
    component: MaindashboardDoctoravailabilityComponent,
    canActivate: [SvcAuthGuard],
  },
  {
    path: 'maindashboard-Doctoravgtime',
    data: { role: Roles.GovEmployee },
    component: MaindashboardDoctoravgtimeComponent,
    canActivate: [SvcAuthGuard],
  },

  {
    path: 'maindashboard-Diagnosis',
    data: { role: Roles.GovEmployee },
    component: MaindashboardDiagnosisComponent,
    canActivate: [SvcAuthGuard],
  },
  {
    path: 'maindashboard-Diagnosticprescribedphcwise',
    data: { role: Roles.GovEmployee },
    component: MaindashboardDiagnosticprescribedphcwiseComponent,
    canActivate: [SvcAuthGuard],
  },
  {
    path: 'maindashboard-Diagnosticprescribedtestwise',
    data: { role: Roles.GovEmployee },
    component: MaindashboardDiagnosticprescribedtestwiseComponent,
    canActivate: [SvcAuthGuard],
  },
  {
    path: 'maindashboard-Diseaseprofileagewise',
    data: { role: Roles.GovEmployee },
    component: MaindashboardDiseaseprofileagewiseComponent,
    canActivate: [SvcAuthGuard],
  },
  {
    path: 'maindashboard-Diseaseprofilephcwise',
    data: { role: Roles.GovEmployee },
    component: MaindashboardDiseaseprofilephcwiseComponent,
    canActivate: [SvcAuthGuard],
  },
  {
    path: 'maindashboard-Feedbackdetails',
    data: { role: Roles.GovEmployee },
    component: MaindashboardFeedbackdetailsComponent,
    canActivate: [SvcAuthGuard],
  },
  {
    path: 'maindashboard-Feedbacksummary',
    data: { role: Roles.GovEmployee },
    component: MaindashboardFeedbacksummaryComponent,
    canActivate: [SvcAuthGuard],
  },
  {
    path: 'maindashboard-Medprescribedgenericwise',
    data: { role: Roles.GovEmployee },
    component: MaindashboardMedprescribedgenericwiseComponent,
    canActivate: [SvcAuthGuard],
  },
  {
    path: 'maindashboard-Medprescribedphcwise',
    data: { role: Roles.GovEmployee },
    component: MaindashboardMedprescribedphcwiseComponent,
    canActivate: [SvcAuthGuard],
  },

  {
    path: 'maindashboard-Remotehealth',
    data: { role: Roles.GovEmployee },
    component: MaindashboardRemotehealthComponent,
    canActivate: [SvcAuthGuard],
  },
  {
    path: 'maindashboard-Serverhealth',
    data: { role: Roles.GovEmployee },
    component: MaindashboardServerhealthComponent,
    canActivate: [SvcAuthGuard],
  },
  {
    path: 'maindashboard-installation',
    data: { role: Roles.GovEmployee },
    component: MaindashboardInstallationComponent,
    canActivate: [SvcAuthGuard],
  },
  {
    path: 'maindashboard-HRPower',
    data: { role: Roles.GovEmployee },
    component: MaindashboardPhcHRManpowerReportComponent,
    canActivate: [SvcAuthGuard],
  },

  //   { path:'sysadmin-component',data:{role:Roles.SysAdmin}, component:SysAdminComponentComponent,
  //   children: [
  //     {
  //       path:'spoke maintenance', component: SysAdminComponentComponent , data:{role:Roles.SysAdmin},
  //     },
  //     {
  //       path:'employee training', component: SysAdminComponentComponent, data:{role:Roles.SysAdmin},
  //     }
  //   ]
  // },
  {
    path: 'SysAdmin-Header',
    component: SysAdminHeaderComponent,
    data: { role: Roles.SysAdmin },
    canActivate: [SvcAuthGuard],
  },
  {
    path: 'PHC-Registration',
    component: PHCRegistrationComponent,
    data: { role: Roles.SysAdmin },
    canActivate: [SvcAuthGuard],
  },
  {
    path: 'Doctor-Registration',
    component: DoctorRegistrationComponent,
    data: { role: Roles.SysAdmin },
    canActivate: [SvcAuthGuard],
  },
  {
    path: 'Patient-Queue-Management',
    component: PatientQueueManagementComponent,
    data: { role: Roles.SysAdmin },
    canActivate: [SvcAuthGuard],
  },
  {
    path: 'Holiday-Calendar',
    component: SysHolidayCalendarComponent,
    data: { role: Roles.SysAdmin },
    canActivate: [SvcAuthGuard],
  },
  {
    path: 'Spoke-MAintenance',
    component: SysSpokeMaintenanceComponent,
    data: { role: Roles.SysAdmin },
    canActivate: [SvcAuthGuard],
  },
  {
    path: 'Employee-Training',
    component: SysEmployeeTrainingComponent,
    data: { role: Roles.SysAdmin },
    canActivate: [SvcAuthGuard],
  },
  {
    path: 'System-Health',
    component: SysSystemHealthComponent,
    data: { role: Roles.SysAdmin },
    canActivate: [SvcAuthGuard],
  },
  {
    path: 'Doctor-Feedback',
    component: DoctorFeedbackComponent,
    data: { role: Roles.SysAdmin },
    canActivate: [SvcAuthGuard],
  },

  {
    path: 'Installation',
    data: { role: Roles.SysAdmin },
    component: InstallationComponent,
    canActivate: [SvcAuthGuard],
  },

  {
    path: 'Create-User',
    component: SuperAdminCreateUserComponent,
    data: { role: Roles.SuperAdmin },
    canActivate: [SvcAuthGuard],
  },
  {
    path: 'Reset-Password',
    component: SuperAdminResetPasswordComponent,
    data: { role: Roles.SuperAdmin },
    canActivate: [SvcAuthGuard],
  },
  {
    path: 'Side-bar',
    component: SuperadminSidebarComponent,
    data: { role: Roles.SuperAdmin },
    canActivate: [SvcAuthGuard],
  },
  {
    path: 'delete-pending-cases',
    component: DeletePendingCasesComponent,
    data: { role: Roles.SuperAdmin },
    canActivate: [SvcAuthGuard],
  },
  {
    path: 'Report-Access',
    component: ReportAccessComponent,
    data: { role: Roles.SuperAdmin },
    canActivate: [SvcAuthGuard],
  },
];
@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forRoot(appRoutes),
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    MatDatepickerModule,
    MatAutocompleteModule,
  ],
})
export class AdminExportModelModule {}
