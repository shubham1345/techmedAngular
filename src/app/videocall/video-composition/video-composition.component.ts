import { Component, OnInit } from '@angular/core';
import { VideoChatService } from '../services/videochat.service';
import { SvclocalstorageService } from 'src/app/services/services/svclocalstorage.service';
import { environment } from 'src/environments/environment';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-video-composition',
  templateUrl: './video-composition.component.html',
  styleUrls: ['./video-composition.component.css']
})
export class VideoCompositionComponent implements OnInit {

  compositionRecord:any =[]
  callRecord: any =[]
  Fileurl:any 
  videoCompose: any
  constructor(private readonly videoChatService: VideoChatService, private svcLocalstorage: SvclocalstorageService) { }

  ngOnInit(): void {
    this.getAllComposition()
    this.getAllCallRecord()
  }
  
  getAllComposition()
  {
    this.videoChatService.getComposedRecording().subscribe(data => {
      this.compositionRecord.push(data)
      console.log(this.compositionRecord)
    })
    
  }
  getAllCallRecord()
  {
    this.videoChatService.getCallRecording().subscribe(data => {
      this.callRecord.push(data)
      console.log(this.callRecord,"Call Record")
    })
    
  }
 downloadComposition(compid:string)
  {
     this.videoChatService.downloadCallRecord(compid).subscribe((data)=> {
     this.Fileurl =data
    })
    console.log(this.Fileurl.redirect_to)
    if(this.Fileurl != undefined)
    saveAs(this.Fileurl.redirect_to, compid+".mp4");
  }
  deleteComposition(compid:string)
  {
    this.videoChatService.deleteCallRecord(compid).subscribe(data => {
      if(data === true)
      {
        window.location.reload();
      }
    })
  }
  recordComposition(element,roomsid: string)
  {
    debugger
    this.videoChatService.ComposeCallRecording(roomsid, environment.ImagesHeader).subscribe((data: any)=> {
      this.compositionRecord =data
    })
    element.disabled = true;
  }

}
