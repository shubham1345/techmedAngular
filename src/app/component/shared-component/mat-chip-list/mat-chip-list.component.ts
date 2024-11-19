import { Component, OnInit } from '@angular/core';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatChipInputEvent } from '@angular/material/chips';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { COMMA, ENTER } from '@angular/cdk/keycodes';


export interface Fruit {
  name: string;
}
@Component({
  selector: 'app-mat-chip-list',
  templateUrl: './mat-chip-list.component.html',
  styleUrls: ['./mat-chip-list.component.css']
})
export class MatChipListComponent implements OnInit {
  observations: Fruit[] = [{ name: 'Chest Pain, Back ache.' }];
  readonly separatorKeysCodes = [ENTER, COMMA] as const;

  constructor() { }

  ngOnInit(): void {
  }
  add(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();
    //console.log(value)
    if (value) {
      this.observations.push({ name: value });
    }
    event.chipInput!.clear();

  }
  remove(fruit: Fruit): void {
    const index = this.observations.indexOf(fruit);

    if (index >= 0) {
      this.observations.splice(index, 1);
    }

  }
}

