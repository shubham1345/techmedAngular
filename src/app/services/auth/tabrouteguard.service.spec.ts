import { TestBed } from '@angular/core/testing';

import { TabrouteguardService } from './tabrouteguard.service';

describe('TabrouteguardService', () => {
  let service: TabrouteguardService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TabrouteguardService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
