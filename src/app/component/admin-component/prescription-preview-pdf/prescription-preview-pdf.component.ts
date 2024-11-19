import { ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import jsPDF from 'jspdf';
// import pdfMake from 'pdfmake/build/pdfmake';
// import pdfFonts from 'pdfmake/build/vfs_fonts';
// (<any>pdfMake).vfs = pdfFonts.pdfMake.vfs;
import html2canvas from 'html2canvas';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-prescription-preview-pdf',
  templateUrl: './prescription-preview-pdf.component.html',
  styleUrls: ['./prescription-preview-pdf.component.css']
})
export class PrescriptionPreviewPdfComponent implements OnInit {
  isHidden: boolean = true
  @ViewChild('pdfTable') pdfTable: ElementRef;
  @ViewChild('docSigna') docSigna: ElementRef;
  @Output() getPdf = new EventEmitter<any>();
  @Input() preview: any;
  @Input() doctorSignature: any;
  imagespatient = environment.ImagesHeader
  gender: any
  state: any
  medicine: any = []
  createdOn: any
  diagnosticTest: any = []
  bd: any
  od: any
  constructor(private detectChanges: ChangeDetectorRef) {
  }
  // ngOnChanges(changes : SimpleChanges){
  //   this.caseDetailPrint = changes.caseDetailPrint?.currentValue
  //   if(this.caseDetailPrint?.patientMaster?.genderId == 2){
  //     this.gender = "Female"
  //   }
  //   else{
  //     this.gender = "Male"
  //   }
  // }



  ngAfterViewInit() {
    this.docSigna.nativeElement.src = 'data:image/jpeg;base64,' + this.doctorSignature

  }



  ngOnInit(): void {
    //  this.caseDetailPrint
    // this.preview
    // this.createdOn;
    //this.divHello.nativeElement.innerHTML = "Hello Angular";
    }
  duration: any
  durationCalculation(medicineVMs) {

    this.duration = medicineVMs?.duration
    let durationtime = this.duration;
    if (medicineVMs?.doseTiming == 'od') {
      durationtime = this.duration * 1
    }
    else if (medicineVMs?.doseTiming == 'bd') {
      durationtime = this.duration * 2
    }
    else if (medicineVMs?.doseTiming == 'td') {
      durationtime = this.duration * 3
    }
    return durationtime
  }
  createdOndateTime: any
  reviewDate: any
  getPdffile(doctorDetail, TreatmentData, diagnostics, referredMedList) {

    this.preview = {
      doctorDetail: doctorDetail,
      treatmentDetail: TreatmentData,
      diagnostics: diagnostics,
      referredMedList: referredMedList
    }
    if (this.preview?.doctorDetail?.patientCase?.createdOn) {
      var today = new Date();
      var date = today.getDate() + '-' + (today.getMonth() + 1) + '-' + today.getFullYear();
      this.createdOn = date
      var dateTime = today.getDate() + '-' + (today.getMonth() + 1) + '-' + today.getFullYear() + ' ' + ("0" + today.getHours()).slice(-2) + ':' + ("0" + today.getMinutes()).slice(-2) + ':' + ("0" + today.getSeconds()).slice(-2);
      this.createdOndateTime = dateTime
    }
    if (this.preview?.treatmentDetail?.reviewDate) {
      var today = new Date(this.preview?.treatmentDetail?.reviewDate);
      var date = today.getDate() + '-' + (today.getMonth() + 1) + '-' + today.getFullYear();
      this.reviewDate = date;
    }
    //this.docSigna.nativeElement.src = 'data:image/jpeg;base64,' + this.doctorSignature
    this.detectChanges.detectChanges()

    var html = document.getElementById('pdfTable');


    return html2canvas(html, { logging: true, useCORS: false }).then((canvas) => {

      const contentDataURL = canvas.toDataURL('image/png')

      var imgWidth = 210;
      var pageHeight = 295;
      var imgHeight = canvas.height * imgWidth / canvas.width;
      var heightLeft = imgHeight;
      var doc = new jsPDF('p', 'mm', 'a4');

      var position = 10; // give some top padding to first page

      doc.addImage(contentDataURL, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position += heightLeft - imgHeight; // top padding for other pages
        doc.addPage();
        doc.addImage(contentDataURL, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }
      const newBlob = new Blob([doc.output('blob')], { type: 'application/pdf' });

      return newBlob;
    }
    )



  }


  // ngOnChanges(changes: SimpleChanges) {
  //   console.log(changes)
  // }


}
