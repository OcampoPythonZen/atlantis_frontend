import { Component, Input, Output, EventEmitter, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClinicalSectionKey, ClinicalSectionStatus } from '../../../models/clinical-history.model';
import { PatientMedicalInfoExtended } from '../../../models/nutritionist.model';

@Component({
  selector: 'app-clinical-record-overview',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="space-y-6">
      <!-- Header -->
      <div>
        <h3 class="text-lg font-semibold text-dark-900 dark:text-dark-50 flex items-center gap-2">
          <svg class="w-5 h-5 text-navy-600 dark:text-navy-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          Resumen del Expediente
        </h3>
        @if (lastUpdated) {
          <p class="text-sm text-dark-500 dark:text-dark-400 mt-1">
            Última actualización: {{ lastUpdated | date:'medium' }}
          </p>
        }
      </div>

      <!-- Completeness Bar -->
      <div class="bg-white dark:bg-dark-800 rounded-xl border border-dark-200 dark:border-dark-700 p-5">
        <div class="flex items-center justify-between mb-3">
          <h4 class="text-sm font-medium text-dark-900 dark:text-dark-50">Completitud del Expediente</h4>
          <span class="text-sm font-semibold text-teal-600 dark:text-teal-400">{{ filledCount() }}/{{ totalCount() }}</span>
        </div>

        <!-- Segmented Bar -->
        <div class="flex gap-1 h-3 mb-3">
          @for (section of sectionStatuses; track section.sectionKey) {
            <div
              class="flex-1 rounded-full transition-colors cursor-pointer"
              [class]="section.filled ? 'bg-teal-400 dark:bg-teal-500' : 'bg-dark-200 dark:bg-dark-700'"
              [title]="section.label + (section.filled ? ' ✓' : ' — Vacío')"
              (click)="goToSection.emit(section.sectionKey)"
            ></div>
          }
        </div>

        <p class="text-xs text-dark-500 dark:text-dark-400">
          {{ percentage() }}% completado · {{ emptyCount() }} secciones pendientes
        </p>
      </div>

      <!-- Clinical Alerts -->
      @if (hasAlerts()) {
        <div class="bg-white dark:bg-dark-800 rounded-xl border border-dark-200 dark:border-dark-700 p-5">
          <h4 class="text-sm font-medium text-dark-900 dark:text-dark-50 mb-3">Alertas Clínicas</h4>
          <div class="flex flex-wrap gap-2">
            @for (condition of medicalInfo?.conditions || []; track condition) {
              <span class="px-3 py-1 text-xs bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 rounded-full">
                {{ condition }}
              </span>
            }
            @for (allergy of medicalInfo?.allergies || []; track allergy) {
              <span class="px-3 py-1 text-xs bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-full">
                Alergia: {{ allergy }}
              </span>
            }
            @for (med of medicalInfo?.medications || []; track med) {
              <span class="px-3 py-1 text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-full">
                {{ med }}
              </span>
            }
          </div>
        </div>
      }

      <!-- Quick Actions: Go to empty sections -->
      @if (emptySections().length > 0) {
        <div class="bg-white dark:bg-dark-800 rounded-xl border border-dark-200 dark:border-dark-700 p-5">
          <h4 class="text-sm font-medium text-dark-900 dark:text-dark-50 mb-3">Secciones Pendientes</h4>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-2">
            @for (section of emptySections(); track section.sectionKey) {
              <button
                (click)="goToSection.emit(section.sectionKey)"
                class="flex items-center gap-2 p-3 text-left text-sm bg-dark-50 dark:bg-dark-900 hover:bg-teal-50 dark:hover:bg-teal-900/10 rounded-lg transition-colors group"
              >
                <span class="w-2 h-2 rounded-full bg-dark-300 dark:bg-dark-600 group-hover:bg-teal-400"></span>
                <span class="text-dark-700 dark:text-dark-300 group-hover:text-teal-700 dark:group-hover:text-teal-400">{{ section.label }}</span>
                <svg class="w-4 h-4 ml-auto text-dark-400 group-hover:text-teal-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            }
          </div>
        </div>
      }
    </div>
  `
})
export class ClinicalRecordOverviewComponent {
  @Input() sectionStatuses: ClinicalSectionStatus[] = [];
  @Input() medicalInfo: PatientMedicalInfoExtended | null = null;
  @Input() lastUpdated: Date | null = null;
  @Output() goToSection = new EventEmitter<ClinicalSectionKey>();

  filledCount = computed(() => this.sectionStatuses.filter(s => s.filled).length);
  totalCount = computed(() => this.sectionStatuses.length);
  emptyCount = computed(() => this.sectionStatuses.filter(s => !s.filled).length);
  percentage = computed(() => {
    if (this.totalCount() === 0) return 0;
    return Math.round((this.filledCount() / this.totalCount()) * 100);
  });

  emptySections = computed(() => this.sectionStatuses.filter(s => !s.filled));

  hasAlerts = computed(() => {
    if (!this.medicalInfo) return false;
    return (this.medicalInfo.conditions?.length > 0) ||
           (this.medicalInfo.allergies?.length > 0) ||
           (this.medicalInfo.medications?.length > 0);
  });
}
