import { DatePipe } from '@angular/common';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Params } from '@angular/router';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class svc_PHCservice {
  constructor(private http: HttpClient,private datepipe:DatePipe) 
  {
    
  }

  UploadPHCDoc(params) {
    return this.http.post(
      `${environment.ApiEndPoint}${environment.EndPoints.PHC.Endpoint}${environment.EndPoints.PHC.methods.UploadPHCDoc}`,
      params
    );
  }

  uploadPhcDetails(form:any)
  { 
 var formdata=new FormData()
 formdata.set('DCName',form.moname1),
 formdata.set('dateTime',this.datepipe.transform(form.date,'yyyy-MM-dd')),
 formdata.set('Phcid',form.phcid),
 formdata.set('file',form.file)
    return this.http.post(
      `${environment.ApiEndPoint}${environment.EndPoints.PHC.Endpoint}${environment.EndPoints.PHC.methods.UploadPHCDetails}`,formdata
    );
  }
  GetDateWisePrescriptionNotGeneratedByPhcs()
  {
    return this.http.get(`${environment.ApiEndPoint}${environment.EndPoints.PHC.Endpoint}${environment.EndPoints.PHC.methods.GetDateWisePrescriptionNotGeneratedByPhcs}`)
  }

}