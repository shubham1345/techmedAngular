import { Component, OnInit } from '@angular/core';

export interface PeriodicElement {
  srno: string;
  date: string;
  name: string;
  ageSex: string;
  phc: string;
  technician: string;
  doctor: string;
  caseStatus: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  {srno: 'aaaa' , date: 'aaaaa' , name: 'Mr. Rajesh Kumar' , ageSex: 'Male' , phc: 'Vijay Nagar' , technician: 'Dr. John Doe' , doctor: 'Dr. John Doe', caseStatus: 'Closed'},
  {srno: 'aaaa' , date: 'aaaaa' , name: 'Mr. Rajesh Kumar' , ageSex: 'Male' , phc: 'Vijay Nagar' , technician: 'Dr. John Doe' , doctor: 'Dr. John Doe', caseStatus: 'Pending'},
  {srno: 'aaaa' , date: 'aaaaa' , name: 'Mr. Rajesh Kumar' , ageSex: 'Male' , phc: 'Vijay Nagar' , technician: 'Dr. John Doe' , doctor: 'Dr. John Doe', caseStatus: 'Closed'},
  {srno: 'aaaa' , date: 'aaaaa' , name: 'Mr. Rajesh Kumar' , ageSex: 'Male' , phc: 'Vijay Nagar' , technician: 'Dr. John Doe' , doctor: 'Dr. John Doe', caseStatus: 'Pending'},
  {srno: 'aaaa' , date: 'aaaaa' , name: 'Mr. Rajesh Kumar' , ageSex: 'Male' , phc: 'Vijay Nagar' , technician: 'Dr. John Doe' , doctor: 'Dr. John Doe', caseStatus: 'Closed'},
  {srno: 'aaaa' , date: 'aaaaa' , name: 'Mr. Rajesh Kumar' , ageSex: 'Male' , phc: 'Vijay Nagar' , technician: 'Dr. John Doe' , doctor: 'Dr. John Doe', caseStatus: 'Closed'},
  {srno: 'aaaa' , date: 'aaaaa' , name: 'Mr. Rajesh Kumar' , ageSex: 'Male' , phc: 'Vijay Nagar' , technician: 'Dr. John Doe' , doctor: 'Dr. John Doe', caseStatus: 'Closed'},
  {srno: 'aaaa' , date: 'aaaaa' , name: 'Mr. Rajesh Kumar' , ageSex: 'Male' , phc: 'Vijay Nagar' , technician: 'Dr. John Doe' , doctor: 'Dr. John Doe', caseStatus: 'Closed'},
  {srno: 'aaaa' , date: 'aaaaa' , name: 'Mr. Rajesh Kumar' , ageSex: 'Male' , phc: 'Vijay Nagar' , technician: 'Dr. John Doe' , doctor: 'Dr. John Doe', caseStatus: 'Closed'},
  {srno: 'aaaa' , date: 'aaaaa' , name: 'Mr. Rajesh Kumar' , ageSex: 'Male' , phc: 'Vijay Nagar' , technician: 'Dr. John Doe' , doctor: 'Dr. John Doe', caseStatus: 'Closed'},
  {srno: 'aaaa' , date: 'aaaaa' , name: 'Mr. Rajesh Kumar' , ageSex: 'Male' , phc: 'Vijay Nagar' , technician: 'Dr. John Doe' , doctor: 'Dr. John Doe', caseStatus: 'Closed'},
];

@Component({
  selector: 'app-tabular-patient-information',
  templateUrl: './tabular-patient-information.component.html',
  styleUrls: ['./tabular-patient-information.component.css']
})
export class TabularPatientInformationComponent implements OnInit {
  displayedColumns: string[] = ['srno', 'date', 'name', 'ageSex', 'phc', 'technician', 'doctor', 'caseStatus'];
  dataSource = ELEMENT_DATA;

  constructor() { }

  ngOnInit() {
  }

}
