import { Injectable } from '@angular/core';
import { SvccasedetailService } from './svccasedetail.service';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SvclocalstorageService {
  phcDetail:any;
  caseDetails:any;
  caseDoctor:any;

  constructor( private svcCasedetail:SvccasedetailService) { }


    GetData(KeyName: string): (string | null) {
        return localStorage.getItem(KeyName);
    }
    SetData(KeyName: string, Value: string): void {
        return localStorage.setItem(KeyName, Value);
    }
    DeleteData(KeyName: string): void {
        localStorage.removeItem(KeyName);
    }
    DeleteAll(): void {
        localStorage.clear();
    }
    setCaseDetail(detail)
    {
        this.SetData("CaseDetail",JSON.stringify(detail))
    }
    getCaseDetail()
    {
        if(this.GetData("CaseDetail"))
        {
            return JSON.parse(this.GetData("CaseDetail"));
        }

        return false;
    }
    getPatientDetail()
    {
        if(this.GetData("patientDetail"))
        {
            return JSON.parse(this.GetData("patientDetail"));
        }

        return false;
    }

    setPatientDetail(detail)
    {
        this.SetData("patientDetail",JSON.stringify(detail))
    }
    
    setDoctordetail(detail)
    {
        this.SetData("doctorDetail",JSON.stringify(detail))

    }
    setRoomName(roomName)
    {
        this.SetData("RoomName", JSON.stringify(roomName))
    }
    setRoomSid(roomSid)
    {
        this.SetData("RoomSid", JSON.stringify(roomSid))
    }
    public getPatientCaseDetail(phcId,patientId)
    {
        
     this.svcCasedetail.GetPatientCaseDetailsdirect(patientId).subscribe(data => {

     this.caseDetails = data;
   
    });
}
}
