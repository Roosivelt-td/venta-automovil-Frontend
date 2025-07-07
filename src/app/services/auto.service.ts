import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

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

@Injectable({
  providedIn: 'root'
})
export class AutoService {
  private apiUrl = 'http://localhost:8080/api/autos';

  constructor(private http: HttpClient) { }

  // Crear un nuevo auto
  crearAuto(auto: Auto): Observable<any> {
    return this.http.post(`${this.apiUrl}/create`, auto);
  }

  // Obtener todos los autos
  obtenerTodosLosAutos(): Observable<Auto[]> {
    return this.http.get<Auto[]>(`${this.apiUrl}/`);
  }

  // Obtener auto por ID
  obtenerAutoPorId(id: number): Observable<Auto> {
    return this.http.get<Auto>(`${this.apiUrl}/${id}`);
  }

  // Actualizar auto
  actualizarAuto(id: number, auto: Auto): Observable<any> {
    return this.http.put(`${this.apiUrl}/update/${id}`, auto);
  }

  // Eliminar auto
  eliminarAuto(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/delete/${id}`);
  }

  // Obtener autos por marca
  obtenerAutosPorMarca(marca: string): Observable<Auto[]> {
    return this.http.get<Auto[]>(`${this.apiUrl}/marca/${marca}`);
  }

  // Buscar autos por marca y modelo
  buscarAutosPorMarcaYModelo(marca: string, modelo: string): Observable<Auto[]> {
    return this.http.get<Auto[]>(`${this.apiUrl}/buscar?marca=${marca}&modelo=${modelo}`);
  }

  // Actualizar stock de un auto
  actualizarStock(id: number, cantidad: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}/stock?cantidad=${cantidad}`, {});
  }
} 