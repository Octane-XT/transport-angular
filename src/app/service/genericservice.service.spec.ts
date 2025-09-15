import { TestBed } from '@angular/core/testing';

import { GenericService } from './genericservice.service';

describe('GenericserviceService', () => {
  let service: GenericService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GenericService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
