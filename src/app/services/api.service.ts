import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = 'https://mockapi.io/projects/6a8da136baf2ac84246d4bb2'; // Reemplaza con tu URL

  constructor(private http: HttpClient) {}

  // Consulta (GET)
  getDatos(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  // Alta (POST)
  crearDato(nuevoDato: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, nuevoDato);
  }

  // Eliminación (DELETE)
  eliminarDato(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }
}