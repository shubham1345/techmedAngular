import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeletePendingCasesComponent } from './delete-pending-cases.component';

describe('DeletePendingCasesComponent', () => {
  let component: DeletePendingCasesComponent;
  let fixture: ComponentFixture<DeletePendingCasesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeletePendingCasesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeletePendingCasesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
