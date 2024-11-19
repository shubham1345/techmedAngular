import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaindashboardPhcloginComponent } from './maindashboard-phclogin.component';

describe('MaindashboardPhcloginComponent', () => {
  let component: MaindashboardPhcloginComponent;
  let fixture: ComponentFixture<MaindashboardPhcloginComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MaindashboardPhcloginComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MaindashboardPhcloginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
