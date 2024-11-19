import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SvcSnowMedService {

  constructor(private http: HttpClient) { }

  getSnowMedList(data) {

    let params = new HttpParams();
    params = params.append('data', data);
    return this.http.get(`${environment.ApiSnowMed}${environment.EndPoints.search.Endpoint}${environment.EndPoints.search.methods.search}`, { params: params });
  }

}
