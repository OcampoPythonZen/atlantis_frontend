import { Routes } from '@angular/router';
import { authGuard } from './core/auth/guards/auth.guard';
import { guestGuard } from './core/auth/guards/guest.guard';
import { patientGuard } from './core/auth/guards/patient.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  },
  {
    path: 'auth',
    canActivate: [guestGuard],
    loadChildren: () => import('./features/auth/auth.routes').then(m => m.AUTH_ROUTES)
  },
  {
    path: 'dashboard',
    canActivate: [authGuard],
    loadComponent: () => import('./features/dashboard/dashboard.component')
      .then(m => m.DashboardComponent)
  },
  {
    path: 'patient',
    canActivate: [patientGuard],
    loadChildren: () => import('./features/patient-portal/patient-portal.routes')
      .then(m => m.PATIENT_PORTAL_ROUTES),
    title: 'Portal del Paciente'
  },
  {
    path: '**',
    redirectTo: 'auth/login'
  }
];
