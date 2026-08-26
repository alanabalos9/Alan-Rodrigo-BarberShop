import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Turno {
  id?: string;
  Nombre: string;
  Apellido: string;
  Dni?: string;
  Telefono?: string;
  FotoPerfil?: string;
  Barbero?: string;
  Servicio?: string;
  Fecha?: string;
  Hora?: string;
}

export interface Barbero {
  id?: string;
  Nombre: string;
  Apellido?: string;
  FotoPerfil?: string;
  Especialidad?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl = 'https://6a8da136baf2ac84246d4bb1.mockapi.io/api/v1';

  constructor(private http: HttpClient) {}

  getDatos(): Observable<Turno[]> {
    return this.http.get<Turno[]>(`${this.baseUrl}/turnos`);
  }

  crearDato(nuevoDato: Turno): Observable<Turno> {
    return this.http.post<Turno>(`${this.baseUrl}/turnos`, nuevoDato);
  }

  eliminarDato(id: string): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/turnos/${id}`);
  }

  getBarberos(): Observable<Barbero[]> {
    return this.http.get<Barbero[]>(`${this.baseUrl}/barberos`);
  }

  crearBarbero(nuevoBarbero: Barbero): Observable<Barbero> {
    return this.http.post<Barbero>(`${this.baseUrl}/barberos`, nuevoBarbero);
  }

  eliminarBarbero(id: string): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/barberos/${id}`);
  }
}