//login.ts
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
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
export class LoginComponent implements OnInit {
  credentials = {
    username: '',
    password: ''
  };
  errorMessage = '';
  successMessage = '';
  isLoading = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
    ) { }

  ngOnInit() {
    // Verificar si hay mensaje de éxito en los query params
    this.route.queryParams.subscribe(params => {
      if (params['message']) {
        this.successMessage = params['message'];
        // Limpiar el mensaje después de 5 segundos
        setTimeout(() => {
          this.successMessage = '';
        }, 5000);
      }
    });
  }

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
          // Redirigir automáticamente al dashboard
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
    this.router.navigate(['/dashboard']);
  }
}
