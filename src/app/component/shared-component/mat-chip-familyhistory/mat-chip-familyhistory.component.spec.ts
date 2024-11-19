import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MatChipFamilyhistoryComponent } from './mat-chip-familyhistory.component';

describe('MatChipFamilyhistoryComponent', () => {
  let component: MatChipFamilyhistoryComponent;
  let fixture: ComponentFixture<MatChipFamilyhistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MatChipFamilyhistoryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MatChipFamilyhistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
