import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

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
  private apiUrl = 'https://6a8da136baf2ac84246d4bb1.mockapi.io/api/v1/Turnos';

  constructor(private http: HttpClient) {}

  getDatos(): Observable<Turno[]> {
    return this.http.get<Turno[]>(this.apiUrl);
  }

  crearDato(nuevoDato: Turno): Observable<Turno> {
    return this.http.post<Turno>(this.apiUrl, nuevoDato);
  }

  eliminarDato(id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }
}