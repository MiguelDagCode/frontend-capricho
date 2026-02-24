import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { TokenService } from '../Services/token.service';

export const roleGuard: CanActivateFn = (route, state) => {
  const tokenService = inject(TokenService);
  const router = inject(Router);
  
  // Leemos qué roles están permitidos para esta ruta (lo configuraremos en app.routes.ts)
  const expectedRoles = route.data['roles'] as Array<string>;
  
  // Extraemos el rol del token del usuario actual
  const userRole = tokenService.getUserRole();

  // 1. Verificamos si no está logueado
  if (!tokenService.getToken() || tokenService.isTokenExpired()) {
    router.navigate(['/auth']);
    return false;
  }

  // 2. Verificamos si su rol está en la lista de permitidos
  if (userRole && expectedRoles.includes(userRole)) {
    return true; // ¡Adelante!
  } else {
    // Si es un cliente intentando entrar al admin, lo pateamos al inicio
    console.warn('Acceso denegado: No tienes el rol necesario.');
    router.navigate(['/']); 
    return false;
  }
};