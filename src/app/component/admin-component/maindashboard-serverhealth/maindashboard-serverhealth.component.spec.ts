import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaindashboardServerhealthComponent } from './maindashboard-serverhealth.component';

describe('MaindashboardServerhealthComponent', () => {
  let component: MaindashboardServerhealthComponent;
  let fixture: ComponentFixture<MaindashboardServerhealthComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MaindashboardServerhealthComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MaindashboardServerhealthComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
