import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrescriptionPreviewPdfComponent } from './prescription-preview-pdf.component';

describe('PrescriptionPreviewPdfComponent', () => {
  let component: PrescriptionPreviewPdfComponent;
  let fixture: ComponentFixture<PrescriptionPreviewPdfComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PrescriptionPreviewPdfComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PrescriptionPreviewPdfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
