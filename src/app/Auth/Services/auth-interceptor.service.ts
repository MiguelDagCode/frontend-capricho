import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { TokenService } from './token.service';

export const AuthInterceptorService: HttpInterceptorFn = (req, next) => {
  console.error('🛑 INTERCEPTOR EJECUTÁNDOSE PARA:', req.url); // <--- TEST 1
  const tokenService = inject(TokenService);
  const router = inject(Router);
  const token = tokenService.getToken();
  console.error('🔑 TOKEN ENCONTRADO:', token); // <--- TEST 2

  // Excluir login/register para evitar bucles
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
        // Si el token expiró o no es válido, cerramos sesión a la fuerza
        tokenService.removeToken();
        router.navigate(['/login']);
      }
      return throwError(() => error);
    })
  );
};
