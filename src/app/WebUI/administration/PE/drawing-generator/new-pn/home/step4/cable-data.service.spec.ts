import { TestBed } from '@angular/core/testing';

import { CableDataService } from './cable-data.service';

describe('CableDataService', () => {
  let service: CableDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CableDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
