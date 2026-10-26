import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { HttpClient } from '@angular/common/http';
import { WeatherService } from '../services/weather.service';

export interface Turno {
  id: string;
  Nombre: string;
  Apellido: string;
  Barbero: string;
  Servicio: string;
  Fecha: string;
  Hora: string;
}

export interface Barbero {
  id: string;
  nombre: string;
  apellido: string;
  especialidad: string;
}

@Component({
  selector: 'app-turnos',
  standalone: true,
  imports: [CommonModule, MatButtonModule],
  templateUrl: './turnos.component.html',
  styleUrls: ['./turnos.component.scss']
})
export class TurnosComponent implements OnInit {
  turnos: Turno[] = [];
  barberosMap: { [key: string]: string } = {};
  errorMensaje: string = '';
  currentTemp: number | null = null;

  // URL MockAPI
  private apiUrl = 'https://6a8da136baf2ac84246d4bb1.mockapi.io/api/v1';

  constructor(
    private http: HttpClient,
    private weatherService: WeatherService
  ) {}

  ngOnInit(): void {
    // 1. Obtener clima de la API externa
    this.weatherService.getCurrentWeather().subscribe({
      next: (data) => {
        if (data && data.current_weather) {
          this.currentTemp = data.current_weather.temperature;
        }
      },
      error: (err) => console.error('Error al obtener el clima externo:', err)
    });

    // 2. Cargar barberos y turnos desde MockAPI
    this.cargarBarberosYTurnos();
  }

  cargarBarberosYTurnos(): void {
    // Primero cargamos los barberos para armar el mapa de IDs a Nombres
    this.http.get<Barbero[]>(`${this.apiUrl}/Barberos`).subscribe({
      next: (barberos) => {
        barberos.forEach(b => {
          this.barberosMap[b.id] = `${b.nombre} ${b.apellido}`;
        });
        // Luego cargamos los turnos
        this.cargarTurnos();
      },
      error: (err) => {
        console.error('Error al cargar barberos', err);
        this.cargarTurnos(); // Intentamos cargar turnos igual
      }
    });
  }

  cargarTurnos(): void {
    this.http.get<Turno[]>(`${this.apiUrl}/Turnos`).subscribe({
      next: (data) => {
        this.turnos = data;
        this.errorMensaje = '';
      },
      error: (err) => {
        console.error('Error al cargar los turnos', err);
        this.errorMensaje = 'No se pudieron cargar los turnos desde el servidor.';
      }
    });
  }

  nombreBarbero(barberoId: string): string {
    return this.barberosMap[barberoId] || barberoId;
  }

  cancelarTurno(id: string): void {
    if (confirm('¿Estás seguro de que deseas cancelar este turno?')) {
      this.http.delete(`${this.apiUrl}/Turnos/${id}`).subscribe({
        next: () => {
          // Filtramos localmente para actualizar la vista al instante
          this.turnos = this.turnos.filter(t => t.id !== id);
        },
        error: (err) => {
          console.error('Error al eliminar el turno', err);
          this.errorMensaje = 'No se pudo eliminar el turno.';
        }
      });
    }
  }
}