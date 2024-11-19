import { connect, ConnectOptions, LocalTrack, Room } from 'twilio-video';
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { ReplaySubject, Observable } from 'rxjs';
import { AuthToken, Rooms } from '../models/twilio-model.export';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class TwilioMiddlewareService {
  
  $roomsUpdated: Observable<boolean>;
  callingEnvironment: string;
  private roomBroadcast = new ReplaySubject<boolean>();
  private videoCallendpoints = environment.EndPoints.VideoCall;
  private userMasterendpoints = environment.EndPoints.UserMaster;
  constructor(private readonly http: HttpClient) {
    this.$roomsUpdated = this.roomBroadcast.asObservable();
  }

  private getAuthToken(): Promise<AuthToken> {
    return this.http
      .get<AuthToken>(`${environment.ApiEndPoint}videocall/token`)
      .toPromise();
  }

  public async joinRoom(roomName) {
    let room: Room = null;
    try {
      const token = await this.getAuthToken();
      room = await connect(token.token, { name: roomName });
    } catch (error) {
      // console.error(`Unable to connect to Room: ${error.message}`);
    } finally {
      if (room) {
        this.roomBroadcast.next(true);
      }
    }

    return room;
  }
  public async joinOrCreateRoom(name: string, tracks: LocalTrack[]) {
    let room: Room = null;
    try {
      const token = await this.getAuthToken();
      room = await connect(token.token, {
        name,
        tracks,
        dominantSpeaker: true,
        networkQuality: {
          local: 2, // LocalParticipant's Network Quality verbosity [1 - 3]
          remote: 2, // RemoteParticipants' Network Quality verbosity [0 - 3]
        },
      } as ConnectOptions);
    } catch (error) {
      console.log('ERR ROOM JOIN', error);
      room = null;
    } finally {
      if (room) {
        this.roomBroadcast.next(true);
      }
    }

    return room;
  }

  nudge() {
    this.roomBroadcast.next(true);
  }
  public ConnectToMeetingRoom(
    patientCaseId: number,
    meetingInstance: string,
    isDoctor: boolean,
    isInitiator: boolean,
    callingEnvironment: string
  ): Observable<boolean> {
    this.callingEnvironment = callingEnvironment;
    return this.http.get<boolean>(
      `${environment.ApiEndPoint}${this.videoCallendpoints.Endpoint}${this.videoCallendpoints.methods.ConnectToMeetingRoom}?patientCaseId=${patientCaseId}&meetingInstance=${meetingInstance}&isDoctor=${isDoctor}&isInitiator=${isInitiator}&CallingEnvironment=${callingEnvironment}`
    );
  }
  public CallingByPatientCaseId(patientCaseId: number): Observable<boolean> {
    let params = new FormData();
    params.append('patientCaseId', patientCaseId.toString());
    return this.http.post<boolean>(
      `${environment.ApiEndPoint}${this.videoCallendpoints.Endpoint}${this.videoCallendpoints.methods.CallingByPatientCaseId}`,
      params
    );
  }
  public DismissCall(
    roomName: string,
    patientCaseid: number,
    isPartiallyClosed: boolean,
    comp: any
  ): Observable<boolean> {
    // alert(comp);
    let params = new FormData();

    console.log(roomName, patientCaseid, isPartiallyClosed, 'tttttttttttttttt');
    params.append('roomInstance', roomName.toString());
    params.append('patientCaseId', patientCaseid.toString());
    params.append('isPartiallyClosed', isPartiallyClosed.toString());
    params.append('CallingEnvironment', this.callingEnvironment);
    return this.http.post<boolean>(
      `${environment.ApiEndPoint}${this.videoCallendpoints.Endpoint}${this.videoCallendpoints.methods.DismissCall}`,
      params
    );
  }
  // public CreateRoom(patientCaseId: number): Observable<boolean> {
  //     let params = new HttpParams();
  //     params.append('patientCaseId', patientCaseId)
  //     // params.append('callBackUrl', "callbackurl")
  //     return this.http.post<boolean>(`${environment.ApiEndPoint}${this.videoCallendpoints.Endpoint}${this.videoCallendpoints.methods.CreateRoomWithRecording}?patientCaseId=${patientCaseId}`, params);
  // }
  public BeginDialingCallToUser(patientCaseId: number, meetingInstance:string, callingEnvironment: string) {
    return this.http.post<boolean>( // meetingInstance
      `${environment.ApiEndPoint}${this.videoCallendpoints.Endpoint}${
        this.videoCallendpoints.methods.BeginDialingCallToUser
      }?patientCaseId=${patientCaseId.toString()}&CallingEnvironment=${
        callingEnvironment
      }${(JSON.parse(localStorage.getItem('AuthToken')).CallingEnvironment == 'jitsi') ? "&meetingInstance="+meetingInstance : ''}`,
      {}
    );
    
  }

  public CaptureNetworkQuality(
    roomName: string,
    patientCaseid: number,
    networkQualityLevel: number
  ): Observable<boolean> {
    let params = new FormData();
    params.append('roomInstance', roomName);
    params.append('patientCaseId', patientCaseid.toString());
    params.append('networkQualityLevel', networkQualityLevel.toString());
    return this.http.post<boolean>(
      `${environment.ApiEndPoint}${this.videoCallendpoints.Endpoint}${this.videoCallendpoints.methods.CaptureNetworkQuality}`,
      params
    );
  }
}
