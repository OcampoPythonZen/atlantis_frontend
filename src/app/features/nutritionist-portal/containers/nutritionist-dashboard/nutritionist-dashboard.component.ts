import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NutritionistPortalFacade } from '../../facades/nutritionist-portal.facade';
import { PatientSummary, PatientFilterStatus } from '../../models/nutritionist.model';

@Component({
  selector: 'app-nutritionist-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="space-y-6">
      <!-- Page header -->
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 class="text-2xl font-display font-bold text-dark-900 dark:text-dark-50">
            Mis Pacientes
          </h1>
          <p class="mt-1 text-dark-600 dark:text-dark-400">
            Gestiona y da seguimiento a tus pacientes
          </p>
        </div>

        <!-- Add patient button (mobile) -->
        <button
          (click)="onAddPatient()"
          class="
            sm:hidden flex items-center justify-center gap-2
            px-4 py-2 rounded-lg
            bg-primary-500 hover:bg-primary-600
            text-dark-950 font-medium
            transition-colors
          "
          aria-label="Agregar nuevo paciente"
        >
          <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          Nuevo Paciente
        </button>
      </div>

      <!-- Stats cards -->
      @if (stats()) {
        <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div class="bg-white dark:bg-dark-800 rounded-xl border border-dark-200 dark:border-dark-700 p-4">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 bg-primary-100 dark:bg-primary-900/30 rounded-lg flex items-center justify-center">
                <svg class="w-5 h-5 text-primary-600 dark:text-primary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div>
                <p class="text-2xl font-bold text-dark-900 dark:text-dark-50">{{ stats()!.totalPatients }}</p>
                <p class="text-xs text-dark-500">Total pacientes</p>
              </div>
            </div>
          </div>

          <div class="bg-white dark:bg-dark-800 rounded-xl border border-dark-200 dark:border-dark-700 p-4">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                <svg class="w-5 h-5 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p class="text-2xl font-bold text-dark-900 dark:text-dark-50">{{ stats()!.activePatients }}</p>
                <p class="text-xs text-dark-500">Activos</p>
              </div>
            </div>
          </div>

          <div class="bg-white dark:bg-dark-800 rounded-xl border border-dark-200 dark:border-dark-700 p-4">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                <svg class="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <p class="text-2xl font-bold text-dark-900 dark:text-dark-50">{{ stats()!.appointmentsToday }}</p>
                <p class="text-xs text-dark-500">Citas hoy</p>
              </div>
            </div>
          </div>

          <div class="bg-white dark:bg-dark-800 rounded-xl border border-dark-200 dark:border-dark-700 p-4">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                <svg class="w-5 h-5 text-purple-600 dark:text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <div>
                <p class="text-2xl font-bold text-dark-900 dark:text-dark-50">{{ stats()!.pendingMessages }}</p>
                <p class="text-xs text-dark-500">Mensajes</p>
              </div>
            </div>
          </div>
        </div>
      }

      <!-- Filters -->
      <div class="bg-white dark:bg-dark-800 rounded-xl border border-dark-200 dark:border-dark-700 p-4">
        <div class="flex flex-col sm:flex-row gap-4">
          <!-- Search -->
          <div class="flex-1">
            <div class="relative">
              <label for="patient-search" class="sr-only">Buscar pacientes</label>
              <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                id="patient-search"
                type="text"
                placeholder="Buscar por nombre o expediente..."
                [ngModel]="searchTerm"
                (ngModelChange)="onSearchChange($event)"
                class="
                  w-full pl-10 pr-4 py-2
                  bg-dark-50 dark:bg-dark-900
                  border border-dark-200 dark:border-dark-700
                  rounded-lg
                  text-dark-900 dark:text-dark-50
                  placeholder-dark-400
                  focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent
                "
              />
            </div>
          </div>

          <!-- Status filter -->
          <div class="flex gap-2" role="group" aria-label="Filtrar por estado">
            <button
              (click)="onStatusFilter('all')"
              [attr.aria-pressed]="statusFilter === 'all'"
              class="px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              [class.bg-primary-500]="statusFilter === 'all'"
              [class.text-dark-950]="statusFilter === 'all'"
              [class.bg-dark-100]="statusFilter !== 'all'"
              [class.dark:bg-dark-700]="statusFilter !== 'all'"
              [class.text-dark-600]="statusFilter !== 'all'"
              [class.dark:text-dark-400]="statusFilter !== 'all'"
            >
              Todos
            </button>
            <button
              (click)="onStatusFilter('active')"
              [attr.aria-pressed]="statusFilter === 'active'"
              class="px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              [class.bg-green-500]="statusFilter === 'active'"
              [class.text-white]="statusFilter === 'active'"
              [class.bg-dark-100]="statusFilter !== 'active'"
              [class.dark:bg-dark-700]="statusFilter !== 'active'"
              [class.text-dark-600]="statusFilter !== 'active'"
              [class.dark:text-dark-400]="statusFilter !== 'active'"
            >
              Activos
            </button>
            <button
              (click)="onStatusFilter('inactive')"
              [attr.aria-pressed]="statusFilter === 'inactive'"
              class="px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              [class.bg-dark-500]="statusFilter === 'inactive'"
              [class.text-white]="statusFilter === 'inactive'"
              [class.bg-dark-100]="statusFilter !== 'inactive'"
              [class.dark:bg-dark-700]="statusFilter !== 'inactive'"
              [class.text-dark-600]="statusFilter !== 'inactive'"
              [class.dark:text-dark-400]="statusFilter !== 'inactive'"
            >
              Inactivos
            </button>
          </div>
        </div>
      </div>

      <!-- Loading state -->
      @if (isLoading()) {
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          @for (i of [1, 2, 3, 4, 5, 6]; track i) {
            <div class="bg-white dark:bg-dark-800 rounded-xl border border-dark-200 dark:border-dark-700 p-4 animate-pulse">
              <div class="flex items-center gap-3 mb-4">
                <div class="w-12 h-12 bg-dark-200 dark:bg-dark-700 rounded-full"></div>
                <div class="flex-1">
                  <div class="h-4 bg-dark-200 dark:bg-dark-700 rounded w-3/4 mb-2"></div>
                  <div class="h-3 bg-dark-200 dark:bg-dark-700 rounded w-1/2"></div>
                </div>
              </div>
              <div class="h-3 bg-dark-200 dark:bg-dark-700 rounded w-full mb-2"></div>
              <div class="h-3 bg-dark-200 dark:bg-dark-700 rounded w-2/3"></div>
            </div>
          }
        </div>
      } @else if (filteredPatients().length === 0) {
        <!-- Empty state -->
        <div class="bg-white dark:bg-dark-800 rounded-xl border border-dark-200 dark:border-dark-700 p-12 text-center">
          <svg class="w-16 h-16 text-dark-300 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <h2 class="text-xl font-semibold text-dark-900 dark:text-dark-50 mb-2">
            No hay pacientes
          </h2>
          <p class="text-dark-500 mb-4">
            @if (searchTerm) {
              No se encontraron pacientes con ese criterio de búsqueda
            } @else {
              Comienza agregando tu primer paciente
            }
          </p>
          @if (!searchTerm) {
            <button
              (click)="onAddPatient()"
              class="
                inline-flex items-center gap-2
                px-4 py-2 rounded-lg
                bg-primary-500 hover:bg-primary-600
                text-dark-950 font-medium
                transition-colors
              "
              aria-label="Agregar paciente"
            >
              <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
              </svg>
              Agregar Paciente
            </button>
          }
        </div>
      } @else {
        <!-- Patient cards grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          @for (patient of filteredPatients(); track patient.id) {
            <article class="
              bg-white dark:bg-dark-800
              rounded-xl border border-dark-200 dark:border-dark-700
              p-4 hover:shadow-lg transition-shadow
            ">
              <!-- Patient header -->
              <div class="flex items-start justify-between mb-3">
                <div class="flex items-center gap-3">
                  <!-- Avatar -->
                  <div class="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
                    [class.bg-primary-100]="patient.status === 'active'"
                    [class.dark:bg-primary-900/30]="patient.status === 'active'"
                    [class.bg-dark-200]="patient.status === 'inactive'"
                    [class.dark:bg-dark-700]="patient.status === 'inactive'"
                  >
                    @if (patient.photoUrl) {
                      <img
                        [src]="patient.photoUrl"
                        [alt]="patient.fullName"
                        class="w-12 h-12 rounded-full object-cover"
                      />
                    } @else {
                      <span class="text-sm font-semibold"
                        [class.text-primary-600]="patient.status === 'active'"
                        [class.dark:text-primary-400]="patient.status === 'active'"
                        [class.text-dark-500]="patient.status === 'inactive'"
                      >
                        {{ getInitials(patient.fullName) }}
                      </span>
                    }
                  </div>

                  <div class="min-w-0">
                    <h3 class="font-semibold text-dark-900 dark:text-dark-50 truncate">
                      {{ patient.fullName }}
                    </h3>
                    <p class="text-xs text-dark-500">{{ patient.expedienteNumber }}</p>
                  </div>
                </div>

                <!-- Status badge -->
                <span
                  class="px-2 py-1 text-xs font-medium rounded-full"
                  [class.bg-green-100]="patient.status === 'active'"
                  [class.dark:bg-green-900/30]="patient.status === 'active'"
                  [class.text-green-700]="patient.status === 'active'"
                  [class.dark:text-green-300]="patient.status === 'active'"
                  [class.bg-dark-200]="patient.status === 'inactive'"
                  [class.dark:bg-dark-700]="patient.status === 'inactive'"
                  [class.text-dark-600]="patient.status === 'inactive'"
                  [class.dark:text-dark-400]="patient.status === 'inactive'"
                >
                  {{ patient.status === 'active' ? 'Activo' : 'Inactivo' }}
                </span>
              </div>

              <!-- Patient info -->
              <div class="flex items-center gap-4 mb-4 text-sm text-dark-600 dark:text-dark-400">
                @if (patient.currentWeight) {
                  <div class="flex items-center gap-1">
                    <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
                    </svg>
                    <span>{{ patient.currentWeight }} kg</span>
                  </div>
                }
                @if (patient.nextAppointmentDate) {
                  <div class="flex items-center gap-1">
                    <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span>{{ formatDate(patient.nextAppointmentDate) }}</span>
                  </div>
                }
              </div>

              <!-- Progress bar -->
              @if (patient.progressPercentage !== undefined) {
                <div class="mb-4">
                  <div class="flex items-center justify-between text-xs mb-1">
                    <span class="text-dark-500" [id]="'progress-label-' + patient.id">Progreso</span>
                    <span class="font-medium text-dark-700 dark:text-dark-300">{{ patient.progressPercentage }}%</span>
                  </div>
                  <div
                    class="w-full h-2 bg-dark-200 dark:bg-dark-700 rounded-full overflow-hidden"
                    role="progressbar"
                    [attr.aria-valuenow]="patient.progressPercentage"
                    aria-valuemin="0"
                    aria-valuemax="100"
                    [attr.aria-labelledby]="'progress-label-' + patient.id"
                  >
                    <div
                      class="h-full bg-gradient-to-r from-primary-400 to-primary-600 rounded-full transition-all duration-300"
                      [style.width.%]="patient.progressPercentage"
                    ></div>
                  </div>
                </div>
              }

              <!-- Quick actions -->
              <div class="flex items-center justify-between pt-3 border-t border-dark-200 dark:border-dark-700">
                <div class="flex items-center gap-1" role="group" [attr.aria-label]="'Acciones rápidas para ' + patient.fullName">
                  <button
                    [routerLink]="['/nutritionist/patient', patient.id]"
                    class="p-2 rounded-lg text-dark-500 hover:text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors"
                    [attr.aria-label]="'Ver perfil de ' + patient.fullName"
                  >
                    <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </button>
                  <button
                    [routerLink]="['/nutritionist/patient', patient.id]"
                    [queryParams]="{ tab: 'progress' }"
                    class="p-2 rounded-lg text-dark-500 hover:text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors"
                    [attr.aria-label]="'Ver progreso de ' + patient.fullName"
                  >
                    <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </button>
                  <button
                    [routerLink]="['/nutritionist/patient', patient.id]"
                    [queryParams]="{ tab: 'plan' }"
                    class="p-2 rounded-lg text-dark-500 hover:text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-900/20 transition-colors"
                    [attr.aria-label]="'Ver plan de ' + patient.fullName"
                  >
                    <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                  </button>
                  <button
                    [routerLink]="['/nutritionist/patient', patient.id]"
                    [queryParams]="{ tab: 'appointments' }"
                    class="p-2 rounded-lg text-dark-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
                    [attr.aria-label]="'Ver citas de ' + patient.fullName"
                  >
                    <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </button>
                  <button
                    class="p-2 rounded-lg transition-colors relative"
                    [class.text-purple-600]="patient.hasUnreadMessages"
                    [class.text-dark-500]="!patient.hasUnreadMessages"
                    [class.hover:text-purple-600]="true"
                    [class.hover:bg-purple-50]="true"
                    [class.dark:hover:bg-purple-900/20]="true"
                    [attr.aria-label]="'Mensajes de ' + patient.fullName + (patient.hasUnreadMessages ? ' (mensajes sin leer)' : '')"
                  >
                    <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                    @if (patient.hasUnreadMessages) {
                      <span class="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full" aria-hidden="true"></span>
                    }
                  </button>
                </div>

                <button
                  [routerLink]="['/nutritionist/patient', patient.id, 'edit']"
                  class="p-2 rounded-lg text-dark-500 hover:text-dark-700 dark:hover:text-dark-300 hover:bg-dark-100 dark:hover:bg-dark-700 transition-colors"
                  [attr.aria-label]="'Editar información de ' + patient.fullName"
                >
                  <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>
              </div>
            </article>
          }
        </div>
      }
    </div>
  `
})
export class NutritionistDashboardComponent implements OnInit {
  private readonly facade = inject(NutritionistPortalFacade);

  // State from facade
  readonly isLoading = this.facade.isLoading;
  readonly filteredPatients = this.facade.filteredPatients;
  readonly stats = this.facade.stats;

  // Local filter state
  searchTerm = '';
  statusFilter: PatientFilterStatus = 'all';

  ngOnInit(): void {
    this.facade.loadDashboard();
  }

  onSearchChange(term: string): void {
    this.searchTerm = term;
    this.facade.setPatientFilters({ searchTerm: term });
  }

  onStatusFilter(status: PatientFilterStatus): void {
    this.statusFilter = status;
    this.facade.setPatientFilters({ status });
  }

  onAddPatient(): void {
    this.facade.openCreatePatientModal();
  }

  getInitials(name: string): string {
    const parts = name.split(' ');
    if (parts.length >= 2) {
      return `${parts[0]![0]}${parts[1]![0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('es-MX', {
      day: 'numeric',
      month: 'short'
    });
  }
}
