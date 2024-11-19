import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Params } from '@angular/router';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class svc_HolidayCalenderService {
  constructor(private http: HttpClient) {}


  GetHolidayList(params) {
    return this.http.get(
      `${environment.ApiEndPoint}${environment.EndPoints.HolidayCalender.Endpoint}${environment.EndPoints.HolidayCalender.methods.GetHolidayList}`,
      params
    );
  }
  AddHoliday(params) {
    return this.http.post(
      `${environment.ApiEndPoint}${environment.EndPoints.HolidayCalender.Endpoint}${environment.EndPoints.HolidayCalender.methods.AddHoliday}`,
      params
    );
  }
  DeleteHoliday(params) {
    return this.http.post(
      `${environment.ApiEndPoint}${environment.EndPoints.HolidayCalender.Endpoint}${environment.EndPoints.HolidayCalender.methods.DeleteHoliday}`,
      params
    );
  }
  


}