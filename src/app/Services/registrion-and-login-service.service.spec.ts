import { TestBed } from '@angular/core/testing';

import { RegistrionAndLoginServiceService } from './registrion-and-login-service.service';

describe('RegistrionAndLoginServiceService', () => {
  let service: RegistrionAndLoginServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RegistrionAndLoginServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
