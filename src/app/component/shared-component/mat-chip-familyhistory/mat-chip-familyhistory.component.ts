import { Component, OnInit } from '@angular/core';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatChipInputEvent } from '@angular/material/chips';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { COMMA, ENTER } from '@angular/cdk/keycodes';


export interface genetic {
  name: string;
}
@Component({
  selector: 'app-mat-chip-familyhistory',
  templateUrl: './mat-chip-familyhistory.component.html',
  styleUrls: ['./mat-chip-familyhistory.component.css']
})
export class MatChipFamilyhistoryComponent implements OnInit {


  readonly separatorKeysCodes = [ENTER, COMMA] as const;


  /*observation*/
  addOnBlur = true;
  genetics: genetic[] = [{ name: 'Chest Pain, Back ache.' }];

  constructor() { }

  ngOnInit(): void {
  }

  addgenetic(e: MatChipInputEvent){
    const value = (e.value || '').trim();
    if (value) {
      this.genetics.push({ name: value });
    }
    e.chipInput!.clear();
  }



  remove(fruit: genetic): void {
    const genindex = this.genetics.indexOf(fruit);

   
    if (genindex >= 0) {
      this.genetics.splice(genindex, 1);
    }
  }
}
