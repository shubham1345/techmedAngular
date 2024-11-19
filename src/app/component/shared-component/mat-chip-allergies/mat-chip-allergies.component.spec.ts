import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MatChipAllergiesComponent } from './mat-chip-allergies.component';

describe('MatChipAllergiesComponent', () => {
  let component: MatChipAllergiesComponent;
  let fixture: ComponentFixture<MatChipAllergiesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MatChipAllergiesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MatChipAllergiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
