import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { UsuarioService } from '../../../services/usuario';
import { User } from '../../../models/user';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './usuario-list.html',
  styleUrl: './usuario-list.css'
})
export class UsuarioList implements OnInit {
  registerData = {
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    termsAccepted: false
  };

  showPassword = false;
  usuarios: User[] = [];

  private usuarioService = inject(UsuarioService);

  constructor(private router: Router) {}

  ngOnInit() {
    this.usuarioService.getUsuarios().subscribe((data: User[]) => {
      this.usuarios = data;
    });
  }

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
