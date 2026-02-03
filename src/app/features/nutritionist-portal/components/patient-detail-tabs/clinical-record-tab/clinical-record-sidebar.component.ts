import { Component, Input, Output, EventEmitter, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ClinicalSectionKey, ClinicalSectionStatus } from '../../../models/clinical-history.model';

export interface SidebarSection {
  key: ClinicalSectionKey | 'overview';
  label: string;
  category: string;
  filled: boolean;
  conditional?: boolean;
}

export interface SidebarCategory {
  key: string;
  label: string;
  sections: SidebarSection[];
}

@Component({
  selector: 'app-clinical-record-sidebar',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <!-- Search -->
    <div class="px-3 pb-3 border-b border-dark-200 dark:border-dark-700">
      <div class="relative">
        <svg class="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          type="text"
          placeholder="Buscar sección..."
          [ngModel]="searchTerm()"
          (ngModelChange)="searchTerm.set($event)"
          class="w-full pl-8 pr-3 py-2 text-sm bg-dark-50 dark:bg-dark-900 border border-dark-200 dark:border-dark-700 rounded-lg text-dark-900 dark:text-dark-50 placeholder-dark-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
        />
      </div>
    </div>

    <!-- Overview -->
    <div class="px-2 py-2">
      <button
        (click)="onSelect('overview')"
        class="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors"
        [class]="activeSection === 'overview'
          ? 'bg-teal-50 dark:bg-teal-900/20 text-teal-700 dark:text-teal-400'
          : 'text-dark-700 dark:text-dark-300 hover:bg-dark-50 dark:hover:bg-dark-700/50'"
      >
        <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
        </svg>
        Resumen
      </button>
    </div>

    <!-- Categories -->
    <nav class="px-2 pb-3 space-y-3 overflow-y-auto flex-1">
      @for (category of filteredCategories(); track category.key) {
        @if (category.sections.length > 0) {
          <div>
            <h4 class="px-3 py-1 text-xs font-semibold text-dark-500 dark:text-dark-400 uppercase tracking-wider">
              {{ category.label }}
            </h4>
            <div class="mt-1 space-y-0.5">
              @for (section of category.sections; track section.key) {
                <button
                  (click)="onSelect(section.key)"
                  class="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors"
                  [class]="activeSection === section.key
                    ? 'bg-teal-50 dark:bg-teal-900/20 text-teal-700 dark:text-teal-400 font-medium'
                    : 'text-dark-700 dark:text-dark-300 hover:bg-dark-50 dark:hover:bg-dark-700/50'"
                >
                  <span
                    class="w-2 h-2 rounded-full flex-shrink-0"
                    [class]="section.filled ? 'bg-teal-500' : 'bg-dark-300 dark:bg-dark-600'"
                  ></span>
                  <span class="truncate">{{ section.label }}</span>
                </button>
              }
            </div>
          </div>
        }
      }
    </nav>
  `
})
export class ClinicalRecordSidebarComponent {
  @Input() activeSection: ClinicalSectionKey | 'overview' = 'overview';
  @Input() patientGender: 'male' | 'female' | 'other' = 'female';
  @Input() patientAge: number = 30;
  @Input() sectionStatuses: ClinicalSectionStatus[] = [];
  @Output() sectionSelected = new EventEmitter<ClinicalSectionKey | 'overview'>();

  searchTerm = signal('');

  private readonly allCategories = computed<SidebarCategory[]>(() => {
    const statusMap = new Map(this.sectionStatuses.map(s => [s.sectionKey, s.filled]));
    const isFilled = (key: ClinicalSectionKey): boolean => statusMap.get(key) ?? false;

    const categories: SidebarCategory[] = [
      {
        key: 'basic',
        label: 'Datos Generales',
        sections: [
          { key: 'personal_info' as ClinicalSectionKey, label: 'Datos Personales', category: 'basic', filled: isFilled('personal_info') },
          { key: 'medical_info' as ClinicalSectionKey, label: 'Información Médica', category: 'basic', filled: isFilled('medical_info') }
        ]
      },
      {
        key: 'medical_history',
        label: 'Ant. Médicos',
        sections: [
          { key: 'family_history' as ClinicalSectionKey, label: 'Familiares', category: 'medical_history', filled: isFilled('family_history') },
          { key: 'pathological_history' as ClinicalSectionKey, label: 'Patológicos', category: 'medical_history', filled: isFilled('pathological_history') },
          { key: 'current_conditions' as ClinicalSectionKey, label: 'Padecimientos', category: 'medical_history', filled: isFilled('current_conditions') }
        ]
      },
      {
        key: 'special_history',
        label: 'Ant. Especiales',
        sections: this.getSpecialSections(isFilled)
      },
      {
        key: 'lifestyle',
        label: 'Estilo de Vida',
        sections: [
          { key: 'physical_activity' as ClinicalSectionKey, label: 'Act. Física', category: 'lifestyle', filled: isFilled('physical_activity') },
          { key: 'habits_customs' as ClinicalSectionKey, label: 'Hábitos', category: 'lifestyle', filled: isFilled('habits_customs') },
          { key: 'dietary_recall' as ClinicalSectionKey, label: 'Recordatorio 24h', category: 'lifestyle', filled: isFilled('dietary_recall') },
          { key: 'habitual_diet' as ClinicalSectionKey, label: 'Dieta Habitual', category: 'lifestyle', filled: isFilled('habitual_diet') }
        ]
      },
      {
        key: 'clinical_eval',
        label: 'Eval. Clínica',
        sections: [
          { key: 'physical_examination' as ClinicalSectionKey, label: 'Expl. Física', category: 'clinical_eval', filled: isFilled('physical_examination') },
          { key: 'biochemical_data' as ClinicalSectionKey, label: 'Datos Bioquím.', category: 'clinical_eval', filled: isFilled('biochemical_data') }
        ]
      }
    ];

    return categories;
  });

  filteredCategories = computed(() => {
    const term = this.searchTerm().toLowerCase().trim();
    if (!term) return this.allCategories();

    return this.allCategories()
      .map(cat => ({
        ...cat,
        sections: cat.sections.filter(s => s.label.toLowerCase().includes(term))
      }))
      .filter(cat => cat.sections.length > 0);
  });

  private getSpecialSections(isFilled: (key: ClinicalSectionKey) => boolean): SidebarSection[] {
    const sections: SidebarSection[] = [];

    if (this.patientAge < 18) {
      sections.push({
        key: 'perinatal_history' as ClinicalSectionKey,
        label: 'Perinatales',
        category: 'special_history',
        filled: isFilled('perinatal_history'),
        conditional: true
      });
    }

    if (this.patientGender === 'female') {
      sections.push({
        key: 'gynecological_history' as ClinicalSectionKey,
        label: 'Gineco-Obst.',
        category: 'special_history',
        filled: isFilled('gynecological_history'),
        conditional: true
      });
    }

    return sections;
  }

  onSelect(sectionKey: ClinicalSectionKey | 'overview'): void {
    this.sectionSelected.emit(sectionKey);
  }
}
