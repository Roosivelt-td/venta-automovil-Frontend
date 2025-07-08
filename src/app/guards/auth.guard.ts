import { Injectable } from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from '@angular/router';
import { AuthService } from '../services/auth';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    // Verificar si el usuario está logueado (sin verificar token)
    if (this.authService.isLoggedIn()) {
      return true;
    } else {
      // Si no está logueado, redirigir al login
      this.router.navigate(['/login']);
      return false;
    }
  }
}

