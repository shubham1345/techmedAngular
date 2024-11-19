import { Location } from '@angular/common';
import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  QueryList,
  Renderer2,
  ViewChild,
  ViewChildren,
  AfterViewInit,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  HubConnection,
  HubConnectionBuilder,
  LogLevel,
} from '@microsoft/signalr';
import { environment } from 'src/environments/environment';

import { TwilioMiddlewareService } from '../../services/twilio-middleware.service';
import { TwilioCameraComponent } from '../twilio-camera/twilio-camera.component';
import { TwilioRoomParticipantsComponent } from '../twilio-room-participants/twilio-room-participants.component';
import { SvcAuthenticationService } from 'src/app/services/services/svc-authentication.service';
import { NotificationHubService } from 'src/app/services/services/notification-hub.service';
import {
  connect,
  Room,
  LocalParticipant,
  RemoteParticipant,
  Participant,
  RemoteTrack,
  LocalTrack,
  RemoteTrackPublication,
  RemoteAudioTrack,
  RemoteVideoTrack,
  ConnectOptions,
  createLocalTracks,
  isSupported,
  LocalVideoTrack,
  LocalDataTrack,
} from 'twilio-video';
import { Observable } from 'rxjs';
import Swal from 'sweetalert2';
import { ngxLoadingAnimationTypes } from 'ngx-loading';
import { INotificationResponse } from 'src/app/model/INotificationResponse';
import { SvcmainAuthserviceService } from 'src/app/services/services/svcmain-authservice.service';

@Component({
  selector: 'app-twilio-room',
  templateUrl: './twilio-room.component.html',
  styleUrls: ['./twilio-room.component.css'],
})
export class TwilioRoomComponent implements OnInit {
  constructor(
    private route: Router,
    private actRoute: ActivatedRoute,
    private location: Location,
    private twilioService: TwilioMiddlewareService,
    private readonly renderer: Renderer2,
    private svcAuth: SvcAuthenticationService,
    public svcNotification: NotificationHubService,
    private _sweetAlert: SvcmainAuthserviceService,

  ) {
    this.registerBeforeUnloadHandler()
  }

  private notificationHub: HubConnection;
  @Input() roomName: string;

  @Input() patientCaseId: any;
  @Output() onMeetingCloseTrigger: EventEmitter<boolean> =
    new EventEmitter<boolean>();
  activeRoom: Room;
  isDoctor: boolean = false;
  arr: any = [];
  // @ViewChild('camera', { static: false }) camera: TwilioCameraComponent;
  // @ViewChild('participants', { static: false }) participants: TwilioRoomParticipantsComponent;

  async ngOnInit() {
    this.isDoctor = this.svcAuth.isDoctor;
    this.onCallEndNotificationReceived();
    this.startNewMeeting();

    this._sweetAlert.getpatientAbsent().subscribe((res: any) => {
      // alert('twilio room absent');
      if (res == true) {
        this.onEndCallClick(true);
      }
    });
  }
  ngAfterViewInit() {
    this.svcNotification.endCallOnLogout.subscribe((data: any) => {
      if (data == true) {
        this.endCall(this.activeRoom.name, this.patientCaseId, true);
      }
      console.log(data);
    });
  }
  //new code
  get participantCount() {
    return !!this.participants ? this.participants.size : 0;
  }

  get isAlone() {
    return this.participantCount === 0;
  }
  getParticipants() {
    if (!!this.participants) {
      return Array.from(this.participants).map((item) => item[1]);
    } else {
      return [];
    }
  }

  @ViewChild('participant', { static: false }) participant: ElementRef;
  @ViewChildren('participant') participantElem: QueryList<'participant'>;
  @ViewChild('preview', { static: false }) preview: ElementRef;
  @ViewChild('smallPreview', { static: false }) smallPreview: ElementRef;
  @ViewChild('shareElement', { static: false }) shareElement: ElementRef;
  @ViewChild('smallPreviewContainer', { static: false })
  smallPreviewContainer: ElementRef;

  showInfo = true;
  localTrack;
  localTrackAll: LocalTrack[] = [];
  private participants: Map<
    Participant.SID,
    RemoteParticipant | LocalParticipant
  >; //RemoteParticipant
  dominantSpeaker: RemoteParticipant;
  localParticipant: LocalParticipant;
  dataTrack = new LocalDataTrack();
  dataTrackPublished: any = {};
  localInitial: string;
  isJoining: boolean;
  startNewMeeting() {
    createLocalTracks({
      audio: true,
      video: true,
    })
      .then((localTracks) => {
        this.localTrackAll = localTracks;
        /*set preview*/
        this.isJoining = true;
        this.localTrack = localTracks.find((track) => track.kind === 'video');

        return this.twilioService.joinOrCreateRoom(this.roomName, localTracks);
      })
      .then(
        (room) => {
          this.activeRoom = room;
          this._sweetAlert.setpatientAbsent(
            this.activeRoom.name,
            this.patientCaseId
          );
          this.isJoining = false;
          this.initializeParticipent(this.activeRoom.participants);
          this.registerRoomEvents();
          this.publishDataTrack();
          // this.localParticipant = new Observable((observer) => {
          //   observer.next(this.activeRoom.localParticipant);
          // });
          this.localParticipant = this.activeRoom.localParticipant;

          this.localInitial =
            this.activeRoom.localParticipant.identity.substring(0, 1);
          this.participants.set(
            this.activeRoom.localParticipant.sid,
            this.activeRoom.localParticipant
          );
          //this.activeRoom.localParticipant.on('networkQualityLevelChanged', (networkQualityLevel, networkQualityStats) => { this.printNetworkQualityStats(networkQualityLevel, networkQualityStats) });
        },
        (err) => {
          console.log('Room NOT CONNECTED TO TWILIO exception ', err);
          Swal.fire({
            allowOutsideClick: false,
            allowEscapeKey: false,
            allowEnterKey: false,
            position: 'bottom-end',
            icon: 'error',
            title: 'Error - ' + err,
            confirmButtonText: 'Ok',
          }).then((result) => {
            this.twilioService
              .DismissCall(
                this.roomName,
                this.patientCaseId,
                true,
                'startmeeting'
              )
              .subscribe({
                next: (val) => {
                  this.svcNotification.isCallInProgress.next(false);
                },
                error: (err) => {
                  this.svcNotification.isCallInProgress.next(false);
                  window.location.href = '/';
                },
              });

            this.route.navigate(['/']);
          });
        }
      );
  }

  initializeParticipent(participants: Map<Participant.SID, RemoteParticipant>) {
    this.participants = participants;
    if (this.participants) {
      this.participants.forEach((participant) =>
        this.registerParticipantEvents(participant)
      );
    }
  }
  getUserInitial(name): string {
    return name.toString().substring(0, 1).toUpperCase();
  }

  private registerParticipantEvents(
    participant: RemoteParticipant | LocalParticipant
  ) {
    if (participant) {
      participant.tracks.forEach((publication) =>
        this.subscribeParticipant(publication)
      );
      participant.on('trackPublished', (publication) =>
        this.subscribeParticipant(publication)
      );
      participant.on('trackUnpublished', (publication) => {
        if (publication && publication.track) {
          this.detachRemoteTrack(publication.track);
        }
      });
      // participant.on('trackSubscribed', track => {

      //   if (track.kind === 'data') {
      //     track.on('message', data => {
      //       console.log(data);
      //     });
      //   }
      // });
    }

    console.log(
      this.participantCount,
      '!!!!!!!!!!!!1',
      this.participant,
      '##############',
      this.participants.size,
      '@@@@@@@222'
    );
  }

  private subscribeParticipant(publication: RemoteTrackPublication | any) {
    if (publication && publication.on) {
      publication.on('subscribed', (track) => this.attachRemoteTrack(track));
      publication.on('unsubscribed', (track) => this.detachRemoteTrack(track));
    }
  }

  private attachRemoteTrack(track: RemoteTrack) {
    if (this.isAttachable(track)) {
      const element = track.attach();
      this.renderer.data['id'] = track.sid;
      this.renderer.setStyle(element, 'width', '95%');
      this.renderer.setStyle(element, 'margin-left', '2.5%');
      // this.renderer.appendChild(this.listRef.nativeElement, element);
      // this.participantsChanged.emit(true);
    }
  }

  private detachRemoteTrack(track: RemoteTrack) {
    if (this.isDetachable(track)) {
      track.detach().forEach((el) => el.remove());
      // this.participantsChanged.emit(true);
    }
  }
  private isAttachable(
    track: RemoteTrack
  ): track is RemoteAudioTrack | RemoteVideoTrack {
    return (
      !!track &&
      ((track as RemoteAudioTrack).attach !== undefined ||
        (track as RemoteVideoTrack).attach !== undefined)
    );
  }

  private isDetachable(
    track: RemoteTrack
  ): track is RemoteAudioTrack | RemoteVideoTrack {
    return (
      !!track &&
      ((track as RemoteAudioTrack).detach !== undefined ||
        (track as RemoteVideoTrack).detach !== undefined)
    );
  }

  private registerRoomEvents() {
    this.activeRoom
      .on('disconnected', (room: Room) => {
        // room.localParticipant.tracks.forEach((publication: any) => {
        //   //this.detachLocalTrack(publication.track)
        //   try {
        //     if (this.isDetachable(publication.track)) {
        //       publication.track.detach().forEach(el => el.remove());
        //     }
        //   } catch (e) {
        //   }
        // })
      })
      .on('participantConnected', (participant: RemoteParticipant) => {
        this.addParticipant(participant);
      })
      .on('participantDisconnected', (participant: RemoteParticipant) => {
        console.log(participant);
        
         console.error(participant,'participantttttttttttt  lft')
             
        this.removeParticipant(participant);
        // this.onEndCallClick(true)
        this.endCall(
          this.activeRoom.name,
          this.patientCaseId,
          true
        );
        
      })
      .on('dominantSpeakerChanged', (dominantSpeaker: RemoteParticipant) => {
        this.loudestParticipant(dominantSpeaker);
      });
  }
  private registerBeforeUnloadHandler() {
    window.addEventListener('beforeunload', () => {
        console.log('Before A');
       if (this.activeRoom) {
           console.log('Before B');
            
            this.endCall(
                this.activeRoom.name,
                this.patientCaseId,
                true
            );
        }
    });
}

  private publishDataTrack() {
    this.activeRoom.localParticipant.publishTrack(this.dataTrack);
    this.dataTrackPublished.promise = new Promise((resolve, reject) => {
      this.dataTrackPublished.resolve = resolve;
      this.dataTrackPublished.reject = reject;
    });

    this.activeRoom.localParticipant.on('trackPublished', (publication) => {
      if (publication.track === this.dataTrack) {
        this.dataTrackPublished.resolve();
      }
    });

    this.activeRoom.localParticipant.on(
      'trackPublicationFailed',
      (error, track) => {
        if (track === this.dataTrack) {
          this.dataTrackPublished.reject(error);
        }
      }
    );
  }

  //LocalTrack
  // private detachLocalTrack(track: any) {
  //   try {

  //     if (this.isDetachable(track)) {
  //       track.detach().forEach(el => el.remove());
  //     }

  //   } catch (e) {

  //   }
  // }

  addParticipant(participant: RemoteParticipant) {
    if (this.participants && participant) {
      this.participants.set(participant.sid, participant);
      this.registerParticipantEvents(participant);
    }
  }

  removeParticipant(participant: RemoteParticipant) {
    if (this.participants && this.participants.has(participant.sid)) {
      this.participants.delete(participant.sid);
    }
  }

  loudestParticipant(participant: RemoteParticipant) {
    this.dominantSpeaker = participant;

    // new Observable((observer) => {
    //   observer.next(participant);
    // })
  }

  leaveRoom() {
    try {
      if (this.participants) {
        this.participants.forEach((x) => {
          x.videoTracks.clear();
        });
        this.participants.forEach((x) => {
          x.tracks.clear();
        });
        this.participants.clear();
      }
      if (this.activeRoom) {
        this.activeRoom = null;
      }
    } catch (err) {
      console.log('ROOM LEAVE ERROR', err);
    }
    // To disconnect from a Room
  }
  isPresenting: boolean = false;
  stream;
  screenTrack;

  fullScreen = false;
  speakerView = true;
  minimizePreview = false;
  showToolbar = true;
  showFullScreenBar = true;
  elem: any;
  micOn = true;

  isHost(identity: string): string {
    // console.error(this.participant,'particiAbhishek');
    // console.error(this.localParticipant,'localPeri');

    let loginUserEmail = (this.svcAuth.currentUserEmail || '').toLowerCase();

    if (loginUserEmail === identity.toLowerCase()) {
      return '(Host)';
    } else {
      return '';
    }
  }
  public ngxLoadingAnimationTypes = ngxLoadingAnimationTypes;
  showLoader: boolean = false;

  onCallErrorClick() {
    if (this.isDoctor) {
      window.location.href = '/doctor-detail';
    } else {
      window.location.href = '/chc-center';
    }
  }

  onEndCallClick(isPartiallyClosed: boolean) {
    Swal.fire({
      allowOutsideClick: false,
      allowEscapeKey: false,
      allowEnterKey: false,
      position: 'bottom-end',
      icon: 'info',
      title: 'Do you want to close call?',
      showDenyButton: true,
      confirmButtonText: 'Yes',
      denyButtonText: `No`,
    }).then((result) => {
      if (result.isConfirmed) {
        this.showLoader = true;
        this.endCall(
          this.activeRoom.name,
          this.patientCaseId,
          isPartiallyClosed
        );
      }
    });
  }
  endCall(activeRoom, patientCaseId, isPartiallyClosed) {
    this.twilioService
      .DismissCall(activeRoom, patientCaseId, isPartiallyClosed, 'endcall')
      .subscribe({
        next: (data: any) => {
          // alert('room endcall');
          this.showLoader = false;
        },
        error: (err) => {
          this.showLoader = false;
          console.log('ERROR ON SERVER', err);
          Swal.fire({
            allowOutsideClick: false,
            allowEscapeKey: false,
            allowEnterKey: false,
            position: 'bottom-end',
            icon: 'info',
            title: 'There is error on server?',
            showConfirmButton: false,
            timer: 5000,
          }).then((x) => {
            this.onMeetingCloseTrigger.emit(true);
          });
        },
      });
  }

  onCallEndNotificationReceived() {
    // alert('onCallEndNotificationReceived twilio');
    this.svcNotification.onNotifyParticipientToExit.subscribe({
      next: (message: any) => {
        // alert(
        //   localStorage.getItem('meetingInstace') +
        //     '     ss   ' +
        //     message.roomName.toString()
        // );
        if (
          localStorage.getItem('meetingInstace') == message.roomName.toString()
        ) {
          if (message) {
            // alert('room twilioonCall EndNotificationReceived');
            // alert('call end');
            Swal.close();
            Swal.fire({
              allowOutsideClick: false,
              allowEscapeKey: false,
              allowEnterKey: false,
              toast: true,
              position: 'bottom-end',
              icon: 'info',
              title: 'Disconnected.',
            });

            this.leaveRoom();

            this.onMeetingCloseTrigger.emit(true);
          }
        }
      },
    });
  }

  ///old code

  // async StartMeeting() {

  //   this.camera.finalizePreview();

  //   this.activeRoom = await this.twilioService.joinOrCreateRoom(this.roomName, this.camera.tracks)
  //   if (this.activeRoom) {
  //     this.camera.initializePreview(this.deviceInfo);
  //     this.registerRoomEvents();
  //     console.log(this.activeRoom.localParticipant);
  //     this.participants.initialize(this.activeRoom.participants);
  //     this.notificationHub.send('RoomsUpdated', true);
  //   }

  // }
  // private registerRoomEvents() {
  //   this.activeRoom
  //     .on('disconnected',
  //       (room: Room) => {
  //         console.log("Disconnected", room);
  //         //  room.localParticipant.tracks.forEach(publication => this.detachLocalTrack(publication.track))
  //       })
  //     .on('participantConnected',
  //       (participant: RemoteParticipant) => {
  //         ;
  //         console.log("participantConnected", participant)
  //         this.participants.add(participant)
  //       })
  //     .on('participantDisconnected',
  //       (participant: RemoteParticipant) => {
  //         console.log("participantDisconnected", participant)
  //         ;
  //         this.participants.remove(participant)
  //       })
  //     .on('dominantSpeakerChanged',
  //       (dominantSpeaker: RemoteParticipant) => {
  //         ;
  //         console.log("dominantSpeakerChanged")
  //         this.participants.loudest(dominantSpeaker)
  //       });
  // }
  // async onLeaveRoom(_: boolean) {
  //   ;
  //   if (this.activeRoom) {
  //     this.activeRoom.disconnect();
  //     this.activeRoom = null;
  //   }
  //   // const videoDevice = this.settings.hidePreviewCamera();
  //   // this.camera.finalizePreview();

  //   // this.camera.initializePreview(videoDevice);
  //   // this.participants.clear();
  // }
  // onParticipantsChanged(_: boolean) {
  //   ;
  //   this.twilioService.nudge();
  // }

  // nQstateCounter: number = 0;
  // showNetworkError: boolean = false;
  printNetworkQualityStats(networkQualityLevel, networkQualityStats) {
    // Print in console the networkQualityLevel using bars
    console.log(
      {
        1: '▃',
        2: '▃▄',
        3: '▃▄▅',
        4: '▃▄▅▆',
        5: '▃▄▅▆▇',
      }[networkQualityLevel] || ''
    );

    // if (networkQualityLevel <= 3 && this.nQstateCounter <= 2) {
    //   this.showNetworkError = true;
    // } else if (this.nQstateCounter <= 2) {
    //   this.showNetworkError = false;
    // }
    // this.nQstateCounter += 1;

    // else {
    //   this.showNetworkError = false;
    //   this.isFirstCall = false;

    // }
    if (networkQualityStats) {
      // Print in console the networkQualityStats, which is non-null only if Network Quality
      // verbosity is 2 (moderate) or greater
      console.log(
        'Network Quality statistics:',
        networkQualityLevel,
        networkQualityStats,
        this.patientCaseId,
        this.svcAuth.currentUserEmail,
        this.roomName
      );
      this.twilioService
        .CaptureNetworkQuality(
          this.activeRoom.name,
          this.patientCaseId,
          networkQualityLevel
        )
        .subscribe({
          next: (resp) => {},
          error: (err) => {},
        });
    }
  }
}
