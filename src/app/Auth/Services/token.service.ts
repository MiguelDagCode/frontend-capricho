import { Injectable } from '@angular/core';
import { jwtDecode } from 'jwt-decode';

const TOKEN_KEY = 'auth-token';

@Injectable({
  providedIn: 'root'
})
export class TokenService {

  constructor() { }

  public setToken(token: string): void {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.setItem(TOKEN_KEY, token);
  }

  public getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  }

  public removeToken(): void {
    localStorage.removeItem(TOKEN_KEY);
  }

  // Nuevo: Obtener el Rol directamente del token
  public getUserRole(): string | null {
    const token = this.getToken();
    if (!token) return null;
    
    try {
      const decoded: any = jwtDecode(token);
      // Ajusta esto según cómo venga en tu backend (rol, role, authorities, etc)
      return decoded.rol || decoded.role || null; 
    } catch (e) {
      return null;
    }
  }

  // Nuevo: Obtener nombre de usuario o email del token
  public getUserName(): string | null {
    const token = this.getToken();
    if (!token) return null;
    try {
      const decoded: any = jwtDecode(token);
      return decoded.sub || decoded.nombre || null; // 'sub' es el estándar para el username/email
    } catch (e) {
      return null;
    }
  }

  // Nuevo: Verificar si el token ha expirado
  public isTokenExpired(): boolean {
    const token = this.getToken();
    if (!token) return true;

    try {
      const decoded: any = jwtDecode(token);
      const expirationDate = decoded.exp * 1000; // JWT viene en segundos, JS usa milisegundos
      return new Date().getTime() > expirationDate;
    } catch (e) {
      return true;
    }
  }
}