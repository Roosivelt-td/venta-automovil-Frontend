import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PagoService, Pago, PagoRequest } from '../../../../services/pago.service';

@Component({
  selector: 'app-pagos-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './pagos.html',
  styleUrls: ['./pagos-list.css']
})
export class PagosListComponent implements OnInit {
  pagos: Pago[] = [];
  pagosFiltrados: Pago[] = [];
  filtroPagos: string = '';
  loading = false;
  errorMessage = '';
  mostrarModalRegistro: boolean = false;
  mostrarModalEditar: boolean = false;

  // Formulario para nuevo pago
  nuevoPago: PagoRequest = {
    idVenta: 0,
    metodoPago: '',
    monto: 0,
    fecha: ''
  };

  // Formulario para editar pago
  pagoEditando: PagoRequest = {
    idVenta: 0,
    metodoPago: '',
    monto: 0,
    fecha: ''
  };
  pagoSeleccionado: Pago | null = null;

  constructor(private pagoService: PagoService) { }

  ngOnInit(): void {
    this.cargarPagos();
  }

  cargarPagos(): void {
    this.loading = true;
    this.errorMessage = '';
    this.pagoService.obtenerTodosLosPagos().subscribe({
      next: (pagos) => {
        this.pagos = pagos;
        this.pagosFiltrados = pagos;
        this.loading = false;
        console.log('Pagos cargados:', pagos);
      },
      error: (error) => {
        console.error('Error al cargar pagos:', error);
        this.loading = false;
        this.errorMessage = 'Error al cargar los pagos: ' + (error.error?.message || error.message || 'Error desconocido');
      }
    });
  }

  buscarPago(): void {
    if (!this.filtroPagos || this.filtroPagos.trim() === '') {
      this.pagosFiltrados = this.pagos;
      return;
    }

    const terminoLower = this.filtroPagos.toLowerCase().trim();
    
    this.pagosFiltrados = this.pagos.filter(pago => {
      // Buscar por ID de pago
      if (pago.identificador?.toString().includes(terminoLower)) {
        return true;
      }
      
      // Buscar por ID de venta
      if (pago.idVenta?.toString().includes(terminoLower)) {
        return true;
      }
      
      // Buscar por método de pago
      if (pago.metodoPago?.toLowerCase().includes(terminoLower)) {
        return true;
      }
      
      // Buscar por monto
      if (pago.monto?.toString().includes(terminoLower)) {
        return true;
      }
      
      // Buscar por fecha
      const fecha = new Date(pago.fecha);
      const fechaFormateada = fecha.toLocaleDateString('es-ES');
      if (fechaFormateada.includes(terminoLower)) {
        return true;
      }
      
      return false;
    });

    console.log(`Buscando "${this.filtroPagos}": ${this.pagosFiltrados.length} resultados encontrados`);
  }

  limpiarFiltro(): void {
    this.filtroPagos = '';
    this.pagosFiltrados = this.pagos;
  }

  abrirModalRegistro() {
    this.mostrarModalRegistro = true;
    this.nuevoPago = {
      idVenta: 0,
      metodoPago: '',
      monto: 0,
      fecha: new Date().toISOString().split('T')[0] // Fecha actual
    };
  }

  cerrarModalRegistro() {
    this.mostrarModalRegistro = false;
  }

  registrarPago(): void {
    if (this.nuevoPago.idVenta && this.nuevoPago.metodoPago && this.nuevoPago.monto > 0 && this.nuevoPago.fecha) {
      this.loading = true;
      this.pagoService.crearPago(this.nuevoPago).subscribe({
        next: () => {
          this.loading = false;
          this.cerrarModalRegistro();
          this.cargarPagos(); // Recargar la lista
          alert('Pago registrado exitosamente');
        },
        error: (error) => {
          console.error('Error al registrar pago:', error);
          this.loading = false;
          alert('Error al registrar el pago: ' + (error.error?.message || error.message || 'Error desconocido'));
        }
      });
    } else {
      alert('Por favor, complete todos los campos requeridos');
    }
  }

  editarPago(pago: Pago): void {
    this.pagoSeleccionado = pago;
    this.pagoEditando = {
      idVenta: pago.idVenta,
      metodoPago: pago.metodoPago,
      monto: pago.monto,
      fecha: pago.fecha
    };
    this.mostrarModalEditar = true;
  }

  cerrarModalEditar(): void {
    this.mostrarModalEditar = false;
    this.pagoSeleccionado = null;
    this.pagoEditando = {
      idVenta: 0,
      metodoPago: '',
      monto: 0,
      fecha: ''
    };
  }

  actualizarPago(): void {
    if (this.pagoSeleccionado && this.pagoEditando.idVenta && this.pagoEditando.metodoPago && this.pagoEditando.monto > 0 && this.pagoEditando.fecha) {
      this.loading = true;
      this.pagoService.actualizarPago(this.pagoSeleccionado.identificador || 0, this.pagoEditando).subscribe({
        next: () => {
          this.loading = false;
          this.cerrarModalEditar();
          this.cargarPagos(); // Recargar la lista
          alert('Pago actualizado exitosamente');
        },
        error: (error) => {
          console.error('Error al actualizar pago:', error);
          this.loading = false;
          alert('Error al actualizar el pago: ' + (error.error?.message || error.message || 'Error desconocido'));
        }
      });
    } else {
      alert('Por favor, complete todos los campos requeridos');
    }
  }

  eliminarPago(id: number): void {
    if (confirm('¿Estás seguro de que quieres eliminar este pago?')) {
      this.pagoService.eliminarPago(id).subscribe({
        next: () => {
          console.log('Pago eliminado exitosamente');
          this.cargarPagos(); // Recargar la lista
        },
        error: (error) => {
          console.error('Error al eliminar pago:', error);
          alert('Error al eliminar el pago: ' + (error.error?.message || error.message || 'Error desconocido'));
        }
      });
    }
  }

  // Propiedades calculadas para estadísticas
  get totalPagos(): number {
    return this.pagos.length;
  }

  get pagosFiltradosCount(): number {
    return this.pagosFiltrados.length;
  }

  get totalMonto(): number {
    return this.pagos.reduce((sum, pago) => sum + (pago.monto || 0), 0);
  }

  get montoFiltrado(): number {
    return this.pagosFiltrados.reduce((sum, pago) => sum + (pago.monto || 0), 0);
  }
} 