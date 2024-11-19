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
  selector: 'app-tabular-video-consultation',
  templateUrl: './tabular-video-consultation.component.html',
  styleUrls: ['./tabular-video-consultation.component.css']
})
export class TabularVideoConsultationComponent implements OnInit {
  displayedColumns: string[] = ['position', 'name'];
  dataSource = ELEMENT_DATA;
  constructor() { }

  ngOnInit() {
  }

}
