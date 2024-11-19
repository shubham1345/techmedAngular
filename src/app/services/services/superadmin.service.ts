import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class SuperadminService {

  constructor(private http:HttpClient) { }

  getRoles()
  {
    return this.http.get(`${environment.ApiEndPoint}Master/GetAllUserTypeMaster`)
  }

  createUser(form:any)
  {
    const body={
      
        "email": form.email,
        "mobile": form.mobile,
        "name": form.username,
        "userTypeID": form.userid
    }

    return this.http.post(`${environment.ApiEndPoint}${environment.EndPoints.UserMaster.Endpoint}${environment.EndPoints.UserMaster.methods.AddUser}`,body)
  }

  GetAllPendingPatientToDelete(fromdate:any,todate:any)
  {
    return this.http.get(`${environment.ApiEndPoint}${environment.EndPoints.PatientCase.Endpoint}${environment.EndPoints.PatientCase.methods.GetAllPendingPatientToDelete}?fromDate=${fromdate}&toDate=${todate}`)
  }

  DeletePatientCase(array:any)
  {
    const body=array
  
    return this.http.post(`${environment.ApiEndPoint}${environment.EndPoints.PatientCase.Endpoint}${environment.EndPoints.PatientCase.methods.DeletePatientCase}`,body)

  }
  AddReportAccessDetails(params)
  {
   
  
    return this.http.post(`${environment.ApiEndPoint}${environment.EndPoints.Master.Endpoint}${environment.EndPoints.Master.methods.AddReportAccessDetails}`,params)

  }
  
  GetAllGovUser(){
    return this.http.get(`${environment.ApiEndPoint}${environment.EndPoints.UserMaster.Endpoint}${environment.EndPoints.UserMaster.methods.GetAllGovUser}`); 
  }

  getUserById(userid:any)
  {
    return this.http.get(`${environment.ApiEndPoint}${environment.EndPoints.Master.Endpoint}${environment.EndPoints.Master.methods.GetAllUsersByUserTypeID}?userTypeID=${userid}`); 
  }
  GetAllUserTypeMaster()
  {
    return this.http.get(`${environment.ApiEndPoint}${environment.EndPoints.Master.Endpoint}${environment.EndPoints.Master.methods.GetAllUserTypeMaster}`); 
  }
  GetReportNameByUserTypeID(userTypeID){
    let params = new HttpParams();
    params = params.append('userTypeID', userTypeID);
    return this.http.get(`${environment.ApiEndPoint}${environment.EndPoints.Master.Endpoint}${environment.EndPoints.Master.methods.GetReportNameByUserTypeID}`,{ params: params });

  }
  GetReportAccessDetailsByUserID(userID){
    let params = new HttpParams();
    params = params.append('userID', userID);
    return this.http.get(`${environment.ApiEndPoint}${environment.EndPoints.Master.Endpoint}${environment.EndPoints.Master.methods.GetReportAccessDetailsByUserID}`,{ params: params });

  }
  changeStatusOfUser(userid:any,userEmail:any,active:any)
  {
    const body:any={
      userID:userid,
      userEmail:userEmail,
      isActive:active
    }
    return this.http.post(`${environment.ApiEndPoint}${environment.EndPoints.UserMaster.Endpoint}${environment.EndPoints.UserMaster.methods.DeleteUser}`,body); 

  }
}
