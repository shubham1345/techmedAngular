import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaindashboardSystemhealthserverComponent } from './maindashboard-systemhealthserver.component';

describe('MaindashboardSystemhealthserverComponent', () => {
  let component: MaindashboardSystemhealthserverComponent;
  let fixture: ComponentFixture<MaindashboardSystemhealthserverComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MaindashboardSystemhealthserverComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MaindashboardSystemhealthserverComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
