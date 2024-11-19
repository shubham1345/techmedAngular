import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PHCHRExecutiveProfileComponent } from './phc-hr-executive-profile.component';

describe('PHCHRExecutiveProfileComponent', () => {
  let component: PHCHRExecutiveProfileComponent;
  let fixture: ComponentFixture<PHCHRExecutiveProfileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PHCHRExecutiveProfileComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PHCHRExecutiveProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
