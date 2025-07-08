import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Proveedor {
  identificador?: number;
  nombreEmpresa: string;
  ruc: string;
  contacto: string;
  telefono: string;
  direccion?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ProveedorService {
  private apiUrl = 'http://localhost:8080/api/proveedores';

  constructor(private http: HttpClient) { }

  // Crear un nuevo proveedor
  crearProveedor(proveedor: Proveedor): Observable<any> {
    return this.http.post(`${this.apiUrl}/create`, proveedor);
  }

  // Obtener todos los proveedores
  obtenerTodosLosProveedores(): Observable<Proveedor[]> {
    return this.http.get<Proveedor[]>(`${this.apiUrl}/todos`);
  }

  // Obtener proveedor por ID
  obtenerProveedorPorId(id: number): Observable<Proveedor> {
    return this.http.get<Proveedor>(`${this.apiUrl}/${id}`);
  }

  // Actualizar proveedor
  actualizarProveedor(id: number, proveedor: Proveedor): Observable<any> {
    return this.http.put(`${this.apiUrl}/update/${id}`, proveedor);
  }

  // Eliminar proveedor
  eliminarProveedor(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/delete/${id}`);
  }

  // Buscar proveedores por nombre de empresa
  buscarProveedoresPorEmpresa(nombreEmpresa: string): Observable<Proveedor[]> {
    return this.http.get<Proveedor[]>(`${this.apiUrl}/buscar?nombreEmpresa=${nombreEmpresa}`);
  }

  // Buscar proveedores por RUC
  buscarProveedoresPorRuc(ruc: string): Observable<Proveedor[]> {
    return this.http.get<Proveedor[]>(`${this.apiUrl}/buscar?ruc=${ruc}`);
  }
} 