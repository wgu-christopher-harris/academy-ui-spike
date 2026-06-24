import { TestBed } from '@angular/core/testing';

import { BffHttpClient } from './bff-http-client';

describe('BffHttpClient', () => {
  let service: BffHttpClient;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BffHttpClient);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
