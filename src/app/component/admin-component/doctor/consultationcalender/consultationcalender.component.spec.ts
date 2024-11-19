import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsultationcalenderComponent } from './consultationcalender.component';

describe('ConsultationcalenderComponent', () => {
  let component: ConsultationcalenderComponent;
  let fixture: ComponentFixture<ConsultationcalenderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConsultationcalenderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConsultationcalenderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
