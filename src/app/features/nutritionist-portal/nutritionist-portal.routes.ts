import { Routes } from '@angular/router';
import { NutritionistLayoutComponent } from './components/layout/nutritionist-layout.component';

export const NUTRITIONIST_PORTAL_ROUTES: Routes = [
  {
    path: '',
    component: NutritionistLayoutComponent,
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./containers/nutritionist-dashboard/nutritionist-dashboard.component')
            .then(m => m.NutritionistDashboardComponent),
        title: 'Dashboard - Portal del Nutriólogo'
      },
      {
        path: 'patient/:id',
        loadComponent: () =>
          import('./containers/patient-detail/patient-detail.component')
            .then(m => m.PatientDetailComponent),
        title: 'Detalle del Paciente - Portal del Nutriólogo'
      },
      {
        path: 'patient/:id/edit',
        loadComponent: () =>
          import('./containers/patient-detail/patient-detail.component')
            .then(m => m.PatientDetailComponent),
        title: 'Editar Paciente - Portal del Nutriólogo'
      },
      {
        path: 'calendar',
        loadComponent: () =>
          import('./containers/appointments-calendar/appointments-calendar.component')
            .then(m => m.AppointmentsCalendarComponent),
        title: 'Calendario - Portal del Nutriólogo'
      },
      {
        path: 'messages',
        loadComponent: () =>
          import('./containers/nutritionist-messages/nutritionist-messages.component')
            .then(m => m.NutritionistMessagesComponent),
        title: 'Mensajes - Portal del Nutriólogo'
      },
      {
        path: 'consultations',
        loadComponent: () =>
          import('./containers/consultations/consultations.component')
            .then(m => m.ConsultationsComponent),
        title: 'Consultas - Portal del Nutriólogo'
      },
      {
        path: 'profile',
        loadComponent: () =>
          import('./containers/nutritionist-profile/nutritionist-profile.component')
            .then(m => m.NutritionistProfileComponent),
        title: 'Mi Perfil - Portal del Nutriólogo'
      },
      {
        path: 'settings',
        loadComponent: () =>
          import('./containers/nutritionist-settings/nutritionist-settings.component')
            .then(m => m.NutritionistSettingsComponent),
        title: 'Configuración - Portal del Nutriólogo'
      }
    ]
  }
];
