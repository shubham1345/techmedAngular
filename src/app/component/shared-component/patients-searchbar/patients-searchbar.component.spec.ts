import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PatientsSearchbarComponent } from './patients-searchbar.component';

describe('PatientsSearchbarComponent', () => {
  let component: PatientsSearchbarComponent;
  let fixture: ComponentFixture<PatientsSearchbarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PatientsSearchbarComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PatientsSearchbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
