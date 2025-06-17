// auth.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = 'https://localhost:8080/api/auth';  // Reemplaza con tu endpoint real
  // private isAuthenticated$: Observable<boolean>;

  constructor(private http: HttpClient, private router: Router) {}

  login(credentials: { username: string, password: string }): Observable<any> {
    return this.http.post<{token: string}>(`${this.apiUrl}/login`, credentials).pipe(
      tap(response => {
        if (response.token) {
          localStorage.setItem('auth_token', response.token);
        }
      })
    );
  }



  isLoggedIn(): boolean {
    return !!this.getToken();
  }


  logout() {
    localStorage.removeItem('auth_token');
    this.router.navigate(['/login']);
  }


  getToken(): string | null {
    return localStorage.getItem('auth_token');
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
