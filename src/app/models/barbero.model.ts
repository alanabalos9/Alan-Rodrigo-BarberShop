export interface Barbero {
  id?: string;
  Nombre: string;
  Apellido: string;
  FotoPerfil?: string;
  Especialidad?: string;
}

export interface Turno {
  id?: string;
  Nombre: string;     // Nombre del cliente
  Apellido: string;   // Apellido del cliente
  Barbero: string;    // ID o Nombre del barbero
  Servicio: string;   // Servicio seleccionado
  Fecha: string;      // Fecha seleccionada (YYYY-MM-DD)
  Hora: string;       // Hora elegida (HH:mm)
  DNI: string;
  Telefono: string;
}