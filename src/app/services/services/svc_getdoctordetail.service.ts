import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Params } from '@angular/router';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class Svc_getdoctordetailService {
  SearchDoctorDetails() {
    throw new Error('Method not implemented.');
  }

  constructor(private http: HttpClient) { }

  //post
  GetListOfNotification(params) {
    return this.http.post(`${environment.ApiEndPoint}${environment.EndPoints.Doctor.Endpoint}${environment.EndPoints.Doctor.methods.GetListOfNotification}`, params)
  }

  //get
  getCDSSGuideLines() {
    return this.http.get(`${environment.ApiEndPoint}${environment.EndPoints.Doctor.Endpoint}${environment.EndPoints.Doctor.methods.GetCDSSGuideLines}`);
  }



  //get
  GetListOfMedicine() {
    return this.http.get(`${environment.ApiEndPoint}${environment.EndPoints.Doctor.Endpoint}${environment.EndPoints.Doctor.methods.GetListOfMedicine}`);
  }

  //get
  GetListOfVital() {
    return this.http.get(`${environment.ApiEndPoint}${environment.EndPoints.Doctor.Endpoint}${environment.EndPoints.Doctor.methods.GetListOfVital}`);
  }

  //get
  GetListOfPHCHospital() {
    return this.http.get(`${environment.ApiEndPoint}${environment.EndPoints.Doctor.Endpoint}${environment.EndPoints.Doctor.methods.GetListOfPHCHospital}`);
  }

  //get
  GetListOfSpecializationMaster() {
    return this.http.get(`${environment.ApiEndPoint}${environment.EndPoints.Doctor.Endpoint}${environment.EndPoints.Doctor.methods.GetListOfSpecializationMaster}`);
  }

  //get
  GetListOfSubSpecializationMaster(SpecializationId) {
    let params = new HttpParams();
    params = params.append('SpecializationId', SpecializationId.toString());
    return this.http.get(`${environment.ApiEndPoint}${environment.EndPoints.Doctor.Endpoint}${environment.EndPoints.Doctor.methods.GetListOfSubSpecializationMaster}`, { params: params });
  }

  //post
  UpdateDoctorDetails(params) {
    return this.http.post(`${environment.ApiEndPoint}${environment.EndPoints.Doctor.Endpoint}${environment.EndPoints.Doctor.methods.UpdateDoctorDetails}`, params);
  }
  DoctorSearchByName(params) {
    // let params = new HttpParams();
    // params = params.append('userEmailID', userEmailID.toString());
    return this.http.post(`${environment.ApiEndPoint}${environment.EndPoints.Doctor.Endpoint}${environment.EndPoints.Doctor.methods.SearchDoctorDetails}`,  params);
  }
//post
GetAllDoctorEmails(params) {
  return this.http.post(`${environment.ApiEndPoint}${environment.EndPoints.Doctor.Endpoint}${environment.EndPoints.Doctor.methods.GetAllDoctorEmails}`, params);
}

  // GetPhcDetailById(email) {
  //   let params = new HttpParams();
  //   params = params.append('email', email.toString());
  //   return this.http.get(`${environment.ApiEndPoint}${environment.EndPoints.PHC.Endpoint}${environment.EndPoints.PHC.methods.GetPHCDetailsByEmailID}`, { params: params })

  // }
  

  //post
  GetTodaysPatients(doctorID: any) {
    return this.http.post(`${environment.ApiEndPoint}${environment.EndPoints.Doctor.Endpoint}${environment.EndPoints.Doctor.methods.GetTodayesPatients}`, doctorID);
  }

  DoctorRegistration(obj : object) {
    return this.http.post(`${environment.ApiEndPoint}${environment.EndPoints.Doctor.Endpoint}${environment.EndPoints.Doctor.methods.AddDoctor}`, obj);
  }

  //post
  GetDoctorDetails(userEmailID: any) {
    return this.http.post(`${environment.ApiEndPoint}${environment.EndPoints.Doctor.Endpoint}${environment.EndPoints.Doctor.methods.GetDoctorDetails}`, userEmailID)
  }
  image(path: any) {
    return this.http.get( `${environment.ImagesHeader}${path}`,{responseType:'blob'})
  }

  GetDoctorDetails1(userEmailID: any) {
    return this.http.post(`${environment.ApiEndPoint}${environment.EndPoints.Doctor.Endpoint}${environment.EndPoints.Doctor.methods.GetDoctorDetails}`, userEmailID)
  }

  //post
  GetCompletedConsultationPatientsHistory(doctorID: any) {
    let params = new HttpParams();
    return this.http.post(`${environment.ApiEndPoint}${environment.EndPoints.Doctor.Endpoint}${environment.EndPoints.Doctor.methods.GetCompletedConsultationPatientsHistory}`, doctorID);
  }

  //post
  GetYesterdayPatientsHistory(doctorID: any) {
    let params = new HttpParams();
    return this.http.post(`${environment.ApiEndPoint}${environment.EndPoints.Doctor.Endpoint}${environment.EndPoints.Doctor.methods.GetYesterdayPatientsHistory}`, doctorID);
  }

  //post
  GetPastPatientsHistory(doctorID: any) {
    return this.http.post(`${environment.ApiEndPoint}${environment.EndPoints.Doctor.Endpoint}${environment.EndPoints.Doctor.methods.GetPastPatientsHistory}`, doctorID);
  }

  //post
  AdvanceSearchResult(data: any) {

    return this.http.post(`${environment.ApiEndPoint}${environment.EndPoints.Doctor.Endpoint}${environment.EndPoints.Doctor.methods.AdvanceSearchResult}`, data);
  }

  //post
  // GetPatientCaseDetailsAsync(params) {
  //   debugger
  //   return this.http.post(`${environment.ApiEndPoint}${environment.EndPoints.Doctor.Endpoint}${environment.EndPoints.Doctor.methods.GetPatientCaseDetailsAsync}`, params);
  // }
  GetPatientCaseDetailsAsync(patientCaseID: any) {

    // let params = new HttpParams();
    //  params = params.append('patientCaseID', patientCaseID);
    return this.http.post(`${environment.ApiEndPoint}${environment.EndPoints.Doctor.Endpoint}${environment.EndPoints.Doctor.methods.GetPatientCaseDetailsAsync}`, patientCaseID);

  }
  //post
  PostTreatmentPlan(params) {
    return this.http.post(`${environment.ApiEndPoint}${environment.EndPoints.Doctor.Endpoint}${environment.EndPoints.Doctor.methods.PostTreatmentPlan}`, params);
  }

  //post
  DeleteNotification(NotificationID) {
    let params = new HttpParams().set('NotificationID', NotificationID);
    return this.http.post(`${environment.ApiEndPoint}${environment.EndPoints.Doctor.Endpoint}${environment.EndPoints.Doctor.methods.DeleteNotification}?NotificationID=${NotificationID}`, '');
  }

  //post
  EHRData(patientCaseID: any) {
    return this.http.post(`${environment.ApiEndPoint}${environment.EndPoints.Doctor.Endpoint}${environment.EndPoints.Doctor.methods.EHRData}`, patientCaseID);
  }

  //post
  PatientAbsent(params) {
    return this.http.post(`${environment.ApiEndPoint}${environment.EndPoints.Doctor.Endpoint}${environment.EndPoints.Doctor.methods.PatientAbsent}`, params);
  }

  //post
  ReferHigherFacility(params) {
    return this.http.post(`${environment.ApiEndPoint}${environment.EndPoints.Doctor.Endpoint}${environment.EndPoints.Doctor.methods.ReferHigherFacility}`, params);
  }

  //post
  GetCaseLabel(patientID: []) {
    return this.http.post(`${environment.ApiEndPoint}${environment.EndPoints.Doctor.Endpoint}${environment.EndPoints.Doctor.methods.GetCaseLabel}`, patientID);
  }

  //post
  SearchPatientDrDashBoard(params) {

    // let params = new HttpParams();
    // params = params.append('patientName', patientName.toString());
    // params = params.append('doctorID', doctorID.toString());

    return this.http.post(`${environment.ApiEndPoint}${environment.EndPoints.Doctor.Endpoint}${environment.EndPoints.Doctor.methods.SearchPatientDrDashBoard}`, params);

  }
  // GetSearchPatient(patientName: []){
  //   let params = new HttpParams();
  //   params = params.append('patientName', patientName.toString());
  //   return this.http.get(`${environment.ApiEndPoint}${environment.EndPoints.Patient.Endpoint}${environment.EndPoints.Patient.methods.GetTodaysSearchedPatients}`, { params: params });
  // }
  //post
  SearchPatientDrHistory(params) {
    return this.http.post(`${environment.ApiEndPoint}${environment.EndPoints.Doctor.Endpoint}${environment.EndPoints.Doctor.methods.SearchPatientDrHistory}`, params);
  }

  //post
  GetListOfPHCHospitalBlockWise(blockID) {
    
    return this.http.post(`${environment.ApiEndPoint}${environment.EndPoints.Doctor.Endpoint}${environment.EndPoints.Doctor.methods.GetListOfPHCHospitalBlockWise}`, blockID );
  }
  // GetListOfPHCListBlockWise(blockID)
  // {
  //   debugger;
  //   let param = new HttpParams();
  //   param = param.append("blockID", blockID);
  //   return this.http.get(`${environment.ApiEndPoint}${environment.EndPoints.Master.Endpoint}${environment.EndPoints.Master.methods.GetListOfPHCHospitalBlockWise}`,{ params: param });
  // }

  GetListOfPHCBlockWise(params) {
    return this.http.post(`${environment.ApiEndPoint}${environment.EndPoints.Doctor.Endpoint}${environment.EndPoints.Doctor.methods.GetListOfPHCHospitalBlockWise}`, params);
  }
  //post
  GetLatestReferred(params) {
    return this.http.post(`${environment.ApiEndPoint}${environment.EndPoints.Doctor.Endpoint}${environment.EndPoints.Doctor.methods.GetLatestReferred}`, params);
  }
  //post
  GetLatestReferredCount(params) {
    return this.http.post(`${environment.ApiEndPoint}${environment.EndPoints.Doctor.Endpoint}${environment.EndPoints.Doctor.methods.GetLatestReferredCount}`, params);
  }
  //post
  UpdateIsDrOnline(params) {
    return this.http.post(`${environment.ApiEndPoint}${environment.EndPoints.Doctor.Endpoint}${environment.EndPoints.Doctor.methods.UpdateIsDrOnline}`, params);
  }

  //post
  IsDrOnline(params) {
    return this.http.post(`${environment.ApiEndPoint}${environment.EndPoints.Doctor.Endpoint}${environment.EndPoints.Doctor.methods.IsDrOnline}`, params);
  }

  //post
  OnlineDrList(params) {
    return this.http.post(`${environment.ApiEndPoint}${environment.EndPoints.Doctor.Endpoint}${environment.EndPoints.Doctor.methods.OnlineDrList}`, params);
  }

  
  //post
  AddDoctor(params) {
    return this.http.post(`${environment.ApiEndPoint}${environment.EndPoints.Doctor.Endpoint}${environment.EndPoints.Doctor.methods.AddDoctor}`, params);
  }
  GetAllPHC(districtId) {

    let params = new HttpParams();
    params = params.append('districtId', districtId.toString());
    return this.http.get(`${environment.ApiEndPoint}${environment.EndPoints.PHC.Endpoint}${environment.EndPoints.PHC.methods.GetAllPHC}`, { params: params });

  }
  CreatePrescription(caseid) {
    let params = new HttpParams();
    params = params.append('caseid', caseid.toString());
    return this.http.get(`${environment.ApiEndPoint}${environment.EndPoints.Doctor.Endpoint}${environment.EndPoints.Doctor.methods.CreatePrescription}`, { params: params });

  }

  GetCDSSGuideLinesByDiseasesAndAge(obj) {
    let params = new HttpParams();
    params = params.append('Diseases', obj.Diseases);
    let ageArray = (obj?.Age || "0 Days").split(" ");
    let ageInt = ageArray[1].toLowerCase() == "days" ? "0" : ageArray[0];

    params = params.append('Age', ageInt);
    return this.http.get(`${environment.ApiEndPoint}${environment.EndPoints.CDSSGuideline.Endpoint}${environment.EndPoints.CDSSGuideline.methods.GetCDSSGuideLinesByDiseasesAndAge}`, { params: params });

  }

  GetCDSSGuidelineDiseasesByDiseasesAndAge(obj) {
    let params = new HttpParams();
    let ageArray = (obj?.Age || "0 Days").split(" ");
    let ageInt = ageArray[1].toLowerCase() == "days" ? "0" : ageArray[0];
    params = params.append('Diseases', obj.Diseases);
    params = params.append('Age', ageInt);
    return this.http.get(`${environment.ApiEndPoint}${environment.EndPoints.CDSSGuideline.Endpoint}${environment.EndPoints.CDSSGuideline.methods.GetCDSSGuidelineDiseasesByDiseasesAndAge}`, { params: params });

  }

  downloadPrescription(userid:any)
  {
    return this.http.get(`${environment.ApiEndPoint}${environment.EndPoints.Doctor.Endpoint}${environment.EndPoints.Doctor.methods.CreatePrescriptionHTML}?caseid=${userid}`);

  }

  downloadCaseFile(filePath:String){
    return this.http.get(`${filePath}`,{responseType:'blob'})
  }

  GetPrescriptionFile(storage:any,path:'any')
  {
    return this.http.get(`${environment.ApiEndPoint}${environment.EndPoints.Doctor.Endpoint}${environment.EndPoints.Doctor.methods.GetPrescriptionFile}?filePath=${path}&StorageSource=${storage==null?0:storage}`)
  }
  GetDoctorCalendar(month,year,AssignedDoctorID) {
    let params = new HttpParams();
    params = params.append('month', month.toString());
    params = params.append('year', year.toString());
    params = params.append('AssignedDoctorID', AssignedDoctorID.toString());
    return this.http.get(`${environment.ApiEndPoint}${environment.EndPoints.Doctor.Endpoint}${environment.EndPoints.Doctor.methods.GetDoctorCalendar}`, { params: params });

  }


}
