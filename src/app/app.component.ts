import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from './Auth/Services/auth.service';
import { TokenService } from './Auth/Services/token.service';
import { CarroService } from './Services/Carro/carro-service.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  totalItemsEnCarrito$: Observable<number>;

  title = 'capricho-dulce-frontend';
  
  // Variable reactiva para saber si está logueado
  isLoggedIn$: Observable<boolean>;
  userRole: string | null = null;
  // Variable para guardar el correo a mostrar
  userEmail: string | null = '';
  constructor(
    private authService: AuthService,
    private tokenService: TokenService,
    private carroService: CarroService
  ) {
    // Escuchamos el estado global de la autenticación
    this.isLoggedIn$ = this.authService.isLoggedIn$;
    this.totalItemsEnCarrito$ = this.carroService.getTotalItems();
  }

  ngOnInit(): void {
    // Cada vez que el estado cambie (entra o sale), actualizamos el correo
    this.isLoggedIn$.subscribe(isLoggedIn => {
      if (isLoggedIn) {
        this.userEmail = this.tokenService.getUserName();
        this.userRole = this.tokenService.getUserRole(); // <-- Guardamos el rol
      } else {
        this.userEmail = null;
        this.userRole = null;
      }
    });
  }

  // Método que llamaremos desde el HTML
  logout(): void {
    this.authService.logout();
  
  }
  
}