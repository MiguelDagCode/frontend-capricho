import { TestBed } from '@angular/core/testing';

import { HttpInterceptorFn } from '@angular/common/http';
import { AuthInterceptorService } from './auth-interceptor.service';

describe('authInterceptor', () => {
  const interceptor: HttpInterceptorFn = (req, next) => 
    TestBed.runInInjectionContext(() => AuthInterceptorService(req, next));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(interceptor).toBeTruthy();
  });
});
