import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Barbero, Turno } from './barbero.model';

@Injectable({
  providedIn: 'root'
})
export class BarberoService {
  private baseUrl = 'https://6a8da136baf2ac84246d4bb12.mockapi.io/api/v1';

  constructor(private http: HttpClient) {}

  getBarberos(): Observable<Barbero[]> {
    return this.http.get<Barbero[]>(`${this.baseUrl}/Barberos`);
  }

  guardarBarbero(barbero: Barbero): Observable<Barbero> {
    return this.http.post<Barbero>(`${this.baseUrl}/Barberos`, barbero);
  }

  getTurnos(): Observable<Turno[]> {
    return this.http.get<Turno[]>(`${this.baseUrl}/Turnos`);
  }

  guardarTurno(turno: Turno): Observable<Turno> {
    return this.http.post<Turno>(`${this.baseUrl}/Turnos`, turno);
  }
}