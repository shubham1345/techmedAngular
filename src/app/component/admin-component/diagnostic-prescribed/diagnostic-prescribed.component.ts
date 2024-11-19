import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Component, ElementRef, EventEmitter, Output, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatChipInputEvent } from '@angular/material/chips';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { SvcPhcGetPatientService } from 'src/app/services/services/svc-phc-get-patient.service';
import { SvclocalstorageService } from 'src/app/services/services/svclocalstorage.service';
import { environment } from 'src/environments/environment';


@Component({
  selector: 'app-diagnostic-prescribed',
  templateUrl: './diagnostic-prescribed.component.html',
  styleUrls: ['./diagnostic-prescribed.component.css']
})
export class DiagnosticPrescribedComponent {
  @Output() diagnosticTest = new EventEmitter<string>();

  separatorKeysCodes: number[] = [ENTER, COMMA];
  fruitCtrl = new FormControl();
  filteredFruits: any
  fruits: any = [];

  @ViewChild('fruitInput') fruitInput: ElementRef<HTMLInputElement>;

  constructor(private svcLocalstorage: SvclocalstorageService , private SvcPhcPatient: SvcPhcGetPatientService) {
    this.GetDiagnosticTest()
    this.filteredFruits = this.fruitCtrl.valueChanges.pipe(
      startWith(null),
      map((fruit: string | null) => (fruit ? this._filter(fruit) : this.diagnostictest.slice())),
     
    );
  }

  add(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();

    // Add our fruit
    if(this.fruits.length >  10){
      
    }
    if (value) {
      this.fruits.push(value);
      this.diagnosticTest.emit(this.fruits)
    }

    // Clear the input value
    event.chipInput!.clear();

    this.fruitCtrl.setValue(null);
  }

  remove(fruit: string): void {
    const index = this.fruits.indexOf(fruit);

    if (index >= 0) {
      this.fruits.splice(index, 1);
      this.diagnosticTest.emit(this.fruits)

    }
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    this.fruits.push(event.option.viewValue);
    this.fruitInput.nativeElement.value = '';
    this.fruitCtrl.setValue(null);
  }

  private _filter(value: string): string[] {
    
    const filterValue = value.toLowerCase();

    return this.diagnostictest.filter(fruit => fruit.name.toLowerCase().includes(filterValue));
  }

  userObjFromToken: any
  diagnostictest: any = []
  GetDiagnosticTest() {
    this.userObjFromToken = this.svcLocalstorage.GetData(environment.AuthTokenKeyLSKey);
    if (this.userObjFromToken) {
      this.SvcPhcPatient.GetDiagnosticTest().subscribe(data =>{
        this.diagnostictest = data
        console.log(data)
        console.log(this.filteredFruits)

      })

    }
  }
}