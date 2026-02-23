import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { TokenService } from './token.service';
import { Router } from '@angular/router';
import { LoginRequest } from '../Interface/LoginRequest';
import { LoginResponse } from '../Interface/LoginResponse';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = 'http://localhost:8080/api/auth';
  private isLoggedInSubject = new BehaviorSubject<boolean>(false);
  public isLoggedIn$ = this.isLoggedInSubject.asObservable();

  constructor(
    private http: HttpClient,
    private tokenService: TokenService,
    private router: Router
  ) { 
    this.isLoggedInSubject.next(!this.tokenService.isTokenExpired());
  }
  
login(credentials: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, credentials).pipe(
      tap((response) => {
        // ¡CORRECCIÓN AQUÍ! Entramos a response.data.token
        this.tokenService.setToken(response.data.token);
        this.isLoggedInSubject.next(true); 
      })
    );
  }

  logout(): void {
    this.tokenService.removeToken();
    this.isLoggedInSubject.next(false);
    this.router.navigate(['/login']);
  }

  // Método auxiliar para redireccionar según rol
  redirectBasedOnRole(): void {
    const role = this.tokenService.getUserRole();
    switch (role) {
      case 'CLIENTE': this.router.navigate(['/menu-cliente']); break;
      case 'PASTELERO': this.router.navigate(['/mozo-menu']); break;
      case 'ADMIN': this.router.navigate(['/cajero-menu']); break;
      default: this.router.navigate(['']); 
    }
  }
}