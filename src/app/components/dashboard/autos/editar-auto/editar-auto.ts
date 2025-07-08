import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AutoService, Auto } from '../../../../services/auto.service';

@Component({
  selector: 'app-editar-auto',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, HttpClientModule],
  templateUrl: './editar-auto.html',
  styleUrls: ['./editar-auto.css']
})
export class EditarAutoComponent implements OnInit, OnChanges {
  @Input() auto: Auto | null = null;
  @Input() mostrarModal = false;
  @Output() cerrar = new EventEmitter<void>();
  @Output() actualizado = new EventEmitter<void>();

  autoForm: FormGroup;
  isLoading = false;
  errorMessage = '';
  successMessage = '';

  marcas = [
    'Toyota', 'Honda', 'Ford', 'Chevrolet', 'Nissan', 'BMW', 'Mercedes-Benz',
    'Audi', 'Volkswagen', 'Hyundai', 'Kia', 'Mazda', 'Subaru', 'Lexus',
    'Acura', 'Infiniti', 'Volvo', 'Jaguar', 'Land Rover', 'Porsche'
  ];
  colores = [
    'Blanco', 'Negro', 'Gris', 'Plateado', 'Azul', 'Rojo', 'Verde',
    'Amarillo', 'Naranja', 'Marrón', 'Beige', 'Dorado', 'Púrpura'
  ];
  tiposCombustible = [
    'Gasolina', 'Diesel', 'Eléctrico', 'Híbrido', 'Gas Natural', 'Hidrógeno'
  ];
  transmisiones = [
    'Manual', 'Automática', 'CVT', 'Semi-automática'
  ];

  constructor(
    private fb: FormBuilder,
    private autoService: AutoService
  ) {
    this.autoForm = this.fb.group({
      marca: ['', Validators.required],
      modelo: ['', Validators.required],
      anio: ['', [Validators.required, Validators.min(1900), Validators.max(new Date().getFullYear() + 1)]],
      color: ['', Validators.required],
      precio: ['', [Validators.required, Validators.min(0)]],
      kilometraje: ['', [Validators.required, Validators.min(0)]],
      tipoCombustible: ['', Validators.required],
      transmision: ['', Validators.required],
      cilindrada: ['', [Validators.required, Validators.min(0)]],
      potencia: ['', [Validators.required, Validators.min(0)]],
      stock: ['', [Validators.required, Validators.min(0)]],
      descripcion: ['', Validators.maxLength(500)],
      imagenUrl: [''],
      estado: ['']
    });
  }

  ngOnInit(): void {
    console.log('EditarAutoComponent ngOnInit - auto:', this.auto);
    if (this.auto) {
      this.autoForm.patchValue(this.auto);
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log('EditarAutoComponent ngOnChanges - changes:', changes);
    if (changes['auto'] && changes['auto'].currentValue) {
      console.log('Cargando datos del auto:', changes['auto'].currentValue);
      this.autoForm.patchValue(changes['auto'].currentValue);
    }
    if (changes['mostrarModal']) {
      console.log('Estado del modal cambió a:', changes['mostrarModal'].currentValue);
    }
  }

  cerrarModal(): void {
    this.cerrar.emit();
  }

  onSubmit(): void {
    if (this.autoForm.valid && this.auto) {
      this.isLoading = true;
      this.errorMessage = '';
      this.successMessage = '';
      const autoData: Auto = {
        ...this.autoForm.value,
        id: this.auto.id
      };
      this.autoService.actualizarAuto(this.auto.id!, autoData).subscribe({
        next: () => {
          this.isLoading = false;
          this.successMessage = 'Auto actualizado exitosamente';
          this.actualizado.emit();
          setTimeout(() => this.cerrarModal(), 1500);
        },
        error: (error: any) => {
          this.isLoading = false;
          this.errorMessage = 'Error al actualizar el auto: ' + (error.error?.message || error.message || 'Error desconocido');
        }
      });
    } else {
      this.marcarCamposInvalidos();
    }
  }

  marcarCamposInvalidos(): void {
    Object.keys(this.autoForm.controls).forEach(key => {
      const control = this.autoForm.get(key);
      if (control?.invalid) {
        control.markAsTouched();
      }
    });
  }

  esCampoInvalido(campo: string): boolean {
    const control = this.autoForm.get(campo);
    return control ? (control.invalid && control.touched) : false;
  }

  obtenerMensajeError(campo: string): string {
    const control = this.autoForm.get(campo);
    if (control?.errors) {
      if (control.errors['required']) return 'Este campo es requerido';
      if (control.errors['min']) return `El valor mínimo es ${control.errors['min'].min}`;
      if (control.errors['max']) return `El valor máximo es ${control.errors['max'].max}`;
      if (control.errors['maxlength']) return `Máximo ${control.errors['maxlength'].requiredLength} caracteres`;
    }
    return '';
  }
} 