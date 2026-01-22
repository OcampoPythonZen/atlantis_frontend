import { Component, computed, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-weight-summary-card',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <article
      class="bg-white dark:bg-dark-800 rounded-xl border border-dark-200 dark:border-dark-700 p-6 hover:shadow-md transition-shadow"
      aria-labelledby="weight-summary-title"
    >
      <header class="flex items-center justify-between mb-4">
        <h2
          id="weight-summary-title"
          class="text-sm font-medium text-dark-600 dark:text-dark-400 uppercase tracking-wide"
        >
          Resumen de peso
        </h2>
        <div class="w-10 h-10 bg-primary-500/10 dark:bg-primary-500/20 rounded-lg flex items-center justify-center">
          <svg class="w-5 h-5 text-primary-600 dark:text-primary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
          </svg>
        </div>
      </header>

      <div class="space-y-4">
        <!-- Current weight -->
        <div>
          <p class="text-3xl font-bold text-dark-900 dark:text-dark-50">
            @if (currentWeight()) {
              {{ currentWeight() | number:'1.1-1' }} <span class="text-lg font-normal text-dark-500">kg</span>
            } @else {
              <span class="text-dark-400">Sin datos</span>
            }
          </p>
          @if (lastUpdated()) {
            <p class="text-xs text-dark-500 dark:text-dark-400 mt-1">
              Última actualización: {{ lastUpdated() | date:'d MMM yyyy':'':'es-MX' }}
            </p>
          }
        </div>

        <!-- Progress -->
        @if (hasProgress()) {
          <div class="flex items-center gap-4">
            <!-- Weight lost -->
            <div class="flex-1">
              <div class="flex items-center gap-1">
                @if (weightDiff() < 0) {
                  <svg class="w-4 h-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                  <span class="text-sm font-semibold text-green-600 dark:text-green-400">
                    {{ weightDiff() | number:'1.1-1' }} kg
                  </span>
                } @else if (weightDiff() > 0) {
                  <svg class="w-4 h-4 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
                  </svg>
                  <span class="text-sm font-semibold text-red-600 dark:text-red-400">
                    +{{ weightDiff() | number:'1.1-1' }} kg
                  </span>
                }
              </div>
              <p class="text-xs text-dark-500">desde inicio</p>
            </div>

            <!-- Target -->
            @if (targetWeight()) {
              <div class="flex-1 text-right">
                <p class="text-sm font-semibold text-dark-700 dark:text-dark-300">
                  Meta: {{ targetWeight() }} kg
                </p>
                <p class="text-xs text-dark-500">
                  @if (toGoal() > 0) {
                    Faltan {{ toGoal() | number:'1.1-1' }} kg
                  } @else if (toGoal() < 0) {
                    ¡Meta alcanzada! 🎉
                  } @else {
                    ¡En tu meta!
                  }
                </p>
              </div>
            }
          </div>

          <!-- Progress bar -->
          @if (targetWeight() && initialWeight()) {
            <div class="relative pt-1">
              <div class="flex items-center justify-between mb-1">
                <span class="text-xs text-dark-500">{{ initialWeight() }} kg</span>
                <span class="text-xs text-dark-500">{{ targetWeight() }} kg</span>
              </div>
              <div class="w-full h-2 bg-dark-200 dark:bg-dark-700 rounded-full overflow-hidden">
                <div
                  class="h-full bg-gradient-to-r from-primary-400 to-primary-600 rounded-full transition-all duration-500"
                  [style.width.%]="progressPercentage()"
                ></div>
              </div>
              <p class="text-xs text-center text-dark-500 mt-1">
                {{ progressPercentage() | number:'1.0-0' }}% completado
              </p>
            </div>
          }
        }
      </div>

      <!-- Link to progress page -->
      <footer class="mt-4 pt-4 border-t border-dark-200 dark:border-dark-700">
        <a
          routerLink="/patient/progress"
          class="text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium flex items-center gap-1"
        >
          Ver mi progreso completo
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
        </a>
      </footer>
    </article>
  `
})
export class WeightSummaryCardComponent {
  currentWeight = input<number | null>(null);
  targetWeight = input<number | null>(null);
  initialWeight = input<number | null>(null);
  lastUpdated = input<Date | undefined>(undefined);

  hasProgress = computed(() => {
    return this.currentWeight() !== null && this.initialWeight() !== null;
  });

  weightDiff = computed(() => {
    const current = this.currentWeight();
    const initial = this.initialWeight();
    if (current === null || initial === null) return 0;
    return current - initial;
  });

  toGoal = computed(() => {
    const current = this.currentWeight();
    const target = this.targetWeight();
    if (current === null || target === null) return 0;
    return current - target;
  });

  progressPercentage = computed(() => {
    const initial = this.initialWeight();
    const current = this.currentWeight();
    const target = this.targetWeight();

    if (initial === null || current === null || target === null) return 0;

    const totalToLose = initial - target;
    if (totalToLose <= 0) return 100;

    const lost = initial - current;
    const percentage = (lost / totalToLose) * 100;

    return Math.min(Math.max(percentage, 0), 100);
  });
}
