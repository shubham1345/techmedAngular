import { Component, OnInit, OnDestroy, EventEmitter, Output, Input } from '@angular/core';
import { Subscription } from 'rxjs';
import { tap } from 'rxjs/operators';
import { NamedRoom, VideoChatService } from '../services/videochat.service';
import { SvclocalstorageService } from 'src/app/services/services/svclocalstorage.service';
import { environment } from 'src/environments/environment';

@Component({
    selector: 'app-rooms',
    styleUrls: ['./rooms.component.css'],
    templateUrl: './rooms.component.html',
})
export class RoomsComponent implements OnInit, OnDestroy {
    @Output() roomChanged = new EventEmitter<string>();
    @Input() activeRoomName: string;

    userObjFromToken : any;
    roomName: string;
    rooms: NamedRoom[];
    public roomSid : any
    private subscription: Subscription;

    constructor(
        private readonly videoChatService: VideoChatService, private svcLocalstorage: SvclocalstorageService) {
            this.roomName = this.svcLocalstorage.GetData(environment.doctorName).replace(/\s/g,"")
            this.svcLocalstorage.SetData( environment.RoomName,this.roomName)
          
         }

    async ngOnInit() {
        debugger
        await this.updateRooms();
        this.subscription =
            this.videoChatService
                .$roomsUpdated
                .pipe(tap(_ => this.updateRooms()))
                .subscribe();
                this.onTryAddRoom();
              
    }

    ngOnDestroy() {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }

    onTryAddRoom() {
        debugger
           if (this.roomName) {
            this.onAddRoom(this.roomName);
        }
    }

    onAddRoom(roomName: string) {
        debugger
        this.roomName = null;
        this.roomChanged.emit(roomName);
    }

    onJoinRoom(roomName: string) {
        this.userObjFromToken = this.svcLocalstorage.GetData(environment.AuthTokenKeyLSKey);
        if(this.userObjFromToken)
        {
         this.roomChanged.emit(roomName);
        }
    }

    async updateRooms() {
        this.rooms = (await this.videoChatService.getAllRooms()) as NamedRoom[];
    }
}