import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NutritionistPortalFacade } from '../../facades/nutritionist-portal.facade';

@Component({
  selector: 'app-nutritionist-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="p-6 max-w-4xl mx-auto">
      <!-- Header -->
      <div class="mb-6">
        <h1 class="text-2xl font-bold text-dark-900 dark:text-dark-50">Mi Perfil</h1>
        <p class="text-dark-600 dark:text-dark-400 mt-1">
          Administra tu información profesional
        </p>
      </div>

      @if (facade.isLoading()) {
        <div class="flex items-center justify-center py-12">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
        </div>
      } @else if (facade.nutritionist(); as nutritionist) {
        <div class="space-y-6">
          <!-- Profile Card -->
          <div class="bg-white dark:bg-dark-800 rounded-xl border border-dark-200 dark:border-dark-700 p-6">
            <div class="flex items-start gap-6">
              <!-- Avatar -->
              <div class="relative">
                <div class="w-24 h-24 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center text-3xl font-bold text-primary-600 dark:text-primary-400">
                  @if (nutritionist.photoUrl) {
                    <img
                      [src]="nutritionist.photoUrl"
                      [alt]="nutritionist.fullName"
                      class="w-full h-full rounded-full object-cover">
                  } @else {
                    {{ getInitials(nutritionist.fullName) }}
                  }
                </div>
                <button class="absolute bottom-0 right-0 p-1.5 bg-primary-500 hover:bg-primary-600 text-dark-950 rounded-full transition-colors">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </button>
              </div>

              <!-- Info -->
              <div class="flex-1">
                <h2 class="text-xl font-bold text-dark-900 dark:text-dark-50">
                  {{ nutritionist.fullName }}
                </h2>
                <p class="text-primary-600 dark:text-primary-400 font-medium">
                  {{ nutritionist.specialty || 'Nutriólogo' }}
                </p>
                <p class="text-dark-500 dark:text-dark-400 mt-1">
                  Cédula Profesional: {{ nutritionist.licenseNumber || 'No especificada' }}
                </p>
              </div>

              <button class="px-4 py-2 bg-primary-500 hover:bg-primary-600 text-dark-950 font-medium rounded-lg transition-colors">
                Editar Perfil
              </button>
            </div>
          </div>

          <!-- Personal Information -->
          <div class="bg-white dark:bg-dark-800 rounded-xl border border-dark-200 dark:border-dark-700 p-6">
            <h3 class="text-lg font-semibold text-dark-900 dark:text-dark-50 mb-4">
              Información Personal
            </h3>

            <div class="grid grid-cols-2 gap-6">
              <div>
                <label class="block text-sm font-medium text-dark-700 dark:text-dark-300 mb-1">
                  Nombre Completo
                </label>
                <input
                  type="text"
                  [value]="nutritionist.fullName"
                  disabled
                  class="w-full px-4 py-2 rounded-lg border border-dark-200 dark:border-dark-700 bg-dark-50 dark:bg-dark-900 text-dark-900 dark:text-dark-50 disabled:opacity-60">
              </div>

              <div>
                <label class="block text-sm font-medium text-dark-700 dark:text-dark-300 mb-1">
                  Correo Electrónico
                </label>
                <input
                  type="email"
                  [value]="nutritionist.email"
                  disabled
                  class="w-full px-4 py-2 rounded-lg border border-dark-200 dark:border-dark-700 bg-dark-50 dark:bg-dark-900 text-dark-900 dark:text-dark-50 disabled:opacity-60">
              </div>

              <div>
                <label class="block text-sm font-medium text-dark-700 dark:text-dark-300 mb-1">
                  Teléfono
                </label>
                <input
                  type="tel"
                  [value]="nutritionist.phone || 'No especificado'"
                  disabled
                  class="w-full px-4 py-2 rounded-lg border border-dark-200 dark:border-dark-700 bg-dark-50 dark:bg-dark-900 text-dark-900 dark:text-dark-50 disabled:opacity-60">
              </div>

              <div>
                <label class="block text-sm font-medium text-dark-700 dark:text-dark-300 mb-1">
                  Especialidad
                </label>
                <input
                  type="text"
                  [value]="nutritionist.specialty || 'Nutrición General'"
                  disabled
                  class="w-full px-4 py-2 rounded-lg border border-dark-200 dark:border-dark-700 bg-dark-50 dark:bg-dark-900 text-dark-900 dark:text-dark-50 disabled:opacity-60">
              </div>
            </div>
          </div>

          <!-- Professional Information -->
          <div class="bg-white dark:bg-dark-800 rounded-xl border border-dark-200 dark:border-dark-700 p-6">
            <h3 class="text-lg font-semibold text-dark-900 dark:text-dark-50 mb-4">
              Información Profesional
            </h3>

            <div class="grid grid-cols-2 gap-6">
              <div>
                <label class="block text-sm font-medium text-dark-700 dark:text-dark-300 mb-1">
                  Cédula Profesional
                </label>
                <input
                  type="text"
                  [value]="nutritionist.licenseNumber || 'No especificada'"
                  disabled
                  class="w-full px-4 py-2 rounded-lg border border-dark-200 dark:border-dark-700 bg-dark-50 dark:bg-dark-900 text-dark-900 dark:text-dark-50 disabled:opacity-60">
              </div>

              <div>
                <label class="block text-sm font-medium text-dark-700 dark:text-dark-300 mb-1">
                  Clínica / Consultorio
                </label>
                <input
                  type="text"
                  [value]="nutritionist.clinic || 'No especificado'"
                  disabled
                  class="w-full px-4 py-2 rounded-lg border border-dark-200 dark:border-dark-700 bg-dark-50 dark:bg-dark-900 text-dark-900 dark:text-dark-50 disabled:opacity-60">
              </div>

              <div class="col-span-2">
                <label class="block text-sm font-medium text-dark-700 dark:text-dark-300 mb-1">
                  Dirección del Consultorio
                </label>
                <input
                  type="text"
                  [value]="nutritionist.address || 'No especificada'"
                  disabled
                  class="w-full px-4 py-2 rounded-lg border border-dark-200 dark:border-dark-700 bg-dark-50 dark:bg-dark-900 text-dark-900 dark:text-dark-50 disabled:opacity-60">
              </div>

              <div class="col-span-2">
                <label class="block text-sm font-medium text-dark-700 dark:text-dark-300 mb-1">
                  Biografía / Descripción
                </label>
                <textarea
                  rows="3"
                  [value]="nutritionist.bio || 'Sin descripción'"
                  disabled
                  class="w-full px-4 py-2 rounded-lg border border-dark-200 dark:border-dark-700 bg-dark-50 dark:bg-dark-900 text-dark-900 dark:text-dark-50 disabled:opacity-60 resize-none">
                </textarea>
              </div>
            </div>
          </div>

          <!-- Statistics -->
          <div class="bg-white dark:bg-dark-800 rounded-xl border border-dark-200 dark:border-dark-700 p-6">
            <h3 class="text-lg font-semibold text-dark-900 dark:text-dark-50 mb-4">
              Estadísticas
            </h3>

            <div class="grid grid-cols-4 gap-6">
              <div class="text-center">
                <div class="text-3xl font-bold text-primary-500">
                  {{ facade.stats()?.totalPatients || 0 }}
                </div>
                <div class="text-sm text-dark-500 dark:text-dark-400 mt-1">
                  Pacientes Totales
                </div>
              </div>

              <div class="text-center">
                <div class="text-3xl font-bold text-green-500">
                  {{ facade.stats()?.activePatients || 0 }}
                </div>
                <div class="text-sm text-dark-500 dark:text-dark-400 mt-1">
                  Pacientes Activos
                </div>
              </div>

              <div class="text-center">
                <div class="text-3xl font-bold text-blue-500">
                  {{ facade.stats()?.appointmentsThisWeek || 0 }}
                </div>
                <div class="text-sm text-dark-500 dark:text-dark-400 mt-1">
                  Citas Esta Semana
                </div>
              </div>

              <div class="text-center">
                <div class="text-3xl font-bold text-amber-500">
                  {{ facade.pendingConsultationsCount() }}
                </div>
                <div class="text-sm text-dark-500 dark:text-dark-400 mt-1">
                  Consultas Pendientes
                </div>
              </div>
            </div>
          </div>

          <!-- Account Settings -->
          <div class="bg-white dark:bg-dark-800 rounded-xl border border-dark-200 dark:border-dark-700 p-6">
            <h3 class="text-lg font-semibold text-dark-900 dark:text-dark-50 mb-4">
              Configuración de Cuenta
            </h3>

            <div class="space-y-4">
              <button class="w-full flex items-center justify-between p-4 rounded-lg hover:bg-dark-50 dark:hover:bg-dark-700 transition-colors">
                <div class="flex items-center gap-3">
                  <div class="p-2 bg-dark-100 dark:bg-dark-700 rounded-lg">
                    <svg class="w-5 h-5 text-dark-600 dark:text-dark-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                    </svg>
                  </div>
                  <div class="text-left">
                    <div class="font-medium text-dark-900 dark:text-dark-50">Cambiar Contraseña</div>
                    <div class="text-sm text-dark-500 dark:text-dark-400">Actualiza tu contraseña de acceso</div>
                  </div>
                </div>
                <svg class="w-5 h-5 text-dark-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                </svg>
              </button>

              <button class="w-full flex items-center justify-between p-4 rounded-lg hover:bg-dark-50 dark:hover:bg-dark-700 transition-colors">
                <div class="flex items-center gap-3">
                  <div class="p-2 bg-dark-100 dark:bg-dark-700 rounded-lg">
                    <svg class="w-5 h-5 text-dark-600 dark:text-dark-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                    </svg>
                  </div>
                  <div class="text-left">
                    <div class="font-medium text-dark-900 dark:text-dark-50">Notificaciones</div>
                    <div class="text-sm text-dark-500 dark:text-dark-400">Configura tus preferencias de notificación</div>
                  </div>
                </div>
                <svg class="w-5 h-5 text-dark-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>

          <!-- Danger Zone -->
          <div class="bg-white dark:bg-dark-800 rounded-xl border border-red-200 dark:border-red-900/50 p-6">
            <h3 class="text-lg font-semibold text-red-600 dark:text-red-400 mb-4">
              Zona de Peligro
            </h3>
            <p class="text-dark-600 dark:text-dark-400 mb-4">
              Las siguientes acciones son permanentes y no se pueden deshacer.
            </p>
            <button class="px-4 py-2 bg-red-500 hover:bg-red-600 text-white font-medium rounded-lg transition-colors">
              Eliminar Cuenta
            </button>
          </div>
        </div>
      } @else {
        <div class="text-center py-12 bg-white dark:bg-dark-800 rounded-xl border border-dark-200 dark:border-dark-700">
          <p class="text-dark-500 dark:text-dark-400">No se pudo cargar la información del perfil</p>
        </div>
      }
    </div>
  `
})
export class NutritionistProfileComponent implements OnInit {
  readonly facade = inject(NutritionistPortalFacade);

  ngOnInit(): void {
    this.facade.loadProfile();
  }

  getInitials(name: string): string {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .substring(0, 2)
      .toUpperCase();
  }
}
