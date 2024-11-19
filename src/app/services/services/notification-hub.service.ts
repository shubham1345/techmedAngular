import { Injectable } from '@angular/core';
import {
  HubConnection,
  HubConnectionBuilder,
  LogLevel,
} from '@microsoft/signalr';
import { environment } from 'src/environments/environment';
import { SvclocalstorageService } from './svclocalstorage.service';
import { BehaviorSubject } from 'rxjs';
import { INotificationResponse } from 'src/app/model/INotificationResponse';
import Swal from 'sweetalert2';
import { SvcAuthenticationService } from './svc-authentication.service';
import { Router } from '@angular/router';
import { Input } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class NotificationHubService {
  private MessageType = {
    BeginDialingCall: 'BeginDialingCall',
    CallRejected: 'CallRejected',
    NotifyParticipientToJoin: 'NotifyParticipientToJoin',
    NotifyParticipientToExit: 'NotifyParticipientToExit',

    CallingToPHC: 'CallingToPHC',
    // CallAcceptedByPHC: "CallAcceptedByPHC",
    CallRoomStartingForDoctor: 'CallRoomStartingForDoctor',
    CallRoomStartingForPHC: 'CallRoomStartingForPHC',
    MeetingRoomCloseByDoctor: 'MeetingRoomCloseByDoctor',
    LogoutFromOtherDevices: 'LogoutFromOtherDevices',
    Handshake: 'Handshake',
  };
  @Input() patientCaseId: number = 0;
  constructor(
    private svcLocalstorage: SvclocalstorageService,
    private svcAuth: SvcAuthenticationService,
    private router: Router
  ) {
    this.onStopHub();
  }
  private notificationHub: HubConnection;
  public isCallInProgress: BehaviorSubject<boolean> = new BehaviorSubject(
    false
  );
  public endCallOnLogout: BehaviorSubject<boolean> = new BehaviorSubject(false);

  public ringTheCallAudio: BehaviorSubject<boolean> = new BehaviorSubject(
    false
  );
  public isInitiator: BehaviorSubject<boolean> = new BehaviorSubject(false);
  public isCallInDailing: BehaviorSubject<boolean> = new BehaviorSubject(false);
  public onCallReceived: BehaviorSubject<INotificationResponse> =
    new BehaviorSubject(null);
  public OnNotificationHubStart: BehaviorSubject<boolean> = new BehaviorSubject(
    false
  );

  public onCallRejected: BehaviorSubject<INotificationResponse> =
    new BehaviorSubject(null);
  public onNotifyParticipientToJoin: BehaviorSubject<INotificationResponse> =
    new BehaviorSubject(null);
  public onNotifyParticipientToExit: BehaviorSubject<INotificationResponse> =
    new BehaviorSubject(null);

  public onCallinRoomStartForDoctor: BehaviorSubject<INotificationResponse> =
    new BehaviorSubject(null);
  public onCallinRoomStartForPHC: BehaviorSubject<INotificationResponse> =
    new BehaviorSubject(null);

  public onLogoutFromOtherDevicesReceived: BehaviorSubject<INotificationResponse> =
    new BehaviorSubject(null);
  public connectionStatus$: BehaviorSubject<boolean> = new BehaviorSubject(
    null
  );

  public get currentUserEmail() {
    try {
      return JSON.parse(
        this.svcLocalstorage.GetData(environment.AuthTokenKeyLSKey)
      ).username;
    } catch (e) {
      return undefined;
    }
  }
  retryTimes: number[] = [0, 3000, 4000, 5000];
  token: string;
  connectionID: string;
  public async NotificationHubStart(): Promise<boolean> {
    try {
      this.token = JSON.parse(
        this.svcLocalstorage.GetData(environment.AuthTokenKeyLSKey)
      ).accessToken;
      const builder = new HubConnectionBuilder()
        .configureLogging(LogLevel.Information)
        .withUrl(`${environment.ImagesHeader}/notificationHub`, {
          accessTokenFactory: () =>
            JSON.parse(localStorage.getItem('AuthToken')).accessToken,
        })

        .withAutomaticReconnect({
          nextRetryDelayInMilliseconds: (context) => {
            const index =
              context.previousRetryCount < this.retryTimes.length
                ? context.previousRetryCount
                : this.retryTimes.length - 1;
            return this.retryTimes[index];
          },
        });

      this.notificationHub = builder.build();
      this.notificationHub.on(
        'BroadcastMessage',
        (message: INotificationResponse) => {
          if (message.messageType == this.MessageType.Handshake) {
            console.log('onHandShake message recieved.');
            this.connectionID = this.notificationHub.connectionId;
            console.log('onHandShake message recieved.ID=' + this.connectionID);
            //this.onHandShake(this.connectionID,message.message);
            //connetionID:string,HandShakeMessage:string
            this.svcAuth
              .SignalRHandShake({
                connetionID: this.connectionID,
                HandShakeMessage: message.message,
              })
              .subscribe((data) => {});
          }
          if (
            this.currentUserEmail?.toLowerCase() ==
            message.receiverEmail.toLowerCase()
          ) {
            switch (message.messageType) {
              case this.MessageType.BeginDialingCall:
                this.onCallReceived.next(message);
                break;
              case this.MessageType.CallRejected:
                this.onCallRejected.next(message);
                break;
              case this.MessageType.NotifyParticipientToJoin:
                this.onNotifyParticipientToJoin.next(message);
                break;
              case this.MessageType.NotifyParticipientToExit:
                console.log(
                  localStorage.getItem('meetingInstace'),
                  message.roomName.toString(),
                  'notifify exit'
                );

                if (
                  localStorage.getItem('meetingInstace') ==
                  message.roomName.toString()
                ) {
                  this.onNotifyParticipientToExit.next(message);
                }
                break;
              case this.MessageType.LogoutFromOtherDevices:
                {
                  if (this.isCallInProgress.getValue()) {
                    this.svcLocalstorage.SetData(
                      'logOutOnDelete',
                      'logOutOnDelete'
                    );
                    this.endCallOnLogout.next(true);
                  } else {
                    Swal.fire({
                      allowOutsideClick: false,
                      allowEscapeKey: false,
                      allowEnterKey: false,
                      toast: true,
                      position: 'bottom-end',
                      icon: 'info',
                      title: message.message,
                    });
                    this.svcAuth.LogOutUser().subscribe({
                      next: () => {
                        this.svcLocalstorage.DeleteAll();
                        this.router.navigate(['login']);
                      },
                    });
                  }
                }
                break;
              default:
                break;
            }
          }
        }
      );

      await this.notificationHub.start().then(() => {
        this.connectionStatus$.next(true);
      }).catch(error=>{
        console.table(error)
      });

      this.notificationHub.onreconnecting(() => {
        console.warn('...............SignalR in Reconnecting State...............')
        this.connectionStatus$.next(false);
      });

      this.notificationHub.onreconnected(() => {
        console.warn('...............SignalR in Connected State...............')
        this.connectionStatus$.next(true);
      });

      return true;
    } catch (e) {
      return false;
    }
  }

  public OnCallRejectedNotify(toUser: string, fromUser): void {
    // alert(value + 'function');
    this.notificationHub.send('onCallRejected', toUser, fromUser);
  }
  public onHandShake(connetionID: string, HandShakeMessage: string): void {
    this.notificationHub.send('onHandShake', connetionID, HandShakeMessage);
  }

  public onMeetingRoomInitiatedByDoctor(
    patientCaseId: number,
    toUser: string,
    roomName: string
  ): void {
    this.notificationHub.send(
      'onMeetingRoomInitiatedByDoctor',
      patientCaseId,
      toUser,
      this.currentUserEmail,
      roomName
    );
  }
  public onMeetingRoomClose(
    patientCaseId: number,
    patientId: number,
    toUser: string
  ): void {
    this.notificationHub.send(
      'onMeetingRoomClose',
      patientCaseId,
      patientId,
      toUser,
      this.currentUserEmail
    );
  }
  public onLogoutFromOtherDevices(toUser: string): void {
    console.log(toUser, 'notification');

    // this.notificationHub.send('onLogoutFromOtherDevices', toUser);
  }

  public onLogoutFromBrowser(toUser: string): void {
    this.notificationHub.send('onLogoutFromBrowser', toUser);
  }
  onStopHub(): void {
    this.svcAuth.OnNotificationHubStop.subscribe({
      next: (message: boolean) => {
        if (message) {
          this.notificationHub.stop();
        }
      },
    });
  }
}
