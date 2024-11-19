import { connect, ConnectOptions, LocalTrack, Room } from 'twilio-video';
import { Injectable, OnDestroy } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { ReplaySubject , Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

interface AuthToken {
    token: string;
}

export interface NamedRoom {
    id: string;
    name: string;
    maxParticipants?: number;
    participantCount: number;
}


export type Rooms = NamedRoom[];

@Injectable()

export class VideoChatService implements OnDestroy {
    $roomsUpdated: Observable<boolean>;

    private roomBroadcast = new ReplaySubject<boolean>();

    constructor(private readonly http: HttpClient) {
        this.$roomsUpdated = this.roomBroadcast.asObservable();
    }

    ngOnDestroy(): void {
        if (this.roomBroadcast) {
            this.roomBroadcast.unsubscribe();
        }
    }

    private async getAuthToken() {
        const auth =
            await this.http
                      .get<AuthToken>(`${environment.ApiEndPoint}videocall/token`)
                      .toPromise();
         
        return auth.token;
    }

    getAllRooms() {
        return this.http
                   .get<Rooms>(`${environment.ApiEndPoint}videocall/rooms`)
                   .toPromise();
    }
    getRoomSid(roomName: string)
    {
        let params = new HttpParams();
        params = params.append('roomName', roomName);
        return this.http.get(`${environment.ApiEndPoint}videocall/getroom-sid`, { params: params });
    }
    getComposedRecording()
    {
        return this.http.get(`${environment.ApiEndPoint}VideoCall/get-completed-Compose`);
    }
    getCallRecording()
    {
        return this.http.get(`${environment.ApiEndPoint}VideoCall/get-completed-callrecord`);
    }
    ComposeCallRecording(roomSid: string, callBackUrl: string)
    {
        let params = new HttpParams();
        params = params.append('roomSid', roomSid);
        params = params.append('callBackUrl', callBackUrl);
        return this.http.get(`${environment.ApiEndPoint}VideoCall/compose-video`, {params: params} );
    }
    downloadCallRecord(compositionSid: string)
    {
        let params = new HttpParams();
        params = params.append('compositionSid', compositionSid);
        return this.http.get(`${environment.ApiEndPoint}VideoCall/download-video`, { params: params });
    }
    deleteCallRecord(compositionSid: string)
    {
        let params = new HttpParams();
        params = params.append('compositionSid', compositionSid);
        return this.http.get(`${environment.ApiEndPoint}VideoCall/delete-video`, { params: params });
    }
    endVideoCall(roomName: string)
    {
        let params = new HttpParams();
        params = params.append('roomName', roomName);
        return this.http.get(`${environment.ApiEndPoint}VideoCall/end-video-call`, { params: params });
    }
   public async createRoom(name: string, callbackurl: string)
    {
        let params = new HttpParams();
        params.set('roomname',name)
        params.set('callBackUrl',callbackurl)
        return this.http.post(`${environment.ApiEndPoint}videocall/create-room-with-recording`,params)
    }
    async joinOrCreateRoom(name: string, tracks: LocalTrack[]) {
        let room: Room = null;
        try {
            const token = await this.getAuthToken();
            room =
                await connect(
                    token, {
                        name,
                        tracks,
                        dominantSpeaker: true
                    } as ConnectOptions);
        } catch (error) {
            console.error(`Unable to connect to Room: ${error.message}`);
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
}