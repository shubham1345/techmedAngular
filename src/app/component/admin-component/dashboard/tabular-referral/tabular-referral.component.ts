import { Component, OnInit } from '@angular/core';

export interface PeriodicElement {
  name: number;
  position: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  {position: 'PHC Vijay Nagar' , name: 1000},
  {position: 'PHC Vijay Nagar' , name: 1000},
  {position: 'PHC Vijay Nagar' , name: 1000},
  {position: 'PHC Vijay Nagar' , name: 1000},
  {position: 'PHC Vijay Nagar' , name: 1000},
  {position: 'PHC Vijay Nagar' , name: 1000},
  {position: 'PHC Vijay Nagar' , name: 1000},
  {position: 'PHC Vijay Nagar' , name: 1000},
  {position: 'PHC Vijay Nagar' , name: 1000},
  {position: 'PHC Vijay Nagar' , name: 1000},
  {position: 'PHC Vijay Nagar' , name: 1000},
  {position: 'PHC Vijay Nagar' , name: 1000},
  {position: 'PHC Vijay Nagar' , name: 1000},
  {position: 'PHC Vijay Nagar' , name: 1000},
  {position: 'PHC Vijay Nagar' , name: 1000},
  {position: 'PHC Vijay Nagar' , name: 1000},
];

@Component({
  selector: 'app-tabular-referral',
  templateUrl: './tabular-referral.component.html',
  styleUrls: ['./tabular-referral.component.css']
})
export class TabularReferralComponent implements OnInit {
  displayedColumns: string[] = ['position', 'name'];
  dataSource = ELEMENT_DATA;
  
  constructor() { }

  ngOnInit() {
  }

}
