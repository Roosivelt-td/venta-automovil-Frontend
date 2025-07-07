import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiUrlService } from '../config/ApiUrlService';
import { Usuario } from '../models/usuario';
import {Router} from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  private http = inject(HttpClient);
  private router = inject(Router);
  private apiUrl = inject(ApiUrlService);
  getUsuarios(): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(this.apiUrl.getUrl('usuarios'));
  }

  deleteUsuario(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl.getUrl('usuarios')}/${id}`);
  }

  updateEstado(id: number, estado: boolean): Observable<Usuario> {
    return this.http.patch<Usuario>(`${this.apiUrl.getUrl('usuarios')}/${id}`, { estado });
  }
}
