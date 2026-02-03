import { Component, Input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PhysicalExamination } from '../../../../models/clinical-history.model';

@Component({
  selector: 'app-physical-examination-section',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="space-y-4">
      <div class="flex items-center justify-between">
        <h3 class="text-lg font-semibold text-dark-900 dark:text-dark-50 flex items-center gap-2">
          <svg class="w-5 h-5 text-navy-600 dark:text-navy-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
          Exploración Física
        </h3>
        <button class="px-3 py-1.5 text-sm bg-primary-500 hover:bg-primary-600 text-dark-950 font-medium rounded-lg transition-colors">
          + Nuevo Registro
        </button>
      </div>

      @if (records && records.length > 0) {
        <div class="space-y-3">
          @for (exam of records; track exam.id) {
            <div class="bg-dark-50 dark:bg-dark-900 rounded-xl border border-dark-200 dark:border-dark-700">
              <button
                (click)="toggleExpanded(exam.id)"
                class="w-full flex items-center justify-between p-4 text-left"
              >
                <div class="flex items-center gap-3">
                  <span class="text-sm font-medium text-dark-900 dark:text-dark-50">{{ exam.date | date:'mediumDate' }}</span>
                  @if (exam.vitalSigns.systolicBP && exam.vitalSigns.diastolicBP) {
                    <span class="text-xs text-dark-500 dark:text-dark-400">PA: {{ exam.vitalSigns.systolicBP }}/{{ exam.vitalSigns.diastolicBP }}</span>
                  }
                  @if (exam.vitalSigns.heartRate) {
                    <span class="text-xs text-dark-500 dark:text-dark-400">FC: {{ exam.vitalSigns.heartRate }}</span>
                  }
                </div>
                <svg class="w-5 h-5 text-dark-400 transition-transform" [class.rotate-180]="expandedId() === exam.id" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              @if (expandedId() === exam.id) {
                <div class="px-4 pb-4 space-y-4">
                  <!-- Vital Signs -->
                  <div>
                    <h4 class="text-xs font-semibold text-dark-500 dark:text-dark-400 uppercase tracking-wider mb-2">Signos Vitales</h4>
                    <div class="grid grid-cols-2 md:grid-cols-3 gap-3">
                      @if (exam.vitalSigns.systolicBP && exam.vitalSigns.diastolicBP) {
                        <div class="p-2 bg-white dark:bg-dark-800 rounded-lg text-sm">
                          <span class="text-dark-500 dark:text-dark-400 text-xs">PA</span>
                          <p class="font-medium text-dark-900 dark:text-dark-50">{{ exam.vitalSigns.systolicBP }}/{{ exam.vitalSigns.diastolicBP }} mmHg</p>
                        </div>
                      }
                      @if (exam.vitalSigns.heartRate) {
                        <div class="p-2 bg-white dark:bg-dark-800 rounded-lg text-sm">
                          <span class="text-dark-500 dark:text-dark-400 text-xs">FC</span>
                          <p class="font-medium text-dark-900 dark:text-dark-50">{{ exam.vitalSigns.heartRate }} bpm</p>
                        </div>
                      }
                      @if (exam.vitalSigns.temperature) {
                        <div class="p-2 bg-white dark:bg-dark-800 rounded-lg text-sm">
                          <span class="text-dark-500 dark:text-dark-400 text-xs">Temperatura</span>
                          <p class="font-medium text-dark-900 dark:text-dark-50">{{ exam.vitalSigns.temperature }} °C</p>
                        </div>
                      }
                    </div>
                  </div>

                  <!-- Clinical Observation -->
                  <div class="pt-2 border-t border-dark-200 dark:border-dark-700">
                    <h4 class="text-xs font-semibold text-dark-500 dark:text-dark-400 uppercase tracking-wider mb-2">Observación Clínica</h4>
                    <div class="grid grid-cols-2 gap-2 text-sm">
                      <div class="flex items-center gap-2">
                        <span class="w-2 h-2 rounded-full" [class]="exam.skinAppearance === 'normal' ? 'bg-green-500' : 'bg-amber-500'"></span>
                        <span class="text-dark-700 dark:text-dark-300">Piel: {{ exam.skinAppearance === 'normal' ? 'Normal' : 'Anormal' }}</span>
                      </div>
                      <div class="flex items-center gap-2">
                        <span class="w-2 h-2 rounded-full" [class]="exam.hairAppearance === 'normal' ? 'bg-green-500' : 'bg-amber-500'"></span>
                        <span class="text-dark-700 dark:text-dark-300">Cabello: {{ exam.hairAppearance === 'normal' ? 'Normal' : 'Anormal' }}</span>
                      </div>
                      <div class="flex items-center gap-2">
                        <span class="w-2 h-2 rounded-full" [class]="exam.nailAppearance === 'normal' ? 'bg-green-500' : 'bg-amber-500'"></span>
                        <span class="text-dark-700 dark:text-dark-300">Uñas: {{ exam.nailAppearance === 'normal' ? 'Normal' : 'Anormal' }}</span>
                      </div>
                      <div class="flex items-center gap-2">
                        <span class="w-2 h-2 rounded-full" [class]="exam.dentalHealth === 'normal' ? 'bg-green-500' : 'bg-amber-500'"></span>
                        <span class="text-dark-700 dark:text-dark-300">Dental: {{ exam.dentalHealth === 'normal' ? 'Normal' : 'Anormal' }}</span>
                      </div>
                    </div>
                  </div>

                  @if (exam.hasEdema) {
                    <div class="px-3 py-2 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 rounded-lg text-sm">
                      Edema presente{{ exam.edemaLocation ? ': ' + exam.edemaLocation : '' }}
                    </div>
                  }

                  @if (exam.generalObservations) {
                    <div class="pt-2 border-t border-dark-200 dark:border-dark-700">
                      <p class="text-sm text-dark-600 dark:text-dark-400">{{ exam.generalObservations }}</p>
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
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
          <p class="font-medium text-dark-700 dark:text-dark-300">Sin registros</p>
          <p class="text-sm text-dark-500 dark:text-dark-400 mt-1">Agrega la primera exploración física</p>
        </div>
      }
    </div>
  `
})
export class PhysicalExaminationSectionComponent {
  @Input() records: PhysicalExamination[] = [];
  expandedId = signal<string | null>(null);

  toggleExpanded(id: string): void {
    this.expandedId.update(current => current === id ? null : id);
  }
}
