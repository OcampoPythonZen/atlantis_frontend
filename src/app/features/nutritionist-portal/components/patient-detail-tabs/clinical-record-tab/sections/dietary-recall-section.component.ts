import { Component, Input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DietaryRecall24h } from '../../../../models/clinical-history.model';

@Component({
  selector: 'app-dietary-recall-section',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="space-y-4">
      <div class="flex items-center justify-between">
        <h3 class="text-lg font-semibold text-dark-900 dark:text-dark-50 flex items-center gap-2">
          <svg class="w-5 h-5 text-navy-600 dark:text-navy-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          Recordatorio de 24 Horas
        </h3>
        <button class="px-3 py-1.5 text-sm bg-primary-500 hover:bg-primary-600 text-dark-950 font-medium rounded-lg transition-colors">
          + Nuevo Registro
        </button>
      </div>

      @if (records && records.length > 0) {
        <div class="space-y-3">
          @for (recall of records; track recall.id) {
            <div class="bg-dark-50 dark:bg-dark-900 rounded-xl border border-dark-200 dark:border-dark-700">
              <button
                (click)="toggleExpanded(recall.id)"
                class="w-full flex items-center justify-between p-4 text-left"
              >
                <div class="flex items-center gap-3">
                  <span class="text-sm font-medium text-dark-900 dark:text-dark-50">
                    {{ recall.recallDate | date:'mediumDate' }}
                  </span>
                  <span class="px-2 py-0.5 text-xs rounded-full"
                    [class]="recall.isTypicalDay
                      ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                      : 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400'">
                    {{ recall.isTypicalDay ? 'Día típico' : 'Día atípico' }}
                  </span>
                  <span class="text-xs text-dark-500 dark:text-dark-400">{{ recall.meals.length }} comidas</span>
                </div>
                <svg class="w-5 h-5 text-dark-400 transition-transform" [class.rotate-180]="expandedId() === recall.id" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              @if (expandedId() === recall.id) {
                <div class="px-4 pb-4 space-y-2">
                  @for (meal of recall.meals; track meal.id) {
                    <div class="flex items-start gap-3 p-2 bg-white dark:bg-dark-800 rounded-lg text-sm">
                      <span class="text-dark-400 whitespace-nowrap">{{ meal.mealTime }}</span>
                      <div class="flex-1">
                        <p class="font-medium text-dark-900 dark:text-dark-50">{{ meal.foodDescription }}</p>
                        <p class="text-xs text-dark-500 dark:text-dark-400">{{ meal.portionSize }}{{ meal.preparationMethod ? ' · ' + meal.preparationMethod : '' }}</p>
                      </div>
                    </div>
                  }
                  @if (recall.observations) {
                    <div class="pt-2 border-t border-dark-200 dark:border-dark-700">
                      <p class="text-xs text-dark-500 dark:text-dark-400">{{ recall.observations }}</p>
                    </div>
                  }
                </div>
              }
            </div>
          }
        </div>
      } @else {
        <div class="border-2 border-dashed border-teal-300 dark:border-teal-700 rounded-xl p-8 text-center">
          <svg class="w-12 h-12 mx-auto mb-3 text-teal-400 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          <p class="font-medium text-dark-700 dark:text-dark-300">Sin registros</p>
          <p class="text-sm text-dark-500 dark:text-dark-400 mt-1">Agrega el primer recordatorio de 24 horas</p>
        </div>
      }
    </div>
  `
})
export class DietaryRecallSectionComponent {
  @Input() records: DietaryRecall24h[] = [];
  expandedId = signal<string | null>(null);

  toggleExpanded(id: string): void {
    this.expandedId.update(current => current === id ? null : id);
  }
}
