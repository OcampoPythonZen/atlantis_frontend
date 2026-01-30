import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PatientPortalFacade } from '../../facades/patient-portal.facade';
import { Appointment } from '../../models/patient.model';

@Component({
  selector: 'app-patient-appointments',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="space-y-6">
      <!-- Page header -->
      <div>
        <h1 class="text-2xl font-display font-bold text-dark-900 dark:text-dark-50">
          Mis Citas
        </h1>
        <p class="mt-1 text-dark-600 dark:text-dark-400">
          Próximas citas e historial de consultas
        </p>
      </div>

      @if (isLoading()) {
        <!-- Loading state -->
        <div class="space-y-4">
          @for (i of [1, 2, 3]; track i) {
            <div class="bg-white dark:bg-dark-800 rounded-xl p-6 animate-pulse">
              <div class="h-5 bg-dark-200 dark:bg-dark-700 rounded w-1/3 mb-3"></div>
              <div class="h-4 bg-dark-200 dark:bg-dark-700 rounded w-1/2"></div>
            </div>
          }
        </div>
      } @else {
        <!-- Next appointment -->
        <section>
          <h2 class="text-lg font-semibold text-dark-900 dark:text-dark-50 mb-4">
            Próxima cita
          </h2>
          @if (nextAppointment()) {
            <div class="bg-gradient-to-br from-navy-700 to-navy-800 rounded-xl p-6 text-white">
              <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div class="flex items-start gap-4">
                  <!-- Calendar icon -->
                  <div class="w-16 h-16 bg-white/20 rounded-xl flex flex-col items-center justify-center">
                    <span class="text-xs font-medium uppercase">
                      {{ nextAppointment()!.date | date:'EEE':'':'es-MX' }}
                    </span>
                    <span class="text-2xl font-bold">
                      {{ nextAppointment()!.date | date:'d' }}
                    </span>
                  </div>

                  <div>
                    <p class="text-xl font-semibold">
                      {{ formatFullDate(nextAppointment()!.date) }}
                    </p>
                    <p class="flex items-center gap-2 mt-1 opacity-90">
                      <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {{ nextAppointment()!.time }} hrs
                    </p>
                    <p class="flex items-center gap-2 mt-1 opacity-90">
                      <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      {{ nextAppointment()!.nutritionistName }}
                    </p>
                    @if (nextAppointment()!.location) {
                      <p class="flex items-center gap-2 mt-1 opacity-90">
                        <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        </svg>
                        {{ nextAppointment()!.location }}
                      </p>
                    }
                  </div>
                </div>

                <div class="flex flex-col gap-2">
                  <!-- Days countdown -->
                  <div class="bg-white/20 rounded-lg px-4 py-2 text-center">
                    @if (daysUntilNextAppointment() === 0) {
                      <p class="font-semibold">¡Hoy!</p>
                    } @else if (daysUntilNextAppointment() === 1) {
                      <p class="font-semibold">Mañana</p>
                    } @else {
                      <p class="text-2xl font-bold">{{ daysUntilNextAppointment() }}</p>
                      <p class="text-sm">días</p>
                    }
                  </div>

                  <!-- Add to calendar button -->
                  <a
                    [href]="getCalendarUrl()"
                    target="_blank"
                    class="flex items-center justify-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
                  >
                    <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span class="text-sm font-medium">Agregar a calendario</span>
                  </a>
                </div>
              </div>
            </div>
          } @else {
            <div class="bg-white dark:bg-dark-800 rounded-xl border border-dark-200 dark:border-dark-700 p-8 text-center">
              <svg class="w-12 h-12 text-dark-300 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <p class="text-dark-500">No tienes citas programadas</p>
              <p class="text-sm text-dark-400 mt-1">Contacta a tu nutriólogo para agendar</p>
            </div>
          }
        </section>

        <!-- Appointment history -->
        <section>
          <h2 class="text-lg font-semibold text-dark-900 dark:text-dark-50 mb-4">
            Historial de consultas
          </h2>
          @if (appointmentHistory().length > 0) {
            <div class="space-y-4">
              @for (appointment of appointmentHistory(); track appointment.id) {
                <div class="bg-white dark:bg-dark-800 rounded-xl border border-dark-200 dark:border-dark-700 p-6">
                  <div class="flex items-start justify-between mb-3">
                    <div class="flex items-center gap-3">
                      <div class="w-12 h-12 bg-dark-100 dark:bg-dark-700 rounded-lg flex flex-col items-center justify-center">
                        <span class="text-xs text-dark-500">
                          {{ appointment.date | date:'MMM':'':'es-MX' }}
                        </span>
                        <span class="text-lg font-bold text-dark-700 dark:text-dark-300">
                          {{ appointment.date | date:'d' }}
                        </span>
                      </div>
                      <div>
                        <p class="font-medium text-dark-900 dark:text-dark-50">
                          {{ getAppointmentTypeLabel(appointment.type) }}
                        </p>
                        <p class="text-sm text-dark-500">
                          {{ appointment.nutritionistName }}
                        </p>
                      </div>
                    </div>
                    <span class="px-2 py-1 text-xs font-medium rounded-full"
                      [class]="getStatusClass(appointment.status)"
                    >
                      {{ getStatusLabel(appointment.status) }}
                    </span>
                  </div>

                  @if (appointment.notes) {
                    <div class="mt-4 p-4 bg-dark-50 dark:bg-dark-900 rounded-lg">
                      <p class="text-sm text-dark-500 mb-1">Notas de la consulta:</p>
                      <p class="text-dark-700 dark:text-dark-300">{{ appointment.notes }}</p>
                    </div>
                  }

                  @if (appointment.attachments && appointment.attachments.length > 0) {
                    <div class="mt-4 flex items-center gap-2">
                      <svg class="w-4 h-4 text-dark-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                      </svg>
                      <span class="text-sm text-dark-500">
                        {{ appointment.attachments!.length }} documento(s) adjunto(s)
                      </span>
                    </div>
                  }
                </div>
              }
            </div>
          } @else {
            <div class="bg-white dark:bg-dark-800 rounded-xl border border-dark-200 dark:border-dark-700 p-8 text-center">
              <p class="text-dark-500">No hay historial de consultas</p>
            </div>
          }
        </section>
      }
    </div>
  `
})
export class PatientAppointmentsComponent implements OnInit {
  private readonly facade = inject(PatientPortalFacade);

  readonly isLoading = this.facade.isLoading;
  readonly nextAppointment = this.facade.nextAppointment;
  readonly appointmentHistory = this.facade.appointmentHistory;
  readonly daysUntilNextAppointment = this.facade.daysUntilNextAppointment;

  ngOnInit(): void {
    this.facade.loadAppointments();
  }

  getCalendarUrl(): string {
    const appointment = this.nextAppointment();
    return appointment ? this.facade.generateCalendarUrl(appointment.id) : '';
  }

  getAppointmentTypeLabel(type: string): string {
    const labels: Record<string, string> = {
      'initial': 'Consulta inicial',
      'follow_up': 'Seguimiento',
      'control': 'Control',
      'emergency': 'Urgencia'
    };
    return labels[type] ?? type;
  }

  getStatusLabel(status: string): string {
    const labels: Record<string, string> = {
      'scheduled': 'Programada',
      'completed': 'Completada',
      'cancelled': 'Cancelada',
      'no_show': 'No asistió'
    };
    return labels[status] ?? status;
  }

  getStatusClass(status: string): string {
    const classes: Record<string, string> = {
      'scheduled': 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300',
      'completed': 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300',
      'cancelled': 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300',
      'no_show': 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300'
    };
    return classes[status] ?? '';
  }

  formatFullDate(date: Date): string {
    return new Date(date).toLocaleDateString('es-MX', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  }
}
