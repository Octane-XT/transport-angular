import { TestBed } from '@angular/core/testing';

import { SuiviTransportService } from './suivi-transport.service';

describe('SuiviTransportService', () => {
  let service: SuiviTransportService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SuiviTransportService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
