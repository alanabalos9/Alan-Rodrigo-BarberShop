export interface Booking {
  id: number;
  cliente: string;
  barbero: string;
  servicio: string;
  precio: number;
  propina: number;
  estado: 'pendiente' | 'confirmado' | 'cancelado';
  fecha: Date;
}