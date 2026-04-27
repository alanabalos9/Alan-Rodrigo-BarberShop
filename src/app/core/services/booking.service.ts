import { Injectable } from '@angular/core';
import { Booking } from '../models/booking.model';

@Injectable({
  providedIn: 'root'
})
export class BookingService {
  private bookings: Booking[] = []; // Aquí se guardarán temporalmente

  // Agregar reserva (lo usa el cliente)
  addBooking(booking: any) {
    const newBooking: Booking = {
      ...booking,
      id: Date.now(),
      precio: 2500, // Precio base de ejemplo
      propina: 0,
      estado: 'pendiente',
      fecha: new Date()
    };
    this.bookings.push(newBooking);
  }

  // Obtener todos los turnos (lo usa el Admin)
  getBookings() {
    return this.bookings;
  }

  // Confirmar asistencia y sumar propina
  confirmarAsistencia(id: number, propina: number) {
    const index = this.bookings.findIndex(b => b.id === id);
    if (index !== -1) {
      this.bookings[index].estado = 'confirmado';
      this.bookings[index].propina = propina;
    }
  }

  // Estadísticas para los reportes que pediste
  getGananciasDelDia() {
    return this.bookings
      .filter(b => b.estado === 'confirmado')
      .reduce((total, b) => total + b.precio + b.propina, 0);
  }
}