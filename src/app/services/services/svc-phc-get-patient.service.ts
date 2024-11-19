import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SvcPhcGetPatientService {
  // phcRegister(obj: any) {
  //   throw new Error('Method not implemented.');
  // }
  // phcRegister(obj: any) {
  //   throw new Error('Method not implemented.');
  // }

  constructor(private http: HttpClient) { }

  GetTodaysPatientCount(phcID: []) {

    let params = new HttpParams();
    params = params.append('phcID', phcID.toString());
    return this.http.get(`${environment.ApiEndPoint}${environment.EndPoints.Patient.Endpoint}${environment.EndPoints.Patient.methods.GetTodaysPatientCount}`, { params: params });
  }
  
  demoCheck(){
    return this.http.get('https://srishti91.mykaarma.dev/appointment/v2/consumer/webservice/customerUserSession/fe79399f-9865-4a24-8041-13dcc857f53f/dealerWithAddress')
  }
  GetConsultedPatient(phcID: []){
    let params = new HttpParams();
    params = params.append('phcID', phcID.toString());
    return this.http.get(`${environment.ApiEndPoint}${environment.EndPoints.Patient.Endpoint}${environment.EndPoints.Patient.methods.GetConsultedPatient}`, { params: params });
  }
  GetTodayPatient(phcID: []){
    let params = new HttpParams();
    params = params.append('phcID', phcID.toString());
    return this.http.get(`${environment.ApiEndPoint}${environment.EndPoints.Patient.Endpoint}${environment.EndPoints.Patient.methods.GetTodaysPatient}`, { params: params });
  }
  
  GetYesterdayPatient(phcID: []){
    let params = new HttpParams();
    params = params.append('phcID', phcID.toString());
    return this.http.get(`${environment.ApiEndPoint}${environment.EndPoints.Patient.Endpoint}${environment.EndPoints.Patient.methods.GetYesterdaysPatient}`, { params: params });
  }
  GetSearchPatient(patientName: []){
    let params = new HttpParams();
    params = params.append('patientName', patientName.toString());
    return this.http.get(`${environment.ApiEndPoint}${environment.EndPoints.Patient.Endpoint}${environment.EndPoints.Patient.methods.GetTodaysSearchedPatients}`, { params: params });
  }
  getAdvancessearch(data : any){
    return this.http.post(`${environment.ApiEndPoint}${environment.EndPoints.Patient.Endpoint}${environment.EndPoints.Patient.methods.AdvanceSearchResult}`, data);
  }
  getmaritalstatus(){
    return this.http.get(`${environment.ApiEndPoint}${environment.EndPoints.Master.Endpoint}${environment.EndPoints.Master.methods.GetAllMaritalStatus}`);

  }
  // getphcdetailbyuserid(userId: []){
    
  //   let params = new HttpParams();
  //   params = params.append('userId', userId.toString());
  //   return this.http.get(`${environment.ApiEndPoint}${environment.EndPoints.PHC.Endpoint}${environment.EndPoints.PHC.methods.GetPHCDetailsByUserID}`, { params: params });
  // }
  getphcdetail(userId: []){
    
    let params = new HttpParams();
    params = params.append('userId', userId.toString());
    return this.http.get(`${environment.ApiEndPoint}${environment.EndPoints.PHC.Endpoint}${environment.EndPoints.PHC.methods.GetPHCDetails}`, { params: params });
  }
  phcRegister(obj :object){
    return this.http.post(`${environment.ApiEndPoint}${environment.EndPoints.PHC.Endpoint}${environment.EndPoints.PHC.methods.AddPHC}`, obj);
  }

  SearchPHCDetailByName(params){
    return this.http.get(`${environment.ApiEndPoint}${environment.EndPoints.PHC.Endpoint}${environment.EndPoints.PHC.methods.SearchPHCDetailByName}`,params);

  }
  //get GetAllPHCName

  GetAllPHCName(){
    return this.http.get(`${environment.ApiEndPoint}${environment.EndPoints.PHC.Endpoint}${environment.EndPoints.PHC.methods.GetAllPHCName}`);

  }

  //get GetPHCDetailByName
  
  GetPHCDetailByName(name){
    let params = new HttpParams();
    params = params.append('name', name);
    return this.http.get(`${environment.ApiEndPoint}${environment.EndPoints.PHC.Endpoint}${environment.EndPoints.PHC.methods.GetPHCDetailByName}`,{ params: params });


  }
  UpdatePHCDetails(obj :object){
    return this.http.post(`${environment.ApiEndPoint}${environment.EndPoints.PHC.Endpoint}${environment.EndPoints.PHC.methods.UpdatePHCDetails}`, obj);
  }


  getphcdetailById(id){
    
    let params = new HttpParams();
    params = params.append('id', id);
    return this.http.get(`${environment.ApiEndPoint}${environment.EndPoints.PHC.Endpoint}${environment.EndPoints.PHC.methods.GetPHCDetailById}`, { params: params });
  }

  SetregisterPatient(obj: Object){
    return this.http.post(`${environment.ApiEndPoint}${environment.EndPoints.Patient.Endpoint}${environment.EndPoints.Patient.methods.AddPatient}`, obj);
  }

  setCountryMaster(){
    return this.http.get(`${environment.ApiEndPoint}${environment.EndPoints.Master.Endpoint}${environment.EndPoints.Master.methods.GetAllCountryMaster}`);
  }
  setdistrictMaster(){
    return this.http.get(`${environment.ApiEndPoint}${environment.EndPoints.Master.Endpoint}${environment.EndPoints.Master.methods.GetAllDistrictMaster}`);
  }
  setidProofMaster(){
    return this.http.get(`${environment.ApiEndPoint}${environment.EndPoints.Master.Endpoint}${environment.EndPoints.Master.methods.GetAllIDProofTypeMaster}`);
  }
  setGenderMaster(){
    return this.http.get(`${environment.ApiEndPoint}${environment.EndPoints.Master.Endpoint}${environment.EndPoints.Master.methods.GetAllGenderMaster}`);
  }
  getonlinedrlist(data){
    // let params = new HttpParams();
    // params = params.append('zoneID', zoneID);
    return this.http.post(`${environment.ApiEndPoint}${environment.EndPoints.Doctor.Endpoint}${environment.EndPoints.Doctor.methods.OnlineDrList}`,{data});
  }
setCityMaster(){
return this.http.get(`${environment.ApiEndPoint}${environment.EndPoints.Master.Endpoint}${environment.EndPoints.Master.methods.GetAllCityMaster}`);
}
  getselectedonlinedrlist(PatientCaseID){
    let params = new HttpParams();
    params = params.append('PatientCaseID', PatientCaseID.toString());
    return this.http.get(`${environment.ApiEndPoint}${environment.EndPoints.PatientCase.Endpoint}${environment.EndPoints.PatientCase.methods.GetSelectedOnlineDoctors}`,{params: params});
  }
  getCaseLabel(patientID : any){
    return this.http.post(`${environment.ApiEndPoint}${environment.EndPoints.Doctor.Endpoint}${environment.EndPoints.Doctor.methods.GetCaseLabel}`,  {patientID} );
  }

  AddReferDoctorInPatientCase(data : any){
    return this.http.post(`${environment.ApiEndPoint}${environment.EndPoints.PatientCase.Endpoint}${environment.EndPoints.PatientCase.methods.AddReferDoctorInPatientCase}`,  data );
  }
  getpatientcasequeue(phcID: [],PatientId: []){
    let params = new HttpParams();
    params = params.append('phcID', phcID.toString());
    params = params.append('PatientId', PatientId.toString());
    return this.http.get(`${environment.ApiEndPoint}${environment.EndPoints.PatientCase.Endpoint}${environment.EndPoints.PatientCase.methods.GetPatientCaseQueue}`, { params: params });
  }
  getpatientcasedetail(phcID: [],PatientId: []){
    let params = new HttpParams();
    params = params.append('phcID', phcID.toString());
    params = params.append('PatientId', PatientId.toString());
    return this.http.get(`${environment.ApiEndPoint}${environment.EndPoints.PatientCase.Endpoint}${environment.EndPoints.PatientCase.methods.GetPatientCaseDetails}`, { params: params });
  }
  AddPatientCaseDetails(data : any){
    return this.http.post(`${environment.ApiEndPoint}${environment.EndPoints.PatientCase.Endpoint}${environment.EndPoints.PatientCase.methods.AddPatientCaseDetails}`, data);
  }
  GetDiagnosticTest(){
    return this.http.get(`${environment.ApiEndPoint}${environment.EndPoints.Master.Endpoint}${environment.EndPoints.Master.methods.GetDiagnosticTest}`);
  }
  GetMedicineTest(){
    return this.http.get(`${environment.ApiEndPoint}${environment.EndPoints.Master.Endpoint}${environment.EndPoints.Master.methods.GetAllDrugsName}`);
  }
  getPatientProfile(PatientID){
    let params = new HttpParams();
    params = params.append('PatientID', PatientID.toString());
    return this.http.get(`${environment.ApiEndPoint}${environment.EndPoints.PatientCase.Endpoint}${environment.EndPoints.PatientCase.methods.GetPatientCaseLevels}`, { params: params });

  }
  getPatientCaseDetail(PatientCaseID){
    let params = new HttpParams();
    params = params.append('PatientCaseID', PatientCaseID?.toString());
    return this.http.get(`${environment.ApiEndPoint}${environment.EndPoints.PatientCase.Endpoint}${environment.EndPoints.PatientCase.methods.GetPatientCaseDetailsByCaseID}`, { params: params });

  }
  getPatientCasedocList(PatientCaseID){
    let params = new HttpParams();
    params = params.append('PatientCaseID', PatientCaseID?.toString());
    return this.http.get(`${environment.ApiEndPoint}${environment.EndPoints.PatientCase.Endpoint}${environment.EndPoints.PatientCase.methods.GetPatientCaseDocList}`, { params: params });
  }
  postFeedback(data : any){
    return this.http.post(`${environment.ApiEndPoint}${environment.EndPoints.PatientCase.Endpoint}${environment.EndPoints.PatientCase.methods.PostFeedback}`,  data );
  }
  GetSuggestedSpecializations(Id){
    let params = new HttpParams();
    params = params.append('Id', Id);
    return this.http.get(`${environment.ApiEndPoint}${environment.EndPoints.Patient.Endpoint}${environment.EndPoints.Patient.methods.GetSuggestedSpecializations}`,{params: params});
  }
  // GetSelectedOnlineDoctors
 
  // GetSelectedOnlineDoctors(PatientCaseID){
  //   let params = new HttpParams();
  //   params = params.append('PatientCaseID', PatientCaseID?.toString());
  //   return this.http.get(`${environment.ApiEndPoint}${environment.EndPoints.PatientCase.Endpoint}${environment.EndPoints.PatientCase.methods.GetSelectedOnlineDoctors}`, { params: params });

  // }

  GetPatientQueue(PHCID){
    
    let params = new HttpParams();
    params = params.append('PHCID', PHCID);
    return this.http.get(`${environment.ApiEndPoint}${environment.EndPoints.PatientCase.Endpoint}${environment.EndPoints.PatientCase.methods.GetPatientQueue}`,{params: params});
  }
  GetPatientQueueByDoctorID(doctorID){
    let params = new HttpParams();
    params = params.append('doctorID', doctorID);
    return this.http.get(`${environment.ApiEndPoint}${environment.EndPoints.PatientCase.Endpoint}${environment.EndPoints.PatientCase.methods.GetPatientQueueByDoctorID}`,{params: params});
  }
  GetPatientQueueByDoctors(SpecializationID){
    let params = new HttpParams();
    params = params.append('SpecializationID', SpecializationID);
    return this.http.get(`${environment.ApiEndPoint}${environment.EndPoints.PatientCase.Endpoint}${environment.EndPoints.PatientCase.methods.GetPatientQueueByDoctors}`,{params: params});
  }
  AddPatientInDoctorsQueue(data){
    return this.http.post(`${environment.ApiEndPoint}${environment.EndPoints.PatientCase.Endpoint}${environment.EndPoints.PatientCase.methods.AddPatientInDoctorsQueue}`,  data );

  }
  RemovePatientFromDoctorsQueue(data : any){
    return this.http.post(`${environment.ApiEndPoint}${environment.EndPoints.PatientCase.Endpoint}${environment.EndPoints.PatientCase.methods.RemovePatientFromDoctorsQueue}?PatientCaseID=${data}`,'');
  }
  GetAllPHCPatientQueue(){
    return this.http.get(`${environment.ApiEndPoint}${environment.EndPoints.PatientCase.Endpoint}${environment.EndPoints.PatientCase.methods.GetAllPHCPatientQueue}`);

  }
  GetAllPandingPatientQueue(fromDate,toDate){
    let params = new HttpParams();
    params = params.append('fromDate', fromDate.toString());
    params = params.append('toDate', toDate.toString());
    return this.http.get(`${environment.ApiEndPoint}${environment.EndPoints.PatientCase.Endpoint}${environment.EndPoints.PatientCase.methods.GetAllPandingPatientQueue}`,{ params: params });

  }
  GetPatientCaseDoctorFeedback(fromDate,toDate){
    let params = new HttpParams();
    params = params.append('fromDate', fromDate.toString());
    params = params.append('toDate', toDate.toString());
    return this.http.get(`${environment.ApiEndPoint}${environment.EndPoints.PatientCase.Endpoint}${environment.EndPoints.PatientCase.methods.GetPatientCaseDoctorFeedback}`,{ params: params });

  }
  UpdatePatientCaseDoctorFeedback(patinetCaseID,doctorFeedback){
    let params = new HttpParams();
    params = params.append('patinetCaseID', patinetCaseID.toString());
    params = params.append('doctorFeedback', doctorFeedback.toString());
    return this.http.get(`${environment.ApiEndPoint}${environment.EndPoints.PatientCase.Endpoint}${environment.EndPoints.PatientCase.methods.UpdatePatientCaseDoctorFeedback}`,{ params: params });

  }
  GetPatientImageFile(image,path)
  {
    let storage=path?path:0
    const requestOptions: Object = {
      responseType: 'blob'
      }
      return this.http.get(`${environment.ApiEndPoint}${environment.EndPoints.Patient.Endpoint}${environment.EndPoints.Patient.methods.GetPatientImageFile}?filePath=${image}&StorageSource=${storage}`,requestOptions)
  }

  GetTotalCaseStatusAndSpecialityWise()
  {
    return this.http.get(`${environment.ApiEndPoint}${environment.EndPoints.PatientCase.Endpoint}${environment.EndPoints.PatientCase.methods.GetTotalCaseStatusAndSpecialityWise}`)
  }



}

