import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CompraService } from '../../../../services/compra.service';
import { AutoService, Auto } from '../../../../services/auto.service';
import { ProveedorService, Proveedor } from '../../../../services/proveedor.service';
import { Compra, CompraRequest } from '../../../../models/compra';

@Component({
  selector: 'app-compras-list',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './compras-list.html',
  styleUrl: './compras-list.css'
})
export class ComprasListComponent implements OnInit {
  mostrarModalRegistro: boolean = false;
  mostrarModalEdicion: boolean = false;
  mostrarModalConfirmacion: boolean = false;
  compras: Compra[] = [];
  comprasFiltradas: Compra[] = [];
  compraForm!: FormGroup;
  compraEditando: Compra | null = null;
  compraEliminando: Compra | null = null;
  isLoading: boolean = false;
  compraEliminandoId: number | null = null;
  terminoBusqueda: string = '';

  // Listas para los selectores
  autos: Auto[] = [];
  proveedores: Proveedor[] = [];

  private compraService = inject(CompraService);
  private autoService = inject(AutoService);
  private proveedorService = inject(ProveedorService);
  private fb = inject(FormBuilder);

  ngOnInit() {
    this.inicializarFormulario();
    this.cargarCompras();
    this.cargarAutos();
    this.cargarProveedores();
  }

  inicializarFormulario() {
    this.compraForm = this.fb.group({
      idProveedor: ['', Validators.required],
      idAuto: ['', Validators.required],
      fecha: ['', Validators.required],
      precioCompra: ['', [Validators.required, Validators.min(0)]]
    });
  }

  cargarCompras() {
    this.isLoading = true;
    this.compraService.getCompras().subscribe({
      next: (data: Compra[]) => {
        console.log('Compras cargadas:', data);
        this.compras = data;
        this.comprasFiltradas = data;
        this.filtrarCompras();
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error al cargar compras:', error);
        this.compras = [];
        this.comprasFiltradas = [];
        this.isLoading = false;
        alert('Error al cargar compras. Por favor, recarga la página.');
      }
    });
  }

  cargarAutos() {
    this.autoService.obtenerTodosLosAutos().subscribe({
      next: (data: Auto[]) => {
        console.log('Autos cargados:', data);
        this.autos = data;
      },
      error: (error) => {
        console.error('Error al cargar autos:', error);
        this.autos = [];
      }
    });
  }

  cargarProveedores() {
    this.proveedorService.obtenerTodosLosProveedores().subscribe({
      next: (data: Proveedor[]) => {
        console.log('Proveedores cargados:', data);
        this.proveedores = data;
      },
      error: (error) => {
        console.error('Error al cargar proveedores:', error);
        this.proveedores = [];
      }
    });
  }

  abrirModalRegistro() {
    this.mostrarModalRegistro = true;
    this.compraForm.reset();
    // Establecer fecha actual por defecto
    this.compraForm.patchValue({
      fecha: new Date().toISOString().split('T')[0]
    });
  }

  cerrarModalRegistro() {
    this.mostrarModalRegistro = false;
    this.compraForm.reset();
  }

  abrirModalEdicion(compra: Compra) {
    this.compraEditando = compra;
    this.mostrarModalEdicion = true;
    
    // Cargar los datos de la compra en el formulario
    this.compraForm.patchValue({
      idProveedor: compra.idProveedor,
      idAuto: compra.idAuto,
      fecha: compra.fecha,
      precioCompra: compra.precioCompra
    });
  }

  cerrarModalEdicion() {
    this.mostrarModalEdicion = false;
    this.compraEditando = null;
    this.compraForm.reset();
  }

  registrarCompra() {
    if (this.compraForm.valid) {
      this.isLoading = true;
      const nuevaCompra: CompraRequest = this.compraForm.value;
      
      this.compraService.crearCompra(nuevaCompra).subscribe({
        next: () => {
          this.cargarCompras();
          this.cerrarModalRegistro();
          this.isLoading = false;
          alert('Compra registrada exitosamente');
        },
        error: (error) => {
          this.isLoading = false;
          console.error('Error al registrar compra:', error);
          alert('Error al registrar compra. Por favor, inténtalo de nuevo.');
        }
      });
    } else {
      this.marcarCamposInvalidos();
    }
  }

  actualizarCompra() {
    if (this.compraForm.valid && this.compraEditando) {
      this.isLoading = true;
      const compraActualizada: CompraRequest = this.compraForm.value;
      
      this.compraService.actualizarCompra(this.compraEditando.identificador, compraActualizada).subscribe({
        next: () => {
          this.cargarCompras();
          this.cerrarModalEdicion();
          this.isLoading = false;
          alert('Compra actualizada exitosamente');
        },
        error: (error) => {
          this.isLoading = false;
          console.error('Error al actualizar compra:', error);
          alert('Error al actualizar compra: ' + (error.error?.message || error.message || 'Error desconocido'));
        }
      });
    } else {
      this.marcarCamposInvalidos();
    }
  }

  eliminarCompra(compra: Compra) {
    this.compraEliminando = compra;
    this.mostrarModalConfirmacion = true;
  }

  confirmarEliminacion() {
    if (this.compraEliminando) {
      this.compraEliminandoId = this.compraEliminando.identificador;
      
      this.compraService.deleteCompra(this.compraEliminando.identificador).subscribe({
        next: () => {
          console.log('Compra eliminada exitosamente');
          this.cargarCompras();
          this.cerrarModalConfirmacion();
          alert('Compra eliminada exitosamente');
        },
        error: (error) => {
          this.compraEliminandoId = null;
          console.error('Error al eliminar compra:', error);
          alert('Error al eliminar compra: ' + (error.error?.message || error.message || 'Error desconocido'));
        }
      });
    }
  }

  cerrarModalConfirmacion() {
    this.mostrarModalConfirmacion = false;
    this.compraEliminando = null;
  }

  marcarCamposInvalidos() {
    Object.keys(this.compraForm.controls).forEach(key => {
      const control = this.compraForm.get(key);
      if (control?.invalid) {
        control.markAsTouched();
      }
    });
  }

  esCampoInvalido(campo: string): boolean {
    const control = this.compraForm.get(campo);
    return !!(control?.invalid && control?.touched);
  }

  obtenerMensajeError(campo: string): string {
    const control = this.compraForm.get(campo);
    if (control?.hasError('required')) {
      return 'Este campo es requerido';
    }
    if (control?.hasError('min')) {
      return 'El valor debe ser mayor a 0';
    }
    return 'Campo inválido';
  }

  // Métodos auxiliares para obtener información relacionada
  obtenerNombreProveedor(idProveedor: number): string {
    const proveedor = this.proveedores.find(p => p.identificador === idProveedor);
    return proveedor ? proveedor.nombreEmpresa : 'N/A';
  }

  obtenerInfoAuto(idAuto: number): string {
    const auto = this.autos.find(a => a.id === idAuto);
    return auto ? `${auto.marca} ${auto.modelo} (${auto.anio})` : 'N/A';
  }

  obtenerPrecioAuto(idAuto: number): number {
    const auto = this.autos.find(a => a.id === idAuto);
    return auto ? auto.precio : 0;
  }

  filtrarCompras() {
    if (!this.terminoBusqueda.trim()) {
      this.comprasFiltradas = this.compras;
      return;
    }

    const termino = this.terminoBusqueda.toLowerCase();
    this.comprasFiltradas = this.compras.filter(compra => {
      const nombreProveedor = this.obtenerNombreProveedor(compra.idProveedor).toLowerCase();
      const infoAuto = this.obtenerInfoAuto(compra.idAuto).toLowerCase();
      const fecha = compra.fecha.toLowerCase();
      const precio = compra.precioCompra.toString();
      
      return nombreProveedor.includes(termino) ||
             infoAuto.includes(termino) ||
             fecha.includes(termino) ||
             precio.includes(termino) ||
             compra.identificador.toString().includes(termino);
    });
  }

  onBusquedaChange(event: any) {
    this.terminoBusqueda = event.target.value;
    this.filtrarCompras();
  }

  limpiarBusqueda() {
    this.terminoBusqueda = '';
    this.filtrarCompras();
  }

  // Método para formatear fecha
  formatearFecha(fecha: string): string {
    return new Date(fecha).toLocaleDateString('es-ES');
  }

  // Método para formatear precio
  formatearPrecio(precio: number): string {
    return new Intl.NumberFormat('es-PE', {
      style: 'currency',
      currency: 'PEN'
    }).format(precio);
  }
}
// En compras-list.component.ts
/*ordenarPor(campo: string) {
  this.compras.sort((a, b) => {
    if (a[campo] < b[campo]) return -1;
    if (a[campo] > b[campo]) return 1;
    return 0;
  });
}*/