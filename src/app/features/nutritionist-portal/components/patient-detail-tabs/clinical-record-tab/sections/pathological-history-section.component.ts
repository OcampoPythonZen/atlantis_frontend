import { Component, Input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PathologicalHistory, PathologicalEventType } from '../../../../models/clinical-history.model';

@Component({
  selector: 'app-pathological-history-section',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="space-y-4">
      <div class="flex items-center justify-between">
        <h3 class="text-lg font-semibold text-dark-900 dark:text-dark-50 flex items-center gap-2">
          <svg class="w-5 h-5 text-navy-600 dark:text-navy-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Antecedentes Patológicos
        </h3>
        @if (data && !isEditing()) {
          <button (click)="isEditing.set(true)" class="px-3 py-1.5 text-sm bg-primary-500 hover:bg-primary-600 text-dark-950 font-medium rounded-lg transition-colors">
            Editar
          </button>
        }
      </div>

      @if (data) {
        <div class="bg-dark-50 dark:bg-dark-900 rounded-xl p-5">
          @if (data.records.length > 0) {
            <div class="space-y-3">
              @for (record of data.records; track record.id) {
                <div class="flex items-start gap-3 p-3 bg-white dark:bg-dark-800 rounded-lg border border-dark-200 dark:border-dark-700">
                  <span class="px-2 py-0.5 text-xs rounded-full mt-0.5 whitespace-nowrap"
                    [class]="record.resolved
                      ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                      : 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400'">
                    {{ record.resolved ? 'Resuelto' : 'Activo' }}
                  </span>
                  <div class="flex-1 min-w-0">
                    <div class="flex items-center gap-2 mb-1">
                      <span class="text-xs font-medium text-dark-500 dark:text-dark-400 uppercase">{{ getTypeLabel(record.type) }}</span>
                      @if (record.date) {
                        <span class="text-xs text-dark-400">{{ record.date | date:'mediumDate' }}</span>
                      }
                    </div>
                    <p class="text-sm font-medium text-dark-900 dark:text-dark-50">{{ record.description }}</p>
                    @if (record.treatment) {
                      <p class="text-xs text-dark-500 dark:text-dark-400 mt-1">Tratamiento: {{ record.treatment }}</p>
                    }
                  </div>
                </div>
              }
            </div>
          }
          @if (data.additionalNotes) {
            <div class="mt-4 pt-3 border-t border-dark-200 dark:border-dark-700">
              <p class="text-sm text-dark-600 dark:text-dark-400">{{ data.additionalNotes }}</p>
            </div>
          }
        </div>
      } @else {
        <div class="border-2 border-dashed border-teal-300 dark:border-teal-700 rounded-xl p-8 text-center">
          <svg class="w-12 h-12 mx-auto mb-3 text-teal-400 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <p class="font-medium text-dark-700 dark:text-dark-300">Sin registros</p>
          <p class="text-sm text-dark-500 dark:text-dark-400 mt-1">Agrega los antecedentes patológicos del paciente</p>
          <button (click)="isEditing.set(true)" class="mt-4 px-4 py-2 bg-primary-500 hover:bg-primary-600 text-dark-950 font-medium rounded-lg transition-colors text-sm">
            Agregar
          </button>
        </div>
      }
    </div>
  `
})
export class PathologicalHistorySectionComponent {
  @Input() data: PathologicalHistory | null = null;
  isEditing = signal(false);

  private readonly typeLabels: Record<PathologicalEventType, string> = {
    disease: 'Enfermedad',
    surgery: 'Cirugía',
    hospitalization: 'Hospitalización',
    transfusion: 'Transfusión',
    trauma: 'Trauma',
    drug_allergy: 'Alergia a Medicamento'
  };

  getTypeLabel(type: PathologicalEventType): string {
    return this.typeLabels[type] || type;
  }
}
