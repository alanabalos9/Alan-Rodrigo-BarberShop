import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { ApiService, Turno, Barbero } from '../services/api.service';
@Component({
  selector: 'app-turnos-admin',
  standalone: true,
  imports: [CommonModule, MatButtonModule],
  templateUrl: './turnos.component.html',
  styleUrls: ['./turnos.component.scss']
})
export class TurnosComponent implements OnInit {
  turnos: Turno[] = [];
  barberos: Barbero[] = [];
  errorMensaje = '';

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
  this.apiService.getBarberos().subscribe({ next: (data: Barbero[]) => this.barberos = data });
  this.cargarTurnos();
}

cargarTurnos(): void {
  this.apiService.getTurnos().subscribe({
    next: (data: Turno[]) => this.turnos = data.sort((a, b) => (a.Fecha + a.Hora).localeCompare(b.Fecha + b.Hora)),
    error: () => this.errorMensaje = 'No se pudieron cargar los turnos.'
  });
}
  nombreBarbero(id: string): string {
    const b = this.barberos.find(x => x.id === id);
    return b ? `${b.Nombre} ${b.Apellido}` : id;
  }

  cancelarTurno(id?: string): void {
    if (!id || !confirm('¿Cancelar este turno?')) return;
    this.apiService.eliminarTurno(id).subscribe({
      next: () => this.cargarTurnos(),
      error: () => this.errorMensaje = 'No se pudo cancelar el turno.'
    });
  }
}