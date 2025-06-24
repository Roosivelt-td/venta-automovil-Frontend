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
    return this.http.get<User[]>(this.apiUrl.getUrl('usuarios'));
  }

  deleteUsuario(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl.getUrl('usuarios')}/${id}`);
  }

  updateEstado(id: number, estado: boolean): Observable<User> {
    return this.http.patch<User>(`${this.apiUrl.getUrl('usuarios')}/${id}`, { estado });
  }
}
