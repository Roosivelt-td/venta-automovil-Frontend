import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ClienteService, Cliente, ClienteRequest } from '../../../../services/cliente.service';

@Component({
  selector: 'app-clientes-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './clientes-list.html',
  styleUrl: './clientes-list.css'
})
export class ClientesListComponent implements OnInit {
  // Propiedades para el filtro y la búsqueda
  filtroClientes: string = '';
  busquedaCliente: string = '';

  // Propiedades para el modal de registro/edición
  mostrarModalRegistro: boolean = false;
  clienteSeleccionado: ClienteRequest = {
    nombre: '',
    dni: 0,
    telefono: '',
    direccion: '',
    correo: ''
  };
  editando: boolean = false;
  clienteIdEditando: number = 0;
  guardando: boolean = false; // Para mostrar loading en el botón

  // Datos reales de clientes
  clientes: Cliente[] = [];
  clientesFiltrados: Cliente[] = [];
  
  // Estados de carga y error
  loading: boolean = false;
  errorMessage: string = '';
  successMessage: string = '';

  constructor(private clienteService: ClienteService) {}

  ngOnInit(): void {
    this.cargarClientes();
  }

  // Cargar clientes desde la API
  cargarClientes(): void {
    this.loading = true;
    this.errorMessage = '';

    this.clienteService.obtenerTodosLosClientes().subscribe({
      next: (clientes: Cliente[]) => {
        this.clientes = clientes;
        this.clientesFiltrados = clientes;
        this.loading = false;
      },
      error: (error: any) => {
        console.error('Error al cargar clientes:', error);
        this.errorMessage = 'Error al cargar los clientes';
        this.loading = false;
      }
    });
  }

  // Métodos para el modal
  abrirModalRegistro(cliente?: Cliente) {
    this.errorMessage = '';
    this.successMessage = '';
    
    if (cliente) {
      // Modo edición - cargar datos del cliente
      this.editando = true;
      this.clienteIdEditando = cliente.identificador || 0;
      this.clienteSeleccionado = {
        nombre: cliente.nombre || '',
        dni: cliente.dni || 0,
        telefono: cliente.telefono || '',
        direccion: cliente.direccion || '',
        correo: cliente.correo || ''
      };
      console.log('Editando cliente:', this.clienteSeleccionado);
    } else {
      // Modo creación - limpiar formulario
      this.editando = false;
      this.clienteIdEditando = 0;
      this.clienteSeleccionado = {
        nombre: '',
        dni: 0,
        telefono: '',
        direccion: '',
        correo: ''
      };
    }
    this.mostrarModalRegistro = true;
  }

  cerrarModalRegistro() {
    this.mostrarModalRegistro = false;
    this.clienteSeleccionado = {
      nombre: '',
      dni: 0,
      telefono: '',
      direccion: '',
      correo: ''
    };
    this.editando = false;
    this.clienteIdEditando = 0;
    this.guardando = false;
    this.errorMessage = '';
    this.successMessage = '';
  }

  // Validar formulario
  validarFormulario(): boolean {
    if (!this.clienteSeleccionado.nombre?.trim()) {
      this.errorMessage = 'El nombre es obligatorio';
      return false;
    }
    if (!this.clienteSeleccionado.dni || this.clienteSeleccionado.dni <= 0) {
      this.errorMessage = 'El DNI es obligatorio y debe ser válido';
      return false;
    }
    if (!this.clienteSeleccionado.telefono?.trim()) {
      this.errorMessage = 'El teléfono es obligatorio';
      return false;
    }
    if (!this.clienteSeleccionado.correo?.trim()) {
      this.errorMessage = 'El correo es obligatorio';
      return false;
    }
    if (!this.clienteSeleccionado.direccion?.trim()) {
      this.errorMessage = 'La dirección es obligatoria';
      return false;
    }
    return true;
  }

  // Métodos para la gestión de clientes
  registrarNuevoCliente() {
    if (!this.validarFormulario()) {
      return;
    }

    this.guardando = true;
    this.errorMessage = '';
    this.successMessage = '';

    if (this.editando) {
      // Actualizar cliente existente
      this.clienteService.actualizarCliente(this.clienteIdEditando, this.clienteSeleccionado).subscribe({
        next: () => {
          console.log('Cliente actualizado exitosamente');
          this.successMessage = 'Cliente actualizado correctamente';
          this.cargarClientes();
          setTimeout(() => {
            this.cerrarModalRegistro();
          }, 1500);
        },
        error: (error: any) => {
          console.error('Error al actualizar cliente:', error);
          this.errorMessage = error.error?.message || 'Error al actualizar el cliente';
          this.guardando = false;
        }
      });
    } else {
      // Crear nuevo cliente
      this.clienteService.crearCliente(this.clienteSeleccionado).subscribe({
        next: () => {
          console.log('Cliente creado exitosamente');
          this.successMessage = 'Cliente creado correctamente';
          this.cargarClientes();
          setTimeout(() => {
            this.cerrarModalRegistro();
          }, 1500);
        },
        error: (error: any) => {
          console.error('Error al crear cliente:', error);
          this.errorMessage = error.error?.message || 'Error al crear el cliente';
          this.guardando = false;
        }
      });
    }
  }

  buscarClientes() {
    if (!this.busquedaCliente.trim()) {
      this.clientesFiltrados = this.clientes;
      return;
    }

    const termino = this.busquedaCliente.toLowerCase();
    this.clientesFiltrados = this.clientes.filter(cliente => 
      cliente.nombre.toLowerCase().includes(termino) ||
      cliente.dni.toString().includes(termino) ||
      cliente.correo.toLowerCase().includes(termino) ||
      cliente.telefono.includes(termino)
    );
  }

  editarCliente(cliente: Cliente) {
    this.abrirModalRegistro(cliente);
  }

  eliminarCliente(id: number) {
    if (confirm('¿Está seguro de que desea eliminar este cliente?')) {
      this.clienteService.eliminarCliente(id).subscribe({
        next: () => {
          console.log('Cliente eliminado exitosamente');
          this.successMessage = 'Cliente eliminado correctamente';
          this.cargarClientes();
          setTimeout(() => {
            this.successMessage = '';
          }, 3000);
        },
        error: (error: any) => {
          console.error('Error al eliminar cliente:', error);
          this.errorMessage = error.error?.message || 'Error al eliminar el cliente';
          setTimeout(() => {
            this.errorMessage = '';
          }, 5000);
        }
      });
    }
  }

  // Método para filtrar la tabla
  filtrarTabla() {
    this.buscarClientes();
  }

  // Limpiar mensajes
  limpiarMensajes() {
    this.errorMessage = '';
    this.successMessage = '';
  }
}
