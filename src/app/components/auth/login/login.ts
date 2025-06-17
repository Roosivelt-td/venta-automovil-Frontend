//login.ts
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth';
import { FormsModule } from '@angular/forms';
import {CommonModule} from '@angular/common';
import {HttpClientModule} from '@angular/common/http';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule, HttpClientModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class LoginComponent {
  credentials = {
    username: '',
    password: ''
  };
  errorMessage = '';
  isLoading = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    //private snackBar: MatSnackBar // Opcional: para mostrar mensajes
    ) { }

  onSubmit(): void {
    if (!this.credentials.username || !this.credentials.password) {
      this.errorMessage = 'Por favor, complete todos los campos';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    this.authService.login(this.credentials)
      .subscribe({
        next: (response) => {
          console.log('Login exitoso');
          this.isLoading = false;
          this.router.navigate(['/dashboard']);
        },
        error: (error) => {
          this.isLoading = false;
          console.error('Error en el login:', error);
          this.errorMessage = 'Error al iniciar sesión. Por favor, verifique sus credenciales.';
        }
      });
  }



  navigateToRegister() {
    this.router.navigate(['/register']);
  }
  navigateToForgotPassword() {
    this.router.navigate(['/forgot-password']);
  }
    navigateToDashboard() {
      this.router.navigate(['/dashboard']);}
}
