import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChcCenterComponent } from './chc-center.component';

describe('ChcCenterComponent', () => {
  let component: ChcCenterComponent;
  let fixture: ComponentFixture<ChcCenterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChcCenterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChcCenterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
