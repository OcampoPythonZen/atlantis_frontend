import { Component, Input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HabitualDiet, FoodGroupCategory, ConsumptionFrequency } from '../../../../models/clinical-history.model';

@Component({
  selector: 'app-habitual-diet-section',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="space-y-4">
      <div class="flex items-center justify-between">
        <h3 class="text-lg font-semibold text-dark-900 dark:text-dark-50 flex items-center gap-2">
          <svg class="w-5 h-5 text-navy-600 dark:text-navy-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" />
          </svg>
          Dieta Habitual
        </h3>
        @if (data && !isEditing()) {
          <button (click)="isEditing.set(true)" class="px-3 py-1.5 text-sm bg-primary-500 hover:bg-primary-600 text-dark-950 font-medium rounded-lg transition-colors">
            Editar
          </button>
        }
      </div>

      @if (data) {
        <div class="bg-dark-50 dark:bg-dark-900 rounded-xl p-5 space-y-4">
          <dl class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <dt class="text-sm text-dark-500 dark:text-dark-400">Comidas al Día</dt>
              <dd class="text-sm font-medium text-dark-900 dark:text-dark-50 mt-0.5">{{ data.numberOfMealsPerDay }}</dd>
            </div>
            <div>
              <dt class="text-sm text-dark-500 dark:text-dark-400">Desayuna</dt>
              <dd class="text-sm font-medium text-dark-900 dark:text-dark-50 mt-0.5">{{ data.eatsBreakfast ? 'Sí' : 'No' }}</dd>
            </div>
            <div>
              <dt class="text-sm text-dark-500 dark:text-dark-400">Colaciones</dt>
              <dd class="text-sm font-medium text-dark-900 dark:text-dark-50 mt-0.5">{{ data.snacksBetweenMeals ? 'Sí' : 'No' }}</dd>
            </div>
          </dl>

          @if (data.entries.length > 0) {
            <div class="pt-3 border-t border-dark-200 dark:border-dark-700">
              <h4 class="text-xs font-semibold text-dark-500 dark:text-dark-400 uppercase tracking-wider mb-3">Frecuencia de Consumo</h4>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-2">
                @for (entry of data.entries; track entry.id) {
                  <div class="flex items-center justify-between p-2 bg-white dark:bg-dark-800 rounded-lg text-sm">
                    <span class="text-dark-900 dark:text-dark-50">{{ getFoodGroupLabel(entry.foodGroup) }}</span>
                    <span class="text-xs text-dark-500 dark:text-dark-400">{{ getFrequencyLabel(entry.frequency) }}</span>
                  </div>
                }
              </div>
            </div>
          }

          @if (data.foodPreferences || data.foodAversions) {
            <div class="pt-3 border-t border-dark-200 dark:border-dark-700 grid grid-cols-1 md:grid-cols-2 gap-4">
              @if (data.foodPreferences) {
                <div>
                  <dt class="text-sm text-dark-500 dark:text-dark-400">Preferencias</dt>
                  <dd class="text-sm text-dark-900 dark:text-dark-50 mt-0.5">{{ data.foodPreferences }}</dd>
                </div>
              }
              @if (data.foodAversions) {
                <div>
                  <dt class="text-sm text-dark-500 dark:text-dark-400">Aversiones</dt>
                  <dd class="text-sm text-dark-900 dark:text-dark-50 mt-0.5">{{ data.foodAversions }}</dd>
                </div>
              }
            </div>
          }
        </div>
      } @else {
        <div class="border-2 border-dashed border-teal-300 dark:border-teal-700 rounded-xl p-8 text-center">
          <svg class="w-12 h-12 mx-auto mb-3 text-teal-400 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" />
          </svg>
          <p class="font-medium text-dark-700 dark:text-dark-300">Sin registros</p>
          <p class="text-sm text-dark-500 dark:text-dark-400 mt-1">Agrega la dieta habitual del paciente</p>
          <button (click)="isEditing.set(true)" class="mt-4 px-4 py-2 bg-primary-500 hover:bg-primary-600 text-dark-950 font-medium rounded-lg transition-colors text-sm">
            Agregar
          </button>
        </div>
      }
    </div>
  `
})
export class HabitualDietSectionComponent {
  @Input() data: HabitualDiet | null = null;
  isEditing = signal(false);

  private readonly foodGroupLabels: Record<FoodGroupCategory, string> = {
    dairy: 'Lácteos', meat_poultry: 'Carnes y Aves', fish_seafood: 'Pescados y Mariscos',
    eggs: 'Huevos', legumes: 'Leguminosas', cereals_grains: 'Cereales y Granos',
    bread_tortilla: 'Pan y Tortilla', fruits: 'Frutas', vegetables: 'Verduras',
    fats_oils: 'Grasas y Aceites', sugar_sweets: 'Azúcares y Dulces', beverages: 'Bebidas',
    processed_foods: 'Alimentos Procesados', fast_food: 'Comida Rápida'
  };

  private readonly frequencyLabels: Record<ConsumptionFrequency, string> = {
    never: 'Nunca', rarely: 'Rara vez', '1_2_per_week': '1-2/semana',
    '3_4_per_week': '3-4/semana', '5_6_per_week': '5-6/semana',
    daily: 'Diario', multiple_per_day: 'Varias/día'
  };

  getFoodGroupLabel(group: FoodGroupCategory): string {
    return this.foodGroupLabels[group] || group;
  }

  getFrequencyLabel(freq: ConsumptionFrequency): string {
    return this.frequencyLabels[freq] || freq;
  }
}
