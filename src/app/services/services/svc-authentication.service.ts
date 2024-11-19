import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { SvclocalstorageService } from './svclocalstorage.service';
import { DatePipe } from '@angular/common';

import { SvcmainAuthserviceService } from './svcmain-authservice.service';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SvcAuthenticationService {
  constructor(
    private http: HttpClient,
    private svcLocalstorage: SvclocalstorageService,
    private _sweetAlert: SvcmainAuthserviceService,
    private datepipe: DatePipe
  ) {}
  public OnNotificationHubStop: BehaviorSubject<boolean> = new BehaviorSubject(
    false
  );

  AuthenticateUser(encModel: any) {
    return this.http.post(
      `${environment.ApiEndPoint}${environment.EndPoints.Login}`,
      encModel
    );
  }
  ResetPassword(userEmail, accesstoken: any) {
    console.log(accesstoken);

    var headers = new HttpHeaders();
    headers = headers.append('Authorization', accesstoken);
    console.log(headers, 'headers');

    return this.http.post(
      `${environment.ApiEndPoint}${environment.EndPoints.UserMaster.Endpoint}${environment.EndPoints.UserMaster.methods.ChangePassword}`,
      userEmail,
      {
        headers: headers,
      }
    );
  }
  RegisterStudent(username: string, password: string) {
    // let formdata = new FormData();

    // formdata.append("UserName",username)
    // formdata.append("password",password)

    return this.http.post(
      `${environment.ApiEndPoint}${environment.EndPoints.Login}`,
      {
        username: username,
        password: password,
        UserType: 'internal',
      }
    );
  }

  GetRole(userEmail: any) {
    let params = new HttpParams();
    let headers = new HttpHeaders().set(
      'Content-Type',
      'text/plain; charset=utf-8'
    );
    params = params.append('userEmail', userEmail.toString());
    return this.http.get(
      `${environment.ApiEndPoint}${environment.EndPoints.UserMaster.Endpoint}${environment.EndPoints.UserMaster.methods.GetUserRole}`,
      { params: params, headers: headers, responseType: 'text' }
    );
  }

  GetLoggedUserDetail(userEmail: any) {
    let params = new HttpParams();
    params = params.append('userEmail', userEmail.toString());
    return this.http.get(
      `${environment.ApiEndPoint}${environment.EndPoints.UserMaster.Endpoint}${environment.EndPoints.UserMaster.methods.LogedUserDetails}`,
      { params: params }
    );
  }
  getdronlinelist(blockID: any) {
    let params = new HttpParams();
    params = params.append('blockID', blockID.toString());
    return this.http.post(
      `${environment.ApiEndPoint}${environment.EndPoints.Doctor.Endpoint}${environment.EndPoints.Doctor.methods.OnlineDrList}`,
      { params: params }
    );
  }
  GetDoctorDetails(userEmailID: any) {
    return this.http.post(
      `${environment.ApiEndPoint}${environment.EndPoints.Doctor.Endpoint}${environment.EndPoints.Doctor.methods.GetDoctorDetails}`,
      { userEmailID }
    );
  }
  GetPhcDetailById(email) {
    let params = new HttpParams();
    params = params.append('email', email.toString());
    return this.http.get(
      `${environment.ApiEndPoint}${environment.EndPoints.PHC.Endpoint}${environment.EndPoints.PHC.methods.GetPHCDetailsByEmailID}`,
      { params: params }
    );
  }
  UpdateUserLastAlive() {
    // let params = new HttpParams();
    // params = params.append('email', email.toString());
    var time = this.datepipe.transform(new Date(), 'dd-MM-yyyyThh:mm:ss');
    return this.http.get(
      `${environment.ApiEndPoint}${environment.EndPoints.UserMaster.Endpoint}${environment.EndPoints.UserMaster.methods.UpdateUserLastAlive}?dateTime=${time}`,
      {}
    );
  }
  public get currentUserEmail() {
    try {
      return JSON.parse(
        this.svcLocalstorage.GetData(environment.AuthTokenKeyLSKey)
      ).username;
    } catch (e) {
      throw e;
    }
  }
  public get isDoctor() {
    let userType = this.svcLocalstorage.GetData(environment.Role);
    return userType === 'Doctor';
  }

  LogoutFromOtherDevice(authtoken) {
    var headers = new HttpHeaders();
    headers = headers.append('Authorization', 'Bearer ' + authtoken);
    return this.http.get(
      `${environment.ApiEndPoint}${environment.EndPoints.LogoutFromOtherDevice}`,
      {
        headers: headers,
      }
    );
  }
  LogOutUser() {
    this._sweetAlert.setLoginUser(false);
    this.OnNotificationHubStop.next(true);
    return this.http.get(
      `${environment.ApiEndPoint}${environment.EndPoints.LogOutUser}`
    );
  }

  SaveTokens(res: any) {
    var obj = JSON.parse(localStorage.getItem('AuthToken'));
    obj.accessToken = res.accessToken;
    obj.refreshToken = res.refreshToken;
    obj.accessTokenExpirationTime = res.accessTokenExpirationTime;
    localStorage.setItem('AuthToken', JSON.stringify(obj));
  }

  GenerateRefreshToken() {
    var token = JSON.parse(localStorage.getItem('AuthToken'));
    const body = {
      email: token.username,
      refreshToken: token.refreshToken,
      accessToken: token.accessToken,
    };
    return this.http.post(`${environment.ApiEndPoint}refresh-token`, body, {
      withCredentials: true,
    });
  }

  SignalRHandShake(params) {
    //connetionID:string,HandShakeMessage:string
    return this.http.get(
      `${environment.ApiEndPoint}${environment.EndPoints.VideoCall.Endpoint}${environment.EndPoints.VideoCall.methods.SignalRHandShake}`,
      { params: params }
    );
  }
}
