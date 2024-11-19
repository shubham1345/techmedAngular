import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SysSystemHealthComponent } from './sys-system-health.component';

describe('SysSystemHealthComponent', () => {
  let component: SysSystemHealthComponent;
  let fixture: ComponentFixture<SysSystemHealthComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SysSystemHealthComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SysSystemHealthComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
