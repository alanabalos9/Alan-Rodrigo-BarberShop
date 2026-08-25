import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// Definimos la interfaz con los campos que creaste en MockAPI
export interface Turno {
  id?: string;
  Nombre: string;
  Apellido: string;
  FotoPerfil?: string;
  Barbero?: string;
  Servicio?: string;
  Fecha?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  // URL exacta del recurso endpoint de MockAPI:
  private apiUrl = 'https://6a8da136baf2ac84246d4bb1.mockapi.io/api/v1/TURNOS';

  constructor(private http: HttpClient) {}

  // Consulta (GET)
  getDatos(): Observable<Turno[]> {
    return this.http.get<Turno[]>(this.apiUrl);
  }

  // Alta (POST)
  crearDato(nuevoDato: Turno): Observable<Turno> {
    return this.http.post<Turno>(this.apiUrl, nuevoDato);
  }

  // Eliminación (DELETE)
  eliminarDato(id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }
}