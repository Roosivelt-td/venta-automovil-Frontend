import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';
import { ProveedorService, Proveedor } from '../../../../services/proveedor.service';

@Component({
  selector: 'app-editar-proveedor',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, HttpClientModule],
  templateUrl: './editar-proveedor.html',
  styleUrls: ['./editar-proveedor.css']
})
export class EditarProveedorComponent implements OnInit, OnChanges {
  @Input() proveedor: Proveedor | null = null;
  @Input() mostrarModal = false;
  @Output() cerrar = new EventEmitter<void>();
  @Output() actualizado = new EventEmitter<void>();

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
    console.log('EditarProveedorComponent ngOnInit - proveedor:', this.proveedor);
    if (this.proveedor) {
      this.proveedorForm.patchValue(this.proveedor);
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log('EditarProveedorComponent ngOnChanges - changes:', changes);
    if (changes['proveedor'] && changes['proveedor'].currentValue) {
      console.log('Cargando datos del proveedor:', changes['proveedor'].currentValue);
      this.proveedorForm.patchValue(changes['proveedor'].currentValue);
    }
    if (changes['mostrarModal']) {
      console.log('Estado del modal cambió a:', changes['mostrarModal'].currentValue);
    }
  }

  cerrarModal(): void {
    this.cerrar.emit();
  }

  onSubmit(): void {
    if (this.proveedorForm.valid && this.proveedor) {
      this.isLoading = true;
      this.errorMessage = '';
      this.successMessage = '';

      const proveedorData: Proveedor = {
        ...this.proveedorForm.value,
        identificador: this.proveedor.identificador
      };

      this.proveedorService.actualizarProveedor(this.proveedor.identificador!, proveedorData).subscribe({
        next: (response: any) => {
          this.isLoading = false;
          this.successMessage = 'Proveedor actualizado exitosamente';
          console.log('Proveedor actualizado:', response);
          this.actualizado.emit();
          setTimeout(() => this.cerrarModal(), 1500);
        },
        error: (error: any) => {
          this.isLoading = false;
          this.errorMessage = 'Error al actualizar el proveedor: ' + (error.error?.message || error.message || 'Error desconocido');
          console.error('Error al actualizar proveedor:', error);
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