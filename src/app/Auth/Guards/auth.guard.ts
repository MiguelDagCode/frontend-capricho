import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { TokenService } from '../Services/token.service'; 

export const AuthGuard: CanActivateFn = (route, state) => {
  const tokenService = inject(TokenService);
  const router = inject(Router);

  // 1. Verificamos si hay token y si NO está expirado
  if (tokenService.getToken() && !tokenService.isTokenExpired()) {
    return true; // ¡Adelante, puedes pasar!
  } else {
    // 2. Si no hay token o ya caducó, lo mandamos a loguearse
    console.warn('Acceso denegado: Por favor inicia sesión.');
    router.navigate(['/auth']);
    return false; // Bloqueamos la ruta original
  }
};