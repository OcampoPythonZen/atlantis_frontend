import { Component, input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PatientComplete } from '../../models/nutritionist.model';

@Component({
  selector: 'app-patient-plan-tab',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="space-y-6">
      @if (patient()?.activePlan; as plan) {
        <!-- Plan Header -->
        <div class="flex items-center justify-between">
          <div>
            <h3 class="text-lg font-semibold text-dark-900 dark:text-dark-50">{{ plan.name }}</h3>
            <p class="text-sm text-dark-500 mt-1">
              {{ formatDate(plan.startDate) }}{{ plan.endDate ? ' - ' + formatDate(plan.endDate) : '' }}
            </p>
          </div>
          <div class="flex items-center gap-2">
            <span class="px-3 py-1 text-xs font-medium rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400">
              Activo
            </span>
            <button class="px-4 py-2 bg-primary-500 hover:bg-primary-600 text-dark-950 font-medium rounded-lg transition-colors text-sm">
              Editar Plan
            </button>
          </div>
        </div>

        <!-- Macro Targets -->
        <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div class="bg-dark-50 dark:bg-dark-900 rounded-xl p-4 text-center">
            <div class="w-12 h-12 mx-auto bg-amber-100 dark:bg-amber-900/30 rounded-full flex items-center justify-center mb-2">
              <svg class="w-6 h-6 text-amber-600 dark:text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <p class="text-2xl font-bold text-dark-900 dark:text-dark-50">{{ plan.dailyCalories }}</p>
            <p class="text-xs text-dark-500">Calorías/día</p>
          </div>

          <div class="bg-dark-50 dark:bg-dark-900 rounded-xl p-4 text-center">
            <div class="w-12 h-12 mx-auto bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mb-2">
              <span class="text-lg font-bold text-red-600 dark:text-red-400">P</span>
            </div>
            <p class="text-2xl font-bold text-dark-900 dark:text-dark-50">{{ plan.macros.protein }}g</p>
            <p class="text-xs text-dark-500">Proteína</p>
          </div>

          <div class="bg-dark-50 dark:bg-dark-900 rounded-xl p-4 text-center">
            <div class="w-12 h-12 mx-auto bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mb-2">
              <span class="text-lg font-bold text-blue-600 dark:text-blue-400">C</span>
            </div>
            <p class="text-2xl font-bold text-dark-900 dark:text-dark-50">{{ plan.macros.carbohydrates }}g</p>
            <p class="text-xs text-dark-500">Carbohidratos</p>
          </div>

          <div class="bg-dark-50 dark:bg-dark-900 rounded-xl p-4 text-center">
            <div class="w-12 h-12 mx-auto bg-yellow-100 dark:bg-yellow-900/30 rounded-full flex items-center justify-center mb-2">
              <span class="text-lg font-bold text-yellow-600 dark:text-yellow-400">G</span>
            </div>
            <p class="text-2xl font-bold text-dark-900 dark:text-dark-50">{{ plan.macros.fat }}g</p>
            <p class="text-xs text-dark-500">Grasas</p>
          </div>
        </div>

        <!-- Plan Description -->
        @if (plan.description) {
          <div class="bg-dark-50 dark:bg-dark-900 rounded-xl p-4">
            <h4 class="text-sm font-medium text-dark-700 dark:text-dark-300 mb-2">Descripción del Plan</h4>
            <p class="text-dark-600 dark:text-dark-400 text-sm">{{ plan.description }}</p>
          </div>
        }

        <!-- Weekly Menu Preview -->
        <div>
          <div class="flex items-center justify-between mb-4">
            <h4 class="text-sm font-medium text-dark-700 dark:text-dark-300">Menú Semanal</h4>
            <button class="text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium">
              Ver Completo
            </button>
          </div>
          <div class="grid gap-3">
            @for (day of weekDays; track day.value) {
              <div class="bg-dark-50 dark:bg-dark-900 rounded-xl overflow-hidden">
                <button
                  (click)="toggleDay(day.value)"
                  class="w-full flex items-center justify-between p-4 hover:bg-dark-100 dark:hover:bg-dark-800 transition-colors"
                >
                  <span class="font-medium text-dark-900 dark:text-dark-50">{{ day.label }}</span>
                  <svg
                    class="w-5 h-5 text-dark-500 transition-transform"
                    [class.rotate-180]="expandedDay() === day.value"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                @if (expandedDay() === day.value) {
                  <div class="px-4 pb-4 space-y-3">
                    @for (meal of mockMeals; track meal.type) {
                      <div class="bg-white dark:bg-dark-800 rounded-lg p-3 border border-dark-200 dark:border-dark-700">
                        <div class="flex items-center justify-between mb-2">
                          <span class="text-sm font-medium text-dark-700 dark:text-dark-300">
                            {{ meal.label }}
                          </span>
                          <span class="text-xs text-dark-500">{{ meal.time }}</span>
                        </div>
                        <div class="space-y-1">
                          @for (item of meal.items; track item) {
                            <div class="flex items-center justify-between text-sm">
                              <span class="text-dark-600 dark:text-dark-400">{{ item.name }}</span>
                              <span class="text-dark-500">{{ item.portion }}</span>
                            </div>
                          }
                        </div>
                      </div>
                    }
                  </div>
                }
              </div>
            }
          </div>
        </div>

        <!-- Food Lists (Mock) -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <!-- Allowed Foods -->
          <div class="bg-green-50 dark:bg-green-900/20 rounded-xl p-4 border border-green-200 dark:border-green-800">
            <h5 class="font-medium text-green-800 dark:text-green-300 mb-3 flex items-center gap-2">
              <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Alimentos Permitidos
            </h5>
            <ul class="space-y-1 text-sm text-green-700 dark:text-green-400">
              @for (food of allowedFoods; track food) {
                <li class="flex items-center gap-2">
                  <span class="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                  {{ food }}
                </li>
              }
            </ul>
          </div>

          <!-- Restricted Foods -->
          <div class="bg-red-50 dark:bg-red-900/20 rounded-xl p-4 border border-red-200 dark:border-red-800">
            <h5 class="font-medium text-red-800 dark:text-red-300 mb-3 flex items-center gap-2">
              <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
              </svg>
              Alimentos Restringidos
            </h5>
            <ul class="space-y-1 text-sm text-red-700 dark:text-red-400">
              @for (food of restrictedFoods; track food) {
                <li class="flex items-center gap-2">
                  <span class="w-1.5 h-1.5 bg-red-500 rounded-full"></span>
                  {{ food }}
                </li>
              }
            </ul>
          </div>
        </div>
      } @else {
        <!-- No Plan State -->
        <div class="text-center py-12">
          <div class="w-16 h-16 mx-auto bg-dark-100 dark:bg-dark-800 rounded-full flex items-center justify-center mb-4">
            <svg class="w-8 h-8 text-dark-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <h3 class="text-lg font-medium text-dark-900 dark:text-dark-50 mb-2">Sin Plan Activo</h3>
          <p class="text-dark-500 mb-4">Este paciente aún no tiene un plan nutricional asignado</p>
          <button class="px-6 py-2 bg-primary-500 hover:bg-primary-600 text-dark-950 font-medium rounded-lg transition-colors">
            Crear Plan Nutricional
          </button>
        </div>
      }
    </div>
  `
})
export class PatientPlanTabComponent {
  patient = input<PatientComplete | null>(null);
  expandedDay = signal<number | null>(1);

  readonly weekDays = [
    { value: 1, label: 'Lunes' },
    { value: 2, label: 'Martes' },
    { value: 3, label: 'Miércoles' },
    { value: 4, label: 'Jueves' },
    { value: 5, label: 'Viernes' },
    { value: 6, label: 'Sábado' },
    { value: 0, label: 'Domingo' }
  ];

  readonly mockMeals = [
    {
      type: 'breakfast',
      label: 'Desayuno',
      time: '08:00',
      items: [
        { name: 'Avena con frutas', portion: '1 taza' },
        { name: 'Huevo cocido', portion: '2 piezas' },
        { name: 'Té verde', portion: '1 taza' }
      ]
    },
    {
      type: 'morning_snack',
      label: 'Colación AM',
      time: '11:00',
      items: [
        { name: 'Manzana', portion: '1 pieza' },
        { name: 'Almendras', portion: '10 piezas' }
      ]
    },
    {
      type: 'lunch',
      label: 'Comida',
      time: '14:00',
      items: [
        { name: 'Pechuga de pollo', portion: '150g' },
        { name: 'Arroz integral', portion: '1/2 taza' },
        { name: 'Ensalada mixta', portion: '1 taza' }
      ]
    },
    {
      type: 'afternoon_snack',
      label: 'Colación PM',
      time: '17:00',
      items: [
        { name: 'Yogurt natural', portion: '1 taza' },
        { name: 'Fresas', portion: '1/2 taza' }
      ]
    },
    {
      type: 'dinner',
      label: 'Cena',
      time: '20:00',
      items: [
        { name: 'Salmón al horno', portion: '120g' },
        { name: 'Vegetales al vapor', portion: '1 taza' }
      ]
    }
  ];

  readonly allowedFoods = [
    'Frutas frescas',
    'Verduras de hoja verde',
    'Proteínas magras',
    'Granos integrales',
    'Lácteos bajos en grasa',
    'Frutos secos (moderación)'
  ];

  readonly restrictedFoods = [
    'Azúcares refinados',
    'Bebidas azucaradas',
    'Alimentos ultraprocesados',
    'Frituras',
    'Harinas blancas',
    'Alcohol'
  ];

  toggleDay(day: number): void {
    this.expandedDay.set(this.expandedDay() === day ? null : day);
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('es-MX', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  }
}
