import { AfterViewInit, Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-consultationcalender',
  templateUrl: './consultationcalender.component.html',
  styleUrls: ['./consultationcalender.component.css']
})
export class ConsultationcalenderComponent implements OnInit,AfterViewInit {

  currentMonth: number;
  currentYear: number;
  calendarDays: Array<Array<number>> | undefined;
  disablenext:boolean
  daysOfWeek=['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday']
  months= ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
 public events: { [key: number]: string[] };
 constructor() {
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
    if(this.currentYear===new Date().getFullYear() && new Date().getMonth()-1===this.currentMonth-1)
    {
      this.disablenext=true
    }
    this.generateCalendar();

    //throw new Error('Method not implemented.');

  }

  generateCalendar() {
    const firstDay = new Date(this.currentYear, this.currentMonth, 1);
    const lastDay = new Date(this.currentYear, this.currentMonth + 1, 0);
    const numDays = lastDay.getDate();
    const startingDay = firstDay.getDay();


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

  previousMonth() {
    this.currentMonth--;
    if (this.currentMonth < 0) {
      this.currentMonth = 11;
      this.currentYear--;
    }
    this.generateCalendar();
    this.disablenext=false
  }

  nextMonth() {
    this.currentMonth++; 
    if (this.currentMonth > 11) {
      this.currentMonth = 0;
      this.currentYear++;
    }
    this.generateCalendar();
  
  }

  public getEventsForDay(day: number): string[] {
    return this.events[day] || [];
  }
}
