import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { Router, NavigationEnd } from '@angular/router';
import { filter, debounceTime, distinctUntilChanged, Subject } from 'rxjs';
import { ProveedorService, Proveedor } from '../../../../services/proveedor.service';
import { EditarProveedorComponent } from '../editar-proveedor/editar-proveedor';

@Component({
  selector: 'app-proveedores-list',
  standalone: true,
  imports: [CommonModule, HttpClientModule, FormsModule, EditarProveedorComponent],
  templateUrl: './proveedores-list.html',
  styleUrl: './proveedores-list.css'
})
export class ProveedoresListComponent implements OnInit {
  mostrarModalRegistro: boolean = false;
  proveedores: Proveedor[] = [];
  proveedoresFiltrados: Proveedor[] = [];
  isLoading = false;
  errorMessage = '';
  terminoBusqueda = '';
  private searchSubject = new Subject<string>();
  mostrarModalEditar = false;
  proveedorSeleccionado: Proveedor | null = null;

  constructor(
    private proveedorService: ProveedorService,
    private router: Router
  ) {
    // Suscribirse a eventos de navegación para recargar datos
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      // Recargar proveedores cuando se navegue a esta página
      this.cargarProveedores();
    });

    // Configurar búsqueda con debounce
    this.searchSubject.pipe(
      debounceTime(300), // Esperar 300ms después de que el usuario deje de escribir
      distinctUntilChanged() // Solo buscar si el término cambió
    ).subscribe(termino => {
      this.buscarProveedores(termino);
    });
  }

  ngOnInit(): void {
    this.cargarProveedores();
  }

  cargarProveedores(): void {
    this.isLoading = true;
    this.errorMessage = '';
    console.log('Iniciando carga de proveedores...');

    this.proveedorService.obtenerTodosLosProveedores().subscribe({
      next: (proveedores: Proveedor[]) => {
        this.proveedores = proveedores;
        this.proveedoresFiltrados = proveedores; // Inicialmente mostrar todos
        this.isLoading = false;
        console.log('Proveedores cargados exitosamente:', proveedores);
      },
      error: (error: any) => {
        this.isLoading = false;
        console.error('Error detallado al cargar proveedores:', error);
        console.error('Status:', error.status);
        console.error('StatusText:', error.statusText);
        console.error('URL:', error.url);
        this.errorMessage = 'Error al cargar los proveedores: ' + (error.error?.message || error.message || 'Error desconocido');
      }
    });
  }

  // Método que se ejecuta cuando el usuario escribe en el buscador
  onBusquedaChange(): void {
    this.searchSubject.next(this.terminoBusqueda);
  }

  // Método que realiza la búsqueda
  buscarProveedores(termino: string): void {
    if (!termino || termino.trim() === '') {
      // Si no hay término de búsqueda, mostrar todos los proveedores
      this.proveedoresFiltrados = this.proveedores;
      return;
    }

    const terminoLower = termino.toLowerCase().trim();
    
    // Buscar en nombre de empresa, RUC y contacto
    this.proveedoresFiltrados = this.proveedores.filter(proveedor => 
      proveedor.nombreEmpresa.toLowerCase().includes(terminoLower) ||
      proveedor.ruc.toLowerCase().includes(terminoLower) ||
      proveedor.contacto.toLowerCase().includes(terminoLower) ||
      (proveedor.direccion && proveedor.direccion.toLowerCase().includes(terminoLower))
    );

    console.log(`Buscando "${termino}": ${this.proveedoresFiltrados.length} resultados encontrados`);
  }

  abrirModalRegistro() {
    this.router.navigate(['/dashboard/proveedores/agregar']);
  }

  cerrarModalRegistro() {
    this.mostrarModalRegistro = false;
    this.cargarProveedores(); // Recargar la lista después de cerrar el modal
  }

  eliminarProveedor(identificador: number): void {
    if (confirm('¿Estás seguro de que quieres eliminar este proveedor?')) {
      this.proveedorService.eliminarProveedor(identificador).subscribe({
        next: () => {
          console.log('Proveedor eliminado exitosamente');
          this.cargarProveedores(); // Recargar la lista
        },
        error: (error: any) => {
          console.error('Error al eliminar proveedor:', error);
          alert('Error al eliminar el proveedor: ' + (error.error?.message || error.message || 'Error desconocido'));
        }
      });
    }
  }

  editarProveedor(identificador: number): void {
    console.log('Editar proveedor con ID:', identificador);
    const proveedor = this.proveedores.find(p => p.identificador === identificador);
    if (proveedor) {
      this.proveedorSeleccionado = proveedor;
      this.mostrarModalEditar = true;
      console.log('Abriendo modal para editar proveedor:', proveedor);
    }
  }

  cerrarModalEditar(): void {
    this.mostrarModalEditar = false;
    this.proveedorSeleccionado = null;
  }

  actualizarLista(): void {
    this.cargarProveedores(); // Recargar la lista después de editar
  }

  // Método para limpiar la búsqueda
  limpiarBusqueda(): void {
    this.terminoBusqueda = '';
    this.proveedoresFiltrados = this.proveedores;
  }
}