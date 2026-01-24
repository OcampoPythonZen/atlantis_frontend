import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NutritionistPortalFacade } from '../../facades/nutritionist-portal.facade';

@Component({
  selector: 'app-appointments-calendar',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="p-6">
      <!-- Header -->
      <div class="flex items-center justify-between mb-6">
        <div>
          <h1 class="text-2xl font-bold text-dark-900 dark:text-dark-50">Calendario</h1>
          <p class="text-dark-600 dark:text-dark-400 mt-1">
            Gestiona tus citas con pacientes
          </p>
        </div>
        <button
          (click)="facade.openScheduleAppointmentModal()"
          class="flex items-center gap-2 px-4 py-2 bg-primary-500 hover:bg-primary-600 text-dark-950 font-medium rounded-lg transition-colors">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          Nueva Cita
        </button>
      </div>

      @if (facade.isLoading()) {
        <div class="flex items-center justify-center py-12">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
        </div>
      } @else {
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <!-- Calendar View (Placeholder) -->
          <div class="lg:col-span-2 bg-white dark:bg-dark-800 rounded-xl border border-dark-200 dark:border-dark-700 p-6">
            <div class="flex items-center justify-between mb-6">
              <h2 class="text-lg font-semibold text-dark-900 dark:text-dark-50">
                {{ currentMonth }}
              </h2>
              <div class="flex items-center gap-2">
                <button
                  (click)="previousMonth()"
                  class="p-2 hover:bg-dark-100 dark:hover:bg-dark-700 rounded-lg transition-colors">
                  <svg class="w-5 h-5 text-dark-600 dark:text-dark-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <button
                  (click)="goToToday()"
                  class="px-3 py-1 text-sm font-medium text-primary-600 dark:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-lg transition-colors">
                  Hoy
                </button>
                <button
                  (click)="nextMonth()"
                  class="p-2 hover:bg-dark-100 dark:hover:bg-dark-700 rounded-lg transition-colors">
                  <svg class="w-5 h-5 text-dark-600 dark:text-dark-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>

            <!-- Calendar Grid -->
            <div class="grid grid-cols-7 gap-1">
              <!-- Day Headers -->
              @for (day of weekDays; track day) {
                <div class="text-center text-sm font-medium text-dark-500 dark:text-dark-400 py-2">
                  {{ day }}
                </div>
              }

              <!-- Calendar Days -->
              @for (day of calendarDays; track $index) {
                <button
                  (click)="selectDate(day)"
                  class="aspect-square p-2 text-sm rounded-lg transition-colors relative"
                  [class]="getDayClasses(day)">
                  <span>{{ day?.getDate() }}</span>
                  @if (hasAppointments(day)) {
                    <span class="absolute bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-primary-500 rounded-full"></span>
                  }
                </button>
              }
            </div>
          </div>

          <!-- Today's Appointments -->
          <div class="bg-white dark:bg-dark-800 rounded-xl border border-dark-200 dark:border-dark-700 p-6">
            <h2 class="text-lg font-semibold text-dark-900 dark:text-dark-50 mb-4">
              Citas del Día
            </h2>

            @if (facade.todayAppointments().length > 0) {
              <div class="space-y-3">
                @for (apt of facade.todayAppointments(); track apt.id) {
                  <div class="p-3 bg-dark-50 dark:bg-dark-900 rounded-lg">
                    <div class="flex items-center justify-between mb-2">
                      <span class="text-sm font-medium text-dark-900 dark:text-dark-50">
                        {{ apt.patientName }}
                      </span>
                      <span
                        class="px-2 py-0.5 text-xs rounded"
                        [class]="getStatusClasses(apt.status)">
                        {{ getStatusLabel(apt.status) }}
                      </span>
                    </div>
                    <div class="flex items-center gap-4 text-sm text-dark-500 dark:text-dark-400">
                      <div class="flex items-center gap-1">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {{ apt.time }}
                      </div>
                      <div class="flex items-center gap-1">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        </svg>
                        {{ apt.location }}
                      </div>
                    </div>
                  </div>
                }
              </div>
            } @else {
              <div class="text-center py-8 text-dark-500 dark:text-dark-400">
                <svg class="w-12 h-12 mx-auto mb-3 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <p class="text-sm">Sin citas para hoy</p>
              </div>
            }
          </div>
        </div>
      }
    </div>
  `
})
export class AppointmentsCalendarComponent implements OnInit {
  readonly facade = inject(NutritionistPortalFacade);

  currentDate = new Date();
  selectedDate = new Date();
  calendarDays: (Date | null)[] = [];

  readonly weekDays = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

  get currentMonth(): string {
    return this.currentDate.toLocaleDateString('es-MX', {
      month: 'long',
      year: 'numeric'
    });
  }

  ngOnInit(): void {
    this.facade.loadAppointments();
    this.generateCalendarDays();
  }

  generateCalendarDays(): void {
    const year = this.currentDate.getFullYear();
    const month = this.currentDate.getMonth();

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    const days: (Date | null)[] = [];

    // Add empty days for days before first day of month
    for (let i = 0; i < firstDay.getDay(); i++) {
      days.push(null);
    }

    // Add days of month
    for (let i = 1; i <= lastDay.getDate(); i++) {
      days.push(new Date(year, month, i));
    }

    this.calendarDays = days;
  }

  previousMonth(): void {
    this.currentDate = new Date(
      this.currentDate.getFullYear(),
      this.currentDate.getMonth() - 1,
      1
    );
    this.generateCalendarDays();
  }

  nextMonth(): void {
    this.currentDate = new Date(
      this.currentDate.getFullYear(),
      this.currentDate.getMonth() + 1,
      1
    );
    this.generateCalendarDays();
  }

  goToToday(): void {
    this.currentDate = new Date();
    this.selectedDate = new Date();
    this.generateCalendarDays();
  }

  selectDate(date: Date | null): void {
    if (date) {
      this.selectedDate = date;
      this.facade.setSelectedDate(date);
    }
  }

  getDayClasses(day: Date | null): string {
    if (!day) return 'invisible';

    const today = new Date();
    const isToday = day.toDateString() === today.toDateString();
    const isSelected = day.toDateString() === this.selectedDate.toDateString();

    if (isSelected) {
      return 'bg-primary-500 text-dark-950 font-medium';
    }
    if (isToday) {
      return 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 font-medium';
    }
    return 'hover:bg-dark-100 dark:hover:bg-dark-700 text-dark-900 dark:text-dark-50';
  }

  hasAppointments(day: Date | null): boolean {
    if (!day) return false;
    return this.facade.appointments().some(apt => {
      const aptDate = new Date(apt.date);
      return aptDate.toDateString() === day.toDateString();
    });
  }

  getStatusClasses(status: string): string {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400';
      case 'pending':
        return 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400';
      case 'cancelled':
        return 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400';
      default:
        return 'bg-dark-100 dark:bg-dark-700 text-dark-600 dark:text-dark-400';
    }
  }

  getStatusLabel(status: string): string {
    switch (status) {
      case 'confirmed': return 'Confirmada';
      case 'pending': return 'Pendiente';
      case 'cancelled': return 'Cancelada';
      case 'completed': return 'Completada';
      default: return status;
    }
  }
}
