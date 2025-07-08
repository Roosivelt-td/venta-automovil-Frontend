import { InjectionToken } from '@angular/core';

export interface ApiConfig {
  baseUrl: string;
  endpoints: {
    auth: string;
    usuarios: string;
    compras: string;
    clientes: string;
    ventas: string;
    autos: string;
    // Se agrega aquí más endpoints según se necesita
  };
}

export const API_CONFIG = new InjectionToken<ApiConfig>('api.config', {
  factory: () => {
    // Detectar el entorno
    const isProduction = window.location.hostname !== 'localhost';
    
    // URL base según el entorno
    const baseUrl = isProduction 
      ? 'https://tu-backend.railway.app/api' // URL de producción
      : 'http://localhost:8080/api'; // URL de desarrollo
    
    return {
      baseUrl,
      endpoints: {
        auth: '/auth',
        usuarios: '/usuarios',
        compras: '/compras',
        clientes: '/clientes',
        ventas: '/ventas',
        autos: '/autos'
      }
    };
  }
});
