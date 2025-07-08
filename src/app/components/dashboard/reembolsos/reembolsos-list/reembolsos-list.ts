import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-reembolsos-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './reembolsos.html',
  styleUrls: ['./reembolsos-list.css']
})
export class ReembolsosListComponent {
  mostrarModalRegistro: boolean = false;

  abrirModalRegistro() {
    this.mostrarModalRegistro = true;
  }

  cerrarModalRegistro() {
    this.mostrarModalRegistro = false;
  }
} 