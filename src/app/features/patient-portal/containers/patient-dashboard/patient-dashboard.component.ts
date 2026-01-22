import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PatientPortalFacade } from '../../facades/patient-portal.facade';

// Dashboard card components
import { WeightSummaryCardComponent } from '../../components/dashboard/weight-summary-card.component';
import { DailyPlanSummaryCardComponent } from '../../components/dashboard/daily-plan-summary-card.component';
import { NextAppointmentCardComponent } from '../../components/dashboard/next-appointment-card.component';
import { NutritionistMessageCardComponent } from '../../components/dashboard/nutritionist-message-card.component';

@Component({
  selector: 'app-patient-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    WeightSummaryCardComponent,
    DailyPlanSummaryCardComponent,
    NextAppointmentCardComponent,
    NutritionistMessageCardComponent
  ],
  template: `
    <div class="space-y-6">
      <!-- Page header -->
      <div>
        <h1 class="text-2xl font-display font-bold text-dark-900 dark:text-dark-50">
          Resumen
        </h1>
        <p class="mt-1 text-dark-600 dark:text-dark-400">
          Tu progreso y plan nutricional de un vistazo
        </p>
      </div>

      <!-- Loading state -->
      @if (isLoading()) {
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          @for (i of [1, 2, 3, 4]; track i) {
            <div class="bg-white dark:bg-dark-800 rounded-xl border border-dark-200 dark:border-dark-700 p-6 animate-pulse">
              <div class="h-4 bg-dark-200 dark:bg-dark-700 rounded w-1/3 mb-4"></div>
              <div class="h-8 bg-dark-200 dark:bg-dark-700 rounded w-1/2 mb-2"></div>
              <div class="h-4 bg-dark-200 dark:bg-dark-700 rounded w-2/3"></div>
            </div>
          }
        </div>
      } @else if (error()) {
        <!-- Error state -->
        <div class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-6 text-center">
          <svg class="w-12 h-12 text-red-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <p class="text-red-700 dark:text-red-400 mb-4">{{ error() }}</p>
          <button
            (click)="loadData()"
            class="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
          >
            Reintentar
          </button>
        </div>
      } @else {
        <!-- Dashboard cards grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- Weight Summary -->
          <app-weight-summary-card
            [currentWeight]="currentWeight()"
            [targetWeight]="targetWeight()"
            [initialWeight]="initialWeight()"
            [lastUpdated]="currentMetrics()?.date"
          />

          <!-- Daily Plan Summary -->
          <app-daily-plan-summary-card
            [planName]="activePlan()?.name"
            [calories]="activePlan()?.dailyCalories"
            [protein]="activePlan()?.macros?.protein"
            [carbs]="activePlan()?.macros?.carbohydrates"
            [fat]="activePlan()?.macros?.fat"
          />

          <!-- Next Appointment -->
          <app-next-appointment-card
            [appointment]="nextAppointment()"
            [daysUntil]="daysUntilNextAppointment()"
          />

          <!-- Nutritionist Message -->
          <app-nutritionist-message-card
            [nutritionistName]="nutritionist()?.fullName"
            [message]="'Excelente progreso esta semana. Sigue así 💪'"
            [sentAt]="lastMessageDate"
          />
        </div>

        <!-- Quick actions -->
        <div class="bg-white dark:bg-dark-800 rounded-xl border border-dark-200 dark:border-dark-700 p-6">
          <h2 class="text-lg font-semibold text-dark-900 dark:text-dark-50 mb-4">
            Acciones rápidas
          </h2>
          <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
            <a
              routerLink="/patient/progress"
              class="flex flex-col items-center gap-2 p-4 rounded-lg bg-primary-50 dark:bg-primary-900/20 hover:bg-primary-100 dark:hover:bg-primary-900/30 transition-colors"
            >
              <div class="w-10 h-10 bg-primary-500/20 rounded-lg flex items-center justify-center">
                <svg class="w-5 h-5 text-primary-600 dark:text-primary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <span class="text-sm font-medium text-dark-700 dark:text-dark-300">Ver progreso</span>
            </a>

            <a
              routerLink="/patient/plan"
              class="flex flex-col items-center gap-2 p-4 rounded-lg bg-green-50 dark:bg-green-900/20 hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors"
            >
              <div class="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
                <svg class="w-5 h-5 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <span class="text-sm font-medium text-dark-700 dark:text-dark-300">Mi plan</span>
            </a>

            <a
              routerLink="/patient/messages"
              class="flex flex-col items-center gap-2 p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
            >
              <div class="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                <svg class="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <span class="text-sm font-medium text-dark-700 dark:text-dark-300">Mensajes</span>
            </a>

            <a
              routerLink="/patient/appointments"
              class="flex flex-col items-center gap-2 p-4 rounded-lg bg-purple-50 dark:bg-purple-900/20 hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors"
            >
              <div class="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
                <svg class="w-5 h-5 text-purple-600 dark:text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <span class="text-sm font-medium text-dark-700 dark:text-dark-300">Mis citas</span>
            </a>
          </div>
        </div>
      }
    </div>
  `
})
export class PatientDashboardComponent implements OnInit {
  private readonly facade = inject(PatientPortalFacade);

  // State from facade
  readonly isLoading = this.facade.isLoading;
  readonly error = this.facade.error;
  readonly currentWeight = this.facade.currentWeight;
  readonly targetWeight = this.facade.targetWeight;
  readonly initialWeight = this.facade.initialWeight;
  readonly currentMetrics = this.facade.currentMetrics;
  readonly activePlan = this.facade.activePlan;
  readonly nextAppointment = this.facade.nextAppointment;
  readonly nutritionist = this.facade.nutritionist;
  readonly daysUntilNextAppointment = this.facade.daysUntilNextAppointment;

  // Mock date for last message
  lastMessageDate = new Date('2025-01-20T11:02:00');

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.facade.loadDashboard();
  }
}
