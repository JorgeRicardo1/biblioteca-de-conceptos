import { TestBed } from '@angular/core/testing';

import { MenuEntriesService } from './menu-entries.service';

describe('MenuEntriesService', () => {
  let service: MenuEntriesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MenuEntriesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
