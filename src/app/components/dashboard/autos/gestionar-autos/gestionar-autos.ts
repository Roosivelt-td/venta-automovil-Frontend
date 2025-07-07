import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';
import { AutoService, Auto } from '../../../../services/auto.service';
import { EditarAutoComponent } from '../editar-auto/editar-auto';
import { VerAutoComponent } from '../ver-auto/ver-auto';

@Component({
  selector: 'app-gestionar-autos',
  standalone: true,
  imports: [CommonModule, HttpClientModule, EditarAutoComponent, VerAutoComponent],
  templateUrl: './gestionar-autos.html',
  styleUrls: ['./gestionar-autos.css']
})
export class GestionarAutosComponent implements OnInit {
  
  autos: Auto[] = [];
  isLoading = false;
  errorMessage = '';
  mostrarModalEditar = false;
  autoSeleccionado: Auto | null = null;
  mostrarModalVer = false;
  autoParaVer: Auto | null = null;

  constructor(
    private router: Router,
    private autoService: AutoService
  ) {}

  ngOnInit(): void {
    this.cargarAutos();
  }

  cargarAutos(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.autoService.obtenerTodosLosAutos().subscribe({
      next: (autos: Auto[]) => {
        this.autos = autos;
        this.isLoading = false;
        console.log('Autos cargados:', autos);
      },
      error: (error: any) => {
        this.isLoading = false;
        this.errorMessage = 'Error al cargar los autos: ' + (error.error?.message || error.message || 'Error desconocido');
        console.error('Error al cargar autos:', error);
      }
    });
  }

  // Propiedades calculadas
  get totalAutos(): number {
    return this.autos.length;
  }

  get autosDisponibles(): number {
    return this.autos.filter(auto => auto.stock && auto.stock > 0).length;
  }

  get valorTotal(): string {
    const total = this.autos.reduce((sum, auto) => sum + (auto.precio || 0), 0);
    return total.toLocaleString();
  }

  get stockTotal(): number {
    return this.autos.reduce((sum, auto) => sum + (auto.stock || 0), 0);
  }

  navegarAAnadir(): void {
    this.router.navigate(['/dashboard/autos/agregar']);
  }

  editarAuto(id: number): void {
    console.log('Editar auto con ID:', id);
    const auto = this.autos.find(a => a.id === id);
    if (auto) {
      this.autoSeleccionado = auto;
      this.mostrarModalEditar = true;
      console.log('Abriendo modal para editar auto:', auto);
    }
  }

  cerrarModalEditar(): void {
    this.mostrarModalEditar = false;
    this.autoSeleccionado = null;
  }

  actualizarLista(): void {
    this.cargarAutos(); // Recargar la lista después de editar
  }

  eliminarAuto(id: number): void {
    if (confirm('¿Estás seguro de que quieres eliminar este auto?')) {
      this.autoService.eliminarAuto(id).subscribe({
        next: () => {
          console.log('Auto eliminado exitosamente');
          this.cargarAutos(); // Recargar la lista
        },
        error: (error: any) => {
          console.error('Error al eliminar auto:', error);
          alert('Error al eliminar el auto: ' + (error.error?.message || error.message || 'Error desconocido'));
        }
      });
    }
  }

  verDetalles(id: number): void {
    console.log('Ver detalles del auto con ID:', id);
    const auto = this.autos.find(a => a.id === id);
    if (auto) {
      console.log('Auto encontrado para ver:', auto);
      console.log('imagenUrl del auto:', auto.imagenUrl);
      console.log('Tipo de imagenUrl:', typeof auto.imagenUrl);
      this.autoParaVer = auto;
      this.mostrarModalVer = true;
      console.log('Abriendo modal para ver auto:', auto);
    }
  }

  cerrarModalVer(): void {
    this.mostrarModalVer = false;
    this.autoParaVer = null;
  }
} 