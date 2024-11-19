import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Params } from '@angular/router';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root'
  })
  export class svc_misService {
  
      constructor(private http: HttpClient) { }
    
      //post
      CompletedConsultation(params) {
        return this.http.post(`${environment.ApiEndPoint}${environment.EndPoints.MIS.Endpoint}${environment.EndPoints.MIS.methods.CompletedConsultation}`,  params )
      }
      //post
      CompletedConsultationByDoctors(params) {
        return this.http.post(`${environment.ApiEndPoint}${environment.EndPoints.MIS.Endpoint}${environment.EndPoints.MIS.methods.CompletedConsultationByDoctors}`,  params )
      }
      GetCompletedConsultationChart(year) {
        let params = new HttpParams();
    params = params.append('year', year.toString());
        return this.http.get(`${environment.ApiEndPoint}${environment.EndPoints.MIS.Endpoint}${environment.EndPoints.MIS.methods.GetCompletedConsultationChart}`,  {params:params} )
      }
 
    }
    