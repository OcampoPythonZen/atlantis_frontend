import { Routes } from '@angular/router';
import { PatientLayoutComponent } from './components/patient-layout/patient-layout.component';

export const PATIENT_PORTAL_ROUTES: Routes = [
  {
    path: '',
    component: PatientLayoutComponent,
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./containers/patient-dashboard/patient-dashboard.component')
            .then(m => m.PatientDashboardComponent),
        title: 'Inicio - Portal del Paciente'
      },
      {
        path: 'profile',
        loadComponent: () =>
          import('./containers/patient-profile/patient-profile.component')
            .then(m => m.PatientProfileComponent),
        title: 'Mi Perfil - Portal del Paciente'
      },
      {
        path: 'progress',
        loadComponent: () =>
          import('./containers/patient-progress/patient-progress.component')
            .then(m => m.PatientProgressComponent),
        title: 'Mi Progreso - Portal del Paciente'
      },
      {
        path: 'plan',
        loadComponent: () =>
          import('./containers/nutrition-plan/nutrition-plan.component')
            .then(m => m.NutritionPlanComponent),
        title: 'Mi Plan - Portal del Paciente'
      },
      {
        path: 'appointments',
        loadComponent: () =>
          import('./containers/patient-appointments/patient-appointments.component')
            .then(m => m.PatientAppointmentsComponent),
        title: 'Mis Citas - Portal del Paciente'
      },
      {
        path: 'messages',
        loadComponent: () =>
          import('./containers/patient-messages/patient-messages.component')
            .then(m => m.PatientMessagesComponent),
        title: 'Mensajes - Portal del Paciente'
      },
      {
        path: 'documents',
        loadComponent: () =>
          import('./containers/patient-documents/patient-documents.component')
            .then(m => m.PatientDocumentsComponent),
        title: 'Documentos - Portal del Paciente'
      }
    ]
  }
];
