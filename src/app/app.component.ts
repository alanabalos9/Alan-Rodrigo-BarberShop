import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService, Turno, Barbero } from './services/api.service';
import { WeatherService } from './services/weather.service';

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

  // Lista de servicios reales de barbería
  listaServicios: string[] = [
    'Alisado Pelo Corto — $47.000 (60 min)',
    'Corte Niños (hasta 10 años) — $15.000 (30 min)',
    'Corte Pelo — $15.500 (30 min)',
    'Corte Pelo + Lavado de Cabello — $25.500 (45 min)',
    'Corte Pelo + Alisado — $62.500 (90 min)',
    'Corte Pelo + Barba — $18.500 (45 min)',
    'Corte Pelo + Barba + Alisado — $55.500 (105 min)',
    'Corte Premium Pelo + Barba (Tratamiento Vaporizado) — $21.500 (60 min)',
    'Corte Solo Barba (no pelo) — $13.000 (15 min)',
    'Corte Solo Barba Vaporizado (no pelo) — $17.000 (30 min)',
    'Lavado de Cabello — $10.000 (15 min)',
    'Promo 1 - Corte + Perfilado Cejas — $17.000 (30 min)'
  ];

  horariosBase: string[] = ['09:00', '10:00', '11:00', '12:00', '14:00', '15:00', '16:00', '17:00', '18:00'];
  horariosDisponibles: string[] = [];

  currentTemp: number | null = null;

  nuevoTurno: Turno = {
    Nombre: '',
    Apellido: '',
    DNI: '',
    Telefono: '',
    Barbero: '',
    Servicio: '',
    Fecha: '',
    Hora: ''
  };

  nuevoBarbero: Barbero = {
    Nombre: '',
    Apellido: '',
    Especialidad: ''
  };

  constructor(
    private apiService: ApiService,
    private weatherService: WeatherService
  ) {}

  ngOnInit(): void {
    this.obtenerDatos();
    this.obtenerBarberos();
    this.obtenerClimaExterno();
  }

  obtenerClimaExterno(): void {
    this.weatherService.getCurrentWeather().subscribe({
      next: (data) => {
        if (data && data.current_weather) {
          this.currentTemp = data.current_weather.temperature;
        }
      },
      error: (err) => console.error('Error al obtener el clima externo:', err)
    });
  }

  obtenerDatos(): void {
    this.apiService.getTurnos().subscribe({
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
      },
      error: (err: any) => console.error('Error barberos:', err)
    });
  }

  // Traduce "Servicio 1", etc., y limpia precios o minutos de los textos
  limpiarNombreServicio(servicioGuardado: string): string {
    if (!servicioGuardado) return '-';

    const mapaAntiguo: { [key: string]: string } = {
      'servicio 1': 'Alisado Pelo Corto',
      'servicio 2': 'Corte Niños (hasta 10 años)',
      'servicio 3': 'Corte Pelo',
      'servicio 4': 'Corte Pelo + Lavado de Cabello',
      'servicio 5': 'Corte Pelo + Alisado',
      'servicio 6': 'Corte Pelo + Barba',
      'servicio 7': 'Corte Pelo + Barba + Alisado',
      'servicio 8': 'Corte Premium Pelo + Barba (Tratamiento Vaporizado)',
      'servicio 9': 'Corte Solo Barba (no pelo)',
      'servicio 10': 'Corte Solo Barba Vaporizado (no pelo)',
      'servicio 11': 'Lavado de Cabello',
      'servicio 12': 'Promo 1 - Corte + Perfilado Cejas'
    };

    const clave = servicioGuardado.trim().toLowerCase();
    if (mapaAntiguo[clave]) {
      return mapaAntiguo[clave];
    }

    // Si viene con precio, lo corta en el guion largo
    const partes = servicioGuardado.split('—');
    return partes[0].trim();
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
    this.barberosFiltrados = this.barberos;
    this.actualizarHorariosDisponibles();
  }

  onBarberoChange(): void {
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
    if (!this.nuevoTurno.Nombre || !this.nuevoTurno.Apellido || !this.nuevoTurno.DNI || !this.nuevoTurno.Telefono || !this.nuevoTurno.Servicio || !this.nuevoTurno.Barbero || !this.nuevoTurno.Hora) {
      alert('⚠️ Por favor completa todos los campos obligatorios del turno.');
      return;
    }

    // Guardamos limpiando el precio y los minutos
    const turnoParaGuardar = {
      ...this.nuevoTurno,
      Servicio: this.limpiarNombreServicio(this.nuevoTurno.Servicio)
    };

    this.apiService.crearTurno(turnoParaGuardar).subscribe({
      next: () => {
        alert('✅ ¡Turno registrado con éxito!');
        this.obtenerDatos();
        this.nuevoTurno = { Nombre: '', Apellido: '', DNI: '', Telefono: '', Barbero: '', Servicio: '', Fecha: '', Hora: '' };
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
      this.apiService.eliminarTurno(id).subscribe({ next: () => this.obtenerDatos() });
    }
  }

  borrarBarbero(id?: string): void {
    if (id && confirm('¿Eliminar barbero?')) {
      this.apiService.eliminarBarbero(id).subscribe({ next: () => this.obtenerBarberos() });
    }
  }
}