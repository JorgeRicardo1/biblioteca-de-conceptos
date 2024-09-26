import { TestBed } from '@angular/core/testing';

import { StylesServicesService } from './styles-services.service';

describe('StylesServicesService', () => {
  let service: StylesServicesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StylesServicesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
