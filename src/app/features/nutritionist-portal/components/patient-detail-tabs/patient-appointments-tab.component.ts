import { Component, input, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PatientComplete, Appointment } from '../../models/nutritionist.model';

type AppointmentFilter = 'all' | 'upcoming' | 'past';

@Component({
  selector: 'app-patient-appointments-tab',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="space-y-6">
      <!-- Header with filters -->
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-2">
          @for (filter of filters; track filter.value) {
            <button
              (click)="activeFilter.set(filter.value)"
              class="px-4 py-2 text-sm font-medium rounded-lg transition-colors"
              [class]="activeFilter() === filter.value
                ? 'bg-teal-500 text-white'
                : 'bg-dark-100 dark:bg-dark-800 text-dark-600 dark:text-dark-400 hover:bg-dark-200 dark:hover:bg-dark-700'"
            >
              {{ filter.label }}
            </button>
          }
        </div>
        <button class="flex items-center gap-2 px-4 py-2 bg-primary-500 hover:bg-primary-600 text-dark-950 font-medium rounded-lg transition-colors text-sm">
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          Nueva Cita
        </button>
      </div>

      <!-- Appointments List -->
      @if (filteredAppointments().length > 0) {
        <div class="space-y-3">
          @for (appointment of filteredAppointments(); track appointment.id) {
            <div class="bg-dark-50 dark:bg-dark-900 rounded-xl p-4 border border-dark-200 dark:border-dark-700">
              <div class="flex items-start justify-between">
                <div class="flex items-start gap-4">
                  <!-- Date indicator -->
                  <div class="text-center min-w-[60px]">
                    <div class="text-2xl font-bold text-dark-900 dark:text-dark-50">
                      {{ getDay(appointment.date) }}
                    </div>
                    <div class="text-xs text-dark-500 uppercase">
                      {{ getMonth(appointment.date) }}
                    </div>
                  </div>

                  <!-- Details -->
                  <div>
                    <div class="flex items-center gap-2 mb-1">
                      <span class="font-medium text-dark-900 dark:text-dark-50">
                        {{ getTypeLabel(appointment.type) }}
                      </span>
                      <span
                        class="px-2 py-0.5 text-xs font-medium rounded-full"
                        [class]="getStatusClasses(appointment.status)"
                      >
                        {{ getStatusLabel(appointment.status) }}
                      </span>
                    </div>

                    <div class="flex items-center gap-4 text-sm text-dark-500">
                      <span class="flex items-center gap-1">
                        <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {{ appointment.time }} ({{ appointment.duration }} min)
                      </span>
                      @if (appointment.location) {
                        <span class="flex items-center gap-1">
                          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          {{ appointment.location }}
                        </span>
                      }
                    </div>

                    @if (appointment.notes) {
                      <p class="mt-2 text-sm text-dark-600 dark:text-dark-400">
                        {{ appointment.notes }}
                      </p>
                    }
                  </div>
                </div>

                <!-- Actions -->
                <div class="flex items-center gap-2">
                  @if (isUpcoming(appointment)) {
                    <button class="p-2 text-dark-500 hover:text-navy-600 hover:bg-navy-50 dark:hover:bg-navy-900/20 rounded-lg transition-colors">
                      <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button class="p-2 text-dark-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors">
                      <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  }
                </div>
              </div>
            </div>
          }
        </div>
      } @else {
        <!-- Empty State -->
        <div class="text-center py-12">
          <div class="w-16 h-16 mx-auto bg-dark-100 dark:bg-dark-800 rounded-full flex items-center justify-center mb-4">
            <svg class="w-8 h-8 text-dark-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <h3 class="text-lg font-medium text-dark-900 dark:text-dark-50 mb-2">
            {{ getEmptyMessage() }}
          </h3>
          <p class="text-dark-500 mb-4">
            {{ getEmptyDescription() }}
          </p>
        </div>
      }

      <!-- Stats summary -->
      <div class="grid grid-cols-3 gap-4 pt-4 border-t border-dark-200 dark:border-dark-700">
        <div class="text-center">
          <p class="text-2xl font-bold text-dark-900 dark:text-dark-50">{{ totalAppointments() }}</p>
          <p class="text-xs text-dark-500">Total de citas</p>
        </div>
        <div class="text-center">
          <p class="text-2xl font-bold text-green-600 dark:text-green-400">{{ completedAppointments() }}</p>
          <p class="text-xs text-dark-500">Completadas</p>
        </div>
        <div class="text-center">
          <p class="text-2xl font-bold text-amber-600 dark:text-amber-400">{{ upcomingAppointments() }}</p>
          <p class="text-xs text-dark-500">Próximas</p>
        </div>
      </div>
    </div>
  `
})
export class PatientAppointmentsTabComponent {
  patient = input<PatientComplete | null>(null);
  activeFilter = signal<AppointmentFilter>('all');

  readonly filters: { value: AppointmentFilter; label: string }[] = [
    { value: 'all', label: 'Todas' },
    { value: 'upcoming', label: 'Próximas' },
    { value: 'past', label: 'Pasadas' }
  ];

  filteredAppointments = computed(() => {
    const appointments = this.patient()?.appointments || [];
    const now = new Date();
    const filter = this.activeFilter();

    if (filter === 'upcoming') {
      return appointments.filter(a => new Date(a.date) >= now);
    }
    if (filter === 'past') {
      return appointments.filter(a => new Date(a.date) < now);
    }
    return appointments;
  });

  totalAppointments = computed(() => this.patient()?.appointments?.length || 0);

  completedAppointments = computed(() =>
    this.patient()?.appointments?.filter(a => a.status === 'completed').length || 0
  );

  upcomingAppointments = computed(() => {
    const now = new Date();
    return this.patient()?.appointments?.filter(a =>
      new Date(a.date) >= now && a.status !== 'cancelled'
    ).length || 0;
  });

  isUpcoming(appointment: Appointment): boolean {
    return new Date(appointment.date) >= new Date() && appointment.status !== 'cancelled';
  }

  getDay(date: Date): string {
    return new Date(date).getDate().toString();
  }

  getMonth(date: Date): string {
    return new Date(date).toLocaleDateString('es-MX', { month: 'short' });
  }

  getTypeLabel(type: string): string {
    const labels: Record<string, string> = {
      initial: 'Consulta Inicial',
      followup: 'Seguimiento',
      emergency: 'Urgencia',
      online: 'Consulta en Línea'
    };
    return labels[type] || type;
  }

  getStatusLabel(status: string): string {
    const labels: Record<string, string> = {
      confirmed: 'Confirmada',
      pending: 'Pendiente',
      completed: 'Completada',
      cancelled: 'Cancelada'
    };
    return labels[status] || status;
  }

  getStatusClasses(status: string): string {
    const classes: Record<string, string> = {
      confirmed: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400',
      pending: 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400',
      completed: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400',
      cancelled: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
    };
    return classes[status] || 'bg-dark-100 dark:bg-dark-700 text-dark-600 dark:text-dark-400';
  }

  getEmptyMessage(): string {
    const filter = this.activeFilter();
    if (filter === 'upcoming') return 'Sin citas próximas';
    if (filter === 'past') return 'Sin historial de citas';
    return 'Sin citas registradas';
  }

  getEmptyDescription(): string {
    const filter = this.activeFilter();
    if (filter === 'upcoming') return 'Agenda una nueva cita para este paciente';
    if (filter === 'past') return 'Aún no hay citas completadas';
    return 'Comienza agendando la primera cita';
  }
}
