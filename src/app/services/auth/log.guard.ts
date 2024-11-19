import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { SvclocalstorageService } from '../services/svclocalstorage.service';
import { environment } from 'src/environments/environment';
import { SvcAuthenticationService } from '../services/svc-authentication.service';
import { Roles } from 'src/app/utils/imp-utils';
@Injectable({
  providedIn: 'root'
})
export class LogGuard implements CanActivate {
  constructor(private _router:Router,private _svcLocalStorage: SvclocalstorageService,private _svcAuth: SvcAuthenticationService)
  {}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

      if (localStorage.getItem('AuthToken')) {        
        if (localStorage.getItem('role') === Roles.PHC) {
    
          this._router.navigate(['chc-center']);
          return false;
        }

        else if (localStorage.getItem('role') === Roles.GovEmployee) {
        
          this._router.navigate(['main-dashboard']);
          return false;
        }
        else if (localStorage.getItem('role') === Roles.SysAdmin) {
      
          this._router.navigate(['SysAdmin-Header']);
          return false;
        }
        else if (localStorage.getItem('role') === Roles.DOCTOR) {
        
            this._router.navigate(['doctor-detail']);
            return false;
        }
        else if (localStorage.getItem('role') === Roles.SuperAdmin) {
        
          this._router.navigate(['Side-bar']);
          return false;
        }
        
      } else {
        return true;
      }
    
  
  }
  
}
