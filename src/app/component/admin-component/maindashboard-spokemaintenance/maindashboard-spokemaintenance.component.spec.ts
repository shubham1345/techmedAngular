import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaindashboardSpokemaintenanceComponent } from './maindashboard-spokemaintenance.component';

describe('MaindashboardSpokemaintenanceComponent', () => {
  let component: MaindashboardSpokemaintenanceComponent;
  let fixture: ComponentFixture<MaindashboardSpokemaintenanceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MaindashboardSpokemaintenanceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MaindashboardSpokemaintenanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
