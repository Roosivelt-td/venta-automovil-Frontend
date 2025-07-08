import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ClienteService, Cliente, ClienteRequest } from '../../../../services/cliente.service';
import { VentaService, VentaRequest } from '../../../../services/venta.service';
import { AutoService } from '../../../../services/auto.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-registrar-venta',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './registrar-venta.html',
  styleUrls: ['./registrar-venta.css']
})
export class RegistrarVentaComponent {
  ventaForm: FormGroup;
  clienteForm: FormGroup;
  clientes: Cliente[] = [];
  autos: any[] = [];
  loading = false;
  mostrarFormularioCliente = false;
  clienteSeleccionado: Cliente | null = null;
  dniBusqueda: number | null = null;
  mostrarMensajeExito = false;
  mensajeExito = '';

  constructor(
    private fb: FormBuilder,
    private router: Router,
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
      // apellidos: [''], // Removido porque no existe en la BD
      dni: ['', [Validators.required, Validators.min(10000000), Validators.max(99999999)]],
      telefono: ['', Validators.required],
      direccion: ['', Validators.required],
      correo: ['', [Validators.required, Validators.email]]
    });
  }

  ngOnInit() {
    this.cargarClientes();
    this.cargarAutos();
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
        console.error('Status:', error.status);
        console.error('Message:', error.message);
        console.error('URL:', error.url);
      }
    });
  }

  cargarAutos() {
    this.autoService.obtenerTodosLosAutos().subscribe({
      next: (autos) => {
        console.log('Todos los autos cargados:', autos);
        // Temporalmente mostrar todos los autos para debug
        this.autos = autos;
        console.log('Autos disponibles (todos):', this.autos);
        console.log('Cantidad de autos:', this.autos.length);
        
        // Mostrar información de stock de cada auto
        this.autos.forEach(auto => {
          console.log(`Auto ID ${auto.id}: ${auto.marca} ${auto.modelo} - Stock: ${auto.stock}`);
        });
      },
      error: (error) => {
        console.error('Error al cargar autos:', error);
      }
    });
  }

  buscarClientePorDni() {
    if (this.dniBusqueda) {
      // Mostrar loading mientras busca
      Swal.fire({
        title: 'Buscando Cliente...',
        text: 'Por favor espere mientras se busca el cliente',
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        }
      });
      
      this.clienteService.buscarClientesPorDni(this.dniBusqueda).subscribe({
        next: (clientes) => {
          if (clientes.length > 0) {
            this.clienteSeleccionado = clientes[0];
            console.log('Cliente encontrado:', this.clienteSeleccionado);
            console.log('ID del cliente encontrado:', this.clienteSeleccionado.identificador);
            
            // Establecer el clienteId en el formulario
            this.ventaForm.get('clienteId')?.setValue(this.clienteSeleccionado.identificador);
            
            // Forzar la actualización del formulario
            this.ventaForm.get('clienteId')?.markAsTouched();
            this.ventaForm.get('clienteId')?.markAsDirty();
            
            console.log('Formulario después de establecer clienteId:', this.ventaForm.value);
            console.log('clienteId después de patchValue:', this.ventaForm.get('clienteId')?.value);
            this.mostrarFormularioCliente = false;
            
            // Mostrar mensaje de cliente encontrado
            Swal.fire({
              icon: 'success',
              title: '¡Cliente Encontrado!',
              html: `
                <div class="text-center">
                  <div class="mb-4">
                    <i class="fas fa-user-check text-5xl text-green-500"></i>
                  </div>
                  <p class="text-lg mb-2">Cliente encontrado exitosamente</p>
                  <div class="mt-4 p-3 bg-green-50 rounded-lg">
                    <p><strong>Nombre:</strong> ${this.clienteSeleccionado.nombre}</p>
                    <p><strong>DNI:</strong> ${this.clienteSeleccionado.dni}</p>
                    <p><strong>Teléfono:</strong> ${this.clienteSeleccionado.telefono}</p>
                  </div>
                </div>
              `,
              confirmButtonColor: '#10b981',
              confirmButtonText: '¡Perfecto!',
              showClass: {
                popup: 'animate__animated animate__fadeInDown'
              },
              hideClass: {
                popup: 'animate__animated animate__fadeOutUp'
              },
              timer: 2500,
              timerProgressBar: true
            });
          } else {
            this.mostrarFormularioCliente = true;
            this.clienteSeleccionado = null;
            
            // Mostrar mensaje de cliente no encontrado
            Swal.fire({
              icon: 'info',
              title: 'Cliente No Encontrado',
              html: `
                <div class="text-center">
                  <div class="mb-4">
                    <i class="fas fa-user-plus text-5xl text-blue-500"></i>
                  </div>
                  <p class="text-lg mb-2">No se encontró un cliente con el DNI: <strong>${this.dniBusqueda}</strong></p>
                  <p class="text-sm text-gray-600">Se ha abierto el formulario para registrar un nuevo cliente</p>
                </div>
              `,
              confirmButtonColor: '#3b82f6',
              confirmButtonText: 'Entendido',
              showClass: {
                popup: 'animate__animated animate__fadeInDown'
              },
              hideClass: {
                popup: 'animate__animated animate__fadeOutUp'
              }
            });
          }
        },
        error: (error) => {
          console.error('Error al buscar cliente:', error);
          
          Swal.fire({
            icon: 'error',
            title: '¡Error en la Búsqueda!',
            text: 'Ha ocurrido un error al buscar el cliente. Por favor, inténtalo de nuevo.',
            confirmButtonColor: '#ef4444',
            confirmButtonText: 'Entendido',
            showClass: {
              popup: 'animate__animated animate__fadeInDown'
            },
            hideClass: {
              popup: 'animate__animated animate__fadeOutUp'
            }
          });
        }
      });
    }
  }

  registrarCliente() {
    if (this.clienteForm.valid) {
      const clienteData: ClienteRequest = this.clienteForm.value;
      console.log('Datos del cliente a enviar:', clienteData);
      
      // Mostrar loading mientras se registra
      Swal.fire({
        title: 'Registrando Cliente...',
        text: 'Por favor espere mientras se procesa la información',
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        }
      });
      
      this.clienteService.crearCliente(clienteData).subscribe({
        next: (clienteCreado) => {
          this.clienteSeleccionado = clienteCreado;
          console.log('Cliente creado:', clienteCreado);
          console.log('ID del cliente creado:', clienteCreado.identificador);
          
          // Establecer el clienteId en el formulario
          this.ventaForm.get('clienteId')?.setValue(clienteCreado.identificador);
          
          // Forzar la actualización del formulario
          this.ventaForm.get('clienteId')?.markAsTouched();
          this.ventaForm.get('clienteId')?.markAsDirty();
          
          console.log('Formulario después de crear cliente:', this.ventaForm.value);
          console.log('clienteId después de patchValue:', this.ventaForm.get('clienteId')?.value);
          this.mostrarFormularioCliente = false;
          this.cargarClientes(); // Recargar la lista de clientes
          
          // Mostrar mensaje de éxito
          Swal.fire({
            icon: 'success',
            title: '¡Cliente Registrado Exitosamente!',
            html: `
              <div class="text-center">
                <div class="mb-4">
                  <i class="fas fa-user-plus text-5xl text-blue-500"></i>
                </div>
                <p class="text-lg mb-2">El cliente ha sido registrado correctamente</p>
                <div class="mt-4 p-3 bg-blue-50 rounded-lg">
                  <p><strong>Nombre:</strong> ${clienteCreado.nombre}</p>
                  <p><strong>DNI:</strong> ${clienteCreado.dni}</p>
                  <p><strong>Teléfono:</strong> ${clienteCreado.telefono}</p>
                </div>
              </div>
            `,
            confirmButtonColor: '#3b82f6',
            confirmButtonText: '¡Perfecto!',
            showClass: {
              popup: 'animate__animated animate__fadeInDown'
            },
            hideClass: {
              popup: 'animate__animated animate__fadeOutUp'
            },
            timer: 3000,
            timerProgressBar: true
          });
        },
        error: (error) => {
          console.error('Error al registrar cliente:', error);
          
          Swal.fire({
            icon: 'error',
            title: '¡Error al Registrar Cliente!',
            text: 'Ha ocurrido un error al registrar el cliente. Por favor, inténtalo de nuevo.',
            confirmButtonColor: '#ef4444',
            confirmButtonText: 'Entendido',
            showClass: {
              popup: 'animate__animated animate__fadeInDown'
            },
            hideClass: {
              popup: 'animate__animated animate__fadeOutUp'
            }
          });
        }
      });
    }
  }

  onSubmit() {
    console.log('Estado del formulario de venta:');
    console.log('Válido:', this.ventaForm.valid);
    console.log('Valores:', this.ventaForm.value);
    console.log('Errores:', this.ventaForm.errors);
    
    // Mostrar errores de cada campo
    Object.keys(this.ventaForm.controls).forEach(key => {
      const control = this.ventaForm.get(key);
      if (control?.invalid) {
        console.log(`Campo ${key} inválido:`, control.errors);
      }
    });

    if (this.ventaForm.valid) {
      // Verificar que hay autos disponibles
      if (this.autos.length === 0) {
        Swal.fire({
          icon: 'error',
          title: '¡Error!',
          text: 'No hay autos con stock disponible para vender.',
          confirmButtonColor: '#ef4444',
          confirmButtonText: 'Entendido',
          showClass: {
            popup: 'animate__animated animate__fadeInDown'
          },
          hideClass: {
            popup: 'animate__animated animate__fadeOutUp'
          }
        });
        return;
      }
      
      // Verificar que el auto seleccionado tenga stock disponible
      const autoId = this.ventaForm.get('autoId')?.value;
      console.log('Auto ID del formulario:', autoId, 'Tipo:', typeof autoId);
      console.log('Autos disponibles:', this.autos);
      
      if (!autoId) {
        Swal.fire({
          icon: 'warning',
          title: '¡Atención!',
          text: 'Por favor, seleccione un automóvil.',
          confirmButtonColor: '#f59e0b',
          confirmButtonText: 'Entendido',
          showClass: {
            popup: 'animate__animated animate__fadeInDown'
          },
          hideClass: {
            popup: 'animate__animated animate__fadeOutUp'
          }
        });
        return;
      }
      
      // Convertir a number para comparación consistente
      const autoIdNumber = Number(autoId);
      const autoSeleccionado = this.autos.find(auto => auto.id === autoIdNumber);
      
      console.log('Auto ID convertido a number:', autoIdNumber);
      console.log('Auto seleccionado encontrado:', autoSeleccionado);
      
      if (!autoSeleccionado) {
        Swal.fire({
          icon: 'error',
          title: '¡Error!',
          text: 'Auto no encontrado. Por favor, seleccione un auto válido.',
          confirmButtonColor: '#ef4444',
          confirmButtonText: 'Entendido',
          showClass: {
            popup: 'animate__animated animate__fadeInDown'
          },
          hideClass: {
            popup: 'animate__animated animate__fadeOutUp'
          }
        });
        console.error('No se encontró auto con ID:', autoIdNumber);
        console.error('Autos disponibles:', this.autos.map(a => ({ id: a.id, marca: a.marca, modelo: a.modelo })));
        return;
      }
      
      if (autoSeleccionado.stock <= 0) {
        Swal.fire({
          icon: 'error',
          title: '¡Error!',
          text: 'El auto seleccionado no tiene stock disponible.',
          confirmButtonColor: '#ef4444',
          confirmButtonText: 'Entendido',
          showClass: {
            popup: 'animate__animated animate__fadeInDown'
          },
          hideClass: {
            popup: 'animate__animated animate__fadeOutUp'
          }
        });
        return;
      }

      // Mostrar confirmación antes de registrar
      Swal.fire({
        title: '¿Confirmar Venta?',
        html: `
          <div class="text-left">
            <p><strong>Cliente:</strong> ${this.clienteSeleccionado?.nombre}</p>
            <p><strong>Auto:</strong> ${autoSeleccionado.marca} ${autoSeleccionado.modelo}</p>
            <p><strong>Precio:</strong> S/ ${this.ventaForm.get('precioVenta')?.value}</p>
            <p><strong>Método de Pago:</strong> ${this.ventaForm.get('metodoPago')?.value}</p>
          </div>
        `,
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#10b981',
        cancelButtonColor: '#6b7280',
        confirmButtonText: '¡Sí, Registrar Venta!',
        cancelButtonText: 'Cancelar',
        showClass: {
          popup: 'animate__animated animate__fadeInDown'
        },
        hideClass: {
          popup: 'animate__animated animate__fadeOutUp'
        }
      }).then((result) => {
        if (result.isConfirmed) {
          this.loading = true;
          
          const ventaData: VentaRequest = {
            idCliente: Number(this.ventaForm.get('clienteId')?.value),
            idAuto: Number(this.ventaForm.get('autoId')?.value),
            idUsuario: 1, // TODO: Obtener el ID del usuario logueado
            fecha: this.ventaForm.get('fechaVenta')?.value,
            precioVenta: this.ventaForm.get('precioVenta')?.value,
            metodoPago: this.ventaForm.get('metodoPago')?.value
          };

          console.log('Datos de venta a enviar:', ventaData);

          this.ventaService.crearVenta(ventaData).subscribe({
            next: () => {
              this.loading = false;
              
              // Mostrar mensaje de éxito con SweetAlert2
              Swal.fire({
                icon: 'success',
                title: '¡Venta Registrada Exitosamente!',
                html: `
                  <div class="text-center">
                    <div class="mb-4">
                      <i class="fas fa-check-circle text-6xl text-green-500"></i>
                    </div>
                    <p class="text-lg mb-2">La venta ha sido registrada correctamente</p>
                    <p class="text-sm text-gray-600">El stock del automóvil ha sido actualizado</p>
                    <div class="mt-4 p-3 bg-green-50 rounded-lg">
                      <p><strong>Cliente:</strong> ${this.clienteSeleccionado?.nombre}</p>
                      <p><strong>Auto:</strong> ${autoSeleccionado.marca} ${autoSeleccionado.modelo}</p>
                      <p><strong>Precio:</strong> S/ ${this.ventaForm.get('precioVenta')?.value}</p>
                    </div>
                  </div>
                `,
                confirmButtonColor: '#10b981',
                confirmButtonText: '¡Perfecto!',
                showClass: {
                  popup: 'animate__animated animate__fadeInDown'
                },
                hideClass: {
                  popup: 'animate__animated animate__fadeOutUp'
                },
                timer: 4000,
                timerProgressBar: true,
                didClose: () => {
                  // Recargar la lista de autos para reflejar los cambios en el stock
                  this.cargarAutos();
                  // Redirigir a la lista de ventas
                  this.router.navigate(['/dashboard/ventas']);
                }
              });
            },
            error: (error) => {
              console.error('Error al registrar venta:', error);
              this.loading = false;
              
              Swal.fire({
                icon: 'error',
                title: '¡Error al Registrar!',
                text: 'Ha ocurrido un error al registrar la venta. Por favor, inténtalo de nuevo.',
                confirmButtonColor: '#ef4444',
                confirmButtonText: 'Entendido',
                showClass: {
                  popup: 'animate__animated animate__fadeInDown'
                },
                hideClass: {
                  popup: 'animate__animated animate__fadeOutUp'
                }
              });
            }
          });
        }
      });
    }
  }

  cancelar() {
            this.router.navigate(['/dashboard/ventas']);
  }

  mostrarFormularioNuevoCliente() {
    this.mostrarFormularioCliente = true;
    this.clienteSeleccionado = null;
    this.clienteForm.reset();
  }

  // Métodos para estadísticas de stock
  get totalAutos(): number {
    return this.autos.length;
  }

  get autosConStock(): number {
    return this.autos.filter(auto => auto.stock > 0).length;
  }

  get autosSinStock(): number {
    return this.autos.filter(auto => auto.stock <= 0).length;
  }

  // Método para obtener información del auto seleccionado
  get autoSeleccionadoInfo(): string {
    const autoId = this.ventaForm.get('autoId')?.value;
    if (!autoId) return 'No seleccionado';
    
    const auto = this.autos.find(a => a.id == autoId);
    if (!auto) return 'No encontrado';
    
    return `${auto.marca} ${auto.modelo}`;
  }

  debugFormulario() {
    console.log('=== DEBUG FORMULARIO VENTA ===');
    console.log('Formulario válido:', this.ventaForm.valid);
    console.log('Valores del formulario:', JSON.stringify(this.ventaForm.value, null, 2));
    console.log('Cliente seleccionado:', JSON.stringify(this.clienteSeleccionado, null, 2));
    console.log('Cliente ID en formulario:', this.ventaForm.get('clienteId')?.value);
    
    // Verificar cada campo
    Object.keys(this.ventaForm.controls).forEach(key => {
      const control = this.ventaForm.get(key);
      console.log(`Campo ${key}:`, {
        valor: control?.value,
        válido: control?.valid,
        inválido: control?.invalid,
        errores: control?.errors,
        touched: control?.touched,
        dirty: control?.dirty
      });
    });
    console.log('==============================');
  }
} 