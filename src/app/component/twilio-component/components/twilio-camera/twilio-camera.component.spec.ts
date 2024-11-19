import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TwilioCameraComponent } from './twilio-camera.component';

describe('TwilioCameraComponent', () => {
  let component: TwilioCameraComponent;
  let fixture: ComponentFixture<TwilioCameraComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TwilioCameraComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TwilioCameraComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
