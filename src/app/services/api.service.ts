import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Turno {
  id?: string;
  Nombre: string;
  Apellido: string;
  DNI: string;
  Telefono: string;
  Barbero: string;   // id del barbero
  Servicio: string;  // estilo/servicio elegido
  Fecha: string;     // YYYY-MM-DD
  Hora: string;       // HH:mm
}

export interface Barbero {
  id?: string;
  Nombre: string;
  Apellido: string;
  FotoPerfil?: string;
  Especialidad?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl = 'https://6a8da136baf2ac84246d4bb1.mockapi.io/api/v1';

  constructor(private http: HttpClient) {}

  // ---- Turnos ----
  getTurnos(): Observable<Turno[]> {
    return this.http.get<Turno[]>(`${this.baseUrl}/Turnos`);
  }

  crearTurno(nuevoTurno: Turno): Observable<Turno> {
    return this.http.post<Turno>(`${this.baseUrl}/Turnos`, nuevoTurno);
  }

  eliminarTurno(id: string): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/Turnos/${id}`);
  }

  // ---- Barberos ----
  getBarberos(): Observable<Barbero[]> {
    return this.http.get<Barbero[]>(`${this.baseUrl}/Barberos`);
  }

  crearBarbero(nuevoBarbero: Barbero): Observable<Barbero> {
    return this.http.post<Barbero>(`${this.baseUrl}/Barberos`, nuevoBarbero);
  }

  eliminarBarbero(id: string): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/Barberos/${id}`);
  }
}