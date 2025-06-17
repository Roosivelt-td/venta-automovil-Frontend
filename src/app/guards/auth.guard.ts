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
    if (this.authService.isLoggedIn()) {
      // Si la ruta es login y el usuario está autenticado, redirigir al dashboard
      if (route.routeConfig?.path === 'login') {
        this.router.navigate(['/dashboard']);
        return false;
      }
      return true;
    }

    // Si la ruta requiere autenticación y el usuario no está autenticado
    if (route.routeConfig?.path !== 'login') {
      this.router.navigate(['/login']);
      return false;
    }

    return true;
  }

}

