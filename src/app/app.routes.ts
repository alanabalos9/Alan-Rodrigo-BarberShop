import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'reservar',
    loadChildren: () => import('./features/customer/customer.module').then(m => m.CustomerModule)
  },
  {
    path: 'admin',
    loadChildren: () => import('./features/admin/admin.module').then(m => m.AdminModule)
  },
  {
    path: 'barberos',
    loadChildren: () => import('./barberos/barberos.routes').then(m => m.BARBEROS_ROUTES)
  },
  { path: '', redirectTo: 'reservar', pathMatch: 'full' },
  { path: '**', redirectTo: 'reservar' }
];