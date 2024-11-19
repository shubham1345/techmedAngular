import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaindashboardDiseaseprofilephcwiseComponent } from './maindashboard-diseaseprofilephcwise.component';

describe('MaindashboardDiseaseprofilephcwiseComponent', () => {
  let component: MaindashboardDiseaseprofilephcwiseComponent;
  let fixture: ComponentFixture<MaindashboardDiseaseprofilephcwiseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MaindashboardDiseaseprofilephcwiseComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MaindashboardDiseaseprofilephcwiseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
