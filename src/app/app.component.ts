import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from './Auth/Services/auth.service';
import { TokenService } from './Auth/Services/token.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'capricho-dulce-frontend';

  isLoggedIn$: Observable<boolean>;
  userEmail: string | null = '';

  // true cuando el usuario logueado tiene rol PASTELERO
  esPastelero: boolean = false;

  constructor(
    private authService: AuthService,
    private tokenService: TokenService
  ) {
    this.isLoggedIn$ = this.authService.isLoggedIn$;
  }

  ngOnInit(): void {
    this.isLoggedIn$.subscribe(isLoggedIn => {
      if (isLoggedIn) {
        this.userEmail  = this.tokenService.getUserName();
        // Leemos el rol del JWT y activamos la bandera
        const rol = this.tokenService.getUserRole();
        this.esPastelero = rol === 'PASTELERO';
      } else {
        this.userEmail   = null;
        this.esPastelero = false;
      }
    });
  }

  logout(): void {
    this.authService.logout();
  }
}