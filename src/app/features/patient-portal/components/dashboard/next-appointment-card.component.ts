import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Appointment } from '../../models/patient.model';

@Component({
  selector: 'app-next-appointment-card',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <article
      class="h-full flex flex-col bg-white dark:bg-dark-800 rounded-xl border border-dark-200 dark:border-dark-700 p-6 hover:shadow-md transition-shadow"
      aria-labelledby="appointment-title"
    >
      <header class="flex items-center justify-between mb-4">
        <h2
          id="appointment-title"
          class="text-sm font-medium text-dark-600 dark:text-dark-400 uppercase tracking-wide"
        >
          Próxima cita
        </h2>
        <div class="w-10 h-10 bg-blue-500/10 dark:bg-blue-500/20 rounded-lg flex items-center justify-center">
          <svg class="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
      </header>

      <div class="flex-1">
      @if (appointment()) {
        <div class="space-y-4">
          <!-- Date and time -->
          <div class="flex items-start gap-3">
            <div class="flex-shrink-0 w-12 h-12 bg-primary-100 dark:bg-primary-900/30 rounded-lg flex flex-col items-center justify-center">
              <span class="text-xs font-medium text-primary-600 dark:text-primary-400 uppercase">
                {{ appointment()!.date | date:'EEE':'':'es-MX' }}
              </span>
              <span class="text-lg font-bold text-primary-700 dark:text-primary-300">
                {{ appointment()!.date | date:'d' }}
              </span>
            </div>
            <div>
              <p class="font-semibold text-dark-900 dark:text-dark-50">
                {{ formatAppointmentDate(appointment()!.date) }}
              </p>
              <p class="text-sm text-dark-600 dark:text-dark-400 flex items-center gap-1">
                <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {{ appointment()!.time }} hrs
              </p>
            </div>
          </div>

          <!-- Nutritionist -->
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 bg-dark-200 dark:bg-dark-700 rounded-full flex items-center justify-center">
              <svg class="w-5 h-5 text-dark-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <div>
              <p class="text-sm font-medium text-dark-900 dark:text-dark-50">
                {{ appointment()!.nutritionistName }}
              </p>
              <p class="text-xs text-dark-500">
                {{ getAppointmentTypeLabel(appointment()!.type) }}
              </p>
            </div>
          </div>

          <!-- Location -->
          @if (appointment()!.location) {
            <div class="flex items-start gap-2 text-sm text-dark-600 dark:text-dark-400">
              <svg class="w-4 h-4 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span>{{ appointment()!.location }}</span>
            </div>
          }

          <!-- Days until -->
          @if (daysUntil() !== null) {
            <div class="bg-primary-50 dark:bg-primary-900/20 rounded-lg p-3 text-center">
              @if (daysUntil() === 0) {
                <p class="text-sm font-semibold text-primary-700 dark:text-primary-300">
                  ¡Tu cita es hoy!
                </p>
              } @else if (daysUntil() === 1) {
                <p class="text-sm font-semibold text-primary-700 dark:text-primary-300">
                  Tu cita es mañana
                </p>
              } @else if (daysUntil()! > 0) {
                <p class="text-sm font-semibold text-primary-700 dark:text-primary-300">
                  Faltan {{ daysUntil() }} días
                </p>
              }
            </div>
          }
        </div>
      } @else {
        <!-- Empty state -->
        <div class="text-center py-4">
          <svg class="w-12 h-12 text-dark-300 dark:text-dark-600 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <p class="text-dark-500 dark:text-dark-400 text-sm">
            No tienes citas programadas
          </p>
          <p class="text-dark-400 dark:text-dark-500 text-xs mt-1">
            Contacta a tu nutriólogo para agendar
          </p>
        </div>
      }
      </div>

      <!-- Link to appointments page -->
      <footer class="mt-auto pt-4 border-t border-dark-200 dark:border-dark-700">
        <a
          routerLink="/patient/appointments"
          class="text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium flex items-center gap-1"
        >
          Ver todas mis citas
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
        </a>
      </footer>
    </article>
  `
})
export class NextAppointmentCardComponent {
  appointment = input<Appointment | null>(null);
  daysUntil = input<number | null>(null);

  getAppointmentTypeLabel(type: string): string {
    const labels: Record<string, string> = {
      'initial': 'Consulta inicial',
      'follow_up': 'Seguimiento',
      'control': 'Control',
      'emergency': 'Urgencia'
    };
    return labels[type] ?? type;
  }

  formatAppointmentDate(date: Date): string {
    return new Date(date).toLocaleDateString('es-MX', {
      weekday: 'long',
      day: 'numeric',
      month: 'long'
    });
  }
}
