import { Component } from '@angular/core';
import {UsuarioService} from '../../../services/usuario';
import { Usuario } from '../../../models/usuario';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-usuario-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './usuario-list.html',
  styleUrl: './usuario-list.css'
})
export class UsuarioList {
  usuarios: Usuario[] = [];

  constructor(private usuarioService: UsuarioService) { }

  ngOnInit(): void {
    this.loadUsuarios();
  }

  loadUsuarios(): void {
    this.usuarioService.getUsuarios().subscribe(
      (data: Usuario[]) => {
        this.usuarios = data;
      },
      (error) => {
        console.error('Error al cargar usuarios:', error);
      }
    );
  }

  crearUsuario() {

  }
}
