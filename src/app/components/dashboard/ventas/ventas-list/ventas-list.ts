import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { VentaService, Venta } from '../../../../services/venta.service';

@Component({
  selector: 'app-ventas-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './ventas-list.html',
  styleUrl: './ventas-list.css'
})
export class VentasListComponent implements OnInit {
  ventas: Venta[] = [];
  ventasFiltradas: Venta[] = [];
  filtroVentas: string = '';
  loading = false;
  errorMessage = '';

  constructor(
    private router: Router,
    private ventaService: VentaService
  ) { }

  ngOnInit(): void {
    this.cargarVentas();
  }

  cargarVentas(): void {
    this.loading = true;
    this.errorMessage = '';
    this.ventaService.obtenerTodasLasVentas().subscribe({
      next: (ventas) => {
        this.ventas = ventas;
        this.ventasFiltradas = ventas;
        this.loading = false;
        console.log('Ventas cargadas:', ventas);
      },
      error: (error) => {
        console.error('Error al cargar ventas:', error);
        this.loading = false;
        this.errorMessage = 'Error al cargar las ventas: ' + (error.error?.message || error.message || 'Error desconocido');
      }
    });
  }

  abrirModalRegistro(): void {
    this.router.navigate(['/dashboard/ventas/registrar']);
  }

  buscarVenta(): void {
    if (!this.filtroVentas || this.filtroVentas.trim() === '') {
      // Si no hay término de búsqueda, mostrar todas las ventas
      this.ventasFiltradas = this.ventas;
      return;
    }

    const terminoLower = this.filtroVentas.toLowerCase().trim();
    
    // Buscar en múltiples campos de la venta
    this.ventasFiltradas = this.ventas.filter(venta => {
      // Buscar por ID de venta
      if (venta.identificador?.toString().includes(terminoLower)) {
        return true;
      }
      
      // Buscar por nombre del cliente
      if (venta.cliente?.nombre?.toLowerCase().includes(terminoLower)) {
        return true;
      }
      
      // Buscar por DNI del cliente
      if (venta.cliente?.dni?.toString().includes(terminoLower)) {
        return true;
      }
      
      // Buscar por marca del auto
      if (venta.auto?.marca?.toLowerCase().includes(terminoLower)) {
        return true;
      }
      
      // Buscar por modelo del auto
      if (venta.auto?.modelo?.toLowerCase().includes(terminoLower)) {
        return true;
      }
      
      // Buscar por año del auto
      if (venta.auto?.anio?.toString().includes(terminoLower)) {
        return true;
      }
      
      // Buscar por nombre del usuario
      if (venta.usuario?.nombre?.toLowerCase().includes(terminoLower)) {
        return true;
      }
      
      // Buscar por fecha (formato dd/mm/yyyy)
      const fecha = new Date(venta.fecha);
      const fechaFormateada = fecha.toLocaleDateString('es-ES');
      if (fechaFormateada.includes(terminoLower)) {
        return true;
      }
      
      // Buscar por precio de venta
      if (venta.precioVenta?.toString().includes(terminoLower)) {
        return true;
      }
      
      return false;
    });

    console.log(`Buscando "${this.filtroVentas}": ${this.ventasFiltradas.length} resultados encontrados`);
  }

  editarVenta(id: number): void {
    // Navegar a la página de editar venta
    this.router.navigate(['/dashboard/ventas/editar', id]);
  }

  eliminarVenta(id: number): void {
    // Lógica para eliminar una venta
    console.log('Eliminar venta:', id);
  }

  limpiarFiltro(): void {
    this.filtroVentas = '';
    this.ventasFiltradas = this.ventas;
  }

  // Propiedades calculadas para estadísticas
  get totalVentas(): number {
    return this.ventas.length;
  }

  get ventasFiltradasCount(): number {
    return this.ventasFiltradas.length;
  }

  get totalIngresos(): number {
    return this.ventas.reduce((sum, venta) => sum + (venta.precioVenta || 0), 0);
  }

  get ingresosFiltrados(): number {
    return this.ventasFiltradas.reduce((sum, venta) => sum + (venta.precioVenta || 0), 0);
  }
}
