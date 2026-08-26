import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService, Turno, Barbero } from './services/api.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {
  pestanaActiva: 'reserva' | 'admin' = 'reserva';
  
  // Login Admin
  adminAutenticado: boolean = false;
  credenciales = { usuario: '', password: '' };

  datos: Turno[] = [];
  barberos: Barbero[] = [];
  barberosFiltrados: Barbero[] = [];
  especialidadesUnicas: string[] = [];

  horariosBase: string[] = ['09:00', '10:00', '11:00', '12:00', '14:00', '15:00', '16:00', '17:00', '18:00'];
  horariosDisponibles: string[] = [];

  nuevoTurno: Turno = {
    Nombre: '',
    Apellido: '',
    Dni: '',
    Telefono: '',
    Barbero: '',
    Servicio: '',
    Hora: ''
  };

  nuevoBarbero: Barbero = {
    Nombre: '',
    Apellido: '',
    Especialidad: ''
  };

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.obtenerDatos();
    this.obtenerBarberos();
  }

  obtenerDatos(): void {
    this.apiService.getDatos().subscribe({
      next: (res: Turno[]) => {
        this.datos = res;
        this.actualizarHorariosDisponibles();
      },
      error: (err: any) => console.error('Error turnos:', err)
    });
  }

  obtenerBarberos(): void {
    this.apiService.getBarberos().subscribe({
      next: (res: Barbero[]) => {
        this.barberos = res;
        this.barberosFiltrados = res;
        const espSet = new Set(res.map(b => b.Especialidad).filter(Boolean) as string[]);
        this.especialidadesUnicas = Array.from(espSet);
      },
      error: (err: any) => console.error('Error barberos:', err)
    });
  }

  iniciarSesion(): void {
    if (this.credenciales.usuario === 'admin' && this.credenciales.password === '1234') {
      this.adminAutenticado = true;
      this.credenciales = { usuario: '', password: '' };
    } else {
      alert('⚠️ Usuario o contraseña incorrectos (Usar: admin / 1234)');
    }
  }

  cerrarSesion(): void {
    this.adminAutenticado = false;
  }

  onEspecialidadChange(): void {
    if (this.nuevoTurno.Servicio) {
      this.barberosFiltrados = this.barberos.filter(b => b.Especialidad === this.nuevoTurno.Servicio);
      const coincide = this.barberosFiltrados.some(b => b.Nombre === this.nuevoTurno.Barbero);
      if (!coincide) this.nuevoTurno.Barbero = '';
    } else {
      this.barberosFiltrados = this.barberos;
    }
    this.actualizarHorariosDisponibles();
  }

  onBarberoChange(): void {
    const seleccionado = this.barberos.find(b => b.Nombre === this.nuevoTurno.Barbero);
    if (seleccionado && seleccionado.Especialidad) {
      this.nuevoTurno.Servicio = seleccionado.Especialidad;
      this.barberosFiltrados = this.barberos.filter(b => b.Especialidad === seleccionado.Especialidad);
    }
    this.actualizarHorariosDisponibles();
  }

  actualizarHorariosDisponibles(): void {
    if (!this.nuevoTurno.Barbero) {
      this.horariosDisponibles = [];
      return;
    }
    const ocupados = this.datos
      .filter(t => t.Barbero === this.nuevoTurno.Barbero)
      .map(t => t.Hora);

    this.horariosDisponibles = this.horariosBase.filter(h => !ocupados.includes(h));
  }

  crearTurno(): void {
    if (!this.nuevoTurno.Nombre || !this.nuevoTurno.Apellido || !this.nuevoTurno.Dni || !this.nuevoTurno.Telefono || !this.nuevoTurno.Barbero || !this.nuevoTurno.Hora) {
      alert('⚠️ Por favor completa todos los campos obligatorios del turno.');
      return;
    }

    this.apiService.crearDato(this.nuevoTurno).subscribe({
      next: () => {
        alert('✅ ¡Turno registrado con éxito!');
        this.obtenerDatos();
        this.nuevoTurno = { Nombre: '', Apellido: '', Dni: '', Telefono: '', Barbero: '', Servicio: '', Hora: '' };
        this.barberosFiltrados = this.barberos;
        this.horariosDisponibles = [];
      },
      error: (err: any) => console.error('Error al guardar turno:', err)
    });
  }

  crearBarbero(): void {
    if (!this.nuevoBarbero.Nombre || !this.nuevoBarbero.Especialidad) {
      alert('⚠️ Nombre y Especialidad son obligatorios.');
      return;
    }
    this.apiService.crearBarbero(this.nuevoBarbero).subscribe({
      next: () => {
        alert('✅ ¡Barbero agregado correctamente!');
        this.obtenerBarberos();
        this.nuevoBarbero = { Nombre: '', Apellido: '', Especialidad: '' };
      },
      error: (err: any) => console.error('Error al guardar barbero:', err)
    });
  }

  borrarItem(id?: string): void {
    if (id && confirm('¿Eliminar turno?')) {
      this.apiService.eliminarDato(id).subscribe({ next: () => this.obtenerDatos() });
    }
  }

  borrarBarbero(id?: string): void {
    if (id && confirm('¿Eliminar barbero?')) {
      this.apiService.eliminarBarbero(id).subscribe({ next: () => this.obtenerBarberos() });
    }
  }
}