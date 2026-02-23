import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../Services/auth.service';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-auth', // Asegúrate de que el nombre del selector coincida
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule], // Necesario RouterModule para el 'routerLink' de volver
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent {
  // Controla qué formulario se muestra
  isLoginMode: boolean = true;
  
  // Formularios
  loginForm: FormGroup;
  registerForm: FormGroup;
  
  // Estados de carga y error
  isLoading: boolean = false;
  errorMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService
  ) {
    // 1. Inicializamos el formulario de LOGIN
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(4)]]
    });

    // 2. Inicializamos el formulario de REGISTRO
    this.registerForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  // Método para alternar entre Login y Registro
  switchMode(): void {
    this.isLoginMode = !this.isLoginMode;
    this.errorMessage = ''; // Limpiamos errores al cambiar de pantalla
  }

  // Se ejecuta al dar clic en Iniciar Sesión
  onSubmitLogin(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    this.authService.login(this.loginForm.value).subscribe({
      next: (response) => {
        console.log('Login exitoso', response.mensaje);
        this.isLoading = false;
        this.authService.redirectBasedOnRole();
      },
      error: (err) => {
        this.isLoading = false;
        console.error('Error de login', err);
        this.errorMessage = err.error?.mensaje || 'Credenciales incorrectas o servidor caído.';
      }
    });
  }

  // Se ejecuta al dar clic en Registrarme
  onSubmitRegister(): void {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    
    console.log('Datos de registro listos para enviar al backend:', this.registerForm.value);
    
    // Aquí a futuro llamarás a: this.authService.register(this.registerForm.value).subscribe(...)
    
    // Simulación temporal:
    setTimeout(() => {
      this.isLoading = false;
      alert("Registro simulado con éxito. (Falta conectar al backend)");
      this.switchMode(); // Lo devolvemos al login
    }, 1500);
  }
}