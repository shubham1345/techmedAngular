import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-activity-indicator',
  templateUrl: './activity-indicator.component.html',
  styleUrls: ['./activity-indicator.component.css']
})
export class ActivityIndicatorComponent  {

  @Input() message: string = 'Loading... Please wait.';
}
