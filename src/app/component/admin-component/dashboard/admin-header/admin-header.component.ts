import { Component, OnInit } from '@angular/core';
import { faHome } from '@fortawesome/free-solid-svg-icons';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-header',
  templateUrl: './admin-header.component.html',
  styleUrls: ['./admin-header.component.css']
})


export class AdminHeaderComponent implements OnInit {
  faHome = faHome;
  constructor( private fb: FormBuilder, private router: Router) { }
 
  ngOnInit() {
   
  }
  tabularreport(){
    this.router.navigate(['tabular-completed-consultaion'])
  }

  Employeetraining(){
    this.router.navigate(['employee-training-detail'])
  }

  SystemHealthReport(){
    this.router.navigate(['system-health-report'])
  }
  SpokeMaintenance(){
    this.router.navigate(['spoke-maintenance'])
  }
  Holidaycalendar(){
    this.router.navigate(['holiday-calendar'])
    
  }
}
