import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportAccessComponent } from './report-access.component';

describe('ReportAccessComponent', () => {
  let component: ReportAccessComponent;
  let fixture: ComponentFixture<ReportAccessComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReportAccessComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportAccessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
