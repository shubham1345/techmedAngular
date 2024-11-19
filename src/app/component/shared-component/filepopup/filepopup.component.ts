import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { faL } from '@fortawesome/free-solid-svg-icons';
import { MdbModalRef, MdbModalService } from 'mdb-angular-ui-kit/modal';
import { timeout } from 'rxjs';
import { SvclocalstorageService } from 'src/app/services/services/svclocalstorage.service';
@Component({
  selector: 'app-filepopup',
  templateUrl: './filepopup.component.html',
  styleUrls: ['./filepopup.component.css']
})
export class FilepopupComponent implements OnInit {
  imageFilePath: string = ""
  isPDF: boolean = true;

  constructor(private modalService: MdbModalService, public modalRef: MdbModalRef<FilepopupComponent>,
    private svcLocalstorage: SvclocalstorageService) { 

      

    }

  ngOnInit(): void {

  }
  
  close(): void {
    const closeMessage = 'Modal closed';
    this.modalRef.close(closeMessage)
  }
  open(content) {
    this.modalService.open(content)
  }
}
