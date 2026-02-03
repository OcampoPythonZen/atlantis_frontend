import { Component, Input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CurrentConditions } from '../../../../models/clinical-history.model';

@Component({
  selector: 'app-current-conditions-section',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="space-y-4">
      <div class="flex items-center justify-between">
        <h3 class="text-lg font-semibold text-dark-900 dark:text-dark-50 flex items-center gap-2">
          <svg class="w-5 h-5 text-navy-600 dark:text-navy-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Padecimientos Actuales
        </h3>
        @if (data && !isEditing()) {
          <button (click)="isEditing.set(true)" class="px-3 py-1.5 text-sm bg-primary-500 hover:bg-primary-600 text-dark-950 font-medium rounded-lg transition-colors">
            Editar
          </button>
        }
      </div>

      @if (data) {
        <div class="bg-dark-50 dark:bg-dark-900 rounded-xl p-5">
          @if (data.conditions.length > 0) {
            <div class="space-y-3">
              @for (condition of data.conditions; track condition.id) {
                <div class="p-3 bg-white dark:bg-dark-800 rounded-lg border border-dark-200 dark:border-dark-700">
                  <div class="flex items-center justify-between mb-1">
                    <p class="text-sm font-medium text-dark-900 dark:text-dark-50">{{ condition.diagnosis }}</p>
                    <span class="px-2 py-0.5 text-xs rounded-full"
                      [class]="condition.controlledStatus === 'controlled'
                        ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                        : condition.controlledStatus === 'in_treatment'
                          ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400'
                          : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'">
                      {{ condition.controlledStatus === 'controlled' ? 'Controlado' : condition.controlledStatus === 'in_treatment' ? 'En tratamiento' : 'No controlado' }}
                    </span>
                  </div>
                  @if (condition.currentTreatment) {
                    <p class="text-xs text-dark-500 dark:text-dark-400">Tratamiento: {{ condition.currentTreatment }}</p>
                  }
                  @if (condition.treatingPhysician) {
                    <p class="text-xs text-dark-500 dark:text-dark-400">Médico: {{ condition.treatingPhysician }}</p>
                  }
                </div>
              }
            </div>
          }
        </div>
      } @else {
        <div class="border-2 border-dashed border-teal-300 dark:border-teal-700 rounded-xl p-8 text-center">
          <svg class="w-12 h-12 mx-auto mb-3 text-teal-400 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p class="font-medium text-dark-700 dark:text-dark-300">Sin registros</p>
          <p class="text-sm text-dark-500 dark:text-dark-400 mt-1">Agrega los padecimientos actuales del paciente</p>
          <button (click)="isEditing.set(true)" class="mt-4 px-4 py-2 bg-primary-500 hover:bg-primary-600 text-dark-950 font-medium rounded-lg transition-colors text-sm">
            Agregar
          </button>
        </div>
      }
    </div>
  `
})
export class CurrentConditionsSectionComponent {
  @Input() data: CurrentConditions | null = null;
  isEditing = signal(false);
}
