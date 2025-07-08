// auth.ts
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {inject, Injectable} from '@angular/core';
import { Router } from '@angular/router';
import { Observable, of} from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import {ApiUrlService} from '../config/ApiUrlService';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private http = inject(HttpClient);
  private router = inject(Router);
  private apiUrl = inject(ApiUrlService);

  // Método para registrar usuarios
  register(userData: {
    username: string;
    password: string;
    email: string;
    nombre: string;
    apellido: string;
    sexo: string;
    direccion: string;
    celular: string;
  }): Observable<any> {
    const headers = new HttpHeaders()
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json');

    return this.http.post<any>(
      `${this.apiUrl.getUrl('auth')}/register`,
      userData,
      {
        headers: headers,
        withCredentials: true
      }
    ).pipe(
      tap(response => {
        console.log('Usuario registrado exitosamente:', response);
      }),
      catchError(error => {
        console.error('Error en el registro:', error);
        throw error;
      })
    );
  }

  login(credentials: { username: string, password: string }): Observable<any> {
    const headers = new HttpHeaders()
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json');

    return this.http.post<any>(
      // Aquí está la corrección: usar el método getUrl
      `${this.apiUrl.getUrl('auth')}/login`,
      credentials,
      {

        headers: headers,
        withCredentials: true
      }
    ).pipe(
      tap(response => {
        // Marcar al usuario como logueado (sin verificar token)
        localStorage.setItem('user_logged_in', 'true');
        
        // Guardar datos del usuario si están disponibles en la respuesta
        if (response.user) {
          localStorage.setItem('user_data', JSON.stringify(response.user));
        }
        
        console.log('Usuario logueado exitosamente');
      }),
      catchError(error => {
        console.error('Error en la autenticación:', error);
        throw error;
      })
    );
  }

  isLoggedIn(): boolean {
    // Verificar si el usuario está logueado (sin verificar token)
    return !!localStorage.getItem('user_logged_in');
  }

  logout() {
    localStorage.removeItem('user_logged_in');
    localStorage.removeItem('user_data');
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    return localStorage.getItem('auth_token');
  }

  // Método para obtener los datos del usuario
  getUserData(): any {
    const userData = localStorage.getItem('user_data');
    return userData ? JSON.parse(userData) : null;
  }

  // Método para obtener el nombre del usuario
  getUserName(): string {
    const userData = this.getUserData();
    if (userData) {
      // Si tenemos nombre y apellido, mostrar nombre completo
      if (userData.nombre && userData.apellido) {
        return `${userData.nombre} ${userData.apellido}`;
      }
      // Si solo tenemos nombre
      if (userData.nombre) {
        return userData.nombre;
      }
      // Si solo tenemos username
      if (userData.username) {
        return userData.username;
      }
    }
    return 'Usuario';
  }

  // Método para obtener el email del usuario
  getUserEmail(): string {
    const userData = this.getUserData();
    if (userData) {
      return userData.email || userData.username || '';
    }
    return '';
  }

  // --- Recuperación de contraseña ---

  requestPasswordReset(email: string): Observable<any> {
    // Implementación real:
    // return this.http.post(`${this.apiUrl}/forgot-password`, { email });

    // Simulación para desarrollo:
    return of({ success: true }).pipe(
      tap(() => console.log('Email de recuperación enviado a:', email)),
      catchError(error => {
        console.error('Error al solicitar restablecimiento:', error);
        throw error;
      })
    );
  }

  resetPassword(token: string, newPassword: string): Observable<any> {
    // Implementación real:
    // return this.http.post(`${this.apiUrl}/reset-password`, { token, newPassword });

    // Simulación para desarrollo:
    return of({ success: true }).pipe(
      tap(() => console.log('Contraseña restablecida para token:', token)),
      catchError(error => {
        console.error('Error al restablecer contraseña:', error);
        throw error;
      })
    );
  }
}
