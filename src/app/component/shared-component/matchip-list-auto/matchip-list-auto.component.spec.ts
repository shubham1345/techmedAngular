import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MatchipListAutoComponent } from './matchip-list-auto.component';

describe('MatchipListAutoComponent', () => {
  let component: MatchipListAutoComponent;
  let fixture: ComponentFixture<MatchipListAutoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MatchipListAutoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MatchipListAutoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
