import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BarberoService } from './barbero.service';
import { Barbero, Turno } from './barbero.model';

@Component({
  selector: 'app-barberos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './barberos.component.html'
})
export class BarberosComponent implements OnInit {
  pestanaActiva: 'reserva' | 'admin' = 'reserva';

  barberos: Barbero[] = [];
  barberosFiltrados: Barbero[] = [];
  turnosExistentes: Turno[] = [];

  servicios: string[] = [];
  horariosJornada: string[] = ['09:00', '10:00', '11:00', '12:00', '14:00', '15:00', '16:00', '17:00', '18:00'];
  horariosDisponibles: string[] = [];

  reserva: Turno = {
    Nombre: '',
    Apellido: '',
    DNI: '',
    Telefono: '',
    Servicio: '',
    Barbero: '',
    Fecha: '',
    Hora: ''
  };

  nuevoBarbero: Barbero = {
    Nombre: '',
    Apellido: '',
    Especialidad: ''
  };

  constructor(private barberoService: BarberoService) {}

  ngOnInit(): void {
    this.cargarDatos();
  }

  cargarDatos(): void {
    this.barberoService.getBarberos().subscribe({
      next: (data) => {
        this.barberos = (data || []).map((b: any) => ({
          id: b.id,
          Nombre: b.Nombre || b.nombre || '',
          Apellido: b.Apellido || b.apellido || '',
          Especialidad: b.Especialidad || b.especialidad || ''
        }));

        this.barberosFiltrados = [...this.barberos];

        const especialidadesSet = new Set<string>();
        this.barberos.forEach(b => {
          if (b.Especialidad) especialidadesSet.add(b.Especialidad.trim());
        });
        this.servicios = Array.from(especialidadesSet);
      },
      error: (err) => console.error('Error al cargar barberos:', err)
    });

    this.barberoService.getTurnos().subscribe({
      next: (turnos) => {
        this.turnosExistentes = turnos || [];
      },
      error: (err) => console.error('Error al cargar turnos:', err)
    });
  }

  guardarBarbero(): void {
    if (!this.nuevoBarbero.Nombre || !this.nuevoBarbero.Apellido) {
      alert('Nombre y Apellido son requeridos.');
      return;
    }

    this.barberoService.guardarBarbero(this.nuevoBarbero).subscribe({
      next: () => {
        alert('Barbero registrado con éxito');
        this.nuevoBarbero = { Nombre: '', Apellido: '', Especialidad: '' };
        this.cargarDatos();
      },
      error: (err) => console.error('Error al guardar el barbero:', err)
    });
  }

  onServicioChange(servicio: string): void {
    this.reserva.Servicio = servicio;
    this.reserva.Barbero = '';
    this.reserva.Fecha = '';
    this.reserva.Hora = '';
    this.horariosDisponibles = [];

    if (!servicio || servicio.trim() === '') {
      this.barberosFiltrados = [...this.barberos];
    } else {
      this.barberosFiltrados = this.barberos.filter(b => 
        b.Especialidad && b.Especialidad.trim().toLowerCase() === servicio.trim().toLowerCase()
      );
    }
  }

  onBarberoChange(barberoId: string): void {
    this.reserva.Barbero = barberoId;
    this.reserva.Fecha = '';
    this.reserva.Hora = '';
    this.horariosDisponibles = [];
  }

  onFechaChange(fecha: string): void {
    this.reserva.Fecha = fecha;
    this.reserva.Hora = '';

    if (!fecha || !this.reserva.Barbero) {
      this.horariosDisponibles = [];
      return;
    }

    const turnosOcupados = this.turnosExistentes.filter(t => 
      String(t.Barbero) === String(this.reserva.Barbero) && t.Fecha === fecha
    );

    const horasOcupadas = turnosOcupados.map(t => t.Hora);
    this.horariosDisponibles = this.horariosJornada.filter(h => !horasOcupadas.includes(h));
  }

  confirmarReserva(): void {
    if (!this.reserva.Nombre || !this.reserva.Barbero || !this.reserva.Fecha || !this.reserva.Hora) {
      alert('Por favor complete todos los datos obligatorios.');
      return;
    }

    this.barberoService.guardarTurno(this.reserva).subscribe({
      next: (turnoCreado) => {
        alert(`¡Turno reservado con éxito para las ${turnoCreado.Hora}!`);
        this.reserva = { Nombre: '', Apellido: '', DNI: '', Telefono: '', Servicio: '', Barbero: '', Fecha: '', Hora: '' };
        this.horariosDisponibles = [];
        this.cargarDatos();
      },
      error: (err) => console.error('Error al reservar el turno:', err)
    });
  }
}