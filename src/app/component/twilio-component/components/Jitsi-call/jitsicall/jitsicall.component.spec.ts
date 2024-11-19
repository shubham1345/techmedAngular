import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JitsicallComponent } from './jitsicall.component';

describe('JitsicallComponent', () => {
  let component: JitsicallComponent;
  let fixture: ComponentFixture<JitsicallComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ JitsicallComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(JitsicallComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
