import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiUrlService } from '../config/ApiUrlService';

export interface Cliente {
  identificador?: number;
  nombre: string;
  apellidos?: string;
  dni: number;
  telefono: string;
  direccion: string;
  correo: string;
}

export interface ClienteRequest {
  nombre: string;
  // apellidos?: string; // Comentado porque no existe en la BD
  dni: number;
  telefono: string;
  direccion: string;
  correo: string;
}

@Injectable({
  providedIn: 'root'
})
export class ClienteService {
  private apiUrl: string;

  constructor(private http: HttpClient, private apiUrlService: ApiUrlService) {
    this.apiUrl = 'http://localhost:8080/api';
  }

  // Obtener todos los clientes
  obtenerTodosLosClientes(): Observable<Cliente[]> {
    return this.http.get<Cliente[]>(`${this.apiUrl}/clientes/todos`);
  }

  // Obtener cliente por ID
  obtenerClientePorId(id: number): Observable<Cliente> {
    return this.http.get<Cliente>(`${this.apiUrl}/clientes/${id}`);
  }

  // Crear nuevo cliente
  crearCliente(cliente: ClienteRequest): Observable<Cliente> {
    console.log('URL de creación:', `${this.apiUrl}/clientes/create`);
    console.log('Datos a enviar:', cliente);
    return this.http.post<Cliente>(`${this.apiUrl}/clientes/create`, cliente);
  }

  // Actualizar cliente
  actualizarCliente(id: number, cliente: ClienteRequest): Observable<Cliente> {
    return this.http.put<Cliente>(`${this.apiUrl}/clientes/update/${id}`, cliente);
  }

  // Eliminar cliente
  eliminarCliente(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/clientes/delete/${id}`);
  }

  // Buscar clientes por DNI
  buscarClientesPorDni(dni: number): Observable<Cliente[]> {
    return this.http.get<Cliente[]>(`${this.apiUrl}/clientes/buscar?dni=${dni}`);
  }
} 