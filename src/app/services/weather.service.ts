import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class WeatherService {
  // Usamos una API pública y gratuita de clima (Open-Meteo) para Buenos Aires (Avellaneda)
  private apiUrl = 'https://api.open-meteo.com/v1/forecast?latitude=-34.66&longitude=-58.36&current_weather=true';

  constructor(private http: HttpClient) {}

  getCurrentWeather(): Observable<any> {
    return this.http.get<any>(this.apiUrl).pipe(
      catchError(error => {
        console.error('Error al obtener el clima externo', error);
        return of(null);
      })
    );
  }
}