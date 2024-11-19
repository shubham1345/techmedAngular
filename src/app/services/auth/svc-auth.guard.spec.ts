import { TestBed } from '@angular/core/testing';

import { SvcAuthGuard } from './svc-auth.guard';

describe('SvcAuthGuard', () => {
  let guard: SvcAuthGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(SvcAuthGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
