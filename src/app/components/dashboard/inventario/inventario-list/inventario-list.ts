import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-inventario-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './inventario-list.html',
  styleUrl: './inventario-list.css'
})
export class InventarioListComponent {
  filtroInventario: string = '';

  exportarExcel() {
    // Implementar la lógica de exportación a Excel
    console.log('Exportando a Excel...');
  }
}
