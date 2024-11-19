import { Injectable } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class TabrouteguardService {
  allowedRoute = '/download-prescription';

  constructor(private router: Router) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd && event.url === this.allowedRoute) {
        sessionStorage.setItem('tabGuard', 'true');
      }
    });
  }

  checkTab(): boolean {
    if (this.router.url === this.allowedRoute) {
      const isTabGuardSet = sessionStorage.getItem('tabGuard');
      if (isTabGuardSet === 'true') {
        return true;
      } else {
        this.router.navigateByUrl(this.allowedRoute);
        return false;
      }
    }
    return true;
  }

  allowMultiTab(): void {
    sessionStorage.removeItem('tabGuard');
  }
}