import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SysHolidayCalendarComponent } from './sys-holiday-calendar.component';

describe('SysHolidayCalendarComponent', () => {
  let component: SysHolidayCalendarComponent;
  let fixture: ComponentFixture<SysHolidayCalendarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SysHolidayCalendarComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SysHolidayCalendarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
