import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface Auto {
  id?: number;
  marca: string;
  modelo: string;
  anio: number;
  color: string;
  kilometraje: number;
  tipoCombustible: string;
  transmision: string;
  cilindrada: number;
  potencia: number;
  stock: number;
  precio: number;
  descripcion?: string;
  imagenUrl?: string;
  estado?: string;
}

@Component({
  selector: 'app-ver-auto',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './ver-auto.html',
  styleUrls: ['./ver-auto.css']
})
export class VerAutoComponent implements OnInit, OnChanges {
  @Input() auto: Auto | null = null;
  @Input() mostrarModal = false;
  @Output() cerrar = new EventEmitter<void>();

  imagenError = false;

  ngOnInit(): void {
    console.log('VerAutoComponent ngOnInit - auto:', this.auto);
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log('VerAutoComponent ngOnChanges - changes:', changes);
    if (changes['mostrarModal']) {
      console.log('Estado del modal cambió a:', changes['mostrarModal'].currentValue);
    }
  }

  cerrarModal(): void {
    this.cerrar.emit();
  }

  onImageError(): void {
    this.imagenError = true;
  }

  getImagenUrl(): string {
    console.log('getImagenUrl - auto:', this.auto);
    console.log('getImagenUrl - imagenUrl:', this.auto?.imagenUrl);
    console.log('getImagenUrl - imagenError:', this.imagenError);
    
    if (this.auto?.imagenUrl && this.auto.imagenUrl.trim() !== '' && !this.imagenError) {
      console.log('Retornando imagen del auto:', this.auto.imagenUrl);
      return this.auto.imagenUrl;
    }
    
    console.log('Retornando imagen placeholder');
    // Usar una imagen SVG simple como placeholder
    return 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjNmNGY2Ii8+CiAgPHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxOCIgZmlsbD0iIzY2NzM4NyIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPk5vIGhheSBpbWFnZW48L3RleHQ+Cjwvc3ZnPgo=';
  }

  formatearPrecio(precio: number): string {
    return precio.toLocaleString('es-ES', {
      style: 'currency',
      currency: 'USD'
    });
  }

  formatearKilometraje(kilometraje: number): string {
    return kilometraje.toLocaleString('es-ES') + ' km';
  }
} 