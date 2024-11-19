import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Svc_getdoctordetailService } from '../services/services/svc_getdoctordetail.service';
import { ngxLoadingAnimationTypes } from 'ngx-loading';

@Component({
  selector: 'app-download-prescription',
  templateUrl: './download-prescription.component.html',
  styleUrls: ['./download-prescription.component.css']
})
export class DownloadPrescriptionComponent implements OnInit {
caseID:any
public ngxLoadingAnimationTypes = ngxLoadingAnimationTypes;
public config = {
  animationType: ngxLoadingAnimationTypes.none,
  backdropBorderRadius: '3px',
};

loading:boolean=false
  constructor(private router:Router,private activateRoute:ActivatedRoute,private svcDoctor:Svc_getdoctordetailService) {

    this.activateRoute.queryParams.subscribe((res:any)=>{
     if(res.patientcaseid)
     {
      this.downloadprescription(res.patientcaseid)
     }

    })

   }

  ngOnInit(): void {
  }

  downloadprescription(caseID:any){
    this.loading=true
    this.svcDoctor.downloadPrescription(caseID).subscribe((res:any)=>{
      this.loading=false
      if(res.prescriptionFileHTML)
      {
       var html=document.getElementById('prescription')
       console.log(window.atob(res.prescriptionFileHTML));

       html.innerHTML=window.atob(res.prescriptionFileHTML)
       
       setTimeout(() => {
        window.print()
       }, 1000);
       
      }
      else{
        this.loading=false
        alert('else')
        // window.close()
        // window.open("http://google.com", '_self');
      }
    },(err:any)=>{
      this.loading=false
      alert('error')
      // window.close()
      // window.open("http://google.com", '_self');
    })
    
  }

}
