import { Injectable, inject } from '@angular/core';
import { ApiConfig, API_CONFIG } from './api.config';

@Injectable({
  providedIn: 'root'
})
export class ApiUrlService {
  private config = inject(API_CONFIG);

  getUrl(endpoint: keyof ApiConfig['endpoints']): string {
    const url = `${this.config.baseUrl}${this.config.endpoints[endpoint]}`;
    console.log('URL construida:', url);
    return url;
  }
}
