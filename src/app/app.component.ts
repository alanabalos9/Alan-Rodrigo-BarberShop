import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService, Turno } from './services/api.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {
  datos: Turno[] = [];

  nuevoTurno: Turno = {
    Nombre: '',
    Apellido: '',
    Barbero: '',
    Servicio: ''
  };

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.obtenerDatos();
  }

  obtenerDatos(): void {
    this.apiService.getDatos().subscribe({
      next: (res) => {
        this.datos = res;
      },
      error: (err) => console.error('Error al obtener turnos:', err)
    });
  }

  crearTurno(): void {
    if (!this.nuevoTurno.Nombre || !this.nuevoTurno.Apellido) {
      alert('⚠️ Por favor completa los campos obligatorios: Nombre y Apellido.');
      return;
    }

    this.apiService.crearDato(this.nuevoTurno).subscribe({
      next: () => {
        alert('✅ ¡Turno registrado con éxito!');
        this.obtenerDatos();
        this.nuevoTurno = { Nombre: '', Apellido: '', Barbero: '', Servicio: '' };
      },
      error: (err) => {
        console.error('Error al guardar:', err);
        alert('❌ Hubo un error al conectar con MockAPI.');
      }
    });
  }

  borrarItem(id?: string): void {
    if (!id) return;
    if (confirm('¿Estás seguro de eliminar este turno?')) {
      this.apiService.eliminarDato(id).subscribe({
        next: () => {
          alert('🗑️ Turno eliminado correctamente.');
          this.obtenerDatos();
        },
        error: (err) => console.error('Error al eliminar:', err)
      });
    }
  }
}