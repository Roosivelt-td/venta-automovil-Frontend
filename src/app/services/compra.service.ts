import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiUrlService } from '../config/ApiUrlService';
import { Compra, CompraRequest } from '../models/compra';

@Injectable({
  providedIn: 'root'
})
export class CompraService {
  private http = inject(HttpClient);
  private apiUrl = inject(ApiUrlService);

  // Obtener todas las compras
  getCompras(): Observable<Compra[]> {
    return this.http.get<Compra[]>(this.apiUrl.getUrl('compras') + '/todos');
  }

  // Obtener una compra por ID
  getCompraById(id: number): Observable<Compra> {
    return this.http.get<Compra>(`${this.apiUrl.getUrl('compras')}/${id}`);
  }

  // Crear una nueva compra
  crearCompra(compra: CompraRequest): Observable<void> {
    return this.http.post<void>(this.apiUrl.getUrl('compras') + '/create', compra);
  }

  // Actualizar una compra existente
  actualizarCompra(id: number, compra: CompraRequest): Observable<void> {
    return this.http.put<void>(`${this.apiUrl.getUrl('compras')}/update/${id}`, compra);
  }

  // Eliminar una compra
  deleteCompra(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl.getUrl('compras')}/delete/${id}`);
  }
} 