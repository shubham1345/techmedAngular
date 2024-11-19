import { Component, OnInit,AfterViewInit } from '@angular/core';
import { Svc_getdoctordetailService } from 'src/app/services/services/svc_getdoctordetail.service';
import { SvclocalstorageService } from 'src/app/services/services/svclocalstorage.service';
import { environment } from 'src/environments/environment';
import { ngxLoadingAnimationTypes } from 'ngx-loading';
import {
 
  filter,
 
} from 'rxjs';


@Component({
  selector: 'app-consultationcalendar',
  templateUrl: './consultationcalendar.component.html',
  styleUrls: ['./consultationcalendar.component.css']
})
export class ConsultationcalendarComponent implements OnInit,AfterViewInit {
  public ngxLoadingAnimationTypes = ngxLoadingAnimationTypes;
  loading = false;
  public config = {
    animationType: ngxLoadingAnimationTypes.none,
    backdropBorderRadius: '3px',
  };
  currentMonth: number;
  currentYear: number;
  calendarDays: Array<Array<number>> | undefined;
  disablenext:boolean
  daysOfWeek=['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday']
  months= ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
 public events: { [key: number]: string[] };

 constructor( private svcdoctor: Svc_getdoctordetailService,
  private svcLocalstorage: SvclocalstorageService) {
     const now = new Date();
     this.currentMonth = now.getMonth();
     this.currentYear = now.getFullYear();
 
     this.events = {
       5: ['12'],
       10: ['100'],
       20: ['50']
     };
 
   }
   ngAfterViewInit(): void {
 
   }
   ngOnInit(): void {
     this.GetDoctorCalendar()
     if(this.currentYear===new Date().getFullYear() && new Date().getMonth()-1===this.currentMonth-1)
     {
       this.disablenext=true
     }
     this.generateCalendar();
 
    
 
   }
   generateCalendar() {
    const firstDay = new Date(this.currentYear, this.currentMonth, 1);
    const lastDay = new Date(this.currentYear, this.currentMonth + 1, 0);
    const numDays = lastDay.getDate();
    const startingDay = firstDay.getDay();

    this.GetDoctorCalendar();
        if(this.currentYear===new Date().getFullYear() && new Date().getMonth()-1===this.currentMonth-1)
    {
      this.disablenext=true
    }
    

    this.calendarDays = [];
    let dayCounter = 1;

    for (let i = 0; i < 6; i++) {
      const week: Array<number> = [];

      for (let j = 0; j < 7; j++) {
        if ((i === 0 && j < startingDay) || dayCounter > numDays) {
          week.push(0);
        } else {
          week.push(dayCounter);
          dayCounter++;
        }
      }

      this.calendarDays.push(week);
      if (dayCounter > numDays) {
        break;
      }
    }
   

    
  }

  hasPreviousMonthClicked:boolean
  previousMonth() {
    if (!this.hasPreviousMonthClicked) {
      this.currentMonth--;
      if (this.currentMonth < 0) {
        this.currentMonth = 11;
        this.currentYear--;
      }
      this.generateCalendar();
      this.disablenext=false
      this.hasPreviousMonthClicked = true;
  
     
    }
  }
  
  

  nextMonth() {
    this.currentMonth++; 
    if (this.currentMonth > 11) {
      this.currentMonth = 0;
      this.currentYear++;
    }
    this.generateCalendar();
    this.hasPreviousMonthClicked = false
  }
  totalAbsent:any;
  totalConsultation:any;
  GetDoctorCalendarData:any;
  GetDoctorCalendar(){
    this.loading=true;
    let month=this.currentMonth+1;
    let year=this.currentYear;
   
    let AssignedDoctorID=this.svcLocalstorage.GetData(environment.doctorID);
    this.svcdoctor.GetDoctorCalendar(month,year,AssignedDoctorID).subscribe(data=>{
     this.GetDoctorCalendarData=data;
     this.loading=false;
     console.log(this.GetDoctorCalendarData);
     this.totalConsultation = this.GetDoctorCalendarData.reduce((total, item) => total + item.totalConsultation, 0);
     this.totalAbsent = this.GetDoctorCalendarData.reduce((total, item) => total + item.totalAbsent, 0);

    })
  }

  public getEventsForDay(day: number) {
    return this.GetDoctorCalendarData.filter(event => event.adate === day) ||[];
  }


 
}
