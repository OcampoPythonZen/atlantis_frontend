import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PatientPortalFacade } from '../../facades/patient-portal.facade';
import { MealType } from '../../models/patient.model';
import { MacroDistributionChartComponent, MacroData } from '../../components/charts/macro-distribution-chart/macro-distribution-chart.component';

@Component({
  selector: 'app-nutrition-plan',
  standalone: true,
  imports: [CommonModule, MacroDistributionChartComponent],
  template: `
    <div class="space-y-6">
      <!-- Page header -->
      <div>
        <h1 class="text-2xl font-display font-bold text-dark-900 dark:text-dark-50">
          Mi Plan Nutricional
        </h1>
        <p class="mt-1 text-dark-600 dark:text-dark-400">
          Tu plan alimenticio personalizado
        </p>
      </div>

      @if (isLoading()) {
        <!-- Loading state - skeleton matching page structure -->
        <div class="space-y-6">
          <!-- Plan overview skeleton -->
          <div class="bg-white dark:bg-dark-800 rounded-xl border border-dark-200 dark:border-dark-700 p-6 animate-pulse">
            <div class="flex items-start justify-between mb-4">
              <div class="space-y-2">
                <div class="h-6 bg-dark-200 dark:bg-dark-700 rounded w-48"></div>
                <div class="h-4 bg-dark-200 dark:bg-dark-700 rounded w-32"></div>
              </div>
              <div class="h-6 bg-dark-200 dark:bg-dark-700 rounded-full w-16"></div>
            </div>
            <div class="h-4 bg-dark-200 dark:bg-dark-700 rounded w-3/4 mb-6"></div>
            <!-- Chart skeleton -->
            <div class="h-40 bg-dark-200 dark:bg-dark-700 rounded"></div>
          </div>

          <!-- Daily menu skeleton -->
          <div class="bg-white dark:bg-dark-800 rounded-xl border border-dark-200 dark:border-dark-700 p-6 animate-pulse">
            <div class="flex items-center justify-between mb-6">
              <div class="h-6 bg-dark-200 dark:bg-dark-700 rounded w-40"></div>
              <div class="flex gap-1">
                @for (i of skeletonDays; track i) {
                  <div class="w-10 h-10 bg-dark-200 dark:bg-dark-700 rounded-lg"></div>
                }
              </div>
            </div>
            <div class="space-y-3">
              @for (i of skeletonMeals; track i) {
                <div class="h-16 bg-dark-200 dark:bg-dark-700 rounded-lg"></div>
              }
            </div>
          </div>

          <!-- Food lists skeleton -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="bg-white dark:bg-dark-800 rounded-xl border border-dark-200 dark:border-dark-700 p-6 animate-pulse">
              <div class="flex items-center gap-2 mb-4">
                <div class="w-8 h-8 bg-dark-200 dark:bg-dark-700 rounded-lg"></div>
                <div class="h-6 bg-dark-200 dark:bg-dark-700 rounded w-40"></div>
              </div>
              <div class="space-y-2">
                @for (i of skeletonFoods; track i) {
                  <div class="h-4 bg-dark-200 dark:bg-dark-700 rounded w-3/4"></div>
                }
              </div>
            </div>
            <div class="bg-white dark:bg-dark-800 rounded-xl border border-dark-200 dark:border-dark-700 p-6 animate-pulse">
              <div class="flex items-center gap-2 mb-4">
                <div class="w-8 h-8 bg-dark-200 dark:bg-dark-700 rounded-lg"></div>
                <div class="h-6 bg-dark-200 dark:bg-dark-700 rounded w-40"></div>
              </div>
              <div class="space-y-2">
                @for (i of skeletonFoods; track i) {
                  <div class="h-4 bg-dark-200 dark:bg-dark-700 rounded w-3/4"></div>
                }
              </div>
            </div>
          </div>
        </div>
      } @else if (!activePlan()) {
        <!-- No plan state -->
        <div class="bg-white dark:bg-dark-800 rounded-xl border border-dark-200 dark:border-dark-700 p-12 text-center">
          <svg class="w-16 h-16 text-dark-300 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          <h2 class="text-xl font-semibold text-dark-900 dark:text-dark-50 mb-2">
            Aún no tienes un plan asignado
          </h2>
          <p class="text-dark-500">
            Tu nutriólogo te asignará un plan personalizado en tu próxima consulta.
          </p>
        </div>
      } @else {
        <!-- Plan overview -->
        <div class="bg-white dark:bg-dark-800 rounded-xl border border-dark-200 dark:border-dark-700 p-6">
          <div class="flex items-start justify-between mb-4">
            <div>
              <h2 class="text-xl font-semibold text-dark-900 dark:text-dark-50">
                {{ activePlan()!.name }}
              </h2>
              <p class="text-sm text-dark-500 mt-1">
                Inicio: {{ formatDate(activePlan()!.startDate) }}
              </p>
            </div>
            <span class="px-3 py-1 text-sm font-medium bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-full">
              Activo
            </span>
          </div>
          <p class="text-dark-600 dark:text-dark-400 mb-6">
            {{ activePlan()!.description }}
          </p>

          <!-- Macros distribution chart -->
          @if (macroData()) {
            <app-macro-distribution-chart [macros]="macroData()!" />
          }
        </div>

        <!-- Daily menu -->
        <div class="bg-white dark:bg-dark-800 rounded-xl border border-dark-200 dark:border-dark-700 p-6">
          <div class="flex items-center justify-between mb-6">
            <h2 class="text-lg font-semibold text-dark-900 dark:text-dark-50">
              Menú del día - {{ getDayName(selectedDay()) }}
            </h2>
            <!-- Day selector -->
            <div class="flex gap-1">
              @for (day of weekDays; track day.value) {
                <button
                  (click)="selectedDay.set(day.value)"
                  [class.bg-primary-500]="selectedDay() === day.value"
                  [class.text-dark-950]="selectedDay() === day.value"
                  [class.bg-dark-100]="selectedDay() !== day.value"
                  [class.dark:bg-dark-700]="selectedDay() !== day.value"
                  [class.text-dark-600]="selectedDay() !== day.value"
                  [class.dark:text-dark-400]="selectedDay() !== day.value"
                  class="w-10 h-10 rounded-lg text-sm font-medium transition-colors"
                >
                  {{ day.label }}
                </button>
              }
            </div>
          </div>

          <!-- Meals list -->
          @if (currentDayMenu()) {
            <div class="space-y-4">
              @for (meal of currentDayMenu()!.meals; track meal.id) {
                <div class="border border-dark-200 dark:border-dark-700 rounded-lg overflow-hidden">
                  <!-- Meal header -->
                  <button
                    (click)="toggleMeal(meal.id)"
                    class="w-full flex items-center justify-between p-4 bg-dark-50 dark:bg-dark-900 hover:bg-dark-100 dark:hover:bg-dark-800 transition-colors"
                  >
                    <div class="flex items-center gap-3">
                      <div class="w-10 h-10 rounded-lg flex items-center justify-center" [ngClass]="getMealIconBg(meal.type)">
                        @switch (meal.type) {
                          @case ('breakfast') {
                            <svg class="w-5 h-5" [ngClass]="getMealIconColor(meal.type)" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                            </svg>
                          }
                          @case ('morning_snack') {
                            <svg class="w-5 h-5" [ngClass]="getMealIconColor(meal.type)" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          }
                          @case ('lunch') {
                            <svg class="w-5 h-5" [ngClass]="getMealIconColor(meal.type)" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                          }
                          @case ('afternoon_snack') {
                            <svg class="w-5 h-5" [ngClass]="getMealIconColor(meal.type)" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          }
                          @case ('dinner') {
                            <svg class="w-5 h-5" [ngClass]="getMealIconColor(meal.type)" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                            </svg>
                          }
                          @default {
                            <svg class="w-5 h-5" [ngClass]="getMealIconColor(meal.type)" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                            </svg>
                          }
                        }
                      </div>
                      <div class="text-left">
                        <p class="font-medium text-dark-900 dark:text-dark-50">
                          {{ meal.name }}
                        </p>
                        <p class="text-sm text-dark-500">
                          {{ meal.scheduledTime }} hrs
                        </p>
                      </div>
                    </div>
                    <div class="flex items-center gap-3">
                      <span class="text-sm font-medium text-primary-600 dark:text-primary-400">
                        {{ meal.totalCalories }} kcal
                      </span>
                      <svg
                        class="w-5 h-5 text-dark-400 transition-transform"
                        [class.rotate-180]="expandedMeals().has(meal.id)"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </button>

                  <!-- Meal foods (expandable) -->
                  @if (expandedMeals().has(meal.id)) {
                    <div class="p-4 border-t border-dark-200 dark:border-dark-700">
                      <ul class="space-y-2">
                        @for (food of meal.foods; track food.id) {
                          <li class="flex items-center justify-between py-2">
                            <div class="flex items-center gap-2">
                              <span class="w-2 h-2 bg-primary-500 rounded-full"></span>
                              <span class="text-dark-700 dark:text-dark-300">{{ food.name }}</span>
                            </div>
                            <span class="text-sm text-dark-500">{{ food.portion }}</span>
                          </li>
                        }
                      </ul>
                    </div>
                  }
                </div>
              }
            </div>
          } @else {
            <p class="text-center text-dark-500 py-8">
              No hay menú disponible para este día
            </p>
          }
        </div>

        <!-- Food lists -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- Allowed foods -->
          <div class="bg-white dark:bg-dark-800 rounded-xl border border-dark-200 dark:border-dark-700 p-6">
            <div class="flex items-center gap-2 mb-4">
              <div class="w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                <svg class="w-5 h-5 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 class="text-lg font-semibold text-dark-900 dark:text-dark-50">
                Alimentos recomendados
              </h3>
            </div>
            @if (allowedFoods()?.foods?.length) {
              <ul class="space-y-2">
                @for (food of allowedFoods()!.foods; track food) {
                  <li class="flex items-center gap-2 text-dark-700 dark:text-dark-300">
                    <span class="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                    {{ food }}
                  </li>
                }
              </ul>
            }
          </div>

          <!-- Restricted foods -->
          <div class="bg-white dark:bg-dark-800 rounded-xl border border-dark-200 dark:border-dark-700 p-6">
            <div class="flex items-center gap-2 mb-4">
              <div class="w-8 h-8 bg-red-100 dark:bg-red-900/30 rounded-lg flex items-center justify-center">
                <svg class="w-5 h-5 text-red-600 dark:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <h3 class="text-lg font-semibold text-dark-900 dark:text-dark-50">
                Alimentos a evitar
              </h3>
            </div>
            @if (restrictedFoods()?.foods?.length) {
              <ul class="space-y-2">
                @for (food of restrictedFoods()!.foods; track food) {
                  <li class="flex items-center gap-2 text-dark-700 dark:text-dark-300">
                    <span class="w-1.5 h-1.5 bg-red-500 rounded-full"></span>
                    {{ food }}
                  </li>
                }
              </ul>
            }
          </div>
        </div>
      }
    </div>
  `
})
export class NutritionPlanComponent implements OnInit {
  private readonly facade = inject(PatientPortalFacade);

  readonly isLoading = this.facade.isLoading;
  readonly activePlan = this.facade.activePlan;
  readonly weeklyMenu = this.facade.weeklyMenu;
  readonly allowedFoods = this.facade.allowedFoods;
  readonly restrictedFoods = this.facade.restrictedFoods;

  selectedDay = signal(new Date().getDay());
  expandedMeals = signal<Set<string>>(new Set());

  // Skeleton arrays for loading state
  readonly skeletonDays = [0, 1, 2, 3, 4, 5, 6];
  readonly skeletonMeals = [0, 1, 2, 3, 4];
  readonly skeletonFoods = [0, 1, 2, 3];

  readonly weekDays = [
    { value: 0, label: 'D' },
    { value: 1, label: 'L' },
    { value: 2, label: 'M' },
    { value: 3, label: 'X' },
    { value: 4, label: 'J' },
    { value: 5, label: 'V' },
    { value: 6, label: 'S' }
  ];

  currentDayMenu = computed(() => {
    return this.weeklyMenu().find(m => m.dayOfWeek === this.selectedDay()) ?? null;
  });

  macroData = computed((): MacroData | null => {
    const plan = this.activePlan();
    if (!plan) return null;
    return {
      protein: plan.macros.protein,
      carbohydrates: plan.macros.carbohydrates,
      fat: plan.macros.fat
    };
  });

  ngOnInit(): void {
    this.facade.loadNutritionPlan();
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('es-MX', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  }

  getDayName(day: number): string {
    const days = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    return days[day] ?? '';
  }

  getMealIconBg(type: MealType): string {
    const backgrounds: Record<MealType, string> = {
      'breakfast': 'bg-amber-100 dark:bg-amber-900/30',
      'morning_snack': 'bg-green-100 dark:bg-green-900/30',
      'lunch': 'bg-primary-100 dark:bg-primary-900/30',
      'afternoon_snack': 'bg-blue-100 dark:bg-blue-900/30',
      'dinner': 'bg-indigo-100 dark:bg-indigo-900/30'
    };
    return backgrounds[type] ?? 'bg-dark-100 dark:bg-dark-700';
  }

  getMealIconColor(type: MealType): string {
    const colors: Record<MealType, string> = {
      'breakfast': 'text-amber-600 dark:text-amber-400',
      'morning_snack': 'text-green-600 dark:text-green-400',
      'lunch': 'text-primary-600 dark:text-primary-400',
      'afternoon_snack': 'text-blue-600 dark:text-blue-400',
      'dinner': 'text-indigo-600 dark:text-indigo-400'
    };
    return colors[type] ?? 'text-dark-600 dark:text-dark-400';
  }

  toggleMeal(mealId: string): void {
    this.expandedMeals.update(set => {
      const newSet = new Set(set);
      if (newSet.has(mealId)) {
        newSet.delete(mealId);
      } else {
        newSet.add(mealId);
      }
      return newSet;
    });
  }
}
