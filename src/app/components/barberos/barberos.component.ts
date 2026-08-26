import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BarberoService } from '../../services/barbero.service';
import { Barbero } from '../../models/barbero.model';

@Component({
  selector: 'app-barberos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './barberos.component.html',
  styleUrls: ['./barberos.component.scss']
})
export class BarberosComponent implements OnInit {
  barberos: Barbero[] = [];

  nuevoBarbero: Barbero = {
    nombre: '',
    apellido: '',
    color: ''
  };
  
constructor(private barberoService: BarberoService) {}

  ngOnInit(): void {
    this.cargarBarberos();
  }

  cargarBarberos(): void {
    this.barberoService.getBarberos().subscribe({
      next: (data) => {
        this.barberos = data;
      },
      error: (err) => console.error('Error al traer los barberos:', err)
    });
  }

  guardar(): void {
    if (!this.nuevoBarbero.nombre || !this.nuevoBarbero.apellido) return;

    this.barberoService.guardarBarbero(this.nuevoBarbero).subscribe({
      next: () => {
        this.nuevoBarbero = { nombre: '', apellido: '', color: '' };
        this.cargarBarberos();
      },
      error: (err) => console.error('Error al guardar:', err)
    });
  }
}