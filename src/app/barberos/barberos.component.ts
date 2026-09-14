import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { ApiService, Barbero } from '../services/api.service';
@Component({
  selector: 'app-barberos-admin',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule],
  templateUrl: './barberos.component.html',
  styleUrls: ['./barberos.component.scss']
})
export class BarberosComponent implements OnInit {
  barberos: Barbero[] = [];
  form: FormGroup;
  guardando = false;
  errorMensaje = '';

  constructor(private fb: FormBuilder, private apiService: ApiService) {
    this.form = this.fb.group({
      Nombre: ['', Validators.required],
      Apellido: ['', Validators.required],
      Especialidad: [''],
      FotoPerfil: ['']
    });
  }

  ngOnInit(): void { this.cargarBarberos(); }

  cargarBarberos(): void {
  this.apiService.getBarberos().subscribe({
    next: (data: Barbero[]) => this.barberos = data,
    error: () => this.errorMensaje = 'No se pudieron cargar los barberos.'
  });
}

  agregarBarbero(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }

    this.guardando = true;
    this.apiService.crearBarbero(this.form.value).subscribe({
      next: () => { this.form.reset(); this.guardando = false; this.cargarBarberos(); },
      error: () => { this.errorMensaje = 'No se pudo guardar el barbero.'; this.guardando = false; }
    });
  }

  eliminarBarbero(id?: string): void {
    if (!id || !confirm('¿Eliminar este barbero?')) return;
    this.apiService.eliminarBarbero(id).subscribe({
      next: () => this.cargarBarberos(),
      error: () => this.errorMensaje = 'No se pudo eliminar el barbero.'
    });
  }
}