import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrphanCaseFileQueueComponent } from './orphan-case-file-queue.component';

describe('OrphanCaseFileQueueComponent', () => {
  let component: OrphanCaseFileQueueComponent;
  let fixture: ComponentFixture<OrphanCaseFileQueueComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OrphanCaseFileQueueComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OrphanCaseFileQueueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
