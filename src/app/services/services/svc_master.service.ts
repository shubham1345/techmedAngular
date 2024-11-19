import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Params } from '@angular/router';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})

export class Svc_MasterService {
  // GetAllClusterMaster() {
  //   throw new Error('Method not implemented.');
  // }
  GetListOfPHCHospitalBlockWise(filter: unknown) {
    throw new Error('Method not implemented.');
  }

  constructor(private http: HttpClient) { }


  //get
  GetAllStateMaster() {
    return this.http.get(`${environment.ApiEndPoint}${environment.EndPoints.Master.Endpoint}${environment.EndPoints.Master.methods.GetAllStateMaster}`);
  }
  GetAllGenderMaster() {
    return this.http.get(`${environment.ApiEndPoint}${environment.EndPoints.Master.Endpoint}${environment.EndPoints.Master.methods.GetAllGenderMaster}`);
  }
  GetAllBlockMaster() {
    return this.http.get(`${environment.ApiEndPoint}${environment.EndPoints.Master.Endpoint}${environment.EndPoints.Master.methods.GetAllBlockMaster}`);
  }
  GetBlocksByDistrictID(districtId)
  {
    
    let param = new HttpParams();
    param = param.append("districtId", districtId);
    return this.http.get(`${environment.ApiEndPoint}${environment.EndPoints.Master.Endpoint}${environment.EndPoints.Master.methods.GetBlocksByDistrictID}`,{ params: param });
  }
  GetDivisionsByClusterID(clusterId){
    let param = new HttpParams();
    param = param.append("clusterId", clusterId);
    return this.http.get(`${environment.ApiEndPoint}${environment.EndPoints.Master.Endpoint}${environment.EndPoints.Master.methods.GetDivisionsByClusterID}`,{ params: param });
  } GetDistrictsByDivisionID(divisionId){
    let param = new HttpParams();
    param = param.append("divisionId", divisionId);
    return this.http.get(`${environment.ApiEndPoint}${environment.EndPoints.Master.Endpoint}${environment.EndPoints.Master.methods.GetDistrictsByDivisionID}`,{ params: param });
  }
  GetAllSpecialization(){
    return this.http.get(`${environment.ApiEndPoint}${environment.EndPoints.Master.Endpoint}${environment.EndPoints.Master.methods.GetAllSpecialization}`); 
  }

  GetAllClusterMaster(){
    return this.http.get(`${environment.ApiEndPoint}${environment.EndPoints.Master.Endpoint}${environment.EndPoints.Master.methods.GetAllClusterMaster}`);
  }
  SearchSnomedCTCodes(searchText: string) {
    if (searchText) {

      let param = new HttpParams();
      param = param.append("searchText", searchText);
      return this.http.get(`${environment.ApiEndPoint}${environment.EndPoints.Master.Endpoint}${environment.EndPoints.Master.methods.SearchSnomedCTCodes}`, { params: param });
    } else
      return ;
  }

  GetDivisionsByClusterIDs(clusterId){
    return this.http.post(`${environment.ApiEndPoint}${environment.EndPoints.Master.Endpoint}${environment.EndPoints.Master.methods.GetDivisionsByClusterIDs}`,clusterId);
  }
  GetDistrictsByDivisionIDs(clusterId){
    return this.http.post(`${environment.ApiEndPoint}${environment.EndPoints.Master.Endpoint}${environment.EndPoints.Master.methods.GetDistrictsByDivisionIDs}`,clusterId);
  }
  GetBlocksByDistrictIDs(clusterId){
    return this.http.post(`${environment.ApiEndPoint}${environment.EndPoints.Master.Endpoint}${environment.EndPoints.Master.methods.GetBlocksByDistrictIDs}`,clusterId);
  }
  GetPhcAccessByUserID(userID)
  {
    if(userID > 0){
      let param = new HttpParams();
      param = param.append("userID", userID);
      return this.http.get(`${environment.ApiEndPoint}${environment.EndPoints.Master.Endpoint}${environment.EndPoints.Master.methods.GetPhcAccessByUserID}`, { params: param });
    }
  }
  GetPhcAccessMasterByUserID(userID)
  {
    if(userID > 0){
      let param = new HttpParams();
      param = param.append("userID", userID);
      return this.http.get(`${environment.ApiEndPoint}${environment.EndPoints.Master.Endpoint}${environment.EndPoints.Master.methods.GetPhcAccessMasterByUserID}`, { params: param });
    }
  }

  GetIsPatientCreationActive(){
    return this.http.get(`${environment.ApiEndPoint}${environment.EndPoints.Master.Endpoint}${environment.EndPoints.Master.methods.GetIsPatientCreationActive}`);
  }

  SettIsPatientCreationActive(value){
    return this.http.get(`${environment.ApiEndPoint}${environment.EndPoints.Master.Endpoint}${environment.EndPoints.Master.methods.SetIsPatientCreationActive}?value=${value}`);
  }

  addNotification(form:any)
  {
    const body={
      "heading": form.heading,
      "details": form.details,
      "eventDate": form.date,
      'status':'Pending'
    }
    return this.http.post(`${environment.ApiEndPoint}${environment.EndPoints.Master.Endpoint}${environment.EndPoints.Master.methods.AddEvent}`,body);

  }

  getNotification()
  {
    return this.http.get(`${environment.ApiEndPoint}${environment.EndPoints.Master.Endpoint}${environment.EndPoints.Master.methods.GetEvent}`);

  }

}