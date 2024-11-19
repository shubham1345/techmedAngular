import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FilepopupComponent } from './filepopup.component';

describe('FilepopupComponent', () => {
  let component: FilepopupComponent;
  let fixture: ComponentFixture<FilepopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FilepopupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FilepopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
