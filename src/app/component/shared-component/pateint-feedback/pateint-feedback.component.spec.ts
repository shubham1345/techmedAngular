import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PateintFeedbackComponent } from './pateint-feedback.component';

describe('PateintFeedbackComponent', () => {
  let component: PateintFeedbackComponent;
  let fixture: ComponentFixture<PateintFeedbackComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PateintFeedbackComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PateintFeedbackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
