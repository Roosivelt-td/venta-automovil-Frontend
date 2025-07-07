import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiUrlService } from '../config/ApiUrlService';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  private http = inject(HttpClient);
  private apiUrl = inject(ApiUrlService);

  getUsuarios(): Observable<User[]> {
    return this.http.get<User[]>(this.apiUrl.getUrl('usuarios') + '/todos');
  }

  getUsersDisponibles(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl.getUrl('usuarios') + '/users-disponibles');
  }

  crearUsuario(usuario: Partial<User>): Observable<User> {
    return this.http.post<User>(this.apiUrl.getUrl('usuarios') + '/create', usuario);
  }

  actualizarUsuario(id: number, usuario: Partial<User>): Observable<User> {
    return this.http.put<User>(`${this.apiUrl.getUrl('usuarios')}/update/${id}`, usuario);
  }

  deleteUsuario(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl.getUrl('usuarios')}/delete/${id}`);
  }

  updateEstado(id: number, estado: boolean): Observable<User> {
    return this.http.patch<User>(`${this.apiUrl.getUrl('usuarios')}/${id}`, { estado });
  }
}
