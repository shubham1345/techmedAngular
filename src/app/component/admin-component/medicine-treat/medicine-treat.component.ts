import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Component, ElementRef, EventEmitter, Output, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatChip, MatChipInputEvent } from '@angular/material/chips';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { SvcPhcGetPatientService } from 'src/app/services/services/svc-phc-get-patient.service';
import { SvclocalstorageService } from 'src/app/services/services/svclocalstorage.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-medicine-treat',
  templateUrl: './medicine-treat.component.html',
  styleUrls: ['./medicine-treat.component.css']
})
export class MedicineTreatComponent {
  @Output() medicinelist = new EventEmitter<string>();
  separatorKeysCodes: number[] = [ENTER, COMMA];
  fruitCtrl = new FormControl();
  filteredFruits: any
  fruits: any = [];
  isMorning = false
  isNoon = false
  isnight = false
  isemptyStomach = false
  isafterMeal = false
  isod = false
  isbd = false
  istd = false
  //allFruits: string[] = ['Combiflam', 'paracetamol', 'enterQuenel', 'crocin', 'pain'];

  @ViewChild('fruitInput') fruitInput: ElementRef<HTMLInputElement>;

  constructor(private svcLocalstorage: SvclocalstorageService, private SvcPhcPatient: SvcPhcGetPatientService) {
    this.GetDrugList()
    this.filteredFruits = this.fruitCtrl.valueChanges.pipe(
      startWith(null),
      map((fruit: string | null) => (fruit ? this._filter(fruit) : this.drugList.slice())),

    );
  }
  errorshowlimit: any
  add(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();

    // Add our fruit
    if (this.fruits.length > 10) {
      this.errorshowlimit = "More than 10 is not allowed"
      //  return false
      alert(this.errorshowlimit)

    }
    if (value) {
      this.fruits.push(value);
       this.medicinelist.emit(this.fruits)
    }

    // Clear the input value
    event.chipInput!.clear();

    this.fruitCtrl.setValue(null);
  }

  remove(fruit: string): void {
    const index = this.fruits.indexOf(fruit);

    if (index >= 0) {
      this.fruits.splice(index, 1);
      this.medicinelist.emit(this.fruits)

    }
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    this.fruits.push(event.option.viewValue);
    this.fruitInput.nativeElement.value = '';
    this.fruitCtrl.setValue(null);
    
  }

  private _filter(value: string): string[] {
    
    const filterValue = value.toLowerCase();

    return this.drugList.filter(fruit => fruit.name.toLowerCase().includes(filterValue));
  }

  userObjFromToken: any
  drugList: any = []
  GetDrugList() {
    this.userObjFromToken = this.svcLocalstorage.GetData(environment.AuthTokenKeyLSKey);
    if (this.userObjFromToken) {
      this.SvcPhcPatient.GetMedicineTest().subscribe(data => {
        this.drugList = data
     //   this.medicinelist.emit(this.filteredFruits)
        console.log(data)
        console.log(this.filteredFruits)

      })

    }
  }
  saveMedicine(){
   // this.selected()
   //alert("sdd")
  }
  onSelected($event){

  }
}