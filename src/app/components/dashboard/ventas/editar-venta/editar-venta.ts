import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ClienteService, Cliente, ClienteRequest } from '../../../../services/cliente.service';
import { VentaService, VentaRequest, Venta } from '../../../../services/venta.service';
import { AutoService } from '../../../../services/auto.service';

@Component({
  selector: 'app-editar-venta',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './editar-venta.html',
  styleUrls: ['./editar-venta.css']
})
export class EditarVentaComponent implements OnInit {
  ventaForm: FormGroup;
  clienteForm: FormGroup;
  clientes: Cliente[] = [];
  autos: any[] = [];
  loading = false;
  cargandoVenta = false;
  mostrarFormularioCliente = false;
  clienteSeleccionado: Cliente | null = null;
  dniBusqueda: number | null = null;
  mostrarMensajeExito = false;
  mensajeExito = '';
  ventaId: number = 0;
  ventaOriginal: Venta | null = null;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private clienteService: ClienteService,
    private ventaService: VentaService,
    private autoService: AutoService
  ) {
    this.ventaForm = this.fb.group({
      clienteId: [null, Validators.required],
      autoId: ['', Validators.required],
      fechaVenta: ['', Validators.required],
      precioVenta: ['', [Validators.required, Validators.min(0)]],
      metodoPago: ['', Validators.required],
      observaciones: ['']
    });

    this.clienteForm = this.fb.group({
      nombre: ['', Validators.required],
      dni: ['', [Validators.required, Validators.min(10000000), Validators.max(99999999)]],
      telefono: ['', Validators.required],
      direccion: ['', Validators.required],
      correo: ['', [Validators.required, Validators.email]]
    });
  }

  ngOnInit() {
    this.ventaId = Number(this.route.snapshot.paramMap.get('id'));
    if (this.ventaId) {
      this.cargarVenta();
    }
    this.cargarClientes();
    this.cargarAutos();
  }

  cargarVenta() {
    this.cargandoVenta = true;
    this.ventaService.obtenerVentaPorId(this.ventaId).subscribe({
      next: (venta) => {
        this.ventaOriginal = venta;
        console.log('Venta cargada para edición:', venta);
        
        // Formatear la fecha para el input
        const fecha = new Date(venta.fecha);
        const fechaFormateada = fecha.toISOString().split('T')[0];
        
        this.ventaForm.patchValue({
          clienteId: venta.cliente?.identificador || venta.cliente?.id,
          autoId: venta.auto?.id,
          fechaVenta: fechaFormateada,
          precioVenta: venta.precioVenta,
          metodoPago: venta.metodoPago || 'Efectivo',
          observaciones: venta.observaciones || ''
        });
        
        this.cargandoVenta = false;
      },
      error: (error) => {
        console.error('Error al cargar la venta:', error);
        this.cargandoVenta = false;
        alert('Error al cargar la venta para edición');
        this.router.navigate(['/dashboard/ventas']);
      }
    });
  }

  cargarClientes() {
    console.log('Intentando cargar clientes...');
    this.clienteService.obtenerTodosLosClientes().subscribe({
      next: (clientes) => {
        console.log('Clientes cargados:', clientes);
        this.clientes = clientes;
      },
      error: (error) => {
        console.error('Error al cargar clientes:', error);
      }
    });
  }

  cargarAutos() {
    this.autoService.obtenerTodosLosAutos().subscribe({
      next: (autos) => {
        console.log('Todos los autos cargados:', autos);
        this.autos = autos;
        console.log('Cantidad de autos:', this.autos.length);
      },
      error: (error) => {
        console.error('Error al cargar autos:', error);
      }
    });
  }

  buscarClientePorDni() {
    if (this.dniBusqueda) {
      this.clienteService.buscarClientesPorDni(this.dniBusqueda).subscribe({
        next: (clientes) => {
          if (clientes.length > 0) {
            this.clienteSeleccionado = clientes[0];
            console.log('Cliente encontrado:', this.clienteSeleccionado);
            
            this.ventaForm.get('clienteId')?.setValue(this.clienteSeleccionado.identificador);
            this.ventaForm.get('clienteId')?.markAsTouched();
            this.ventaForm.get('clienteId')?.markAsDirty();
            
            this.mostrarFormularioCliente = false;
          } else {
            this.mostrarFormularioCliente = true;
            this.clienteSeleccionado = null;
          }
        },
        error: (error) => {
          console.error('Error al buscar cliente:', error);
        }
      });
    }
  }

  registrarCliente() {
    if (this.clienteForm.valid) {
      const clienteData: ClienteRequest = this.clienteForm.value;
      console.log('Datos del cliente a enviar:', clienteData);
      this.clienteService.crearCliente(clienteData).subscribe({
        next: (clienteCreado) => {
          this.clienteSeleccionado = clienteCreado;
          console.log('Cliente creado:', clienteCreado);
          
          this.ventaForm.get('clienteId')?.setValue(clienteCreado.identificador);
          this.ventaForm.get('clienteId')?.markAsTouched();
          this.ventaForm.get('clienteId')?.markAsDirty();
          
          this.mostrarFormularioCliente = false;
          this.cargarClientes();
        },
        error: (error) => {
          console.error('Error al registrar cliente:', error);
        }
      });
    }
  }

  onSubmit() {
    console.log('Estado del formulario de venta:');
    console.log('Válido:', this.ventaForm.valid);
    console.log('Valores:', this.ventaForm.value);

    if (this.ventaForm.valid) {
      if (this.autos.length === 0) {
        alert('Error: No hay autos disponibles.');
        return;
      }
      
      const autoId = this.ventaForm.get('autoId')?.value;
      if (!autoId) {
        alert('Error: Por favor, seleccione un auto.');
        return;
      }
      
      const autoIdNumber = Number(autoId);
      const autoSeleccionado = this.autos.find(auto => auto.id === autoIdNumber);
      
      if (!autoSeleccionado) {
        alert('Error: Auto no encontrado. Por favor, seleccione un auto válido.');
        return;
      }
      
      this.loading = true;
      
      const ventaData: VentaRequest = {
        idCliente: this.ventaForm.get('clienteId')?.value,
        idAuto: autoIdNumber,
        idUsuario: 1, // Usuario por defecto o obtener del contexto
        fecha: this.ventaForm.get('fechaVenta')?.value,
        precioVenta: this.ventaForm.get('precioVenta')?.value,
        metodoPago: this.ventaForm.get('metodoPago')?.value,
        observaciones: this.ventaForm.get('observaciones')?.value
      };

      console.log('Datos de venta a actualizar:', ventaData);
      
      this.ventaService.actualizarVenta(this.ventaId, ventaData).subscribe({
        next: () => {
          console.log('Venta actualizada exitosamente');
          this.loading = false;
          this.mostrarMensajeExito = true;
          this.mensajeExito = 'Venta actualizada exitosamente';
          
          setTimeout(() => {
            this.router.navigate(['/dashboard/ventas']);
          }, 2000);
        },
        error: (error) => {
          console.error('Error al actualizar venta:', error);
          this.loading = false;
          alert('Error al actualizar la venta: ' + (error.error?.message || error.message || 'Error desconocido'));
        }
      });
    } else {
      console.log('Formulario inválido');
      Object.keys(this.ventaForm.controls).forEach(key => {
        const control = this.ventaForm.get(key);
        if (control?.invalid) {
          console.log(`Campo ${key} inválido:`, control.errors);
        }
      });
    }
  }

  cancelar() {
    this.router.navigate(['/dashboard/ventas']);
  }

  mostrarFormularioNuevoCliente() {
    this.mostrarFormularioCliente = true;
    this.clienteForm.reset();
  }



  debugFormulario() {
    console.log('Estado completo del formulario:', this.ventaForm);
    console.log('Valores:', this.ventaForm.value);
    console.log('Válido:', this.ventaForm.valid);
    console.log('Errores:', this.ventaForm.errors);
  }
} 