import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BarberosComponent } from './pages/barberos/barberos.component';
import { TurnosComponent } from './pages/turnos/turnos.component';

const routes: Routes = [
  { path: 'barberos', component: BarberosComponent },
  { path: 'turnos', component: TurnosComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }