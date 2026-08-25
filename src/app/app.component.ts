import { Component, OnInit } from '@angular/core';
import { ApiService, Turno } from './services/api.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {
  datos: Turno[] = [];

  nuevoTurno: Turno = {
    Nombre: '',
    Apellido: '',
    Barbero: '',
    Servicio: ''
  };

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.obtenerDatos();
  }

  obtenerDatos(): void {
    this.apiService.getDatos().subscribe({
      next: (res) => this.datos = res,
      error: (err) => console.error('Error al obtener turnos:', err)
    });
  }

  crearTurno(): void {
    if (!this.nuevoTurno.Nombre || !this.nuevoTurno.Apellido) return;

    this.apiService.crearDato(this.nuevoTurno).subscribe({
      next: () => {
        this.obtenerDatos();
        this.nuevoTurno = { Nombre: '', Apellido: '', Barbero: '', Servicio: '' };
      }
    });
  }

  borrarItem(id?: string): void {
    if (!id) return;
    this.apiService.eliminarDato(id).subscribe({
      next: () => this.obtenerDatos()
    });
  }
}