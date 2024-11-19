import { HttpErrorResponse, HttpEvent, HttpHandler, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { SvcAuthenticationService } from '../services/svc-authentication.service';
import {SvcmainAuthserviceService} from '../services/svcmain-authservice.service';
import {AutoLogoutService} from '../services/autoLogout.service'

@Injectable({
  providedIn: 'root'
})
export class ErrorInterceptorService {

  constructor(private authenticationService: SvcAuthenticationService,private _sweetAlert:SvcmainAuthserviceService,private _logout:AutoLogoutService) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<any> {
        return next.handle(request).pipe(catchError((err:any) => {
            // if ([404, 403].includes(err.status)) {

            //   this._sweetAlert.sweetAlert('You Are Not Authorized To Access This Request','info').then((res:any)=>{
            //     if(res)
            //     {
            //       this._logout.onSignOut();
            //     }  
            //   })
            // }

            // const error = err;
            // console.error(err);
            // return throwError(() => error)

            if(err instanceof HttpErrorResponse)
            {
                     if(err.status==404)
                     {
                      alert('true')
                      this._sweetAlert.sweetAlert('You Are Not Authorized To Access This Request','info')
                      return;
                     }
return
            }
           return throwError(err);
        }))
    }
}






