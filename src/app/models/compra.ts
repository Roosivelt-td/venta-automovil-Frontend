export interface Compra {
  identificador: number;
  idProveedor: number;
  idAuto: number;
  fecha: string;
  precioCompra: number;
  
  // Datos relacionados (opcionales para mostrar información completa)
  proveedor?: {
    id: number;
    nombre: string;
    direccion: string;
    telefono: string;
  };
  
  auto?: {
    id: number;
    marca: string;
    modelo: string;
    año: number;
    color: string;
    precio: number;
  };
}

export interface CompraRequest {
  idProveedor: number;
  idAuto: number;
  fecha: string;
  precioCompra: number;
} 