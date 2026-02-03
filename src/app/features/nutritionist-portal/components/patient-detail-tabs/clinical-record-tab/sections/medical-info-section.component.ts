import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PatientMedicalInfoExtended } from '../../../../models/nutritionist.model';

@Component({
  selector: 'app-medical-info-section',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (medicalInfo) {
      <div class="space-y-4">
        <div class="flex items-center justify-between">
          <h3 class="text-lg font-semibold text-dark-900 dark:text-dark-50 flex items-center gap-2">
            <svg class="w-5 h-5 text-navy-600 dark:text-navy-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Información Médica
          </h3>
        </div>

        <div class="bg-dark-50 dark:bg-dark-900 rounded-xl p-5">
          <dl class="space-y-4">
            @if (medicalInfo.bloodType) {
              <div class="flex justify-between">
                <dt class="text-sm text-dark-500 dark:text-dark-400">Tipo de Sangre</dt>
                <dd class="text-sm font-medium text-dark-900 dark:text-dark-50">{{ medicalInfo.bloodType }}</dd>
              </div>
            }
            @if (medicalInfo.allergies.length > 0) {
              <div>
                <dt class="text-sm text-dark-500 dark:text-dark-400 mb-2">Alergias</dt>
                <dd class="flex flex-wrap gap-2">
                  @for (allergy of medicalInfo.allergies; track allergy) {
                    <span class="px-2 py-1 text-xs bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-lg">
                      {{ allergy }}
                    </span>
                  }
                </dd>
              </div>
            }
            @if (medicalInfo.conditions.length > 0) {
              <div>
                <dt class="text-sm text-dark-500 dark:text-dark-400 mb-2">Condiciones</dt>
                <dd class="flex flex-wrap gap-2">
                  @for (condition of medicalInfo.conditions; track condition) {
                    <span class="px-2 py-1 text-xs bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 rounded-lg">
                      {{ condition }}
                    </span>
                  }
                </dd>
              </div>
            }
            @if (medicalInfo.medications.length > 0) {
              <div>
                <dt class="text-sm text-dark-500 dark:text-dark-400 mb-2">Medicamentos</dt>
                <dd class="flex flex-wrap gap-2">
                  @for (med of medicalInfo.medications; track med) {
                    <span class="px-2 py-1 text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-lg">
                      {{ med }}
                    </span>
                  }
                </dd>
              </div>
            }
            @if (medicalInfo.dietaryRestrictions && medicalInfo.dietaryRestrictions.length > 0) {
              <div>
                <dt class="text-sm text-dark-500 dark:text-dark-400 mb-2">Restricciones Alimentarias</dt>
                <dd class="flex flex-wrap gap-2">
                  @for (restriction of medicalInfo.dietaryRestrictions; track restriction) {
                    <span class="px-2 py-1 text-xs bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 rounded-lg">
                      {{ restriction }}
                    </span>
                  }
                </dd>
              </div>
            }
            @if (medicalInfo.notes) {
              <div>
                <dt class="text-sm text-dark-500 dark:text-dark-400 mb-1">Notas</dt>
                <dd class="text-sm text-dark-900 dark:text-dark-50">{{ medicalInfo.notes }}</dd>
              </div>
            }
          </dl>
        </div>
      </div>
    } @else {
      <div class="border-2 border-dashed border-teal-300 dark:border-teal-700 rounded-xl p-8 text-center">
        <svg class="w-12 h-12 mx-auto mb-3 text-teal-400 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <p class="font-medium text-dark-700 dark:text-dark-300">Sin información médica</p>
        <p class="text-sm text-dark-500 dark:text-dark-400 mt-1">Agrega la información médica del paciente</p>
        <button class="mt-4 px-4 py-2 bg-primary-500 hover:bg-primary-600 text-dark-950 font-medium rounded-lg transition-colors text-sm">
          Agregar
        </button>
      </div>
    }
  `
})
export class MedicalInfoSectionComponent {
  @Input() medicalInfo: PatientMedicalInfoExtended | null = null;
}
