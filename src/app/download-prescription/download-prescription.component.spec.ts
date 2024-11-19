import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DownloadPrescriptionComponent } from './download-prescription.component';

describe('DownloadPrescriptionComponent', () => {
  let component: DownloadPrescriptionComponent;
  let fixture: ComponentFixture<DownloadPrescriptionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DownloadPrescriptionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DownloadPrescriptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
