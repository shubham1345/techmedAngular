import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrescriptionNotGeneratedByPhcsComponent } from './prescription-not-generated-by-phcs.component';

describe('PrescriptionNotGeneratedByPhcsComponent', () => {
  let component: PrescriptionNotGeneratedByPhcsComponent;
  let fixture: ComponentFixture<PrescriptionNotGeneratedByPhcsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PrescriptionNotGeneratedByPhcsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PrescriptionNotGeneratedByPhcsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
