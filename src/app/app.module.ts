import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './component/admin-component/login/login.component';
import { ChcCenterComponent } from './component/admin-component/chc-center/chc-center.component';
import { PatientComponent } from './component/admin-component/patient/patient.component';
import { DoctorComponent } from './component/admin-component/doctor/doctor.component';
import { AdminExportModelModule } from './model/admin-export-model/admin-export-model.module';
import { SharedExportModelModule } from './model/shared-export-model/shared-export-model.module';
import { AccountRegisterComponent } from './component/shared-component/account-register/account-register.component';
import { MdbModalModule } from 'mdb-angular-ui-kit/modal';
import { PatientsSearchbarComponent } from './component/shared-component/patients-searchbar/patients-searchbar.component';
import { RegisterSuccesfulPopupComponent } from './component/shared-component/register-succesful-popup/register-succesful-popup.component';
import { CaseDetailsComponent } from './component/admin-component/chc-center/case-details/case-details.component';
import { PateintFeedbackComponent } from './component/shared-component/pateint-feedback/pateint-feedback.component';
import { ReferDoctorComponent } from './component/shared-component/refer-doctor/refer-doctor.component';
import { VideoCallComponent } from './component/shared-component/video-call/video-call.component';
import { WebcamModule } from 'ngx-webcam';
import { PhcHospitalsListComponent } from './component/shared-component/phc-hospitals-list/phc-hospitals-list.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatChipListComponent } from './component/shared-component/mat-chip-list/mat-chip-list.component';
import { MatchipListAutoComponent } from './component/shared-component/matchip-list-auto/matchip-list-auto.component';
import { MatChipAllergiesComponent } from './component/shared-component/mat-chip-allergies/mat-chip-allergies.component';
import { MatChipFamilyhistoryComponent } from './component/shared-component/mat-chip-familyhistory/mat-chip-familyhistory.component';
import { CaseDetailsDocComponent } from './component/admin-component/doctor/case-details-doc/case-details-doc.component';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BearerInterceptorService } from './services/auth/bearer-interceptor.service';
import { AdminMisComponent } from './component/admin-component/dashboard/admin-mis/admin-mis.component';
import { AdminHeaderComponent } from './component/admin-component/dashboard/admin-header/admin-header.component';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import {
  FaIconLibrary,
  FontAwesomeModule,
} from '@fortawesome/angular-fontawesome';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatTableModule } from '@angular/material/table';
import { ProgressGraphComponent } from './component/admin-component/dashboard/progress-graph/progress-graph.component';
import { TabularReferralComponent } from './component/admin-component/dashboard/tabular-referral/tabular-referral.component';
import { TabularVideoConsultationComponent } from './component/admin-component/dashboard/tabular-video-consultation/tabular-video-consultation.component';
import { TabularCompletedConsultationComponent } from './component/admin-component/dashboard/tabular-completed-consultation/tabular-completed-consultation.component';
import { TabularPatientInformationComponent } from './component/admin-component/dashboard/tabular-patient-information/tabular-patient-information.component';
import { TabularCompletedConsultaionDoctorComponent } from './component/admin-component/dashboard/tabular-completed-consultaion-doctor/tabular-completed-consultaion-doctor.component';
import { TabularCompletedConsultationPhcComponent } from './component/admin-component/dashboard/tabular-completed-consultation-phc/tabular-completed-consultation-phc.component';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { ElectronicHealthRecordComponent } from './component/shared-component/electronic-health-record/electronic-health-record.component';
import { ngxLoadingAnimationTypes, NgxLoadingModule } from 'ngx-loading';
import { NgxPaginationModule } from 'ngx-pagination';
import { SearchPipe } from './services/services/search.pipe';
import { DatePipe } from '@angular/common';
import { BackButtonDirective } from './directives/back-button.directive';
import { FilepopupComponent } from './component/shared-component/filepopup/filepopup.component';
import { ActivityIndicatorComponent } from './videocall/activity-indicator/activity-indicator.component';
import { CameraComponent } from './videocall/camera/camera.component';
import { HomeComponent } from './videocall/home/home.component';
import { ParticipantsComponent } from './videocall/participants/participants.component';
import { RoomsComponent } from './videocall/rooms/rooms.component';
import { SettingsComponent } from './videocall/settings/settings.component';
import { DeviceSelectComponent } from './videocall/settings/device-select.component';

import { VideoChatService } from './videocall/services/videochat.service';
import { DeviceService } from './videocall/services/device.service';
import { StorageService } from './videocall/services/storage.service';
import { DoctorSearchComponent } from './component/shared-component/doctor-search/doctor-search.component';
import { MatNativeDateModule } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';

import { MainDashboardComponent } from './component/admin-component/main-dashboard/main-dashboard.component';
import { MaindashboardMedComponent } from './component/admin-component/maindashboard-med/maindashboard-med.component';
import { MatPaginatorModule } from '@angular/material/paginator';
// import { MatPaginatorModule } from '@angular/material';
import { NgChartsModule } from 'ng2-charts';
import { MatSortModule } from '@angular/material/sort';
import { MaindashboardReportsummarydailyComponent } from './component/admin-component/maindashboard-reportsummarydaily/maindashboard-reportsummarydaily.component';
import { MaindashboardReportsummaryweeklyComponent } from './component/admin-component/maindashboard-reportsummaryweekly/maindashboard-reportsummaryweekly.component';
import { MaindashboardReportsummarymonthlyComponent } from './component/admin-component/maindashboard-reportsummarymonthly/maindashboard-reportsummarymonthly.component';
import { MaindashboardReportconsultationComponent } from './component/admin-component/maindashboard-reportconsultation/maindashboard-reportconsultation.component';
import { MaindashboardPhcloginComponent } from './component/admin-component/maindashboard-phclogin/maindashboard-phclogin.component';
import { MaindashboardPhcConsultationComponent } from './component/admin-component/maindashboard-phc-consultation/maindashboard-phc-consultation.component';
import { MaindashboardPhcManpowerComponent } from './component/admin-component/maindashboard-phc-manpower/maindashboard-phc-manpower.component';
import { VideoCompositionComponent } from './videocall/video-composition/video-composition.component';
import { SystemHealthReportComponent } from './component/admin-component/dashboard/system-health-report/system-health-report.component';
import { EmployeeTrainingDetailComponent } from './component/admin-component/dashboard/employee-training-detail/employee-training-detail.component';
import { GovtIdDirective } from './directives/govt-id.directive';
import { MaindashboardPatientRegistrationComponent } from './component/admin-component/maindashboard-patient-registration/maindashboard-patient-registration.component';
import { MaindashboardPatientReviewComponent } from './component/admin-component/maindashboard-patient-review/maindashboard-patient-review.component';
import { MaindashboardPatientReferredComponent } from './component/admin-component/maindashboard-patient-referred/maindashboard-patient-referred.component';
import { MaindashboardEmptrainingFeedbackComponent } from './component/admin-component/maindashboard-emptraining-feedback/maindashboard-emptraining-feedback.component';
import { MaindashboardSpokemaintenanceComponent } from './component/admin-component/maindashboard-spokemaintenance/maindashboard-spokemaintenance.component';
import { MaindashboardSystemhealthserverComponent } from './component/admin-component/maindashboard-systemhealthserver/maindashboard-systemhealthserver.component';
import { MaindashboardSystemhealthequipmentComponent } from './component/admin-component/maindashboard-systemhealthequipment/maindashboard-systemhealthequipment.component';
import { MaindashboardSystemhealthremoteComponent } from './component/admin-component/maindashboard-systemhealthremote/maindashboard-systemhealthremote.component';
import { SweetAlertComponent } from './component/shared-component/sweet-alert/sweet-alert.component';
import { SpokeMaintenanceComponent } from './component/admin-component/dashboard/spoke-maintenance/spoke-maintenance.component';
import { HolidayCalendarComponent } from './component/admin-component/dashboard/holiday-calendar/holiday-calendar.component';
import { DiagnosticPrescribedComponent } from './component/admin-component/diagnostic-prescribed/diagnostic-prescribed.component';
import { MedicineTreatComponent } from './component/admin-component/medicine-treat/medicine-treat.component';
import { DpDatePickerModule } from 'ng2-date-picker';
import { MaindashboardAppointmentComponent } from './component/admin-component/maindashboard-appointment/maindashboard-appointment.component';
import { MaindashboardDoctoravgtimeComponent } from './component/admin-component/maindashboard-doctoravgtime/maindashboard-doctoravgtime.component';
import { MaindashboardDoctoravailabilityComponent } from './component/admin-component/maindashboard-doctoravailability/maindashboard-doctoravailability.component';
import { PrescriptionPreviewPdfComponent } from './component/admin-component/prescription-preview-pdf/prescription-preview-pdf.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MaindashboardDiagnosisComponent } from './component/admin-component/maindashboard-diagnosis/maindashboard-diagnosis.component';
import { MaindashboardMedprescribedgenericwiseComponent } from './component/admin-component/maindashboard-medprescribedgenericwise/maindashboard-medprescribedgenericwise.component';
import { MaindashboardMedprescribedphcwiseComponent } from './component/admin-component/maindashboard-medprescribedphcwise/maindashboard-medprescribedphcwise.component';
import { MaindashboardDiagnosticprescribedtestwiseComponent } from './component/admin-component/maindashboard-diagnosticprescribedtestwise/maindashboard-diagnosticprescribedtestwise.component';
import { MaindashboardDiagnosticprescribedphcwiseComponent } from './component/admin-component/maindashboard-diagnosticprescribedphcwise/maindashboard-diagnosticprescribedphcwise.component';
import { MaindashboardDiseaseprofileagewiseComponent } from './component/admin-component/maindashboard-diseaseprofileagewise/maindashboard-diseaseprofileagewise.component';
import { MaindashboardDiseaseprofilephcwiseComponent } from './component/admin-component/maindashboard-diseaseprofilephcwise/maindashboard-diseaseprofilephcwise.component';
import { MaindashboardFeedbacksummaryComponent } from './component/admin-component/maindashboard-feedbacksummary/maindashboard-feedbacksummary.component';
import { MaindashboardFeedbackdetailsComponent } from './component/admin-component/maindashboard-feedbackdetails/maindashboard-feedbackdetails.component';
import { MatRadioModule } from '@angular/material/radio';
import { ResetPasswordComponent } from './component/admin-component/reset-password/reset-password.component';
import { MaindashboardRemotehealthComponent } from './component/admin-component/maindashboard-remotehealth/maindashboard-remotehealth.component';
import {
  MaindashboardServerhealthComponent,
  MyDirective,
} from './component/admin-component/maindashboard-serverhealth/maindashboard-serverhealth.component';
import { SysAdminComponentComponent } from './component/sysadmin-component/sys-admin-component/sys-admin-component.component';
import { ManagePatientComponent } from './component/sysadmin-component/manage-patient/manage-patient.component';

import { SysAdminHeaderComponent } from './component/sysadmin-component/sys-admin-header/sys-admin-header.component';
import { PHCRegistrationComponent } from './component/sysadmin-component/phc-registration/phc-registration.component';
import { DoctorRegistrationComponent } from './component/sysadmin-component/doctor-registration/doctor-registration.component';
import { PatientQueueManagementComponent } from './component/sysadmin-component/patient-queue-management/patient-queue-management.component';
import { SysHolidayCalendarComponent } from './component/sysadmin-component/sys-holiday-calendar/sys-holiday-calendar.component';
import { SysSpokeMaintenanceComponent } from './component/sysadmin-component/sys-spoke-maintenance/sys-spoke-maintenance.component';
import { SysEmployeeTrainingComponent } from './component/sysadmin-component/sys-employee-training/sys-employee-training.component';
import { SysSystemHealthComponent } from './component/sysadmin-component/sys-system-health/sys-system-health.component';

import { TwilioConferenceModule } from './component/twilio-component/twilio-conference.module';
import { SuperAdminResetPasswordComponent } from './component/super-admin/super-admin-reset-password/super-admin-reset-password.component';
import { SuperAdminCreateUserComponent } from './component/super-admin/super-admin-create-user/super-admin-create-user.component';
import { SuperadminSidebarComponent } from './component/super-admin/superadmin-sidebar/superadmin-sidebar.component';
import { SysQueueMgmtComponent } from './component/sysadmin-component/sys-queue-mgmt/sys-queue-mgmt.component';
import { OrphanCaseFileQueueComponent } from './component/sysadmin-component/orphan-case-file-queue/orphan-case-file-queue.component';
import { ErrorInterceptorService } from './services/auth/error-interceptor.service';
import { MaindashboardInstallationComponent } from './component/admin-component/maindashboard-installation/maindashboard-installation.component';
import { InstallationComponent } from './component/sysadmin-component/installation/installation.component';
import { DeletePendingCasesComponent } from './component/super-admin/delete-pending-cases/delete-pending-cases.component';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTableExporterModule } from 'mat-table-exporter';
import { TwilioRoomComponent } from './component/twilio-component/components/twilio-room/twilio-room.component';
import { SearchFilterPipe } from './pipes/search-filter.pipe';
import { SuperAdminAllowAccessComponent } from './component/super-admin/super-admin-allow-access/super-admin-allow-access.component';
import { DeleteUserComponent } from './component/super-admin/delete-user/delete-user.component';
import { DownloadPrescriptionComponent } from './download-prescription/download-prescription.component';

import { MatDialogModule } from '@angular/material/dialog';
import { MatBadgeModule } from '@angular/material/badge';
import { PrescriptionNotGeneratedByPhcsComponent } from './component/sysadmin-component/prescription-not-generated-by-phcs/prescription-not-generated-by-phcs.component';
import { CreateNotificationComponent } from './component/sysadmin-component/create-notification/create-notification.component';
import { ScreenSaverComponent } from './screen-saver/screen-saver.component';
import { MaindashboardNewReportconsultationComponent } from './component/admin-component/maindashboard-new-reportconsultation/maindashboard-new-reportconsultation.component';
import { DoctorFeedbackComponent } from './component/sysadmin-component/doctor-feedback/doctor-feedback.component';
import { MainDashboardNewAppointmentComponent } from './component/admin-component/main-dashboard-new-appointment/main-dashboard-new-appointment.component';
import { LogGuard } from './services/auth/log.guard';
import { SvcAuthGuard } from './services/auth/svc-auth.guard';
import { MaindashboardPhcHRManpowerReportComponent } from './component/admin-component/maindashboard-phc-hr-manpower-report/maindashboard-phc-hr-manpower-report.component';
import { PHCHRExecutiveProfileComponent } from './component/admin-component/phc-hr-executive-profile/phc-hr-executive-profile.component';
import { ConsultationcalendarComponent } from './component/admin-component/doctor/consultationcalendar/consultationcalendar.component';
import { ReportAccessComponent } from './component/super-admin/report-access/report-access.component';
import { SysadminDashboardComponent } from './component/sysadmin-component/sysadmin-dashboard/sysadmin-dashboard.component';
import { ConsultationcalenderComponent } from './component/admin-component/doctor/consultationcalender/consultationcalender.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    ChcCenterComponent,
    PatientComponent,
    DoctorComponent,
    AccountRegisterComponent,
    PatientsSearchbarComponent,
    RegisterSuccesfulPopupComponent,
    CaseDetailsComponent,
    CaseDetailsDocComponent,
    PateintFeedbackComponent,
    ReferDoctorComponent,
    VideoCallComponent,
    PhcHospitalsListComponent,
    MatChipListComponent,
    MatchipListAutoComponent,
    MatChipAllergiesComponent,
    MatChipFamilyhistoryComponent,

    AdminMisComponent,
    AdminHeaderComponent,
    ProgressGraphComponent,
    TabularReferralComponent,
    TabularVideoConsultationComponent,
    TabularCompletedConsultationComponent,
    TabularPatientInformationComponent,
    TabularCompletedConsultaionDoctorComponent,
    TabularCompletedConsultationPhcComponent,
    ElectronicHealthRecordComponent,
    SearchPipe,
    BackButtonDirective,
    FilepopupComponent,
    ActivityIndicatorComponent,
    CameraComponent,
    HomeComponent,
    ParticipantsComponent,
    RoomsComponent,
    SettingsComponent,
    DeviceSelectComponent,
    DoctorSearchComponent,

    MainDashboardComponent,
    MaindashboardMedComponent,
    MaindashboardReportsummarydailyComponent,
    MaindashboardReportsummaryweeklyComponent,
    MaindashboardReportsummarymonthlyComponent,
    MaindashboardReportconsultationComponent,
    MaindashboardPhcloginComponent,
    MaindashboardPhcConsultationComponent,
    MaindashboardPhcManpowerComponent,
    VideoCompositionComponent,
    SystemHealthReportComponent,
    EmployeeTrainingDetailComponent,
    GovtIdDirective,
    MaindashboardPatientRegistrationComponent,
    MaindashboardPatientReviewComponent,
    MaindashboardPatientReferredComponent,
    MaindashboardEmptrainingFeedbackComponent,
    MaindashboardSpokemaintenanceComponent,
    MaindashboardSystemhealthserverComponent,
    MaindashboardSystemhealthequipmentComponent,
    MaindashboardSystemhealthremoteComponent,
    SweetAlertComponent,
    SpokeMaintenanceComponent,
    HolidayCalendarComponent,
    DiagnosticPrescribedComponent,
    MedicineTreatComponent,
    MaindashboardAppointmentComponent,
    MaindashboardDoctoravgtimeComponent,
    MaindashboardDoctoravailabilityComponent,
    PrescriptionPreviewPdfComponent,
    MaindashboardDiagnosisComponent,
    MaindashboardMedprescribedgenericwiseComponent,
    MaindashboardMedprescribedphcwiseComponent,
    MaindashboardDiagnosticprescribedtestwiseComponent,
    MaindashboardDiagnosticprescribedphcwiseComponent,
    MaindashboardDiseaseprofileagewiseComponent,
    MaindashboardDiseaseprofilephcwiseComponent,
    MaindashboardFeedbacksummaryComponent,
    MaindashboardFeedbackdetailsComponent,
    ResetPasswordComponent,
    MaindashboardRemotehealthComponent,
    MaindashboardServerhealthComponent,
    SysAdminComponentComponent,
    ManagePatientComponent,
    SysAdminHeaderComponent,
    PHCRegistrationComponent,
    DoctorRegistrationComponent,
    PatientQueueManagementComponent,
    SysHolidayCalendarComponent,
    SysSpokeMaintenanceComponent,
    SysEmployeeTrainingComponent,
    SysSystemHealthComponent,
    SuperAdminResetPasswordComponent,
    SuperAdminCreateUserComponent,
    SuperadminSidebarComponent,
    SysQueueMgmtComponent,
    OrphanCaseFileQueueComponent,
    MaindashboardInstallationComponent,
    InstallationComponent,
    DeletePendingCasesComponent,
    MyDirective,
    SearchFilterPipe,
    SuperAdminAllowAccessComponent,
    DeleteUserComponent,
    DownloadPrescriptionComponent,
    PrescriptionNotGeneratedByPhcsComponent,
    CreateNotificationComponent,
    ScreenSaverComponent,
    MaindashboardNewReportconsultationComponent,
    DoctorFeedbackComponent,
    MainDashboardNewAppointmentComponent,
    MaindashboardPhcHRManpowerReportComponent,
    PHCHRExecutiveProfileComponent,
    ConsultationcalendarComponent,
    ReportAccessComponent,
    SysadminDashboardComponent,
    ConsultationcalenderComponent,
  ],

  imports: [
    MatDialogModule,
    MatBadgeModule,
    MatTableExporterModule,
    BrowserModule,
    AppRoutingModule,
    AdminExportModelModule,
    SharedExportModelModule,
    ReactiveFormsModule,
    FormsModule,
    MdbModalModule,
    WebcamModule,
    BrowserAnimationsModule,
    MatChipsModule,
    MatFormFieldModule,
    MatIconModule,
    MatSelectModule,
    MatAutocompleteModule,
    MatSlideToggleModule,
    HttpClientModule,
    MatMenuModule,
    MatButtonModule,
    FontAwesomeModule,
    MatDatepickerModule,
    MatTableModule,
    Ng2SearchPipeModule,
    NgxPaginationModule,
    MatNativeDateModule,
    MatInputModule,
    NgMultiSelectDropDownModule,
    DpDatePickerModule,
    MatPaginatorModule,
    NgChartsModule,
    MatSortModule,
    MatRadioModule,
    NgxLoadingModule.forRoot({
      animationType: ngxLoadingAnimationTypes.wanderingCubes,
      backdropBackgroundColour: 'rgba(0,0,0,0.1)',
      backdropBorderRadius: '4px',
      primaryColour: '#ffffff',
      secondaryColour: '#ffffff',
      tertiaryColour: '#ffffff',
    }),
    NgbModule,
    TwilioConferenceModule,
    MatCheckboxModule,
  ],

  providers: [
    LogGuard,
    ,
    SvcAuthGuard,
    DatePipe,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: BearerInterceptorService,
      multi: true,
    },
    // {provide:HTTP_INTERCEPTORS,useClass:ErrorInterceptorService,multi:true},
    DeviceService,
    VideoChatService,
    StorageService,
    SearchFilterPipe,
  ],
  //providers:[DatePipe],
  bootstrap: [AppComponent],

  exports: [DiagnosticPrescribedComponent],
})
export class AppModule {
  constructor(library: FaIconLibrary) {}
}
