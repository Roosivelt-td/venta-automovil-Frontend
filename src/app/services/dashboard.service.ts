import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

export interface DashboardStats {
  totalAutos: number;
  autosVendidos: number;
  stockDisponible: number;
  totalClientes: number;
  totalVentas: number;
  totalPagos: number;
  totalProveedores: number;
  totalCompras: number;
  totalReembolsos: number;
  ingresosTotales: number;
  promedioVenta: number;
  autosSinStock: number;
}

export interface ActividadReciente {
  id: number;
  tipo: string;
  descripcion: string;
  fecha: string;
  icono: string;
  color: string;
}

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private apiUrl = 'http://localhost:8080/api';

  constructor(private http: HttpClient) { }

  // Obtener estadísticas completas del dashboard
  obtenerEstadisticas(): Observable<DashboardStats> {
    return forkJoin({
      autos: this.http.get<any[]>(`${this.apiUrl}/autos/todos`).pipe(catchError(() => of([]))),
      ventas: this.http.get<any[]>(`${this.apiUrl}/ventas/todos`).pipe(catchError(() => of([]))),
      clientes: this.http.get<any[]>(`${this.apiUrl}/clientes/todos`).pipe(catchError(() => of([]))),
      pagos: this.http.get<any[]>(`${this.apiUrl}/pagos/todos`).pipe(catchError(() => of([]))),
      proveedores: this.http.get<any[]>(`${this.apiUrl}/proveedores/todos`).pipe(catchError(() => of([]))),
      compras: this.http.get<any[]>(`${this.apiUrl}/compras/todos`).pipe(catchError(() => of([]))),
      reembolsos: this.http.get<any[]>(`${this.apiUrl}/reembolsos/todos`).pipe(catchError(() => of([])))
    }).pipe(
      map(data => {
        const totalAutos = data.autos.length;
        const autosVendidos = data.ventas.length;
        const stockDisponible = data.autos.reduce((sum, auto) => sum + (auto.stock || 0), 0);
        const autosSinStock = data.autos.filter(auto => (auto.stock || 0) === 0).length;
        const totalClientes = data.clientes.length;
        const totalVentas = data.ventas.length;
        const totalPagos = data.pagos.length;
        const totalProveedores = data.proveedores.length;
        const totalCompras = data.compras.length;
        const totalReembolsos = data.reembolsos.length;
        
        // Calcular ingresos totales
        const ingresosTotales = data.pagos.reduce((sum, pago) => sum + (pago.monto || 0), 0);
        
        // Calcular promedio de venta
        const promedioVenta = totalVentas > 0 ? ingresosTotales / totalVentas : 0;

        return {
          totalAutos,
          autosVendidos,
          stockDisponible,
          totalClientes,
          totalVentas,
          totalPagos,
          totalProveedores,
          totalCompras,
          totalReembolsos,
          ingresosTotales,
          promedioVenta,
          autosSinStock
        };
      })
    );
  }

  // Obtener actividad reciente combinando datos de diferentes módulos
  obtenerActividadReciente(): Observable<ActividadReciente[]> {
    return forkJoin({
      autos: this.http.get<any[]>(`${this.apiUrl}/autos/todos`).pipe(catchError(() => of([]))),
      ventas: this.http.get<any[]>(`${this.apiUrl}/ventas/todos`).pipe(catchError(() => of([]))),
      clientes: this.http.get<any[]>(`${this.apiUrl}/clientes/todos`).pipe(catchError(() => of([]))),
      pagos: this.http.get<any[]>(`${this.apiUrl}/pagos/todos`).pipe(catchError(() => of([])))
    }).pipe(
      map(data => {
        const actividades: ActividadReciente[] = [];

        // Agregar autos recientes
        data.autos.slice(0, 3).forEach(auto => {
          actividades.push({
            id: auto.id,
            tipo: 'auto',
            descripcion: `Auto agregado: ${auto.marca} ${auto.modelo} ${auto.anio}`,
            fecha: auto.fechaCreacion || new Date().toISOString(),
            icono: 'fas fa-car',
            color: 'blue'
          });
        });

        // Agregar ventas recientes
        data.ventas.slice(0, 3).forEach(venta => {
          actividades.push({
            id: venta.id,
            tipo: 'venta',
            descripcion: `Venta completada: ${venta.auto?.marca} ${venta.auto?.modelo}`,
            fecha: venta.fecha,
            icono: 'fas fa-dollar-sign',
            color: 'green'
          });
        });

        // Agregar clientes recientes
        data.clientes.slice(0, 2).forEach(cliente => {
          actividades.push({
            id: cliente.id,
            tipo: 'cliente',
            descripcion: `Cliente registrado: ${cliente.nombre} ${cliente.apellido}`,
            fecha: cliente.fechaRegistro || new Date().toISOString(),
            icono: 'fas fa-user',
            color: 'purple'
          });
        });

        // Agregar pagos recientes
        data.pagos.slice(0, 2).forEach(pago => {
          actividades.push({
            id: pago.id,
            tipo: 'pago',
            descripcion: `Pago registrado: S/ ${pago.monto}`,
            fecha: pago.fecha,
            icono: 'fas fa-credit-card',
            color: 'orange'
          });
        });

        // Ordenar por fecha (más recientes primero) y tomar los últimos 8
        return actividades
          .sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime())
          .slice(0, 8);
      })
    );
  }

  // Obtener estadísticas de ventas por mes (últimos 6 meses)
  obtenerEstadisticasVentas(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/ventas/todos`).pipe(
      map(ventas => {
        const meses = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
        const estadisticas = new Array(6).fill(0).map((_, index) => ({
          mes: meses[new Date().getMonth() - index],
          ventas: 0,
          ingresos: 0
        }));

        ventas.forEach(venta => {
          const fecha = new Date(venta.fecha);
          const mesIndex = fecha.getMonth();
          const currentMonth = new Date().getMonth();
          
          // Solo considerar los últimos 6 meses
          if (currentMonth - mesIndex < 6) {
            const index = 5 - (currentMonth - mesIndex);
            if (index >= 0 && index < 6) {
              estadisticas[index].ventas++;
              estadisticas[index].ingresos += venta.precioVenta || 0;
            }
          }
        });

        return estadisticas.reverse();
      }),
      catchError(() => of([]))
    );
  }

  // Obtener top 5 autos más vendidos
  obtenerTopAutosVendidos(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/ventas/todos`).pipe(
      map(ventas => {
        const autosCount: { [key: string]: any } = {};
        
        ventas.forEach(venta => {
          const autoKey = `${venta.auto?.marca} ${venta.auto?.modelo}`;
          if (!autosCount[autoKey]) {
            autosCount[autoKey] = {
              nombre: autoKey,
              ventas: 0,
              ingresos: 0,
              marca: venta.auto?.marca,
              modelo: venta.auto?.modelo
            };
          }
          autosCount[autoKey].ventas++;
          autosCount[autoKey].ingresos += venta.precioVenta || 0;
        });

        return Object.values(autosCount)
          .sort((a: any, b: any) => b.ventas - a.ventas)
          .slice(0, 5);
      }),
      catchError(() => of([]))
    );
  }

  // Obtener alertas del sistema
  obtenerAlertas(): Observable<any[]> {
    return forkJoin({
      autos: this.http.get<any[]>(`${this.apiUrl}/autos/todos`).pipe(catchError(() => of([]))),
      ventas: this.http.get<any[]>(`${this.apiUrl}/ventas/todos`).pipe(catchError(() => of([])))
    }).pipe(
      map(data => {
        const alertas = [];

        // Alerta de stock bajo
        const autosStockBajo = data.autos.filter(auto => (auto.stock || 0) <= 2 && (auto.stock || 0) > 0);
        if (autosStockBajo.length > 0) {
          alertas.push({
            tipo: 'warning',
            titulo: 'Stock Bajo',
            mensaje: `${autosStockBajo.length} auto(s) con stock bajo (≤2 unidades)`,
            icono: 'fas fa-exclamation-triangle'
          });
        }

        // Alerta de sin stock
        const autosSinStock = data.autos.filter(auto => (auto.stock || 0) === 0);
        if (autosSinStock.length > 0) {
          alertas.push({
            tipo: 'danger',
            titulo: 'Sin Stock',
            mensaje: `${autosSinStock.length} auto(s) sin stock disponible`,
            icono: 'fas fa-times-circle'
          });
        }

        // Alerta de ventas del día
        const hoy = new Date().toDateString();
        const ventasHoy = data.ventas.filter(venta => 
          new Date(venta.fecha).toDateString() === hoy
        );
        if (ventasHoy.length > 0) {
          alertas.push({
            tipo: 'success',
            titulo: 'Ventas del Día',
            mensaje: `${ventasHoy.length} venta(s) realizadas hoy`,
            icono: 'fas fa-chart-line'
          });
        }

        return alertas;
      })
    );
  }
} 