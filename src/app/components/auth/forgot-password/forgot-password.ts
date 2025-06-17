import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../services/auth';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './forgot-password.html',
  styleUrl: './forgot-password.css'
})

export class ForgotPasswordComponent {
  email = '';
  message = '';
  isLoading = false;

  constructor(private authService: AuthService) {}

  onSubmit() {
    this.isLoading = true;
    this.authService.requestPasswordReset(this.email).subscribe({
      next: () => {
        this.message = 'Se ha enviado un correo con instrucciones para restablecer tu contraseña';
        this.isLoading = false;
      },
      error: () => {
        this.message = 'Error al solicitar el restablecimiento de contraseña';
        this.isLoading = false;
      }
    });
  }
}