import { Router } from '@angular/router';
import * as CryptoJS from 'crypto-js';
import { environment } from 'src/environments/environment';
import { Roles } from './imp-utils';

export function EncryptData(strText: string) {
    return CryptoJS.AES.encrypt(strText, environment.EncyptionKey).toString();
}

export function DecryptData(strEncText: string) {
    return CryptoJS.AES.decrypt(strEncText, environment.EncyptionKey).toString(CryptoJS.enc.Utf8);
}

export function RedirectUserToHomePage(currentRole:string ,router: Router) {
    switch (currentRole) {
        case Roles.PHC:
            router.navigate(['chc-center']);
            break;
        // case Roles.ADMIN:
        //     router.navigate(['tabular-report']);
        //     break;
        case Roles.GovEmployee:
            this.router.navigate(['main-dashboard']);
            break;
        case Roles.DOCTOR:
            router.navigate(['doctor-detail']);
            break;
        default:
            router.navigate(['login']);
            break;
    }
}