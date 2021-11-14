import { TestBed } from '@angular/core/testing';

import { ShowHideService } from './show-hide.service';

describe('ShowHideService', () => {
  let service: ShowHideService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ShowHideService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
