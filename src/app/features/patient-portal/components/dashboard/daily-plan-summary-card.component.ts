import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-daily-plan-summary-card',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <article
      class="h-full flex flex-col bg-white dark:bg-dark-800 rounded-xl border border-dark-200 dark:border-dark-700 p-6 hover:shadow-md transition-shadow"
      aria-labelledby="daily-plan-title"
    >
      <header class="flex items-center justify-between mb-4">
        <h2
          id="daily-plan-title"
          class="text-sm font-medium text-dark-600 dark:text-dark-400 uppercase tracking-wide"
        >
          Tu plan de hoy
        </h2>
        <div class="w-10 h-10 bg-green-500/10 dark:bg-green-500/20 rounded-lg flex items-center justify-center">
          <svg class="w-5 h-5 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
          </svg>
        </div>
      </header>

      <div class="flex-1">
      @if (planName()) {
        <!-- Plan name -->
        <p class="text-sm text-dark-600 dark:text-dark-400 mb-4">
          {{ planName() }}
        </p>

        <!-- Calories -->
        <div class="mb-4">
          <p class="text-3xl font-bold text-dark-900 dark:text-dark-50">
            {{ calories() | number:'1.0-0' }} <span class="text-lg font-normal text-dark-500">kcal</span>
          </p>
          <p class="text-xs text-dark-500">Objetivo diario de calorías</p>
        </div>

        <!-- Macros -->
        <div class="grid grid-cols-3 gap-3">
          <!-- Protein -->
          <div class="text-center p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
            <div class="w-8 h-8 mx-auto mb-1 bg-purple-500/20 rounded-full flex items-center justify-center">
              <svg class="w-4 h-4 text-purple-600 dark:text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <p class="text-lg font-semibold text-purple-700 dark:text-purple-300">{{ protein() }}g</p>
            <p class="text-xs text-purple-600 dark:text-purple-400">Proteína</p>
          </div>

          <!-- Carbs -->
          <div class="text-center p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
            <div class="w-8 h-8 mx-auto mb-1 bg-amber-500/20 rounded-full flex items-center justify-center">
              <svg class="w-4 h-4 text-amber-600 dark:text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <p class="text-lg font-semibold text-amber-700 dark:text-amber-300">{{ carbs() }}g</p>
            <p class="text-xs text-amber-600 dark:text-amber-400">Carbos</p>
          </div>

          <!-- Fat -->
          <div class="text-center p-3 bg-pink-50 dark:bg-pink-900/20 rounded-lg">
            <div class="w-8 h-8 mx-auto mb-1 bg-pink-500/20 rounded-full flex items-center justify-center">
              <svg class="w-4 h-4 text-pink-600 dark:text-pink-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <p class="text-lg font-semibold text-pink-700 dark:text-pink-300">{{ fat() }}g</p>
            <p class="text-xs text-pink-600 dark:text-pink-400">Grasas</p>
          </div>
        </div>
      } @else {
        <!-- Empty state -->
        <div class="text-center py-4">
          <svg class="w-12 h-12 text-dark-300 dark:text-dark-600 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          <p class="text-dark-500 dark:text-dark-400 text-sm">
            Aún no tienes un plan asignado
          </p>
          <p class="text-dark-400 dark:text-dark-500 text-xs mt-1">
            Tu nutriólogo te asignará uno pronto
          </p>
        </div>
      }
      </div>

      <!-- Link to plan page -->
      <footer class="mt-auto pt-4 border-t border-dark-200 dark:border-dark-700">
        <a
          routerLink="/patient/plan"
          class="text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium flex items-center gap-1"
        >
          Ver plan completo
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
        </a>
      </footer>
    </article>
  `
})
export class DailyPlanSummaryCardComponent {
  planName = input<string | undefined>(undefined);
  calories = input<number | undefined>(undefined);
  protein = input<number | undefined>(undefined);
  carbs = input<number | undefined>(undefined);
  fat = input<number | undefined>(undefined);
}
