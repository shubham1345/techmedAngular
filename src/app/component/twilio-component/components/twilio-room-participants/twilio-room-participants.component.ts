import { Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, Renderer2, ViewChild } from '@angular/core';
import { LocalAudioTrackPublication, LocalVideoTrackPublication, Participant, RemoteAudioTrack, RemoteParticipant, RemoteTrack, RemoteTrackPublication, RemoteVideoTrack } from 'twilio-video';

@Component({
  selector: 'app-twilio-room-participants',
  templateUrl: './twilio-room-participants.component.html',
  styleUrls: ['./twilio-room-participants.component.css']
})
export class TwilioRoomParticipantsComponent implements OnInit,OnChanges {


  @ViewChild('preview', { static: false }) preview: ElementRef;

  isPreviewing = false;
  localInitial: string;
  host: string;
  sid: string;
  part: any;
  currentIdentity;

  arr:any=[]

  @Input('participant')
  set participant(participant: any) {
    this.part = participant;
    console.log(participant,'participantttttt');
  }
  @Input('isHost')
  set isHost(host: any) {
    this.host = host;
    console.log(host,'hostttttttttt');
    
  }


  @Input('localParticipant')
  set localParticipant(localParticipant: any) {
    this.currentIdentity = localParticipant.identity;
    console.log(this.currentIdentity,'currentlyyyyy');
    
  }

  @Output('muted') muted = new EventEmitter<boolean>();
  @Input('micOn') micOn: boolean;


  private isAttachable(track: RemoteTrack): track is RemoteAudioTrack | RemoteVideoTrack {
    return !!track &&
      ((track as RemoteAudioTrack).attach !== undefined ||
        (track as RemoteVideoTrack).attach !== undefined);
  }

  private isDetachable(track: RemoteTrack): track is RemoteAudioTrack | RemoteVideoTrack {
    return !!track &&
      ((track as RemoteAudioTrack).detach !== undefined ||
        (track as RemoteVideoTrack).detach !== undefined);
  }

  private isLocal(track: any): track is LocalAudioTrackPublication | LocalVideoTrackPublication {
    return !!track;
  }


  constructor(private readonly renderer: Renderer2) { }

  ngOnChanges(){
    // alert('l')
    console.log('particupant',this.participant);
    console.log('local',this.localParticipant);
  }

  ngOnInit(): void {

    
    
  }

  ngAfterViewInit() {
    
    if (!!this.part) {

      let local;
      this.part.videoTracks.forEach(track => {
        local = this.isLocal(track.track);
      });
      if (local) {
        this.arr.push('local')
        this.part.videoTracks.forEach(track => {
          this.attachLocalTrack(track);
        });
      } else {
        this.arr.push('else')
        this.registerEvents(this.part);
      }

      console.log(this.arr,'arrr@@@@@@@@@@@@@@@@@@@@@@@@')
    }
  }

  private registerEvents(participant: RemoteParticipant) {
    this.localInitial = this.participant?.identity;

    participant.tracks.forEach(publication => this.subscribe(publication));
    participant.on('trackPublished', publication => this.subscribe(publication));
    participant.on('trackUnpublished',
      publication => {
        if (publication && publication.track) {
          this.detachRemoteTrack(publication.track);
        }
      });
  }

  private subscribe(publication: RemoteTrackPublication | any) {
    if (publication && publication.on) {
      publication.on('subscribed', track => this.attachRemoteTrack(track));
      publication.on('unsubscribed', track => this.detachRemoteTrack(track));
    }
  }

  private attachRemoteTrack(track: RemoteTrack) {
    if (this.isAttachable(track)) {
      this.isPreviewing = true;
      const element = track.attach();
      this.renderer.data["id"] = track.sid;
      this.renderer.setStyle(element, 'width', '100%');
      this.renderer.appendChild(this.preview.nativeElement, element);
    }
  }

  private detachRemoteTrack(track: RemoteTrack) {
 
    if (this.isDetachable(track)) {
      track.detach().forEach(el => el.remove());
      this.isPreviewing = false;
    }
  }

  private attachLocalTrack(track: any) {
    if (this.isAttachable(track.track)) {
      this.isPreviewing = true;
      const element = track.track.attach();
      this.renderer.data["id"] = track.sid ? track.sid : track.trackSid;
      this.renderer.setStyle(element, 'width', '100%');
      console.log(this.preview);
      this.renderer.appendChild(this.preview.nativeElement, element);
    }
  }


  mute() {
    this.micOn = !this.micOn;
    this.muted.emit(this.micOn);
  }


  // @ViewChild('list', { static: false }) listRef: ElementRef;
  // @Output('participantsChanged') participantsChanged = new EventEmitter<boolean>();
  // @Output('leaveRoom') leaveRoom = new EventEmitter<boolean>();
  // @Input('activeRoomName') activeRoomName: string;

  // private participants: Map<Participant.SID, RemoteParticipant>;
  // private dominantSpeaker: RemoteParticipant;

  // constructor(private readonly renderer: Renderer2) { }

  // ngOnInit(): void {
  // }
  // get participantCount() {
  //   return !!this.participants ? this.participants.size : 0;
  // }
  // get isAlone() {
  //     return this.participantCount === 0;
  // }
  // clear() {

  //     if (this.participants) {
  //     this.participants.clear();
  //   }
  // }

  // initialize(participants: Map<Participant.SID, RemoteParticipant>) {
  //    this.participants = participants;
  //   if (this.participants) {
  //     this.participants.forEach(participant => this.registerParticipantEvents(participant));
  //   }
  // }

  // add(participant: RemoteParticipant) {
  //   debugger;
  //     if (this.participants && participant) {
  //     this.participants.set(participant.sid, participant);
  //     this.registerParticipantEvents(participant);
  //   }
  // }

  // remove(participant: RemoteParticipant) {
  //   debugger;
  //    if (this.participants && this.participants.has(participant.sid)) {
  //     this.participants.delete(participant.sid);
  //   }
  // }

  // loudest(participant: RemoteParticipant) {
  //   debugger;
  //   this.dominantSpeaker = participant;
  // }

  // onLeaveRoom() {
  //   debugger;
  //     this.leaveRoom.emit(true);
  // }

  // private registerParticipantEvents(participant: RemoteParticipant) {
  //   debugger;
  //   if (participant) {
  //     participant.tracks.forEach(publication => this.subscribe(publication));
  //     participant.on('trackPublished', publication => this.subscribe(publication));
  //     participant.on('trackUnpublished',
  //       publication => {
  //         if (publication && publication.track) {
  //           this.detachRemoteTrack(publication.track);
  //         }
  //       });
  //   }
  // }

  // private subscribe(publication: RemoteTrackPublication | any) {
  //   if (publication && publication.on) {
  //     publication.on('subscribed', track => this.attachRemoteTrack(track));
  //     publication.on('unsubscribed', track => this.detachRemoteTrack(track));
  //   }
  // }

  // private attachRemoteTrack(track: RemoteTrack) {
  //   debugger;
  //     if (this.isAttachable(track)) {
  //     const element = track.attach();
  //     this.renderer.data["id"] = track.sid;
  //     this.renderer.setStyle(element, 'width', '95%');
  //     this.renderer.setStyle(element, 'margin-left', '2.5%');
  //     this.renderer.appendChild(this.listRef.nativeElement, element);
  //     this.participantsChanged.emit(true);
  //   }
  // }

  // private detachRemoteTrack(track: RemoteTrack) {
  //   debugger;
  //   if (this.isDetachable(track)) {
  //     track.detach().forEach(el => el.remove());
  //     this.participantsChanged.emit(true);
  //   }
  // }

  // private isAttachable(track: RemoteTrack): track is RemoteAudioTrack | RemoteVideoTrack {
  //   debugger;
  //     return !!track &&
  //     ((track as RemoteAudioTrack).attach !== undefined ||
  //       (track as RemoteVideoTrack).attach !== undefined);
  // }

  // private isDetachable(track: RemoteTrack): track is RemoteAudioTrack | RemoteVideoTrack {
  //   debugger;
  //   return !!track &&
  //     ((track as RemoteAudioTrack).detach !== undefined ||
  //       (track as RemoteVideoTrack).detach !== undefined);
  // }
}
