import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { ApiService, Barbero, Turno } from '../../../../services/api.service';
@Component({
  selector: 'app-booking-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule
  ],
  templateUrl: './booking-form.component.html',
  styleUrls: ['./booking-form.component.scss']
})
export class BookingFormComponent implements OnInit {

  bookingForm: FormGroup;

  barberos: Barbero[] = [];
  servicios: string[] = ['Corte Clásico', 'Corte + Barba', 'Barba', 'Diseño / Fade', 'Corte Niño'];
  horariosBase: string[] = ['09:00','10:00','11:00','12:00','13:00','14:00','15:00','16:00','17:00','18:00','19:00'];
  horariosDisponibles: string[] = [];
  cargandoHorarios = false;
  turnoConfirmado = false;
  errorMensaje = '';
  minFecha: string;

  constructor(private fb: FormBuilder, private apiService: ApiService) {
    this.minFecha = new Date().toISOString().split('T')[0];

    this.bookingForm = this.fb.group({
      Nombre: ['', [Validators.required, Validators.minLength(2)]],
      Apellido: ['', [Validators.required, Validators.minLength(2)]],
      DNI: ['', [Validators.required, Validators.pattern(/^[0-9]{7,8}$/)]],
      Telefono: ['', Validators.required],
      Barbero: ['', Validators.required],
      Servicio: ['', Validators.required],
      Fecha: ['', Validators.required],
      Hora: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.apiService.getBarberos().subscribe({
  next: (data: Barbero[]) => this.barberos = data,
  error: () => this.errorMensaje = 'No se pudieron cargar los barberos.'
});

    this.bookingForm.get('Barbero')?.valueChanges.subscribe(() => this.actualizarHorariosDisponibles());
    this.bookingForm.get('Fecha')?.valueChanges.subscribe(() => this.actualizarHorariosDisponibles());
  }

  actualizarHorariosDisponibles(): void {
    const barberoId = this.bookingForm.get('Barbero')?.value;
    const fecha = this.bookingForm.get('Fecha')?.value;

    this.bookingForm.get('Hora')?.setValue('');
    this.horariosDisponibles = [];

    if (!barberoId || !fecha) return;

    this.cargandoHorarios = true;
    this.apiService.getTurnos().subscribe({
      next: (turnos: Turno[]) => {
        const ocupados = turnos
          .filter(t => t.Barbero === barberoId && t.Fecha === fecha)
          .map(t => t.Hora);

        this.horariosDisponibles = this.horariosBase.filter(h => !ocupados.includes(h));
        this.cargandoHorarios = false;
      },
      error: () => {
        this.errorMensaje = 'No se pudieron consultar los turnos.';
        this.cargandoHorarios = false;
      }
    });
  }

  onSubmit(): void {
    if (this.bookingForm.invalid) {
      this.bookingForm.markAllAsTouched();
      return;
    }

    const nuevoTurno: Turno = this.bookingForm.value;

    this.apiService.crearTurno(nuevoTurno).subscribe({
      next: () => {
        this.turnoConfirmado = true;
        this.errorMensaje = '';
        this.bookingForm.reset();
        this.horariosDisponibles = [];
      },
      error: () => this.errorMensaje = 'No se pudo guardar el turno. Intentá nuevamente.'
    });
  }
}