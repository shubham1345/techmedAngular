import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SysAdminHeaderComponent } from './sys-admin-header.component';

describe('SysAdminHeaderComponent', () => {
  let component: SysAdminHeaderComponent;
  let fixture: ComponentFixture<SysAdminHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SysAdminHeaderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SysAdminHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
