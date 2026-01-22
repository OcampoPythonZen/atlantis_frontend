import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PatientPortalFacade } from '../../facades/patient-portal.facade';

@Component({
  selector: 'app-patient-profile',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="space-y-6">
      <!-- Page header -->
      <div>
        <h1 class="text-2xl font-display font-bold text-dark-900 dark:text-dark-50">
          Mi Perfil
        </h1>
        <p class="mt-1 text-dark-600 dark:text-dark-400">
          Tu información personal y médica
        </p>
      </div>

      <!-- Info notice -->
      <div class="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 flex items-start gap-3">
        <svg class="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p class="text-sm text-blue-700 dark:text-blue-300">
          Para actualizar tu información, contacta a tu nutriólogo.
        </p>
      </div>

      @if (isLoading()) {
        <!-- Loading state -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
          @for (i of [1, 2, 3]; track i) {
            <div class="bg-white dark:bg-dark-800 rounded-xl border border-dark-200 dark:border-dark-700 p-6 animate-pulse">
              <div class="h-4 bg-dark-200 dark:bg-dark-700 rounded w-1/3 mb-4"></div>
              <div class="space-y-3">
                <div class="h-3 bg-dark-200 dark:bg-dark-700 rounded w-full"></div>
                <div class="h-3 bg-dark-200 dark:bg-dark-700 rounded w-2/3"></div>
              </div>
            </div>
          }
        </div>
      } @else {
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <!-- Profile header card -->
          <div class="lg:col-span-3 bg-white dark:bg-dark-800 rounded-xl border border-dark-200 dark:border-dark-700 p-6">
            <div class="flex items-center gap-6">
              <!-- Avatar -->
              <div class="w-20 h-20 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center">
                @if (patient()?.photoUrl) {
                  <img
                    [src]="patient()!.photoUrl"
                    [alt]="patient()!.fullName"
                    class="w-20 h-20 rounded-full object-cover"
                  />
                } @else {
                  <span class="text-2xl font-bold text-primary-600 dark:text-primary-400">
                    {{ getInitials(patient()?.fullName) }}
                  </span>
                }
              </div>

              <div>
                <h2 class="text-xl font-semibold text-dark-900 dark:text-dark-50">
                  {{ patient()?.fullName }}
                </h2>
                <p class="text-dark-600 dark:text-dark-400">
                  {{ patient()?.email }}
                </p>
                <p class="text-sm text-dark-500 mt-1">
                  Paciente desde {{ patient()?.createdAt | date:'MMMM yyyy':'':'es-MX' }}
                </p>
              </div>
            </div>
          </div>

          <!-- Personal info -->
          <div class="bg-white dark:bg-dark-800 rounded-xl border border-dark-200 dark:border-dark-700 p-6">
            <h3 class="text-lg font-semibold text-dark-900 dark:text-dark-50 mb-4">
              Datos personales
            </h3>
            <dl class="space-y-3">
              <div>
                <dt class="text-xs text-dark-500 uppercase tracking-wide">Fecha de nacimiento</dt>
                <dd class="text-dark-900 dark:text-dark-50">
                  {{ formatBirthDate(patient()?.birthDate) }}
                </dd>
              </div>
              <div>
                <dt class="text-xs text-dark-500 uppercase tracking-wide">Edad</dt>
                <dd class="text-dark-900 dark:text-dark-50">{{ patient()?.age }} años</dd>
              </div>
              <div>
                <dt class="text-xs text-dark-500 uppercase tracking-wide">Género</dt>
                <dd class="text-dark-900 dark:text-dark-50">{{ getGenderLabel(patient()?.gender) }}</dd>
              </div>
              <div>
                <dt class="text-xs text-dark-500 uppercase tracking-wide">Teléfono</dt>
                <dd class="text-dark-900 dark:text-dark-50">{{ patient()?.phone }}</dd>
              </div>
            </dl>
          </div>

          <!-- Medical info -->
          <div class="bg-white dark:bg-dark-800 rounded-xl border border-dark-200 dark:border-dark-700 p-6">
            <h3 class="text-lg font-semibold text-dark-900 dark:text-dark-50 mb-4">
              Información médica
            </h3>
            <dl class="space-y-4">
              <div>
                <dt class="text-xs text-dark-500 uppercase tracking-wide mb-2">Alergias</dt>
                <dd class="flex flex-wrap gap-2">
                  @if (medicalInfo()?.allergies?.length) {
                    @for (allergy of medicalInfo()!.allergies; track allergy) {
                      <span class="px-2 py-1 text-xs bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-full">
                        {{ allergy }}
                      </span>
                    }
                  } @else {
                    <span class="text-dark-500 text-sm">Sin alergias registradas</span>
                  }
                </dd>
              </div>
              <div>
                <dt class="text-xs text-dark-500 uppercase tracking-wide mb-2">Condiciones</dt>
                <dd class="flex flex-wrap gap-2">
                  @if (medicalInfo()?.conditions?.length) {
                    @for (condition of medicalInfo()!.conditions; track condition) {
                      <span class="px-2 py-1 text-xs bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 rounded-full">
                        {{ condition }}
                      </span>
                    }
                  } @else {
                    <span class="text-dark-500 text-sm">Sin condiciones registradas</span>
                  }
                </dd>
              </div>
              <div>
                <dt class="text-xs text-dark-500 uppercase tracking-wide mb-2">Medicamentos</dt>
                <dd class="flex flex-wrap gap-2">
                  @if (medicalInfo()?.medications?.length) {
                    @for (medication of medicalInfo()!.medications; track medication) {
                      <span class="px-2 py-1 text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full">
                        {{ medication }}
                      </span>
                    }
                  } @else {
                    <span class="text-dark-500 text-sm">Sin medicamentos registrados</span>
                  }
                </dd>
              </div>
            </dl>
          </div>

          <!-- Nutritionist info -->
          <div class="bg-white dark:bg-dark-800 rounded-xl border border-dark-200 dark:border-dark-700 p-6">
            <h3 class="text-lg font-semibold text-dark-900 dark:text-dark-50 mb-4">
              Tu nutriólogo
            </h3>
            @if (nutritionist()) {
              <div class="flex items-center gap-4 mb-4">
                <div class="w-12 h-12 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center">
                  <span class="text-sm font-semibold text-primary-600 dark:text-primary-400">
                    {{ getInitials(nutritionist()?.fullName) }}
                  </span>
                </div>
                <div>
                  <p class="font-medium text-dark-900 dark:text-dark-50">
                    {{ nutritionist()!.fullName }}
                  </p>
                  @if (nutritionist()!.specialty) {
                    <p class="text-sm text-dark-500">{{ nutritionist()!.specialty }}</p>
                  }
                </div>
              </div>
              <dl class="space-y-2 text-sm">
                <div class="flex items-center gap-2">
                  <svg class="w-4 h-4 text-dark-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <span class="text-dark-600 dark:text-dark-400">{{ nutritionist()!.email }}</span>
                </div>
                <div class="flex items-center gap-2">
                  <svg class="w-4 h-4 text-dark-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <span class="text-dark-600 dark:text-dark-400">{{ nutritionist()!.phone }}</span>
                </div>
                @if (nutritionist()!.clinicAddress) {
                  <div class="flex items-start gap-2">
                    <svg class="w-4 h-4 text-dark-400 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span class="text-dark-600 dark:text-dark-400">{{ nutritionist()!.clinicAddress }}</span>
                  </div>
                }
              </dl>
            }
          </div>
        </div>
      }
    </div>
  `
})
export class PatientProfileComponent implements OnInit {
  private readonly facade = inject(PatientPortalFacade);

  readonly isLoading = this.facade.isLoading;
  readonly patient = this.facade.patient;
  readonly medicalInfo = this.facade.medicalInfo;
  readonly nutritionist = this.facade.nutritionist;

  ngOnInit(): void {
    this.facade.loadProfile();
  }

  getInitials(name: string | undefined): string {
    if (!name) return '?';
    const parts = name.replace('Dra. ', '').replace('Dr. ', '').split(' ');
    if (parts.length >= 2) {
      return `${parts[0]![0]}${parts[1]![0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  }

  getGenderLabel(gender: string | undefined): string {
    const labels: Record<string, string> = {
      'male': 'Masculino',
      'female': 'Femenino',
      'other': 'Otro'
    };
    return gender ? labels[gender] ?? gender : '';
  }

  formatBirthDate(date: Date | undefined): string {
    if (!date) return '';
    return new Date(date).toLocaleDateString('es-MX', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  }
}
