import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { Observable } from 'rxjs';
import { RedirectUserToHomePage } from 'src/app/utils/utilityFn';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';
import { AutoLogoutService } from '../services/autoLogout.service';
import { SvcAuthenticationService } from '../services/svc-authentication.service';
import { SvclocalstorageService } from '../services/svclocalstorage.service';
import { SvcmainAuthserviceService } from '../services/svcmain-authservice.service';

@Injectable({
  providedIn: 'root',
})
export class SvcAuthGuard implements CanActivate {
  constructor(
    private svcLocalStorage: SvclocalstorageService,
    public router: Router,
    private service: AutoLogoutService,
    private _sweetAlert: SvcmainAuthserviceService
  ) {}
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    /*comment here becaues we set it now after login  
       this._sweetAlert.setNavigation(true)
       */

    this._sweetAlert.setNavigation(true);
    this._sweetAlert.setLoginUser(true);

    let currentRole = this.svcLocalStorage.GetData(environment.Role);
    if (!this.svcLocalStorage.GetData(environment.AuthTokenKeyLSKey)) {
      window.alert('Access Denied, Login is Required to Access This Page!');
      this.router.navigate(['login']);
    } else if (next.data[environment.Role] !== currentRole) {
      Swal.fire({
        title: 'UnAuthorized',
        text: 'You are not allowed to access this Page.',
      });
      RedirectUserToHomePage(currentRole, this.router);
      return false;
    }
    return true;
  }
}
