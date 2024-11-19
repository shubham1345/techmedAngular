import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpResponse,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AutoLogoutService } from '../services/autoLogout.service';
import { SvclocalstorageService } from '../services/svclocalstorage.service';
import { SvcmainAuthserviceService } from '../services/svcmain-authservice.service';

@Injectable({
  providedIn: 'root',
})
export class BearerInterceptorService implements HttpInterceptor {
  private requests: any[] = [];

  constructor(
    public svcLocalStorage: SvclocalstorageService,
    private _sweetAlert: SvcmainAuthserviceService,
    private _logout: AutoLogoutService
  ) {}
  removeRequest(req: HttpRequest<any>) {
    const i = this.requests.indexOf(req.url);
    if (i >= 0) {
      this.requests.splice(i, 1);
    }
    // this.svcLoader.isLoading.next(this.requests.length > 0);
  }
  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    this.requests.push(request.url);
    //this.svcLoader.isLoading.next(true);
    let userObj = this.svcLocalStorage.GetData(environment.AuthTokenKeyLSKey);
    let token = userObj ? `Bearer ${JSON.parse(userObj).accessToken}` : '';
    //console.log("sadfasdf")
    var url: any = ['logout-from-other-device', 'ChangePassword'];
    if (!url.some((el) => request.url.includes(el))) {
      request = request.clone({
        setHeaders: {
          Authorization: token,
          'Cache-Control': 'no-cache, no-store',
          Pragma: 'no-cache',
        },
      });
    }

    // if (request.url.split('api/')[1] == 'logout') {
    //   request = request.clone({
    //     setHeaders: {
    //       Authorization:
    //         'Bearer ' + JSON.parse(localStorage.getItem('logoutToken')),
    //       'Cache-Control': 'no-cache, no-store',
    //       Pragma: 'no-cache',
    //     },
    //   });
    // }

    if (localStorage.getItem('domainNames')) {
      //  console.log(request,'request')
      var domnainName = JSON.parse(localStorage.getItem('domainNames'));
      var local = domnainName.findIndex((element) => {
        return request.url
          .toLowerCase()
          .includes(element.reportName.toLowerCase());
      });
      if (local != -1) {
        let splitreq = request.urlWithParams.split('api/')[1];
        let modifyurl =
          domnainName[local].domain +
          'api/DashBoard/' +
          domnainName[local].reportName;
        console.log(modifyurl, 'modify');
        const modifiedRequest = request.clone({
          url: modifyurl,
        });
        console.log(modifiedRequest, 'request');
        return next.handle(modifiedRequest);
      }
    }

    return Observable.create((observer: any) => {
      const subscription = next.handle(request).subscribe(
        (event) => {
          if (event instanceof HttpResponse) {
            //     this.svcLoader.isLoading.next(false);
            this.removeRequest(request);
            observer.next(event);
          }
        },
        (err) => {
          //   this.svcLoader.isLoading.next(false);

          if (err instanceof HttpErrorResponse) {
            if (err.status == 401 || err.status == 403) {
              this._sweetAlert.setLoader(false);
              //    this._sweetAlert.sweetAlert('You are not authorized to access this request','info').then((res:any)=>{
              this._sweetAlert
                .sweetAlert('Your session Expired', 'info')
                .then((res: any) => {
                  if (res) {
                    this._logout.onSignOut();
                  }
                });
              this._sweetAlert.setLoader(false);
              return throwError(err);
            }
          }
          this._sweetAlert.setLoader(false);
          this.removeRequest(request);
          observer.error(err);
          // console.log(err,'<<<<<<<<<<<<<<<<<<<<')
        },
        () => {
          //    this.svcLoader.isLoading.next(false);
          this.removeRequest(request);
          observer.complete();
        }
      );
      // remove request from queue when cancelled
      return () => {
        this.removeRequest(request);
        subscription.unsubscribe();
      };
    });

    //return next.handle(request);
  }
}
