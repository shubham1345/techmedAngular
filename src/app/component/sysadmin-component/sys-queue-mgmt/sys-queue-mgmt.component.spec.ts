import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SysQueueMgmtComponent } from './sys-queue-mgmt.component';

describe('SysQueueMgmtComponent', () => {
  let component: SysQueueMgmtComponent;
  let fixture: ComponentFixture<SysQueueMgmtComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SysQueueMgmtComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SysQueueMgmtComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
