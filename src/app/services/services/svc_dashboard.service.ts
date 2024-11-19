import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Params } from '@angular/router';
import { environment } from 'src/environments/environment';
import { SvclocalstorageService } from './svclocalstorage.service';
import { Observable } from 'rxjs';
import { DatePipe } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class svc_dashboardService {
  constructor(private http: HttpClient,private svcLocalstorage: SvclocalstorageService,private _datepipe: DatePipe) {}




  //post
  DoctorsLoggedInToday(params) {
    return this.http.post(
      `${environment.ApiEndPoint}${environment.EndPoints.Dashboard.Endpoint}${environment.EndPoints.Dashboard.methods.DoctorsLoggedInToday}`,
      params
    );
  }
  //get
  GetLoggedUserCount(params) {
    return this.http.get(
      `${environment.ApiEndPoint}${environment.EndPoints.Dashboard.Endpoint}${environment.EndPoints.Dashboard.methods.GetLoggedUserCount}`,
      { params: params }
    );
  }

  //get
  GetTodaysPatientQueue(params) {
    return this.http.get(
      `${environment.ApiEndPoint}${environment.EndPoints.Dashboard.Endpoint}${environment.EndPoints.Dashboard.methods.GetTodaysPatientQueue}`,
      { params: params }
    );
  }

  //get
  GetTodaysTotalPatientCase(params) {
    return this.http.get(
      `${environment.ApiEndPoint}${environment.EndPoints.Dashboard.Endpoint}${environment.EndPoints.Dashboard.methods.GetTodaysTotalPatientCase}`,
      { params: params }
    );
  }

  //get
  LoggedUserInToday(params) {
    return this.http.get(
      `${environment.ApiEndPoint}${environment.EndPoints.Dashboard.Endpoint}${environment.EndPoints.Dashboard.methods.LoggedUserInToday}`,
      { params: params }
    );
  }
  //post
  GetDashboardConsultation(params) {
    return this.http.post(
      `${environment.ApiEndPoint}${environment.EndPoints.Dashboard.Endpoint}${environment.EndPoints.Dashboard.methods.GetDashboardConsultation}`,
      params
    );
  }
  //post
  GetDashboardReportSummary(params) {
    return this.http.post(
      `${environment.ApiEndPoint}${environment.EndPoints.Dashboard.Endpoint}${environment.EndPoints.Dashboard.methods.GetDashboardReportSummary}`,
      params
    );
  }
  //post
  GetDashboardReportSummaryMonthly(params) {
    return this.http.post(
      `${environment.ApiEndPoint}${environment.EndPoints.Dashboard.Endpoint}${environment.EndPoints.Dashboard.methods.GetDashboardReportSummaryMonthly}`,
      params
    );
  }
  //post
  GetPHCLoginHistoryReport(params) {
    return this.http.get(
      `${environment.ApiEndPoint}${environment.EndPoints.Dashboard.Endpoint}${environment.EndPoints.Dashboard.methods.GetPHCLoginHistoryReport}`,
      params
    );
  }
  //post
  GetPHCConsulGetPHCConsultationReportWithRestrictedAccesstationReport(params) {
    return this.http.get(
      `${environment.ApiEndPoint}${environment.EndPoints.Dashboard.Endpoint}${environment.EndPoints.Dashboard.methods.GetPHCConsultationReport}`,
      params
    );
  }
  //get
  GetPHCManpowerReport(params) {
    return this.http.get(
      `${environment.ApiEndPoint}${environment.EndPoints.Dashboard.Endpoint}${environment.EndPoints.Dashboard.methods.GetPHCManpowerReport}`,
      params
    );
  }

  //get
  GetAllPHC() {
    return this.http.get(
      `${environment.ApiEndPoint}${environment.EndPoints.Master.Endpoint}${environment.EndPoints.Master.methods.GetAllPHC}`
    );
  }
  //post
  GetDashboardReportConsultation(params) {
    return this.http.post(
      `${environment.ApiEndPoint}${environment.EndPoints.Dashboard.Endpoint}${environment.EndPoints.Dashboard.methods.GetDashboardReportConsultation}`,
      params
    );
  }
  //post
  AddEquipmentUptimeReport(params) {
    return this.http.post(
      `${environment.ApiEndPoint}${environment.EndPoints.Dashboard.Endpoint}${environment.EndPoints.Dashboard.methods.AddEquipmentUptimeReport}`,
      params
    );
  }

  //post
  AddEmployeeTraining(Params) {
    return this.http.post(
      `${environment.ApiEndPoint}${environment.EndPoints.PHC.Endpoint}${environment.EndPoints.PHC.methods.AddEmployeeTraining}`,
      Params
    );
  }
  //get
  GetPatientRegisterReport(params) {
    return this.http.get(
      `${environment.ApiEndPoint}${environment.EndPoints.Dashboard.Endpoint}${environment.EndPoints.Dashboard.methods.GetPatientRegisterReport}`,
      params
    );
  }
  //get
  GetReferredPatientReport(params) {
    return this.http.get(
      `${environment.ApiEndPoint}${environment.EndPoints.Dashboard.Endpoint}${environment.EndPoints.Dashboard.methods.GetReferredPatientReport}`,
      params
    );
  }
  //get
  GetReviewPatientReport(params) {
    return this.http.get(
      `${environment.ApiEndPoint}${environment.EndPoints.Dashboard.Endpoint}${environment.EndPoints.Dashboard.methods.GetReviewPatientReport}`,
      params
    );
  }
  //get
  GetDashboardEmployeeFeedback(params) {
    return this.http.get(
      `${environment.ApiEndPoint}${environment.EndPoints.Dashboard.Endpoint}${environment.EndPoints.Dashboard.methods.GetDashboardEmployeeFeedback}`,
      params
    );
  }
  //get
  GetDashboardSpokeMaintenance(params) {
    return this.http.get(
      `${environment.ApiEndPoint}${environment.EndPoints.Dashboard.Endpoint}${environment.EndPoints.Dashboard.methods.GetDashboardSpokeMaintenance}`,
      params
    );
  }

  //get
  GetDashboardAppointment(params) {
    return this.http.get(
      `${environment.ApiEndPoint}${environment.EndPoints.Dashboard.Endpoint}${environment.EndPoints.Dashboard.methods.GetDashboardAppointment}`,
      params
    );
  }
  //get
  GetDashboardEquipmentUptimeReport(params) {
    return this.http.get(
      `${environment.ApiEndPoint}${environment.EndPoints.Dashboard.Endpoint}${environment.EndPoints.Dashboard.methods.GetDashboardEquipmentUptimeReport}`,
      params
    );
  }
  //get
  GetDashboardDoctorAvgTime(params) {
    return this.http.get(
      `${environment.ApiEndPoint}${environment.EndPoints.Dashboard.Endpoint}${environment.EndPoints.Dashboard.methods.GetDashboardDoctorAvgTime}`,
      params
    );
  }
  //get
  GetDashboardDoctorAvailability(params) {
    return this.http.get(
      `${environment.ApiEndPoint}${environment.EndPoints.Dashboard.Endpoint}${environment.EndPoints.Dashboard.methods.GetDashboardDoctorAvailability}`,
      params
    );
  }
  //get
  GetDashboardEquipmentHeaderReport(params) {
    return this.http.get(
      `${environment.ApiEndPoint}${environment.EndPoints.Dashboard.Endpoint}${environment.EndPoints.Dashboard.methods.GetDashboardEquipmentHeaderReport}`,
      params
    );
  }
  GetPrescribedMedicine(params) {
    return this.http.get(
      `${environment.ApiEndPoint}${environment.EndPoints.Dashboard.Endpoint}${environment.EndPoints.Dashboard.methods.GetPrescribedMedicine}`,
      params
    );
  }


  GetDashboardDiagnosticPrescribedTestWise(params) {
    return this.http.get(
      `${environment.ApiEndPoint}${environment.EndPoints.Dashboard.Endpoint}${environment.EndPoints.Dashboard.methods.GetDashboardDiagnosticPrescribedTestWise}`,
      params
    );
  }
  GetDashboardDiagnosticPrescribedPHCWise(params) {
    return this.http.get(
      `${environment.ApiEndPoint}${environment.EndPoints.Dashboard.Endpoint}${environment.EndPoints.Dashboard.methods.GetDashboardDiagnosticPrescribedPHCWise}`,
      params
    );
  }
  GetPrescribedMeGetPrescribedMedicinePHCWiseWithRestrictedAccessdicinePHCWise(params) {
    return this.http.get(
      `${environment.ApiEndPoint}${environment.EndPoints.Dashboard.Endpoint}${environment.EndPoints.Dashboard.methods.GetPrescribedMedicinePHCWise}`,
      params
    );
  }
  GetDashboardGraph() {
    return this.http.get(
      `${environment.ApiEndPoint}${environment.EndPoints.Dashboard.Endpoint}${environment.EndPoints.Dashboard.methods.GetDashboardGraph}`,
      
    );
  }
  GetDashboardFeedbackSummaryReport() {
    return this.http.get(
      `${environment.ApiEndPoint}${environment.EndPoints.Dashboard.Endpoint}${environment.EndPoints.Dashboard.methods.GetDashboardFeedbackSummaryReport}`,
      
    );
  }

  GetDashboardFeedbackReport(params) {
    return this.http.get(
      `${environment.ApiEndPoint}${environment.EndPoints.Dashboard.Endpoint}${environment.EndPoints.Dashboard.methods.GetDashboardFeedbackReport}`,
      params
    );
  }
  GetDashboardDignosisSpecialityWise(params) {
    return this.http.get(
      `${environment.ApiEndPoint}${environment.EndPoints.Dashboard.Endpoint}${environment.EndPoints.Dashboard.methods.GetDashboardDignosisSpecialityWise}`,
      params
    );
  }
  GetDashboardDiseasephcWise(params) {
    return this.http.get(
      `${environment.ApiEndPoint}${environment.EndPoints.Dashboard.Endpoint}${environment.EndPoints.Dashboard.methods.GetDashboardDiseasephcWise}`,
      params
    );
  }
  GetDashboardDiseaseAgeWise(params) {
    return this.http.get(
      `${environment.ApiEndPoint}${environment.EndPoints.Dashboard.Endpoint}${environment.EndPoints.Dashboard.methods.GetDashboardDiseaseAgeWise}`,
      params
    );
  }

  GetDashboardSystemHealthReport(params) {
    return this.http.get(
      `${environment.ApiEndPoint}${environment.EndPoints.Dashboard.Endpoint}${environment.EndPoints.Dashboard.methods.GetDashboardSystemHealthReport}`,
      params
    );
  }
  RemoteSiteDowntimeSummaryDaily(params) {
    return this.http.get(
      `${environment.ApiEndPoint}${environment.EndPoints.Dashboard.Endpoint}${environment.EndPoints.Dashboard.methods.RemoteSiteDowntimeSummaryDaily}`,
      params
    );
  }
  
  RemoteSiteDowntimeSummaryMonthly(params) {
    return this.http.get(
      `${environment.ApiEndPoint}${environment.EndPoints.Dashboard.Endpoint}${environment.EndPoints.Dashboard.methods.RemoteSiteDowntimeSummaryMonthly}`,
      params
    );
  }

  GetDashboardFeedbackSummaryReportData(fromdate,todate) {
    return this.http.get(
      `${environment.ApiEndPoint}${environment.EndPoints.Dashboard.Endpoint}${environment.EndPoints.Dashboard.methods.GetDashboardFeedbackSummaryReportData}`+`?fromDate=${fromdate}&toDate=${todate}`,
      
    );
  }

  GetUserDetails(email) {
 
    let param = new HttpParams();
    param = param.append("email", email);
    return this.http.get(
      `${environment.ApiEndPoint}${environment.EndPoints.GetUserDetails}`
      ,{ params: email }
    );
  }
  IsUserLoggedIn(userId) {
 
    let params = new HttpParams();
    params = params.append("userId", userId);
    return this.http.get(
      `${environment.ApiEndPoint}${environment.EndPoints.IsUserLoggedIn}`
      ,{ params: params }
    );
  }

  UpdateUserPassword(UserMailID){
    let param = new HttpParams();
    param = param.append("UserMailID", UserMailID);
    return this.http.post(
      `${environment.ApiEndPoint}${environment.EndPoints.UpdateUserPassword}`
      ,param
    );
  }


  getInstallationReport(fromdate:any,todate:any)
  {
    return this.http.get(
      `${environment.ApiEndPoint}${environment.EndPoints.Dashboard.Endpoint}${environment.EndPoints.Dashboard.methods.GetDashboardDCMaintenance}`+`?fromDate=${fromdate}&toDate=${todate}`
    
    );
  }
  
  AddPhcAccess(params) {
    return this.http.post(
      `${environment.ApiEndPoint}${environment.EndPoints.Dashboard.Endpoint}${environment.EndPoints.Dashboard.methods.AddPhcAccess}`,
      params
    );
  }

  AddPhcAccessMaster(params) {
    return this.http.post(
      `${environment.ApiEndPoint}${environment.EndPoints.Dashboard.Endpoint}${environment.EndPoints.Dashboard.methods.AddPhcAccessMaster}`,
      params
    );
  }
  GetDashboardFeedbackReportWithRestrictedAccess(params)
  {
    return this.http.get(`${environment.ApiEndPoint}${environment.EndPoints.Dashboard.Endpoint}${environment.EndPoints.Dashboard.methods.GetDashboardFeedbackReportWithRestrictedAccess}`,params)
  }
  GetDashboardAppointmentWithRestrictedAccess(params)
  {
    return this.http.get(`${environment.ApiEndPoint}${environment.EndPoints.Dashboard.Endpoint}${environment.EndPoints.Dashboard.methods.GetDashboardAppointmentWithRestrictedAccess}`,params)
  }
  
  GetDashboardReportConsultationWithRestrictedAccess(params) {
    return this.http.post(
      `${environment.ApiEndPoint}${environment.EndPoints.Dashboard.Endpoint}${environment.EndPoints.Dashboard.methods.GetDashboardReportConsultationWithRestrictedAccess}`,
      params
    );
  }
  GetDashboardConsultationWithRestrictedAccess(params) {
    return this.http.post(
      `${environment.ApiEndPoint}${environment.EndPoints.Dashboard.Endpoint}${environment.EndPoints.Dashboard.methods.GetDashboardConsultationWithRestrictedAccess}`,
      params
    );
  }
  GetDashboardDiagnosticPrescribedPHCWiseWithRestrictedAccess(params) {
    return this.http.get(
      `${environment.ApiEndPoint}${environment.EndPoints.Dashboard.Endpoint}${environment.EndPoints.Dashboard.methods.GetDashboardDiagnosticPrescribedPHCWiseWithRestrictedAccess}`,
      params
    );
  }
  GetDashboardDiagnosticPrescribedTestWiseWithRestrictedAccess(params) {
    return this.http.get(
      `${environment.ApiEndPoint}${environment.EndPoints.Dashboard.Endpoint}${environment.EndPoints.Dashboard.methods.GetDashboardDiagnosticPrescribedTestWiseWithRestrictedAccess}`,
      params
    );
  }
  GetDashboardDignosisSpecialityWiseWithRestrictedAccess(params) {
    return this.http.get(
      `${environment.ApiEndPoint}${environment.EndPoints.Dashboard.Endpoint}${environment.EndPoints.Dashboard.methods.GetDashboardDignosisSpecialityWiseWithRestrictedAccess}`,
      params
    );
  }
  GetDashboardDiseaseAgeWiseWithRestrictedAccess(params) {
    return this.http.get(
      `${environment.ApiEndPoint}${environment.EndPoints.Dashboard.Endpoint}${environment.EndPoints.Dashboard.methods.GetDashboardDiseaseAgeWiseWithRestrictedAccess}`,
      params
    );
  }
  GetDashboardDiseasephcWiseWithRestrictedAccess(params) {
    return this.http.get(
      `${environment.ApiEndPoint}${environment.EndPoints.Dashboard.Endpoint}${environment.EndPoints.Dashboard.methods.GetDashboardDiseasephcWiseWithRestrictedAccess}`,
      params
    );
  }
  GetDashboardEmployeeFeedbackWithRestrictedAccess(params) {
    return this.http.get(
      `${environment.ApiEndPoint}${environment.EndPoints.Dashboard.Endpoint}${environment.EndPoints.Dashboard.methods.GetDashboardEmployeeFeedbackWithRestrictedAccess}`,
      params
    );
  }
  GetDashboardEquipmentHeaderReportWithRestrictedAccess(params) {
    return this.http.get(
      `${environment.ApiEndPoint}${environment.EndPoints.Dashboard.Endpoint}${environment.EndPoints.Dashboard.methods.GetDashboardEquipmentHeaderReportWithRestrictedAccess}`,
      params
    );
  }
  GetDashboardEquipmentUptimeReportWithRestrictedAccess(params) {
    return this.http.get(
      `${environment.ApiEndPoint}${environment.EndPoints.Dashboard.Endpoint}${environment.EndPoints.Dashboard.methods.GetDashboardEquipmentUptimeReportWithRestrictedAccess}`,
      params
    );
  }
  GetDashboardFeedbackSummaryReportWithRestrictedAccess() {
    return this.http.get(
      `${environment.ApiEndPoint}${environment.EndPoints.Dashboard.Endpoint}${environment.EndPoints.Dashboard.methods.GetDashboardFeedbackSummaryReportWithRestrictedAccess}`,
      
    );
  }
  GetDashboardFeedbackSummaryReportDataWithRestrictedAccess(fromdate,todate) {
    let params = new HttpParams();
    params = params.append('fromDate', fromdate);
    params = params.append('toDate', todate);
   
    return this.http.get(
      `${environment.ApiEndPoint}${environment.EndPoints.Dashboard.Endpoint}${environment.EndPoints.Dashboard.methods.GetDashboardFeedbackSummaryReportDataWithRestrictedAccess}`,{ params: params });
  }  
  GetDashboardGraphWithRestrictedAccess() {
    return this.http.get(
      `${environment.ApiEndPoint}${environment.EndPoints.Dashboard.Endpoint}${environment.EndPoints.Dashboard.methods.GetDashboardGraphWithRestrictedAccess}`,
      
    );
  }
  GetDashboardReportSummaryWithRestrictedAccess(params) {
    return this.http.post(
      `${environment.ApiEndPoint}${environment.EndPoints.Dashboard.Endpoint}${environment.EndPoints.Dashboard.methods.GetDashboardReportSummaryWithRestrictedAccess}`,
      params
    );
  }
  GetDashboardReportSummaryMonthlyWithRestrictedAccess(params) {
    return this.http.post(
      `${environment.ApiEndPoint}${environment.EndPoints.Dashboard.Endpoint}${environment.EndPoints.Dashboard.methods.GetDashboardReportSummaryMonthlyWithRestrictedAccess}`,
      params
    );
  }
  GetDashboardSpokeMaintenanceWithRestrictedAccess(params) {
    return this.http.get(
      `${environment.ApiEndPoint}${environment.EndPoints.Dashboard.Endpoint}${environment.EndPoints.Dashboard.methods.GetDashboardSpokeMaintenanceWithRestrictedAccess}`,
      params
    );
  }
  getInstallationReportWithRestrictedAccess(fromdate:any,todate:any)
  {
    let params=new HttpParams()
    params = params.append('fromDate', fromdate);
    params = params.append('toDate', todate);
   
    return this.http.get(
      `${environment.ApiEndPoint}${environment.EndPoints.Dashboard.Endpoint}${environment.EndPoints.Dashboard.methods.GetDashboardDCMaintenanceWithRestrictedAccess}`,{params:params}
    
    );
  }
  RemoteSiteDowntimeSummaryMonthlyWithRestrictedAccess(params) {
    return this.http.get(
      `${environment.ApiEndPoint}${environment.EndPoints.Dashboard.Endpoint}${environment.EndPoints.Dashboard.methods.RemoteSiteDowntimeSummaryMonthlyWithRestrictedAccess}`,
      params
    );
  }
  RemoteSiteDowntimeSummaryDailyWithRestrictedAccess(params) {
    return this.http.get(
      `${environment.ApiEndPoint}${environment.EndPoints.Dashboard.Endpoint}${environment.EndPoints.Dashboard.methods.RemoteSiteDowntimeSummaryDailyWithRestrictedAccess}`,
      params
    );
  }
  GetPHCConsultationReportWithRestrictedAccess(params) {
    return this.http.get(
      `${environment.ApiEndPoint}${environment.EndPoints.Dashboard.Endpoint}${environment.EndPoints.Dashboard.methods.GetPHCConsultationReportWithRestrictedAccess}`,
      params
    );
  }
  GetPHCLoginHistoryReportWithRestrictedAccess(params) {
    return this.http.get(
      `${environment.ApiEndPoint}${environment.EndPoints.Dashboard.Endpoint}${environment.EndPoints.Dashboard.methods.GetPHCLoginHistoryReportWithRestrictedAccess}`,
      params
    );
  }
  GetPHCManpowerReportWithRestrictedAccess(params) {
    return this.http.get(
      `${environment.ApiEndPoint}${environment.EndPoints.Dashboard.Endpoint}${environment.EndPoints.Dashboard.methods.GetPHCManpowerReportWithRestrictedAccess}`,
      params
    );
  }
  GetHRManpowersAsync(monthyear:any) {
    const body:any={
      year:this._datepipe.transform(monthyear,'yyyy'),
      month:this._datepipe.transform(monthyear,'MM')
    }
    return this.http.get(
      `${environment.ApiEndPoint}${environment.EndPoints.Dashboard.Endpoint}${environment.EndPoints.Dashboard.methods.GetHRManpowersAsync}?year=${body.year}&month=${body.month}`,
      );
  }
  // GetHRExecutiveReportWithRestrictedAccess
  GetHRExecutiveReportWithRestrictedAccess(params) {
    return this.http.get(
      `${environment.ApiEndPoint}${environment.EndPoints.Dashboard.Endpoint}${environment.EndPoints.Dashboard.methods.GetHRExecutiveReportWithRestrictedAccess}`,
      params
    );
  }
  GetPatientRegisterReportWithRestrictedAccess(params) {
    return this.http.get(
      `${environment.ApiEndPoint}${environment.EndPoints.Dashboard.Endpoint}${environment.EndPoints.Dashboard.methods.GetPatientRegisterReportWithRestrictedAccess}`,
      params
    );
  }
  GetReviewPatientReportWithRestrictedAccess(params) {
    return this.http.get(
      `${environment.ApiEndPoint}${environment.EndPoints.Dashboard.Endpoint}${environment.EndPoints.Dashboard.methods.GetReviewPatientReportWithRestrictedAccess}`,
      params
    );
  }
  GetReferredPatientReportWithRestrictedAccess(params) {
    return this.http.get(
      `${environment.ApiEndPoint}${environment.EndPoints.Dashboard.Endpoint}${environment.EndPoints.Dashboard.methods.GetReferredPatientReportWithRestrictedAccess}`,
      params
    );
  }
  GetPrescribedMedicineWithRestrictedAccess(params) {
    return this.http.get(
      `${environment.ApiEndPoint}${environment.EndPoints.Dashboard.Endpoint}${environment.EndPoints.Dashboard.methods.GetPrescribedMedicineWithRestrictedAccess}`,
      params
    );
  }
  GetPrescribedMedicinePHCWiseWithRestrictedAccess(params) {
    return this.http.get(
      `${environment.ApiEndPoint}${environment.EndPoints.Dashboard.Endpoint}${environment.EndPoints.Dashboard.methods.GetPrescribedMedicinePHCWiseWithRestrictedAccess}`,
      params
    );
  }
  GetConsultedPatientsAsync(PageNo,PageSize,SortColumn,SortDirection,SearchValue,FromDate,ToDate,UserID){
   
    let params = new HttpParams();
    params = params.append('PageNo', PageNo);
    params = params.append('PageSize', PageSize);
    params = params.append('SortColumn', SortColumn);
    params = params.append('SortDirection', SortDirection);
    params = params.append('SearchValue', SearchValue);
    params = params.append('FromDate', FromDate);
    params = params.append('ToDate', ToDate);
    params = params.append('UserID', UserID);
    return this.http.get(`${environment.ApiEndPoint}${environment.EndPoints.Dashboard.Endpoint}${environment.EndPoints.Dashboard.methods.GetConsultedPatientsAsync}`, { params: params });

  }
  GetConsultedPatientsReportAsync(PageNo,PageSize,SortColumn,SortDirection,SearchValue,FromDate,ToDate,UserID){
   
    let params = new HttpParams();
    params = params.append('PageNo', PageNo);
    params = params.append('PageSize', PageSize);
    params = params.append('SortColumn', SortColumn);
    params = params.append('SortDirection', SortDirection);
    params = params.append('SearchValue', SearchValue);
    params = params.append('FromDate', FromDate);
    params = params.append('ToDate', ToDate);
    params = params.append('UserID', UserID);
    return this.http.get(`${environment.ApiEndPoint}${environment.EndPoints.Dashboard.Endpoint}${environment.EndPoints.Dashboard.methods.GetConsultedPatientsReportAsync}`, { responseType:'blob',params: params });

  }
  GetAppointedPatientListAsync(PageNo,PageSize,SortColumn,SortDirection,SearchValue,FromDate,ToDate,UserID){
   
    let params = new HttpParams();
    params = params.append('PageNo', PageNo);
    params = params.append('PageSize', PageSize);
    params = params.append('SortColumn', SortColumn);
    params = params.append('SortDirection', SortDirection);
    params = params.append('SearchValue', SearchValue);
    params = params.append('FromDate', FromDate);
    params = params.append('ToDate', ToDate);
    params = params.append('UserID', UserID);
    return this.http.get(`${environment.ApiEndPoint}${environment.EndPoints.Dashboard.Endpoint}${environment.EndPoints.Dashboard.methods.GetAppointedPatientListAsync}`, { params: params });

  }
  // GetAppointedPatientsReportAsync
  GetAppointedPatientsReportAsync(PageNo,PageSize,SortColumn,SortDirection,SearchValue,FromDate,ToDate,UserID){
   
    let params = new HttpParams();
    params = params.append('PageNo', PageNo);
    params = params.append('PageSize', PageSize);
    params = params.append('SortColumn', SortColumn);
    params = params.append('SortDirection', SortDirection);
    params = params.append('SearchValue', SearchValue);
    params = params.append('FromDate', FromDate);
    params = params.append('ToDate', ToDate);
    params = params.append('UserID', UserID);
    return this.http.get(`${environment.ApiEndPoint}${environment.EndPoints.Dashboard.Endpoint}${environment.EndPoints.Dashboard.methods.GetAppointedPatientsReportAsync}`, {responseType:'blob', params: params });

  }
  // AppointmentPatientReportResultAsync
  AppointmentPatientReportResultAsync(PageNo,PageSize,SortColumn,SortDirection,SearchValue,FromDate,ToDate,UserID){
   
    let params = new HttpParams();
    params = params.append('PageNo', PageNo);
    params = params.append('PageSize', PageSize);
    params = params.append('SortColumn', SortColumn);
    params = params.append('SortDirection', SortDirection);
    params = params.append('SearchValue', SearchValue);
    params = params.append('FromDate', FromDate);
    params = params.append('ToDate', ToDate);
    params = params.append('UserID', UserID);
    return this.http.get(`${environment.ApiEndPoint}${environment.EndPoints.Dashboard.Endpoint}${environment.EndPoints.Dashboard.methods.AppointmentPatientReportResultAsync}`, {responseType:'blob', params: params });

  }

  GetApiDomains()
  {
    return this.http.get(`${environment.ApiEndPoint}${environment.EndPoints.Master.Endpoint}${environment.EndPoints.Master.methods.GetApiDomians}`)
  }

  GetReportDomians()
  {
    return this.http.get(`${environment.ApiEndPoint}${environment.EndPoints.Master.Endpoint}${environment.EndPoints.Master.methods.GetReportDomians}`)

  }

  GetReportAccessDetailsByUserID()
  {
    let params=new HttpParams()
    params = params.append('userID', localStorage.getItem('userId'));
    return this.http.get(`${environment.ApiEndPoint}${environment.EndPoints.Master.Endpoint}${environment.EndPoints.Master.methods.GetReportAccessDetailsByUserID}`,{params:params})

  }

}
