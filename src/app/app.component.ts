import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-mi-vista',
  templateUrl: './mi-vista.component.html'
})
export class MiVistaComponent implements OnInit {
  datos: any[] = [];

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.obtenerDatos();
  }

  obtenerDatos(): void {
    this.apiService.getDatos().subscribe(res => this.datos = res);
  }

  borrarItem(id: number): void {
    this.apiService.eliminarDato(id).subscribe(() => this.obtenerDatos());
  }
}