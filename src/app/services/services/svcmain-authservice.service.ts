import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {
  BehaviorSubject,
  Observable,
  Subject,
  startWith,
  switchMap,
  tap,
  timer,
} from 'rxjs';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';
import FileSaver from 'file-saver';
import { jsPDF } from 'jspdf';
import * as forge from 'node-forge';
@Injectable({
  providedIn: 'root',
})
export class SvcmainAuthserviceService {
  public selectDrownSysQueue = '1';
  GetValueOfDropdown() {
    return this.selectDrownSysQueue;
  }
  EXCEL_TYPE =
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
  EXCEL_EXTENSION = '.xlsx';

  publicKey: string = `-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAskgPKBcNpz71mi4NSYa5
mazJrO0WZim7T2yy7qPxk2NqQE7OmWWakLJcaeUYnI0kO3yC57vck66RPCjKxWuW
SGZ7dHXe0bWb5IXjcT4mNdnUIalR+lV8czsoH/wDUvkQdG1SJ+IxzW64WvoaCRZ+
/4wBF2cSUh9oLwGEXiodUJ9oJXFZVPKGCEjPcBI0vC2ADBRmVQ1sKsZg8zbHN+gu
U9rPLFzN4YNrCnEsSezVw/W1FKVS8J/Xx4HSSg7AyVwniz8eHi0e3a8VzFg+H09I
5wK+w39sjDYfAdnJUkr6PjtSbN4/Sg/NMkKB2Ngn8oj7LCfe/7RNqIdiS+dQuSFg
eQIDAQAB
-----END PUBLIC KEY-----`;
  callNotReceived: BehaviorSubject<any> = new BehaviorSubject(false);
  ///////false means video call or ringing is not hapenning and vice versa////////

  closeSelectDropdownSubject: BehaviorSubject<any> = new BehaviorSubject(false);
  ///////close dropdown when screen saver runs //////////////////////

  closeAllModalsOnLogout: Subject<any> = new Subject();
  ////////close all the modals like patient registration if another user login

  postTreatmentSubject: Subject<any> = new BehaviorSubject(false);

  constructor(private http: HttpClient) {}

  sweetAlert(msg, icon) {
    return Swal.fire({
      //title: 'Success',
      text: msg,
      icon: icon,
      confirmButtonText: 'Ok!',
      allowOutsideClick: false,
    });
  }
  sweetAlertError(msg, html, icon) {
    return Swal.fire({
      //title: 'Success',
      text: msg,
      html: html,
      icon: icon,
      confirmButtonText: 'Ok!',
      allowOutsideClick: false,
    });
  }
  deletesweetAlert(msg, icon) {
    return Swal.fire({
      //title: 'Success',
      text: msg,
      icon: icon,
      confirmButtonText: 'Ok',
      cancelButtonText: 'cancel',
      showCancelButton: true,
      allowOutsideClick: false,
    });
  }
  deletesweetAlertFooter(msg, footer, icon) {
    return Swal.fire({
      //title: 'Success',
      text: msg,
      footer: footer,
      icon: icon,
      confirmButtonText: 'Ok',
      cancelButtonText: 'cancel',
      showCancelButton: true,
      allowOutsideClick: false,
    });
  }
  bulkDownload(msg, icon, showConfirmButton) {
    return Swal.fire({
      title: 'Download Status',
      text: msg,
      icon: icon,
      confirmButtonText: 'Ok',
      cancelButtonText: 'cancel',
      showConfirmButton: showConfirmButton,
      showCancelButton: true,
      allowOutsideClick: false,
    });
  }

  showAlert(msg, icon) {
    return Swal.fire({
      text: msg,
      icon: icon,
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
      position: 'bottom-right',
      heightAuto: false,
    });
  }

  private _loader: Subject<any> = new Subject<any>();

  public getLoader(): Observable<any> {
    return this._loader;
  }

  public setLoader(value: any) {
    this._loader.next(value);
  }

  private _navigation: Subject<any> = new BehaviorSubject<any>(false);

  public getNavigation(): Observable<any> {
    return this._navigation;
  }

  public setNavigation(value: any) {
    this._navigation.next(value);
  }

  private _VidelCall: Subject<any> = new BehaviorSubject<any>(true);

  public getVideoCall(): Observable<any> {
    return this._VidelCall;
  }

  public setVideoCall(value: any) {
    this._VidelCall.next(value);
  }

  private _patientAbsent: Subject<any> = new BehaviorSubject<any>(false);

  public getpatientAbsent(): Observable<any> {
    return this._patientAbsent;
  }

  public setpatientAbsent(value: any, patientid: any) {
    var data = {
      room: value,
      patient: patientid,
    };

    this._patientAbsent.next(data);
  }

  LogOutUser() {
    return this.http.get(
      `${environment.ApiEndPoint}${environment.EndPoints.LogOutUser}`
    );
  }

  private _queueUpdate: Subject<any> = new BehaviorSubject<any>(false);

  public getQueueUpdate(): Observable<any> {
    return this._queueUpdate;
  }

  public setQueueUpdate(value: any) {
    this._queueUpdate.next(value);
  }

  private _PhcHistoryData: any;
  public setPhcHistory(value: any) {
    this._PhcHistoryData = value;
    console.log(this._PhcHistoryData, 'service phchisory');
  }

  public getPhcHistory() {
    return this._PhcHistoryData;
  }

  //////////////for stqc////////////////
  private _loginUser: Subject<any> = new BehaviorSubject<any>(false);

  public getLoginUser(): Observable<any> {
    return this._loginUser;
  }

  public setLoginUser(value: any) {
    this._loginUser.next(value);
  }
  ///////////////////

  ////////////to decrypt data //////////////
  decryptdata(data) {
    var rsa: any = forge.pki.publicKeyFromPem(this.publicKey);
    return window.btoa(rsa.encrypt(data));
  }

  emailRegex() {
    var regex: any;
    return (regex = new RegExp(
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    ));
  }

  //isMinVideocallTimeCompleted:BehaviorSubject<any>=new BehaviorSubject(false)
  /*used to show sweetalert when doctor click on submit treatment 
false means time is less than 90 sec 
*/

  isMinVideocallTimeCompleted: boolean = false;
  setisMinVideoTimeCompelted(value) {
    this.isMinVideocallTimeCompleted = value;
    console.log(this.isMinVideocallTimeCompleted, 'setisMinVideoTimeCompelted');
  }
  getisMinVideoTimeCompelted() {
    console.log(this.isMinVideocallTimeCompleted, 'getisMinVideoTimeCompelted');
    return this.isMinVideocallTimeCompleted;
  }
  private readonly STORAGE_KEY = 'lastApiCallTimestamp';
  public makeApiCall(): Observable<any> {
    return this.http.get(
      `${environment.ApiEndPoint}UserMaster/UpdateUserLastAlive`
    );
  }

  public setLastApiCallTimestamp(timestamp: number): void {
    localStorage.setItem(this.STORAGE_KEY, timestamp.toString());
  }

  public getLastApiCallTimestamp(): number | null {
    const timestampStr = localStorage.getItem(this.STORAGE_KEY);
    return timestampStr ? parseInt(timestampStr, 10) : null;
  }

  openTabValue: String = '1';
  historyType = 'yesterdayData';
  advanceHistoryArray = [];
  yesterdayHostoryArray = [];
  pageIndex = 0;
  phcHistoryForm = {
    patientid: '',
    patientname: '',
    contact: '',
    phcid: '',
    dateofRegistration: '',
    dateOfBirth: '',
    gender: 0,
  };

  returnDataToHistoryPHC() {
    var data = {
      openTabValue: this.openTabValue,
      historyType: this.historyType,
      advanceHistoryArray: this.advanceHistoryArray,
      pageIndex: this.pageIndex,
      phcHistoryForm: this.phcHistoryForm,
      yesterdayHostoryArray: this.yesterdayHostoryArray,
    };
    return data;
  }

  downloadPdf(
    orginalArray = [],
    headerArray = [],
    pdfdataArray: any,
    ReportName: any
  ) {
    var prepare = [];
    orginalArray.forEach((e: any, index: any) => {
      var tempObj = [];
      pdfdataArray.forEach((element: any, index) => {
        tempObj.push(e[element]);
      });
      prepare.push(tempObj);
    });

    const doc = new jsPDF('l', 'pt', [1000, 1000]);
    doc.setFontSize(18);
    doc.text(ReportName, 11, 20);
    doc.setFontSize(11);
    doc.setTextColor(100);
    (doc as any).autoTable({
      head: [headerArray],
      body: prepare,
    });
    doc.save(ReportName + '.pdf');
  }
}
