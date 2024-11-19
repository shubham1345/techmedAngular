import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatChipInputEvent } from '@angular/material/chips';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-matchip-list-auto',
  templateUrl: './matchip-list-auto.component.html',
  styleUrls: ['./matchip-list-auto.component.css']
})
export class MatchipListAutoComponent implements OnInit {
  addOnBlur = true;
 separatorKeysCodes1 = [ENTER, COMMA] as const;
  csCtrl = new FormControl();
  filteredCS: Observable<string[]>;
  complaintsymptoms: string[] = ['Chest Pain, Back ache.'];
  allCS: string[] = ['Chest Pain, Back ache.', 'The paitient informed about slipping and falling on his back a week ago'];
  /* Chest Pain, Back ache. The paitient informed about slipping and falling on his back a week ago. */

  @ViewChild('csInput') csInput!: ElementRef<HTMLInputElement>

  constructor() {
    this.filteredCS = this.csCtrl.valueChanges.pipe(
      startWith(null),
      map((fruit: string | null) => (fruit ? this._filter(fruit) : this.allCS.slice())),
    );
   }

  ngOnInit(): void {
  }

  addcs(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();

    // Add our fruit
    if (value) {
      this.complaintsymptoms.push(value);
    }

    // Clear the input value
    event.chipInput!.clear();

    this.csCtrl.setValue(null);
  }


  removecs(fruit: string): void {
    const index = this.complaintsymptoms.indexOf(fruit);

    if (index >= 0) {
      this.complaintsymptoms.splice(index, 1);
    }
  }

  selectedcs(event: MatAutocompleteSelectedEvent): void {
    this.complaintsymptoms.push(event.option.viewValue);
    this.csInput.nativeElement.value = '';
    this.csCtrl.setValue(null);
  }
  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.allCS.filter(fruit => fruit.toLowerCase().includes(filterValue));
  }


}
