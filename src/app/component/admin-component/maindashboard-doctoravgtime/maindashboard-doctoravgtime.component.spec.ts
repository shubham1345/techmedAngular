import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaindashboardDoctoravgtimeComponent } from './maindashboard-doctoravgtime.component';

describe('MaindashboardDoctoravgtimeComponent', () => {
  let component: MaindashboardDoctoravgtimeComponent;
  let fixture: ComponentFixture<MaindashboardDoctoravgtimeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MaindashboardDoctoravgtimeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MaindashboardDoctoravgtimeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
