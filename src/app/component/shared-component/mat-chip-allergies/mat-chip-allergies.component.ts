import { Component, OnInit } from '@angular/core';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatChipInputEvent } from '@angular/material/chips';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { COMMA, ENTER } from '@angular/cdk/keycodes';


export interface allergy {
  name: string;
}
@Component({
  selector: 'app-mat-chip-allergies',
  templateUrl: './mat-chip-allergies.component.html',
  styleUrls: ['./mat-chip-allergies.component.css']
})
export class MatChipAllergiesComponent implements OnInit {


  readonly separatorKeysCodes = [ENTER, COMMA] as const;


  addOnBlur = true;
  allergies: allergy[] = [{ name: 'Chest Pain, Back ache' }];
  constructor() { }

  ngOnInit(): void {
  }
  addallergy(e: MatChipInputEvent){
    const value = (e.value || '').trim();
    if (value) {
      this.allergies.push({ name: value });
    }
    e.chipInput!.clear();

  }
  remove(fruit: allergy): void {
    const allergindex = this.allergies.indexOf(fruit);
   

    if (allergindex >= 0) {
      this.allergies.splice(allergindex, 1);
    }
   
  }
 
}
