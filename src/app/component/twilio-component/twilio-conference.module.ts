import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TwilioConferenceHomeComponent } from './components/twilio-conference-home/twilio-conference-home.component';
import { RouterModule, Routes } from '@angular/router';
import { TwilioRoomComponent } from './components/twilio-room/twilio-room.component';
import { TwilioRoomParticipantsComponent } from './components/twilio-room-participants/twilio-room-participants.component';
import { TwilioCameraComponent } from './components/twilio-camera/twilio-camera.component';
import { TwilioDeviceSettingComponent } from './components/twilio-device-setting/twilio-device-setting.component';
import { TwilioDeviceSelectComponent } from './components/twilio-device-select/twilio-device-select.component';
import { ngxLoadingAnimationTypes, NgxLoadingModule } from 'ngx-loading';

import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSelectModule } from '@angular/material/select';
import { ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatMenuModule } from '@angular/material/menu';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatTableModule } from '@angular/material/table';
import { MatPseudoCheckboxModule } from '@angular/material/core';
import { TwilioSpeakerViewComponent } from './components/twilio-speaker-view/twilio-speaker-view.component';
import { TwilioCallButtonComponent } from './components/twilio-call-button/twilio-call-button.component';
import { JitsicallComponent } from './components/Jitsi-call/jitsicall/jitsicall.component';
import { HttpClient, HttpClientModule } from '@angular/common/http';

const appRoutes: Routes = [
  { path: 'patient-meet/:res', component: TwilioConferenceHomeComponent },
];
@NgModule({
  declarations: [
    TwilioConferenceHomeComponent,
    TwilioRoomComponent,
    TwilioRoomParticipantsComponent,
    TwilioCameraComponent,
    TwilioDeviceSettingComponent,
    TwilioDeviceSelectComponent,
    TwilioSpeakerViewComponent,
    TwilioCallButtonComponent,
    JitsicallComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forRoot(appRoutes),
    NgxLoadingModule.forRoot({
      animationType: ngxLoadingAnimationTypes.wanderingCubes,
      backdropBackgroundColour: 'rgba(0,0,0,0.1)',
      backdropBorderRadius: '4px',
      primaryColour: '#ffffff',
      secondaryColour: '#ffffff',
      tertiaryColour: '#ffffff',
    }),
    MatSelectModule,
    //MatDialogModule,
    ReactiveFormsModule,
    MatInputModule,
    MatButtonModule,
    //MatProgressBarModule,
    MatIconModule,
    //FlexLayoutModule,
    MatSlideToggleModule,
    // PortalModule,
    //MatToolbarModule,
    MatSidenavModule,
    MatMenuModule,
    //MatListModule,
    //MatRadioModule,
    //MatCardModule,
    //MatSnackBarModule,
    MatDatepickerModule,
    //MatMomentDateModule,
    //MatProgressSpinnerModule,
    //MatBadgeModule,
    //NgxMaterialTimepickerModule,
    //ClipboardModule,
    MatTableModule,
    MatPseudoCheckboxModule,
    HttpClientModule,
  ],
  exports: [TwilioConferenceHomeComponent, TwilioCallButtonComponent,JitsicallComponent],
})
export class TwilioConferenceModule {}
