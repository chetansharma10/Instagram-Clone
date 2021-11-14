import { TestBed } from '@angular/core/testing';

import { AccessAuthGuard } from './access-auth.guard';

describe('AccessAuthGuard', () => {
  let guard: AccessAuthGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(AccessAuthGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
