import { Component, Input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PerinatalHistory } from '../../../../models/clinical-history.model';

@Component({
  selector: 'app-perinatal-history-section',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="space-y-4">
      <div class="flex items-center justify-between">
        <h3 class="text-lg font-semibold text-dark-900 dark:text-dark-50 flex items-center gap-2">
          <svg class="w-5 h-5 text-navy-600 dark:text-navy-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
          Antecedentes Perinatales
        </h3>
        @if (data && !isEditing()) {
          <button (click)="isEditing.set(true)" class="px-3 py-1.5 text-sm bg-primary-500 hover:bg-primary-600 text-dark-950 font-medium rounded-lg transition-colors">
            Editar
          </button>
        }
      </div>

      @if (data) {
        <div class="bg-dark-50 dark:bg-dark-900 rounded-xl p-5">
          <dl class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <dt class="text-sm text-dark-500 dark:text-dark-400">Tipo de Parto</dt>
              <dd class="text-sm font-medium text-dark-900 dark:text-dark-50 mt-0.5">{{ data.birthType === 'vaginal' ? 'Vaginal' : 'Cesárea' }}</dd>
            </div>
            @if (data.gestationalWeeks) {
              <div>
                <dt class="text-sm text-dark-500 dark:text-dark-400">Semanas de Gestación</dt>
                <dd class="text-sm font-medium text-dark-900 dark:text-dark-50 mt-0.5">{{ data.gestationalWeeks }} semanas</dd>
              </div>
            }
            @if (data.birthWeight) {
              <div>
                <dt class="text-sm text-dark-500 dark:text-dark-400">Peso al Nacer</dt>
                <dd class="text-sm font-medium text-dark-900 dark:text-dark-50 mt-0.5">{{ data.birthWeight }} kg</dd>
              </div>
            }
            @if (data.birthHeight) {
              <div>
                <dt class="text-sm text-dark-500 dark:text-dark-400">Talla al Nacer</dt>
                <dd class="text-sm font-medium text-dark-900 dark:text-dark-50 mt-0.5">{{ data.birthHeight }} cm</dd>
              </div>
            }
            <div>
              <dt class="text-sm text-dark-500 dark:text-dark-400">Tipo de Lactancia</dt>
              <dd class="text-sm font-medium text-dark-900 dark:text-dark-50 mt-0.5">{{ getBreastfeedingLabel(data.breastfeedingType) }}</dd>
            </div>
            @if (data.breastfeedingDurationMonths) {
              <div>
                <dt class="text-sm text-dark-500 dark:text-dark-400">Duración Lactancia</dt>
                <dd class="text-sm font-medium text-dark-900 dark:text-dark-50 mt-0.5">{{ data.breastfeedingDurationMonths }} meses</dd>
              </div>
            }
            @if (data.ablactationAgeMonths) {
              <div>
                <dt class="text-sm text-dark-500 dark:text-dark-400">Inicio Ablactación</dt>
                <dd class="text-sm font-medium text-dark-900 dark:text-dark-50 mt-0.5">{{ data.ablactationAgeMonths }} meses</dd>
              </div>
            }
          </dl>
          @if (data.complications) {
            <div class="mt-4 pt-3 border-t border-dark-200 dark:border-dark-700">
              <p class="text-sm text-dark-500 dark:text-dark-400">Complicaciones: {{ data.complications }}</p>
            </div>
          }
        </div>
      } @else {
        <div class="border-2 border-dashed border-teal-300 dark:border-teal-700 rounded-xl p-8 text-center">
          <svg class="w-12 h-12 mx-auto mb-3 text-teal-400 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
          <p class="font-medium text-dark-700 dark:text-dark-300">Sin registros</p>
          <p class="text-sm text-dark-500 dark:text-dark-400 mt-1">Agrega los antecedentes perinatales del paciente</p>
          <button (click)="isEditing.set(true)" class="mt-4 px-4 py-2 bg-primary-500 hover:bg-primary-600 text-dark-950 font-medium rounded-lg transition-colors text-sm">
            Agregar
          </button>
        </div>
      }
    </div>
  `
})
export class PerinatalHistorySectionComponent {
  @Input() data: PerinatalHistory | null = null;
  isEditing = signal(false);

  getBreastfeedingLabel(type: string): string {
    const labels: Record<string, string> = {
      exclusive: 'Lactancia Materna Exclusiva',
      mixed: 'Mixta',
      formula_only: 'Fórmula',
      none: 'Ninguna'
    };
    return labels[type] || type;
  }
}
