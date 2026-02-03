import { Component, Input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BiochemicalData } from '../../../../models/clinical-history.model';

@Component({
  selector: 'app-biochemical-data-section',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="space-y-4">
      <div class="flex items-center justify-between">
        <h3 class="text-lg font-semibold text-dark-900 dark:text-dark-50 flex items-center gap-2">
          <svg class="w-5 h-5 text-navy-600 dark:text-navy-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
          </svg>
          Datos Bioquímicos
        </h3>
        <button class="px-3 py-1.5 text-sm bg-primary-500 hover:bg-primary-600 text-dark-950 font-medium rounded-lg transition-colors">
          + Nuevo Registro
        </button>
      </div>

      @if (records && records.length > 0) {
        <div class="space-y-3">
          @for (lab of records; track lab.id) {
            <div class="bg-dark-50 dark:bg-dark-900 rounded-xl border border-dark-200 dark:border-dark-700">
              <button
                (click)="toggleExpanded(lab.id)"
                class="w-full flex items-center justify-between p-4 text-left"
              >
                <div class="flex items-center gap-3">
                  <span class="text-sm font-medium text-dark-900 dark:text-dark-50">{{ lab.date | date:'mediumDate' }}</span>
                  @if (lab.labName) {
                    <span class="text-xs text-dark-500 dark:text-dark-400">{{ lab.labName }}</span>
                  }
                </div>
                <svg class="w-5 h-5 text-dark-400 transition-transform" [class.rotate-180]="expandedId() === lab.id" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              @if (expandedId() === lab.id) {
                <div class="px-4 pb-4 space-y-4">
                  <!-- Glucose -->
                  @if (lab.fastingGlucose || lab.hba1c || lab.insulin) {
                    <div>
                      <h4 class="text-xs font-semibold text-dark-500 dark:text-dark-400 uppercase tracking-wider mb-2">Metabolismo de Glucosa</h4>
                      <div class="grid grid-cols-2 md:grid-cols-4 gap-2">
                        @if (lab.fastingGlucose) {
                          <div class="p-2 bg-white dark:bg-dark-800 rounded-lg text-sm">
                            <span class="text-dark-500 dark:text-dark-400 text-xs">Glucosa Ayuno</span>
                            <p class="font-medium text-dark-900 dark:text-dark-50">{{ lab.fastingGlucose }} mg/dL</p>
                          </div>
                        }
                        @if (lab.hba1c) {
                          <div class="p-2 bg-white dark:bg-dark-800 rounded-lg text-sm">
                            <span class="text-dark-500 dark:text-dark-400 text-xs">HbA1c</span>
                            <p class="font-medium text-dark-900 dark:text-dark-50">{{ lab.hba1c }}%</p>
                          </div>
                        }
                        @if (lab.insulin) {
                          <div class="p-2 bg-white dark:bg-dark-800 rounded-lg text-sm">
                            <span class="text-dark-500 dark:text-dark-400 text-xs">Insulina</span>
                            <p class="font-medium text-dark-900 dark:text-dark-50">{{ lab.insulin }} uUI/mL</p>
                          </div>
                        }
                        @if (lab.homaIr) {
                          <div class="p-2 bg-white dark:bg-dark-800 rounded-lg text-sm">
                            <span class="text-dark-500 dark:text-dark-400 text-xs">HOMA-IR</span>
                            <p class="font-medium text-dark-900 dark:text-dark-50">{{ lab.homaIr }}</p>
                          </div>
                        }
                      </div>
                    </div>
                  }

                  <!-- Lipid Profile -->
                  @if (lab.totalCholesterol || lab.triglycerides) {
                    <div class="pt-2 border-t border-dark-200 dark:border-dark-700">
                      <h4 class="text-xs font-semibold text-dark-500 dark:text-dark-400 uppercase tracking-wider mb-2">Perfil Lipídico</h4>
                      <div class="grid grid-cols-2 md:grid-cols-4 gap-2">
                        @if (lab.totalCholesterol) {
                          <div class="p-2 bg-white dark:bg-dark-800 rounded-lg text-sm">
                            <span class="text-dark-500 dark:text-dark-400 text-xs">Colesterol Total</span>
                            <p class="font-medium text-dark-900 dark:text-dark-50">{{ lab.totalCholesterol }} mg/dL</p>
                          </div>
                        }
                        @if (lab.hdlCholesterol) {
                          <div class="p-2 bg-white dark:bg-dark-800 rounded-lg text-sm">
                            <span class="text-dark-500 dark:text-dark-400 text-xs">HDL</span>
                            <p class="font-medium text-dark-900 dark:text-dark-50">{{ lab.hdlCholesterol }} mg/dL</p>
                          </div>
                        }
                        @if (lab.ldlCholesterol) {
                          <div class="p-2 bg-white dark:bg-dark-800 rounded-lg text-sm">
                            <span class="text-dark-500 dark:text-dark-400 text-xs">LDL</span>
                            <p class="font-medium text-dark-900 dark:text-dark-50">{{ lab.ldlCholesterol }} mg/dL</p>
                          </div>
                        }
                        @if (lab.triglycerides) {
                          <div class="p-2 bg-white dark:bg-dark-800 rounded-lg text-sm">
                            <span class="text-dark-500 dark:text-dark-400 text-xs">Triglicéridos</span>
                            <p class="font-medium text-dark-900 dark:text-dark-50">{{ lab.triglycerides }} mg/dL</p>
                          </div>
                        }
                      </div>
                    </div>
                  }

                  <!-- Other markers -->
                  @if (lab.hemoglobin || lab.serumIron || lab.vitaminD || lab.tsh) {
                    <div class="pt-2 border-t border-dark-200 dark:border-dark-700">
                      <h4 class="text-xs font-semibold text-dark-500 dark:text-dark-400 uppercase tracking-wider mb-2">Otros Marcadores</h4>
                      <div class="grid grid-cols-2 md:grid-cols-4 gap-2">
                        @if (lab.hemoglobin) {
                          <div class="p-2 bg-white dark:bg-dark-800 rounded-lg text-sm">
                            <span class="text-dark-500 dark:text-dark-400 text-xs">Hemoglobina</span>
                            <p class="font-medium text-dark-900 dark:text-dark-50">{{ lab.hemoglobin }} g/dL</p>
                          </div>
                        }
                        @if (lab.serumIron) {
                          <div class="p-2 bg-white dark:bg-dark-800 rounded-lg text-sm">
                            <span class="text-dark-500 dark:text-dark-400 text-xs">Hierro Sérico</span>
                            <p class="font-medium text-dark-900 dark:text-dark-50">{{ lab.serumIron }} ug/dL</p>
                          </div>
                        }
                        @if (lab.vitaminD) {
                          <div class="p-2 bg-white dark:bg-dark-800 rounded-lg text-sm">
                            <span class="text-dark-500 dark:text-dark-400 text-xs">Vitamina D</span>
                            <p class="font-medium text-dark-900 dark:text-dark-50">{{ lab.vitaminD }} ng/mL</p>
                          </div>
                        }
                        @if (lab.tsh) {
                          <div class="p-2 bg-white dark:bg-dark-800 rounded-lg text-sm">
                            <span class="text-dark-500 dark:text-dark-400 text-xs">TSH</span>
                            <p class="font-medium text-dark-900 dark:text-dark-50">{{ lab.tsh }} mUI/L</p>
                          </div>
                        }
                      </div>
                    </div>
                  }

                  @if (lab.additionalNotes) {
                    <div class="pt-2 border-t border-dark-200 dark:border-dark-700">
                      <p class="text-sm text-dark-600 dark:text-dark-400">{{ lab.additionalNotes }}</p>
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
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
          </svg>
          <p class="font-medium text-dark-700 dark:text-dark-300">Sin registros</p>
          <p class="text-sm text-dark-500 dark:text-dark-400 mt-1">Agrega los primeros datos bioquímicos</p>
        </div>
      }
    </div>
  `
})
export class BiochemicalDataSectionComponent {
  @Input() records: BiochemicalData[] = [];
  expandedId = signal<string | null>(null);

  toggleExpanded(id: string): void {
    this.expandedId.update(current => current === id ? null : id);
  }
}
