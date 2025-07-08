import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';
import { ProveedorService, Proveedor } from '../../../../services/proveedor.service';

@Component({
  selector: 'app-agregar-proveedor',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, HttpClientModule],
  templateUrl: './agregar-proveedor.html',
  styleUrls: ['./agregar-proveedor.css']
})
export class AgregarProveedorComponent implements OnInit {
  mostrarModal = false;
  proveedorForm: FormGroup;
  isLoading = false;
  errorMessage = '';
  successMessage = '';

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private proveedorService: ProveedorService
  ) {
    this.proveedorForm = this.fb.group({
      nombreEmpresa: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
      ruc: ['', [Validators.required, Validators.pattern('^[0-9]{11}$')]],
      contacto: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
      telefono: ['', [Validators.required, Validators.pattern('^[0-9]{9}$')]],
      direccion: ['', [Validators.maxLength(200)]]
    });
  }

  ngOnInit(): void {
    // Abrir modal automáticamente al cargar el componente
    this.mostrarModal = true;
  }

  abrirModal(): void {
    this.mostrarModal = true;
  }

  cerrarModal(): void {
    this.mostrarModal = false;
    // Navegar de vuelta a la lista de proveedores
    this.router.navigate(['/dashboard/proveedores']);
  }

  onSubmit(): void {
    if (this.proveedorForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';
      this.successMessage = '';

      const proveedorData: Proveedor = {
        nombreEmpresa: this.proveedorForm.value.nombreEmpresa,
        ruc: this.proveedorForm.value.ruc,
        contacto: this.proveedorForm.value.contacto,
        telefono: this.proveedorForm.value.telefono,
        direccion: this.proveedorForm.value.direccion
      };

      this.proveedorService.crearProveedor(proveedorData).subscribe({
        next: (response: any) => {
          this.isLoading = false;
          this.successMessage = 'Proveedor registrado exitosamente en la base de datos';
          console.log('Proveedor creado:', response);
          
          // Limpiar formulario
          this.proveedorForm.reset();
          
          // Cerrar modal después de 2 segundos sin redirigir
          setTimeout(() => {
            this.cerrarModal();
          }, 2000);
        },
        error: (error: any) => {
          this.isLoading = false;
          this.errorMessage = 'Error al registrar el proveedor: ' + (error.error?.message || error.message || 'Error desconocido');
          console.error('Error al crear proveedor:', error);
        }
      });
    } else {
      this.marcarCamposInvalidos();
    }
  }

  marcarCamposInvalidos(): void {
    Object.keys(this.proveedorForm.controls).forEach(key => {
      const control = this.proveedorForm.get(key);
      if (control?.invalid) {
        control.markAsTouched();
      }
    });
  }

  esCampoInvalido(campo: string): boolean {
    const control = this.proveedorForm.get(campo);
    return control ? (control.invalid && control.touched) : false;
  }

  obtenerMensajeError(campo: string): string {
    const control = this.proveedorForm.get(campo);
    if (control?.errors) {
      if (control.errors['required']) return 'Este campo es requerido';
      if (control.errors['minlength']) return `Mínimo ${control.errors['minlength'].requiredLength} caracteres`;
      if (control.errors['maxlength']) return `Máximo ${control.errors['maxlength'].requiredLength} caracteres`;
      if (control.errors['pattern']) {
        if (campo === 'ruc') return 'El RUC debe tener exactamente 11 dígitos';
        if (campo === 'telefono') return 'El teléfono debe tener exactamente 9 dígitos';
        return 'Formato inválido';
      }
    }
    return '';
  }
} 