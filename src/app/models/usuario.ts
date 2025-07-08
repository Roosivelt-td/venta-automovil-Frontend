export interface Usuario {
  identificador?: number;
  nombre: string;
  apellido: string;
  correo: string;
  contrasena?: string;
  rol: string;
  estado?: boolean;
}
