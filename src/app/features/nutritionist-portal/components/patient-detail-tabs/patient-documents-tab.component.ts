import { Component, input, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PatientComplete } from '../../models/nutritionist.model';
import { DocumentFile } from '../../models/nutritionist.model';

type DocumentFilter = 'all' | 'lab' | 'prescription' | 'plan' | 'other';

@Component({
  selector: 'app-patient-documents-tab',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="space-y-6">
      <!-- Header with filters and upload -->
      <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div class="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0">
          @for (filter of filters; track filter.value) {
            <button
              (click)="activeFilter.set(filter.value)"
              class="px-3 py-1.5 text-sm font-medium rounded-lg transition-colors whitespace-nowrap"
              [class]="activeFilter() === filter.value
                ? 'bg-teal-500 text-white'
                : 'bg-dark-100 dark:bg-dark-800 text-dark-600 dark:text-dark-400 hover:bg-dark-200 dark:hover:bg-dark-700'"
            >
              {{ filter.label }}
            </button>
          }
        </div>
        <button class="flex items-center gap-2 px-4 py-2 bg-primary-500 hover:bg-primary-600 text-dark-950 font-medium rounded-lg transition-colors text-sm">
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
          </svg>
          Subir Documento
        </button>
      </div>

      <!-- Documents Grid -->
      @if (filteredDocuments().length > 0) {
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          @for (doc of filteredDocuments(); track doc.id) {
            <div class="bg-dark-50 dark:bg-dark-900 rounded-xl p-4 border border-dark-200 dark:border-dark-700 hover:shadow-md transition-shadow">
              <div class="flex items-start gap-3">
                <!-- Icon -->
                <div
                  class="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0"
                  [class]="getTypeIconClass(doc.type)"
                >
                  <span [innerHTML]="getTypeIcon(doc.type)" class="w-6 h-6"></span>
                </div>

                <!-- Info -->
                <div class="flex-1 min-w-0">
                  <h4 class="font-medium text-dark-900 dark:text-dark-50 truncate" [title]="doc.name">
                    {{ doc.name }}
                  </h4>
                  <p class="text-xs text-dark-500 mt-0.5">
                    {{ getTypeLabel(doc.type) }}
                  </p>
                  <div class="flex items-center gap-3 mt-2 text-xs text-dark-500">
                    <span>{{ formatFileSize(doc.size) }}</span>
                    <span>{{ formatDate(doc.uploadedAt) }}</span>
                  </div>
                </div>
              </div>

              <!-- Actions -->
              <div class="flex items-center justify-end gap-2 mt-4 pt-3 border-t border-dark-200 dark:border-dark-700">
                <button class="p-2 text-dark-500 hover:text-navy-600 hover:bg-navy-50 dark:hover:bg-navy-900/20 rounded-lg transition-colors">
                  <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </button>
                <button class="p-2 text-dark-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors">
                  <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                </button>
                <button class="p-2 text-dark-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors">
                  <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
          }
        </div>
      } @else {
        <!-- Empty State -->
        <div class="text-center py-12">
          <div class="w-16 h-16 mx-auto bg-dark-100 dark:bg-dark-800 rounded-full flex items-center justify-center mb-4">
            <svg class="w-8 h-8 text-dark-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
          </div>
          <h3 class="text-lg font-medium text-dark-900 dark:text-dark-50 mb-2">
            {{ getEmptyMessage() }}
          </h3>
          <p class="text-dark-500 mb-4">
            {{ getEmptyDescription() }}
          </p>
        </div>
      }

      <!-- Storage Info -->
      <div class="bg-dark-50 dark:bg-dark-900 rounded-xl p-4 border border-dark-200 dark:border-dark-700">
        <div class="flex items-center justify-between mb-2">
          <span class="text-sm font-medium text-dark-700 dark:text-dark-300">Almacenamiento usado</span>
          <span class="text-sm text-dark-500">{{ totalSize() }} de 100 MB</span>
        </div>
        <div class="w-full h-2 bg-dark-200 dark:bg-dark-700 rounded-full overflow-hidden">
          <div
            class="h-full bg-teal-500 rounded-full transition-all"
            [style.width.%]="storagePercentage()"
          ></div>
        </div>
      </div>
    </div>
  `
})
export class PatientDocumentsTabComponent {
  patient = input<PatientComplete | null>(null);
  activeFilter = signal<DocumentFilter>('all');

  readonly filters: { value: DocumentFilter; label: string }[] = [
    { value: 'all', label: 'Todos' },
    { value: 'lab', label: 'Laboratorios' },
    { value: 'prescription', label: 'Recetas' },
    { value: 'plan', label: 'Planes' },
    { value: 'other', label: 'Otros' }
  ];

  filteredDocuments = computed(() => {
    const documents = this.patient()?.documents || [];
    const filter = this.activeFilter();

    if (filter === 'all') return documents;
    return documents.filter(d => d.type === filter);
  });

  totalSize = computed(() => {
    const documents = this.patient()?.documents || [];
    const bytes = documents.reduce((sum, d) => sum + d.size, 0);
    return this.formatFileSize(bytes);
  });

  storagePercentage = computed(() => {
    const documents = this.patient()?.documents || [];
    const bytes = documents.reduce((sum, d) => sum + d.size, 0);
    const maxBytes = 100 * 1024 * 1024; // 100 MB
    return Math.min((bytes / maxBytes) * 100, 100);
  });

  getTypeLabel(type: string): string {
    const labels: Record<string, string> = {
      lab: 'Análisis de Laboratorio',
      prescription: 'Receta Médica',
      plan: 'Plan Nutricional',
      photo: 'Fotografía',
      other: 'Otro'
    };
    return labels[type] || type;
  }

  getTypeIconClass(type: string): string {
    const classes: Record<string, string> = {
      lab: 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400',
      prescription: 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400',
      plan: 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400',
      photo: 'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400',
      other: 'bg-dark-100 dark:bg-dark-700 text-dark-600 dark:text-dark-400'
    };
    return classes[type] || classes['other']!;
  }

  getTypeIcon(type: string): string {
    const icons: Record<string, string> = {
      lab: `<svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>`,
      prescription: `<svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>`,
      plan: `<svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>`,
      photo: `<svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>`,
      other: `<svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>`
    };
    return icons[type] || icons['other']!;
  }

  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('es-MX', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  }

  getEmptyMessage(): string {
    const filter = this.activeFilter();
    if (filter === 'all') return 'Sin documentos';
    return `Sin ${this.filters.find(f => f.value === filter)?.label.toLowerCase()}`;
  }

  getEmptyDescription(): string {
    return 'Sube documentos para este paciente';
  }
}
