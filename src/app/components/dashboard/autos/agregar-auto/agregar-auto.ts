import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';
import { AutoService, Auto } from '../../../../services/auto.service';

@Component({
  selector: 'app-agregar-auto',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, HttpClientModule],
  templateUrl: './agregar-auto.html',
  styleUrls: ['./agregar-auto.css']
})
export class AgregarAutoComponent implements OnInit {
  mostrarModal = false;
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
    private router: Router,
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
      imagenUrl: ['']
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
    this.router.navigate(['/dashboard/autos/gestionar']);
  }

  onSubmit(): void {
    if (this.autoForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';
      this.successMessage = '';

      const autoData: Auto = {
        marca: this.autoForm.value.marca,
        modelo: this.autoForm.value.modelo,
        anio: this.autoForm.value.anio,
        color: this.autoForm.value.color,
        precio: this.autoForm.value.precio,
        kilometraje: this.autoForm.value.kilometraje,
        tipoCombustible: this.autoForm.value.tipoCombustible,
        transmision: this.autoForm.value.transmision,
        cilindrada: this.autoForm.value.cilindrada,
        potencia: this.autoForm.value.potencia,
        stock: this.autoForm.value.stock,
        descripcion: this.autoForm.value.descripcion,
        imagenUrl: this.autoForm.value.imagenUrl,
        estado: 'Disponible'
      };

      this.autoService.crearAuto(autoData).subscribe({
        next: (response: any) => {
          this.isLoading = false;
          this.successMessage = 'Auto registrado exitosamente en la base de datos';
          console.log('Auto creado:', response);
          
          // Limpiar formulario
          this.autoForm.reset();
          
          // Redirigir después de 2 segundos
          setTimeout(() => {
            this.cerrarModal();
          }, 2000);
        },
        error: (error: any) => {
          this.isLoading = false;
          this.errorMessage = 'Error al registrar el auto: ' + (error.error?.message || error.message || 'Error desconocido');
          console.error('Error al crear auto:', error);
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