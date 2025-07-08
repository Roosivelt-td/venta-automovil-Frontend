import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-clientes-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './clientes-list.html',
  styleUrl: './clientes-list.css'
})
export class ClientesListComponent {
  // Propiedades para el filtro y la búsqueda
  filtroClientes: string = '';
  busquedaCliente: string = '';

  // Propiedades para el modal de registro/edición
  mostrarModalRegistro: boolean = false;
  clienteSeleccionado: any = null; // Para editar un cliente existente

  // Datos de ejemplo de clientes (reemplazar con datos reales de la API)
  clientes: any[] = [
    { id: 1, nombre: 'Juan Pérez', dni: '12345678A', telefono: '600111222', correo: 'juan.perez@example.com' },
    { id: 2, nombre: 'María García', dni: '87654321B', telefono: '600333444', correo: 'maria.garcia@example.com' }
  ];

  // Métodos para el modal
  abrirModalRegistro(cliente?: any) {
    this.clienteSeleccionado = cliente ? { ...cliente } : {};
    this.mostrarModalRegistro = true;
  }

  cerrarModalRegistro() {
    this.mostrarModalRegistro = false;
    this.clienteSeleccionado = null;
  }

  // Métodos para la gestión de clientes
  registrarNuevoCliente() {
    // Lógica para registrar o actualizar un cliente
    console.log('Registrando/Actualizando cliente:', this.clienteSeleccionado);
    // Aquí iría la llamada a la API para guardar el cliente
    this.cerrarModalRegistro();
  }

  buscarClientes() {
    // Lógica para buscar clientes (filtrar la lista 'clientes' según 'busquedaCliente')
    console.log('Buscando clientes por:', this.busquedaCliente);
  }

  editarCliente(cliente: any) {
    this.abrirModalRegistro(cliente);
  }

  eliminarCliente(id: number) {
    // Lógica para eliminar un cliente
    console.log('Eliminando cliente con ID:', id);
    // Aquí iría la llamada a la API para eliminar el cliente
  }

  // Método para filtrar la tabla (si se implementa un filtro en el HTML)
  filtrarTabla() {
    // Lógica de filtrado de la tabla
    console.log('Filtrando tabla por:', this.filtroClientes);
  }
}
