import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Pago {
  identificador?: number;
  idVenta: number;
  metodoPago: string;
  monto: number;
  fecha: string;
  venta?: any; // Información de la venta asociada
}

export interface PagoRequest {
  idVenta: number;
  metodoPago: string;
  monto: number;
  fecha: string;
}

@Injectable({
  providedIn: 'root'
})
export class PagoService {
  private apiUrl = 'http://localhost:8080/api/pagos';

  constructor(private http: HttpClient) { }

  // Obtener todos los pagos
  obtenerTodosLosPagos(): Observable<Pago[]> {
    return this.http.get<Pago[]>(`${this.apiUrl}/todos`);
  }

  // Obtener pago por ID
  obtenerPagoPorId(id: number): Observable<Pago> {
    return this.http.get<Pago>(`${this.apiUrl}/${id}`);
  }

  // Crear nuevo pago
  crearPago(pago: PagoRequest): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/create`, pago);
  }

  // Actualizar pago
  actualizarPago(id: number, pago: PagoRequest): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/update/${id}`, pago);
  }

  // Eliminar pago
  eliminarPago(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/delete/${id}`);
  }
} 