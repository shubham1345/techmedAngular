import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsultationcalendarComponent } from './consultationcalendar.component';

describe('ConsultationcalendarComponent', () => {
  let component: ConsultationcalendarComponent;
  let fixture: ComponentFixture<ConsultationcalendarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConsultationcalendarComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConsultationcalendarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
