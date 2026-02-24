import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { TokenService } from './token.service';

export const AuthInterceptorService: HttpInterceptorFn = (req, next) => {
  const tokenService = inject(TokenService);
  const router = inject(Router);
  const token = tokenService.getToken();

  if (req.url.includes('/auth/login') || req.url.includes('/auth/register')) {
    return next(req);
  }

  let authReq = req;
  if (token) {
    authReq = req.clone({
      setHeaders: { Authorization: `Bearer ${token}` }
    });
  }

  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401 || error.status === 403) {
        tokenService.removeToken();
        router.navigate(['/auth']);
      }
      return throwError(() => error);
    })
  );
};