import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root',
})
export class JitsiService {
  private refreshPatientWaitListSubject = new BehaviorSubject<void>(null);
  refreshPatientWaitList$ = this.refreshPatientWaitListSubject.asObservable();

  refreshPatientWaitList() {
    this.refreshPatientWaitListSubject.next();
  }

  public api: any;
  public patientId: any;

  public jitsiCallData: BehaviorSubject<any> = new BehaviorSubject({
    roomData: {},
    meetingInstance: '',
    isInitiator: false,
    callingEnvironment: '',
    patientCaseId: '',
  });

  public isConnecting: BehaviorSubject<any> = new BehaviorSubject({
    isConnectingData: false,
  });
  public isConnectingJitsi: BehaviorSubject<any> = new BehaviorSubject({
    isConnectingJitsiCall: false,
  });


  public isShowing: BehaviorSubject<any> = new BehaviorSubject({
    isShowButton: false,
  });
  constructor() {}

  endMeeting() {
    let callingEnvironment: any = JSON.parse(
      localStorage.getItem('AuthToken')
    ).CallingEnvironment;
    if (this.api && callingEnvironment == 'jitsi') {
      this.api.executeCommand('endConference');
      this.api.executeCommand('stopRecording', 'stop');
      this.api = undefined;
    }
  }

  openJitsiModel: any;
  openModel() {
    this.openJitsiModel = Swal.fire({
      title: 'Connecting',
      icon: 'info',
      timer: 1000 * 20 * 1,
      showConfirmButton: false,
      toast: false,
      allowEscapeKey: false,
      allowOutsideClick: false,
      position: 'bottom-right',
    });
    return this.openJitsiModel;
  }

  closeModel() {
    if (this.openJitsiModel) {
      this.openJitsiModel.close();
    }
  }

  // Subscribe to changes in the BehaviorSubject
}
