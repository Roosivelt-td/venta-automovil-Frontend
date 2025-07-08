import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EditarAutoComponent } from './editar-auto/editar-auto';
import { Auto } from '../../../services/auto.service';

@Component({
  selector: 'app-autos-list',
  standalone: true,
  imports: [CommonModule, EditarAutoComponent],
  templateUrl: './autos-list.html',
  styleUrls: ['./autos-list.css']
})
export class AutosListComponent {
  autos = [
    {
      id: 1,
      anio: 2022,
      color: 'Rojo',
      descripcion: 'Auto deportivo en excelente estado',
      estado: 'Disponible',
      imagenUrl: 'https://via.placeholder.com/100',
      kilometraje: 15000,
      marca: 'Toyota',
      modelo: 'Supra',
      precio: 55000.00,
      tipoCombustible: 'Gasolina',
      transmision: 'Manual',
      cilindrada: 2000,
      potencia: 300,
      stock: 2
    }
  ];

  mostrarModalEditar = false;
  autoSeleccionado: Auto | null = null;

  abrirModalEditar(auto: Auto) {
    console.log('Abriendo modal de edición para auto:', auto);
    this.autoSeleccionado = auto;
    this.mostrarModalEditar = true;
    console.log('Estado del modal:', this.mostrarModalEditar);
  }

  cerrarModalEditar() {
    console.log('Cerrando modal de edición');
    this.mostrarModalEditar = false;
    this.autoSeleccionado = null;
  }

  actualizarLista() {
    // Aquí deberías recargar la lista de autos desde el backend
  }
} 