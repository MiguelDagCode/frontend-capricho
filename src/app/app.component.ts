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

  isLoggedIn$: Observable<boolean>;
  
  // Tu estructura base (La mejor forma)
  userRole: string | null = null;
  userEmail: string | null = '';
  
  // La variable de tu compañero (La mantenemos para no romper su HTML)
  esPastelero: boolean = false;

  constructor(
    private authService: AuthService,
    private tokenService: TokenService,
    private carroService: CarroService
  ) {
    this.isLoggedIn$ = this.authService.isLoggedIn$;
    this.totalItemsEnCarrito$ = this.carroService.getTotalItems();
  }

  ngOnInit(): void {
    this.isLoggedIn$.subscribe(isLoggedIn => {
      if (isLoggedIn) {
        this.userEmail = this.tokenService.getUserName();
        this.userRole = this.tokenService.getUserRole(); // Guardamos el rol global
        
        // Alimentamos su bandera usando tu estructura
        this.esPastelero = this.userRole === 'PASTELERO'; 
      } else {
        this.userEmail = null;
        this.userRole = null;
        this.esPastelero = false;
      }
    });
  }

  logout(): void {
    this.authService.logout();
  }
}