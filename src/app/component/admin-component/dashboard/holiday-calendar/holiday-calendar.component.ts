import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { environment } from 'src/environments/environment';
import { SvclocalstorageService } from 'src/app/services/services/svclocalstorage.service';
import { svc_HolidayCalenderService } from 'src/app/services/services/svc_HolidayCalender.service';
import { SvcPhcGetPatientService } from 'src/app/services/services/svc-phc-get-patient.service';
import { Svc_MasterService } from 'src/app/services/services/svc_master.service';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpParams } from '@angular/common/http';
import { DatePipe } from '@angular/common';


@Component({
  selector: 'app-holiday-calendar',
  templateUrl: './holiday-calendar.component.html',
  styleUrls: ['./holiday-calendar.component.css']
})
export class HolidayCalendarComponent implements OnInit {


  year:string;
  holidaycalendar = new FormGroup({
    holidaydate: new FormControl(''),
    holidaydiscrip: new FormControl(''),
    selectYear: new FormControl('2022')
  })
  userObjFromToken: string;
  constructor(
    private fb: FormBuilder, 
    private svcLocalstorage: SvclocalstorageService,
    private activatedRoute: ActivatedRoute,
    private Svc_HolidayCalenderService: svc_HolidayCalenderService,
    private router: Router,
    public datepipe: DatePipe,
    ) {
      let params = new HttpParams();
      params = params.append('year','2022');
      this.year='2022';
      this.GetHolidayList(params);
      
     }

  ngOnInit(): void {

    
  }
  ApiData :any[]=[]
  GetHolidayList(params:any) {
    this.userObjFromToken = this.svcLocalstorage.GetData(
      environment.AuthTokenKeyLSKey
    );
   

   
    if (this.userObjFromToken) {
      this.Svc_HolidayCalenderService.GetHolidayList({params}).subscribe(
        (data: any) => {
          this.ApiData=data;
          console.log(this.ApiData, 'this is GetHolidayList data');
         
        }
      );
    }
  }
  savesholidaycalendar(){
    let obj: any = {};
    obj.holidaydate = this.holidaycalendar.get('holidaydate').value;
    obj.holidaydiscrip = this.holidaycalendar.get('holidaydiscrip').value;

    let params = new HttpParams();
    params = params.append('holidayDate',obj.holidaydate);
    params = params.append('holidayName',obj.holidaydiscrip);

    console.log(obj,'savesholidaycalendar clicked');

    this.userObjFromToken = this.svcLocalstorage.GetData(
      environment.AuthTokenKeyLSKey
    );
    if (this.userObjFromToken) {
      this.Svc_HolidayCalenderService.AddHoliday({holidayDate:obj.holidaydate,holidayName:obj.holidaydiscrip}).subscribe(
        (data: any) => {
         
          console.log(data, 'this is AddHoliday data');
          let params2 = new HttpParams();
              params2 = params2.append('year',this.year);
              this.GetHolidayList(params2);
         
        }
      );
      (error) => {
        
             console.log("handal");

      }
    }

  }

  deleteholidaycalendar(date:any){

    if(confirm("Are you sure to delete "+date)) {
      // console.log("Implement delete functionality here");
      // console.log(date,'Date to dalete !');
    
    
    let obj: any = {};
    obj.holidaydate = date;
    obj.holidaydiscrip = "";

    let params = new HttpParams();
    params = params.append('holidayDate',obj.holidaydate);
    params = params.append('holidayName',obj.holidaydiscrip);

    console.log(obj,'savesholidaycalendar clicked');

    this.userObjFromToken = this.svcLocalstorage.GetData(
      environment.AuthTokenKeyLSKey
    );
    if (this.userObjFromToken) {
      this.Svc_HolidayCalenderService.DeleteHoliday({holidayDate:obj.holidaydate,holidayName:obj.holidaydiscrip}).subscribe(
        (data: any) => {
         
          console.log(data, 'this is AddHoliday data');
          let params2 = new HttpParams();
              params2 = params2.append('year',this.year);
              this.GetHolidayList(params2);
         
        }
      );
      (error) => {
        
             console.log("handl");

      }
    }
  }
  }

  Editholidaycalendar(date:any,Details:string){

    console.log(date,"Implement delete functionality here");
    console.log(Details,'Date to dalete !');
    this.holidaycalendar = new FormGroup({
      holidaydate: new FormControl(date),
      holidaydiscrip: new FormControl(Details),
      selectYear: new FormControl('2022')
    })

    let obj: any = {};
    obj.holidaydate = this.holidaycalendar.get('holidaydate').value;
    obj.holidaydiscrip = this.holidaycalendar.get('holidaydiscrip').value;

    let params = new HttpParams();
    params = params.append('holidayDate',obj.holidaydate);
    params = params.append('holidayName',obj.holidaydiscrip);

    console.log(obj,'savesholidaycalendar clicked');

    this.userObjFromToken = this.svcLocalstorage.GetData(
      environment.AuthTokenKeyLSKey
    );
    if (this.userObjFromToken) {
      this.Svc_HolidayCalenderService.AddHoliday({holidayDate:obj.holidaydate,holidayName:obj.holidaydiscrip}).subscribe(
        (data: any) => {
         
          console.log(data, 'this is AddHoliday data');
          let params2 = new HttpParams();
              params2 = params2.append('year',this.year);
              this.GetHolidayList(params2);
         
        }
      );
      (error) => {
        
             console.log("handal");

      }
    }

  }

  yearChange(value: any)
  {
    let params = new HttpParams();
    params = params.append('year',value);
    this.GetHolidayList(params);
    console.log(value);
    this.year=value;
  }
}
