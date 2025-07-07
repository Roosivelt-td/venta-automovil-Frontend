import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { UsuarioService } from '../../../services/usuario';
import { AuthService } from '../../../services/auth';
import { User } from '../../../models/user';

@Component({
  selector: 'app-usuarios-list',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './usuarios.html',
  styleUrls: ['./usuarios.css']
})
export class UsuariosListComponent implements OnInit {
  mostrarModalRegistro: boolean = false;
  mostrarModalEdicion: boolean = false;
  mostrarModalConfirmacion: boolean = false;
  usuarios: User[] = [];
  usuariosFiltrados: User[] = [];
  usersDisponibles: any[] = [];
  usuarioForm!: FormGroup;
  usuarioEditando: User | null = null;
  usuarioEliminando: User | null = null;
  isLoading: boolean = false;
  usuarioEliminandoId: number | null = null;
  terminoBusqueda: string = '';
  crearCredenciales: boolean = true; // Controla si se crean credenciales de acceso

  private usuarioService = inject(UsuarioService);
  private authService = inject(AuthService);
  private fb = inject(FormBuilder);

  ngOnInit() {
    this.inicializarFormulario();
    this.cargarUsuarios();
    this.cargarUsersDisponibles();
  }

  inicializarFormulario() {
    this.usuarioForm = this.fb.group({
      // Datos personales (tabla usuarios)
      nombre: ['', [Validators.required, Validators.minLength(2)]],
      apellido: ['', [Validators.required, Validators.minLength(2)]],
      sexo: ['', Validators.required],
      direccion: ['', [Validators.required, Validators.minLength(5)]],
      celular: ['', [Validators.required, Validators.pattern(/^[0-9]{9,10}$/)]],
      estado: [true, Validators.required],
      
      // Datos de autenticación (tabla user) - opcionales
      username: [''],
      email: ['', [Validators.email]],
      password: [''],
      confirmPassword: [''],
      
      // Relación con user existente
      idUser: [null]
    });

    // Validaciones condicionales para credenciales
    this.usuarioForm.get('crearCredenciales')?.valueChanges.subscribe(crear => {
      if (crear) {
        this.usuarioForm.get('username')?.setValidators([Validators.required, Validators.minLength(3)]);
        this.usuarioForm.get('email')?.setValidators([Validators.required, Validators.email]);
        this.usuarioForm.get('password')?.setValidators([Validators.required, Validators.minLength(6)]);
        this.usuarioForm.get('confirmPassword')?.setValidators([Validators.required]);
        this.usuarioForm.get('idUser')?.clearValidators();
      } else {
        this.usuarioForm.get('username')?.clearValidators();
        this.usuarioForm.get('email')?.clearValidators();
        this.usuarioForm.get('password')?.clearValidators();
        this.usuarioForm.get('confirmPassword')?.clearValidators();
      }
      this.usuarioForm.get('username')?.updateValueAndValidity();
      this.usuarioForm.get('email')?.updateValueAndValidity();
      this.usuarioForm.get('password')?.updateValueAndValidity();
      this.usuarioForm.get('confirmPassword')?.updateValueAndValidity();
    });
  }

  cargarUsuarios() {
    this.usuarioService.getUsuarios().subscribe({
      next: (data: User[]) => {
        console.log('Usuarios cargados:', data);
        this.usuarios = data;
        this.usuariosFiltrados = data;
        this.filtrarUsuarios();
      },
      error: (error) => {
        console.error('Error al cargar usuarios:', error);
        this.usuarios = [];
        this.usuariosFiltrados = [];
        alert('Error al cargar usuarios. Por favor, recarga la página.');
      }
    });
  }

  cargarUsersDisponibles() {
    this.usuarioService.getUsersDisponibles().subscribe({
      next: (data: any[]) => {
        console.log('Users disponibles:', data);
        this.usersDisponibles = data;
      },
      error: (error) => {
        console.error('Error al cargar users disponibles:', error);
        this.usersDisponibles = [];
      }
    });
  }

  abrirModalRegistro() {
    this.mostrarModalRegistro = true;
    this.crearCredenciales = true;
    this.usuarioForm.reset({ 
      estado: true, 
      idUser: null,
      crearCredenciales: true 
    });
  }

  cerrarModalRegistro() {
    this.mostrarModalRegistro = false;
    this.usuarioForm.reset();
    this.crearCredenciales = true;
  }

  abrirModalEdicion(usuario: User) {
    this.usuarioEditando = usuario;
    this.mostrarModalEdicion = true;
    
    // Cargar los datos del usuario en el formulario
    this.usuarioForm.patchValue({
      nombre: usuario.nombre,
      apellido: usuario.apellido,
      sexo: usuario.sexo,
      direccion: usuario.direccion,
      celular: usuario.celular,
      estado: usuario.estado,
      idUser: usuario.idUser
    });
  }

  cerrarModalEdicion() {
    this.mostrarModalEdicion = false;
    this.usuarioEditando = null;
    this.usuarioForm.reset();
  }

  registrarUsuario() {
    if (this.usuarioForm.valid) {
      // Validar que las contraseñas coincidan si se están creando credenciales
      if (this.crearCredenciales) {
        const password = this.usuarioForm.get('password')?.value;
        const confirmPassword = this.usuarioForm.get('confirmPassword')?.value;
        
        if (password !== confirmPassword) {
          alert('Las contraseñas no coinciden');
          return;
        }
      }

      this.isLoading = true;
      const formData = this.usuarioForm.value;
      
      if (this.crearCredenciales) {
        // Crear usuario con credenciales (ambas tablas)
        const registerData = {
          username: formData.username,
          password: formData.password,
          email: formData.email,
          nombre: formData.nombre,
          apellido: formData.apellido,
          sexo: formData.sexo,
          direccion: formData.direccion,
          celular: formData.celular
        };

        this.authService.register(registerData).subscribe({
          next: (response) => {
            console.log('Usuario registrado exitosamente con credenciales:', response);
            this.cargarUsuarios();
            this.cerrarModalRegistro();
            this.isLoading = false;
            alert('Usuario registrado exitosamente con credenciales de acceso');
          },
          error: (error) => {
            this.isLoading = false;
            console.error('Error al registrar usuario con credenciales:', error);
            alert('Error al registrar usuario: ' + (error.error?.message || 'Error desconocido'));
          }
        });
      } else {
        // Crear solo usuario sin credenciales (solo tabla usuarios)
        const nuevoUsuario = {
          nombre: formData.nombre,
          apellido: formData.apellido,
          sexo: formData.sexo,
          direccion: formData.direccion,
          celular: formData.celular,
          estado: formData.estado,
          idUser: formData.idUser || null
        };

        this.usuarioService.crearUsuario(nuevoUsuario).subscribe({
          next: (usuario) => {
            this.cargarUsuarios();
            this.cerrarModalRegistro();
            this.isLoading = false;
            alert('Usuario registrado exitosamente');
          },
          error: (error) => {
            this.isLoading = false;
            console.error('Error al registrar usuario:', error);
            alert('Error al registrar usuario. Por favor, inténtalo de nuevo.');
          }
        });
      }
    } else {
      this.marcarCamposInvalidos();
    }
  }

  actualizarUsuario() {
    if (this.usuarioForm.valid && this.usuarioEditando) {
      this.isLoading = true;
      const usuarioActualizado = this.usuarioForm.value;
      
      console.log('Actualizando usuario:', this.usuarioEditando.identificador, usuarioActualizado);
      
      this.usuarioService.actualizarUsuario(this.usuarioEditando.identificador, usuarioActualizado).subscribe({
        next: (usuario) => {
          console.log('Usuario actualizado exitosamente:', usuario);
          this.cargarUsuarios();
          this.cerrarModalEdicion();
          this.isLoading = false;
          alert('Usuario actualizado exitosamente');
        },
        error: (error) => {
          this.isLoading = false;
          console.error('Error al actualizar usuario:', error);
          alert('Error al actualizar usuario: ' + (error.error?.message || error.message || 'Error desconocido'));
        }
      });
    } else {
      this.marcarCamposInvalidos();
    }
  }

  eliminarUsuario(usuario: User) {
    this.usuarioEliminando = usuario;
    this.mostrarModalConfirmacion = true;
  }

  confirmarEliminacion() {
    if (this.usuarioEliminando) {
      this.usuarioEliminandoId = this.usuarioEliminando.identificador;
      console.log('Eliminando usuario:', this.usuarioEliminando.identificador);
      
      this.usuarioService.deleteUsuario(this.usuarioEliminando.identificador).subscribe({
        next: () => {
          console.log('Usuario eliminado exitosamente');
          this.cargarUsuarios();
          this.cerrarModalConfirmacion();
          alert('Usuario eliminado exitosamente');
        },
        error: (error) => {
          this.usuarioEliminandoId = null;
          console.error('Error al eliminar usuario:', error);
          alert('Error al eliminar usuario: ' + (error.error?.message || error.message || `Error ${error.status}: ${error.statusText}`));
        }
      });
    }
  }

  cerrarModalConfirmacion() {
    this.mostrarModalConfirmacion = false;
    this.usuarioEliminando = null;
  }

  marcarCamposInvalidos() {
    Object.keys(this.usuarioForm.controls).forEach(key => {
      const control = this.usuarioForm.get(key);
      if (control?.invalid) {
        control.markAsTouched();
      }
    });
  }

  esCampoInvalido(campo: string): boolean {
    const control = this.usuarioForm.get(campo);
    return !!(control?.invalid && control?.touched);
  }

  obtenerMensajeError(campo: string): string {
    const control = this.usuarioForm.get(campo);
    if (control?.hasError('required')) {
      return 'Este campo es requerido';
    }
    if (control?.hasError('minlength')) {
      return `Mínimo ${control.errors?.['minlength'].requiredLength} caracteres`;
    }
    if (control?.hasError('email')) {
      return 'Email inválido';
    }
    if (control?.hasError('pattern')) {
      return 'Formato inválido';
    }
    return 'Campo inválido';
  }

  filtrarUsuarios() {
    if (!this.terminoBusqueda.trim()) {
      this.usuariosFiltrados = this.usuarios;
      return;
    }

    const termino = this.terminoBusqueda.toLowerCase();
    this.usuariosFiltrados = this.usuarios.filter(usuario =>
      usuario.nombre?.toLowerCase().includes(termino) ||
      usuario.apellido?.toLowerCase().includes(termino) ||
      usuario.celular?.includes(termino) ||
      usuario.direccion?.toLowerCase().includes(termino) ||
      usuario.sexo?.toLowerCase().includes(termino) ||
      usuario.identificador?.toString().includes(termino)
    );
  }

  onBusquedaChange(event: any) {
    this.terminoBusqueda = event.target.value;
    this.filtrarUsuarios();
  }

  limpiarBusqueda() {
    this.terminoBusqueda = '';
    this.filtrarUsuarios();
  }
} 