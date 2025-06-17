import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../../services/auth';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './reset-password.html',
  styleUrl: './reset-password.css'
})
export class ResetPasswordComponent implements OnInit {
  token = '';
  newPassword = '';
  confirmPassword = '';
  message = '';
  isLoading = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.token = this.route.snapshot.params['token'] || '';
  }

  onSubmit() {
    if (this.newPassword !== this.confirmPassword) {
      this.message = 'Las contraseñas no coinciden';
      return;
    }

    this.isLoading = true;
    this.authService.resetPassword(this.token, this.newPassword).subscribe({
      next: () => {
        this.message = 'Contraseña restablecida correctamente';
        setTimeout(() => this.router.navigate(['/login']), 2000);
      },
      error: () => {
        this.message = 'Error al restablecer la contraseña';
        this.isLoading = false;
      }
    });
  }
}
