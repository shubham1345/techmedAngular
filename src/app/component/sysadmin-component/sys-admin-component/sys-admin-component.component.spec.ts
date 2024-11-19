import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SysAdminComponentComponent } from './sys-admin-component.component';

describe('SysAdminComponentComponent', () => {
  let component: SysAdminComponentComponent;
  let fixture: ComponentFixture<SysAdminComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SysAdminComponentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SysAdminComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
