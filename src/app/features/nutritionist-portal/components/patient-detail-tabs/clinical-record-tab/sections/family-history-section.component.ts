import { Component, Input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FamilyHistory, FamilyConditionRecord, FamilyRelationship, FamilyConditionType } from '../../../../models/clinical-history.model';

@Component({
  selector: 'app-family-history-section',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="space-y-4">
      <div class="flex items-center justify-between">
        <h3 class="text-lg font-semibold text-dark-900 dark:text-dark-50 flex items-center gap-2">
          <svg class="w-5 h-5 text-navy-600 dark:text-navy-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          Antecedentes Familiares
        </h3>
        @if (data && !isEditing()) {
          <button (click)="isEditing.set(true)" class="px-3 py-1.5 text-sm bg-primary-500 hover:bg-primary-600 text-dark-950 font-medium rounded-lg transition-colors">
            Editar
          </button>
        }
      </div>

      @if (data) {
        @if (!isEditing()) {
          <div class="bg-dark-50 dark:bg-dark-900 rounded-xl p-5">
            @if (data.records.length > 0) {
              <div class="overflow-x-auto">
                <table class="w-full text-sm">
                  <thead>
                    <tr class="text-left text-dark-500 dark:text-dark-400">
                      <th class="pb-2 font-medium">Condición</th>
                      <th class="pb-2 font-medium">Parentesco</th>
                      <th class="pb-2 font-medium">Estado</th>
                      <th class="pb-2 font-medium">Notas</th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-dark-200 dark:divide-dark-700">
                    @for (record of data.records; track record.id) {
                      <tr>
                        <td class="py-2 text-dark-900 dark:text-dark-50">{{ getConditionLabel(record.condition) }}</td>
                        <td class="py-2 text-dark-700 dark:text-dark-300">{{ getRelationshipLabel(record.relationship) }}</td>
                        <td class="py-2">
                          @if (record.isAlive !== undefined) {
                            <span class="px-2 py-0.5 text-xs rounded-full"
                              [class]="record.isAlive
                                ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                                : 'bg-dark-200 dark:bg-dark-700 text-dark-600 dark:text-dark-400'">
                              {{ record.isAlive ? 'Vivo' : 'Finado' }}
                            </span>
                          }
                        </td>
                        <td class="py-2 text-dark-500 dark:text-dark-400">{{ record.notes || '—' }}</td>
                      </tr>
                    }
                  </tbody>
                </table>
              </div>
            }
            @if (data.additionalNotes) {
              <div class="mt-4 pt-3 border-t border-dark-200 dark:border-dark-700">
                <p class="text-sm text-dark-600 dark:text-dark-400">{{ data.additionalNotes }}</p>
              </div>
            }
          </div>
        } @else {
          <div class="bg-dark-50 dark:bg-dark-900 rounded-xl p-5">
            <p class="text-sm text-dark-500 dark:text-dark-400 mb-4">Formulario de edición (en desarrollo)</p>
            <div class="flex gap-2">
              <button (click)="isEditing.set(false)" class="px-4 py-2 bg-dark-100 hover:bg-dark-200 dark:bg-dark-700 dark:hover:bg-dark-600 text-dark-800 dark:text-dark-100 rounded-lg transition-colors text-sm">
                Cancelar
              </button>
              <button (click)="isEditing.set(false)" class="px-4 py-2 bg-primary-500 hover:bg-primary-600 text-dark-950 font-medium rounded-lg transition-colors text-sm">
                Guardar
              </button>
            </div>
          </div>
        }
      } @else {
        <div class="border-2 border-dashed border-teal-300 dark:border-teal-700 rounded-xl p-8 text-center">
          <svg class="w-12 h-12 mx-auto mb-3 text-teal-400 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <p class="font-medium text-dark-700 dark:text-dark-300">Sin registros</p>
          <p class="text-sm text-dark-500 dark:text-dark-400 mt-1">Agrega los antecedentes familiares del paciente</p>
          <button (click)="isEditing.set(true)" class="mt-4 px-4 py-2 bg-primary-500 hover:bg-primary-600 text-dark-950 font-medium rounded-lg transition-colors text-sm">
            Agregar
          </button>
        </div>
      }
    </div>
  `
})
export class FamilyHistorySectionComponent {
  @Input() data: FamilyHistory | null = null;
  isEditing = signal(false);

  private readonly conditionLabels: Record<FamilyConditionType, string> = {
    diabetes_type_1: 'Diabetes Tipo 1',
    diabetes_type_2: 'Diabetes Tipo 2',
    hypertension: 'Hipertensión',
    obesity: 'Obesidad',
    cancer: 'Cáncer',
    cardiovascular_disease: 'Enfermedad Cardiovascular',
    dyslipidemia: 'Dislipidemia',
    thyroid_disease: 'Enfermedad Tiroidea',
    kidney_disease: 'Enfermedad Renal',
    other: 'Otro'
  };

  private readonly relationshipLabels: Record<FamilyRelationship, string> = {
    father: 'Padre',
    mother: 'Madre',
    paternal_grandfather: 'Abuelo Paterno',
    paternal_grandmother: 'Abuela Paterna',
    maternal_grandfather: 'Abuelo Materno',
    maternal_grandmother: 'Abuela Materna',
    sibling: 'Hermano/a'
  };

  getConditionLabel(condition: FamilyConditionType): string {
    return this.conditionLabels[condition] || condition;
  }

  getRelationshipLabel(relationship: FamilyRelationship): string {
    return this.relationshipLabels[relationship] || relationship;
  }
}
