import { InjectionToken } from '@angular/core';

export interface ApiConfig {
  baseUrl: string;
  endpoints: {
    auth: string;
    usuarios: string;
    compras: string;
    // Se agrega aquí más endpoints según se necesita
  };
}

export const API_CONFIG = new InjectionToken<ApiConfig>('api.config', {
  factory: () => ({
    baseUrl: 'http://localhost:8080/api',
    endpoints: {
      auth: '/auth',
      usuarios: '/usuarios',
      compras: '/compras'

    }
  })
});
