import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MedicineTreatComponent } from './medicine-treat.component';

describe('MedicineTreatComponent', () => {
  let component: MedicineTreatComponent;
  let fixture: ComponentFixture<MedicineTreatComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MedicineTreatComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MedicineTreatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
