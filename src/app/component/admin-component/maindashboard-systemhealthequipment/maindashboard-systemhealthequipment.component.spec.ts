import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaindashboardSystemhealthequipmentComponent } from './maindashboard-systemhealthequipment.component';

describe('MaindashboardSystemhealthequipmentComponent', () => {
  let component: MaindashboardSystemhealthequipmentComponent;
  let fixture: ComponentFixture<MaindashboardSystemhealthequipmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MaindashboardSystemhealthequipmentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MaindashboardSystemhealthequipmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
