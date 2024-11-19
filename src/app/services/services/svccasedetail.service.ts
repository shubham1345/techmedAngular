import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SvccasedetailService {

  constructor(private http: HttpClient) { }

  GetPatientCaseDetails(PatientId,PHCId) {
    let params = new HttpParams();
    params = params.append('PHCId', PHCId);
    params = params.append('PatientId', PatientId);
    return this.http.get(`${environment.ApiEndPoint}${environment.EndPoints.PatientCase.Endpoint}${environment.EndPoints.PatientCase.methods.GetPatientCaseDetails}`, { params: params });
  }
  GetPatientCaseDetailsdirect(PatientId) {
    
    let params = new HttpParams();
    params = params.append('PatientId', PatientId);
    return this.http.get(`${environment.ApiEndPoint}${environment.EndPoints.PatientCase.Endpoint}${environment.EndPoints.PatientCase.methods.GetPatientCaseDetails}`, { params: params });
  }
  setCasedetailPhc(obj){
    return this.http.post(`${environment.ApiEndPoint}${environment.EndPoints.PatientCase.Endpoint}${environment.EndPoints.PatientCase.methods.AddPatientCaseDetails}`, obj);
  }

  createPatientCase(data : any){
    return this.http.post(`${environment.ApiEndPoint}${environment.EndPoints.PatientCase.Endpoint}${environment.EndPoints.PatientCase.methods.CreatePatientCase}`,  data );
  }
  caseFileUpload(data : any){
    return this.http.post(`${environment.ApiEndPoint}${environment.EndPoints.PatientCase.Endpoint}${environment.EndPoints.PatientCase.methods.UploadCaseDoc}`,  data );
  }
  
}
