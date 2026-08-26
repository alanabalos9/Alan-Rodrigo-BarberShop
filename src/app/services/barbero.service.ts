import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Barbero } from '../models/barbero.model';

@Injectable({
  providedIn: 'root'
})
export class BarberoService {
  private apiUrl = 'https://6a8da136baf2ac84246d4bb1.mockapi.io/api/v1/Barberos';

  constructor(private http: HttpClient) {}

  getBarberos(): Observable<Barbero[]> {
    return this.http.get<Barbero[]>(this.apiUrl);
  }

  guardarBarbero(barbero: Barbero): Observable<Barbero> {
    return this.http.post<Barbero>(this.apiUrl, barbero);
  }
}