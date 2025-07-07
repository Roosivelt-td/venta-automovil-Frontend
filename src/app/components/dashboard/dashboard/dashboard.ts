import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { interval, Subscription } from 'rxjs';
import { HttpClientModule, HttpClient } from '@angular/common/http';

// Interfaces temporales
interface DashboardStats {
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

interface ActividadReciente {
  id: number;
  tipo: string;
  descripcion: string;
  fecha: string;
  icono: string;
  color: string;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class DashboardComponent implements OnInit, OnDestroy {
  stats: DashboardStats = {
    totalAutos: 0,
    autosVendidos: 0,
    stockDisponible: 0,
    totalClientes: 0,
    totalVentas: 0,
    totalPagos: 0,
    totalProveedores: 0,
    totalCompras: 0,
    totalReembolsos: 0,
    ingresosTotales: 0,
    promedioVenta: 0,
    autosSinStock: 0
  };

  actividades: ActividadReciente[] = [];
  alertas: any[] = [];
  topAutosVendidos: any[] = [];
  estadisticasVentas: any[] = [];
  
  loading = false;
  errorMessage = '';
  private refreshSubscription?: Subscription;

  constructor(
    private http: HttpClient,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.cargarDatos();
    
    // Actualizar datos cada 30 segundos
    this.refreshSubscription = interval(30000).subscribe(() => {
      this.cargarDatos();
    });
  }

  ngOnDestroy(): void {
    if (this.refreshSubscription) {
      this.refreshSubscription.unsubscribe();
    }
  }

  cargarDatos(): void {
    this.loading = true;
    this.errorMessage = '';

    const apiUrl = 'http://localhost:8080/api';

    // Obtener datos reales de la base de datos
    Promise.all([
      this.http.get<any[]>(`${apiUrl}/autos/`).toPromise().catch(() => []),
      this.http.get<any[]>(`${apiUrl}/ventas/todos`).toPromise().catch(() => []),
      this.http.get<any[]>(`${apiUrl}/clientes/todos`).toPromise().catch(() => []),
      this.http.get<any[]>(`${apiUrl}/pagos/todos`).toPromise().catch(() => []),
      this.http.get<any[]>(`${apiUrl}/proveedores/todos`).toPromise().catch(() => []),
      this.http.get<any[]>(`${apiUrl}/compras/todos`).toPromise().catch(() => []),
      this.http.get<any[]>(`${apiUrl}/reembolsos/todos`).toPromise().catch(() => [])
    ]).then(([autos, ventas, clientes, pagos, proveedores, compras, reembolsos]) => {
      // Asegurar que los arrays no sean undefined
      const autosArray = autos || [];
      const ventasArray = ventas || [];
      const clientesArray = clientes || [];
      const pagosArray = pagos || [];
      const proveedoresArray = proveedores || [];
      const comprasArray = compras || [];
      const reembolsosArray = reembolsos || [];

      // Debug: Ver qué datos se están recibiendo
      console.log('Autos recibidos:', autosArray);
      console.log('Primer auto:', autosArray[0]);

      // Calcular estadísticas
      const totalAutos = autosArray.length;
      const autosVendidos = ventasArray.length;
      const stockDisponible = autosArray.reduce((sum, auto) => {
        const stock = auto.stock || 0;
        console.log(`Auto ${auto.marca} ${auto.modelo}: stock = ${stock}`);
        return sum + stock;
      }, 0);
      const autosSinStock = autosArray.filter(auto => (auto.stock || 0) === 0).length;
      const totalClientes = clientesArray.length;
      const totalVentas = ventasArray.length;
      const totalPagos = pagosArray.length;
      const totalProveedores = proveedoresArray.length;
      const totalCompras = comprasArray.length;
      const totalReembolsos = reembolsosArray.length;

      // Debug: Mostrar resultados de cálculos
      console.log('Resultados de cálculos:');
      console.log('- Total autos:', totalAutos);
      console.log('- Stock disponible:', stockDisponible);
      console.log('- Autos sin stock:', autosSinStock);
      
      // Calcular ingresos totales
      const ingresosTotales = pagosArray.reduce((sum, pago) => sum + (pago.monto || 0), 0);
      
      // Calcular promedio de venta
      const promedioVenta = totalVentas > 0 ? ingresosTotales / totalVentas : 0;

      this.stats = {
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

      // Generar actividad reciente
      this.actividades = [];
      
      // Agregar autos recientes
      autosArray.slice(0, 3).forEach(auto => {
        this.actividades.push({
          id: auto.id,
          tipo: 'auto',
          descripcion: `Auto agregado: ${auto.marca} ${auto.modelo} ${auto.anio}`,
          fecha: auto.fechaCreacion || new Date().toISOString(),
          icono: 'fas fa-car',
          color: 'blue'
        });
      });

      // Agregar ventas recientes
      ventasArray.slice(0, 3).forEach(venta => {
        this.actividades.push({
          id: venta.id,
          tipo: 'venta',
          descripcion: `Venta completada: ${venta.auto?.marca} ${venta.auto?.modelo}`,
          fecha: venta.fecha,
          icono: 'fas fa-dollar-sign',
          color: 'green'
        });
      });

      // Agregar clientes recientes
      clientesArray.slice(0, 2).forEach(cliente => {
        this.actividades.push({
          id: cliente.id,
          tipo: 'cliente',
          descripcion: `Cliente registrado: ${cliente.nombre} ${cliente.apellido}`,
          fecha: cliente.fechaRegistro || new Date().toISOString(),
          icono: 'fas fa-user',
          color: 'purple'
        });
      });

      // Agregar pagos recientes
      pagosArray.slice(0, 2).forEach(pago => {
        this.actividades.push({
          id: pago.id,
          tipo: 'pago',
          descripcion: `Pago registrado: S/ ${pago.monto}`,
          fecha: pago.fecha,
          icono: 'fas fa-credit-card',
          color: 'orange'
        });
      });

      // Ordenar por fecha (más recientes primero) y tomar los últimos 8
      this.actividades = this.actividades
        .sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime())
        .slice(0, 8);

      // Generar alertas
      this.alertas = [];
      if (autosSinStock > 0) {
        this.alertas.push({
          tipo: 'warning',
          titulo: 'Stock Bajo',
          mensaje: `${autosSinStock} auto(s) con stock bajo (≤2 unidades)`,
          icono: 'fas fa-exclamation-triangle'
        });
      }

      // Generar top autos vendidos
      const autosCount: { [key: string]: any } = {};
      ventasArray.forEach(venta => {
        const autoKey = `${venta.auto?.marca} ${venta.auto?.modelo}`;
        if (!autosCount[autoKey]) {
          autosCount[autoKey] = {
            nombre: autoKey,
            ventas: 0,
            ingresos: 0
          };
        }
        autosCount[autoKey].ventas++;
        autosCount[autoKey].ingresos += venta.precioVenta || 0;
      });

      this.topAutosVendidos = Object.values(autosCount)
        .sort((a: any, b: any) => b.ventas - a.ventas)
        .slice(0, 5);

      this.loading = false;
    }).catch(error => {
      console.error('Error al cargar datos del dashboard:', error);
      this.errorMessage = 'Error al cargar los datos del dashboard';
      this.loading = false;
    });
  }

  // Navegación a diferentes secciones
  navegarAAutos() {
    this.router.navigate(['/dashboard/autos/gestionar']);
  }

  navegarAVentas() {
    this.router.navigate(['/dashboard/ventas']);
  }

  navegarAClientes() {
    this.router.navigate(['/dashboard/clientes']);
  }

  navegarAPagos() {
    this.router.navigate(['/dashboard/pagos']);
  }

  navegarAProveedores() {
    this.router.navigate(['/dashboard/proveedores']);
  }

  // Formatear tiempo relativo
  formatearTiempoRelativo(fecha: string): string {
    const ahora = new Date();
    const fechaActividad = new Date(fecha);
    const diferencia = ahora.getTime() - fechaActividad.getTime();
    
    const minutos = Math.floor(diferencia / (1000 * 60));
    const horas = Math.floor(diferencia / (1000 * 60 * 60));
    const dias = Math.floor(diferencia / (1000 * 60 * 60 * 24));

    if (minutos < 60) {
      return `Hace ${minutos} min`;
    } else if (horas < 24) {
      return `Hace ${horas} hora${horas > 1 ? 's' : ''}`;
    } else {
      return `Hace ${dias} día${dias > 1 ? 's' : ''}`;
    }
  }

  // Obtener color de alerta
  getColorAlerta(tipo: string): string {
    switch (tipo) {
      case 'success': return 'green';
      case 'warning': return 'yellow';
      case 'danger': return 'red';
      default: return 'blue';
    }
  }

  // Obtener icono de alerta
  getIconoAlerta(tipo: string): string {
    switch (tipo) {
      case 'success': return 'fas fa-check-circle';
      case 'warning': return 'fas fa-exclamation-triangle';
      case 'danger': return 'fas fa-times-circle';
      default: return 'fas fa-info-circle';
    }
  }
}
