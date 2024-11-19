import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaindashboardPhcManpowerComponent } from './maindashboard-phc-manpower.component';

describe('MaindashboardPhcManpowerComponent', () => {
  let component: MaindashboardPhcManpowerComponent;
  let fixture: ComponentFixture<MaindashboardPhcManpowerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MaindashboardPhcManpowerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MaindashboardPhcManpowerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
