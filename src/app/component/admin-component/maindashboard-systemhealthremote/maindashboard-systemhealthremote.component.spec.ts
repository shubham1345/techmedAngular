import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaindashboardSystemhealthremoteComponent } from './maindashboard-systemhealthremote.component';

describe('MaindashboardSystemhealthremoteComponent', () => {
  let component: MaindashboardSystemhealthremoteComponent;
  let fixture: ComponentFixture<MaindashboardSystemhealthremoteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MaindashboardSystemhealthremoteComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MaindashboardSystemhealthremoteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
