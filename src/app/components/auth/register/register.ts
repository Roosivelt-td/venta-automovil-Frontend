import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './register.html',
  styleUrl: './register.css'
})
export class RegisterComponent {
  registerData = {
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    termsAccepted: false
  };

  showPassword = false;

  constructor(private router: Router) {}

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  onSubmit() {
    console.log('Registration data:', this.registerData);
    // Aquí iría la lógica para enviar los datos al servidor
    // Por ahora solo redirigimos al login
    this.router.navigate(['/login']);
  }
  navigateToLogin() {
  this.router.navigate(['/login']);}
}
