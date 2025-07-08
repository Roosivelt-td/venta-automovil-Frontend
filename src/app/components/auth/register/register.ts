import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../services/auth';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './register.html',
  styleUrl: './register.css'
})
export class RegisterComponent {
  registerData = {
    username: '',
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    sexo: '',
    direccion: '',
    celular: '',
    termsAccepted: false
  };

  showPassword = false;
  isLoading = false;
  errorMessage = '';

  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  onSubmit() {
    if (!this.registerData.termsAccepted) {
      this.errorMessage = 'Debes aceptar los términos y condiciones';
      return;
    }

    if (!this.registerData.username) {
      this.registerData.username = this.registerData.email; // Usar email como username por defecto
    }

    this.isLoading = true;
    this.errorMessage = '';

    // Preparar datos para el backend
    const registerRequest = {
      username: this.registerData.username,
      password: this.registerData.password,
      email: this.registerData.email,
      nombre: this.registerData.firstName,
      apellido: this.registerData.lastName,
      sexo: this.registerData.sexo,
      direccion: this.registerData.direccion,
      celular: this.registerData.celular
    };

    // Llamar al servicio de registro
    this.authService.register(registerRequest).subscribe({
      next: (response) => {
        console.log('Usuario registrado exitosamente:', response);
        this.isLoading = false;
        // Redirigir al login con mensaje de éxito
        this.router.navigate(['/login'], { 
          queryParams: { message: 'Usuario registrado exitosamente. Por favor inicia sesión.' }
        });
      },
      error: (error) => {
        console.error('Error al registrar usuario:', error);
        this.isLoading = false;
        this.errorMessage = error.error?.message || 'Error al registrar usuario. Por favor, inténtalo de nuevo.';
      }
    });
  }

  navigateToLogin() {
    this.router.navigate(['/login']);
  }
}
