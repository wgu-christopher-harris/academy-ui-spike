import { TestBed } from '@angular/core/testing';

import { EnrollmentCatalogService } from './enrollment-catalog.service';

describe('EnrollmentCatalogService', () => {
  let service: EnrollmentCatalogService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EnrollmentCatalogService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
