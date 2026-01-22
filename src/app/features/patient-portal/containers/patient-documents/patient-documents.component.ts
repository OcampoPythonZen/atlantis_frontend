import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PatientPortalFacade } from '../../facades/patient-portal.facade';
import { DocumentType } from '../../models/patient.model';

@Component({
  selector: 'app-patient-documents',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="space-y-6">
      <!-- Page header -->
      <div>
        <h1 class="text-2xl font-display font-bold text-dark-900 dark:text-dark-50">
          Documentos
        </h1>
        <p class="mt-1 text-dark-600 dark:text-dark-400">
          Archivos compartidos por tu nutriólogo
        </p>
      </div>

      @if (isLoading()) {
        <!-- Loading state -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          @for (i of [1, 2, 3]; track i) {
            <div class="bg-white dark:bg-dark-800 rounded-xl p-4 animate-pulse">
              <div class="flex items-center gap-3">
                <div class="w-12 h-12 bg-dark-200 dark:bg-dark-700 rounded-lg"></div>
                <div class="flex-1">
                  <div class="h-4 bg-dark-200 dark:bg-dark-700 rounded w-3/4 mb-2"></div>
                  <div class="h-3 bg-dark-200 dark:bg-dark-700 rounded w-1/2"></div>
                </div>
              </div>
            </div>
          }
        </div>
      } @else if (documents().length === 0) {
        <!-- Empty state -->
        <div class="bg-white dark:bg-dark-800 rounded-xl border border-dark-200 dark:border-dark-700 p-12 text-center">
          <svg class="w-16 h-16 text-dark-300 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <h2 class="text-xl font-semibold text-dark-900 dark:text-dark-50 mb-2">
            No hay documentos
          </h2>
          <p class="text-dark-500">
            Tu nutriólogo aún no ha compartido documentos contigo.
          </p>
        </div>
      } @else {
        <!-- Documents grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          @for (document of documents(); track document.id) {
            <div class="bg-white dark:bg-dark-800 rounded-xl border border-dark-200 dark:border-dark-700 p-4 hover:shadow-md transition-shadow">
              <div class="flex items-start gap-3">
                <!-- File icon -->
                <div
                  class="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0"
                  [class]="getDocumentIconClass(document.type)"
                >
                  <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    @switch (document.type) {
                      @case ('lab_results') {
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                      }
                      @case ('meal_plan') {
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      }
                      @case ('recipe') {
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                      }
                      @default {
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      }
                    }
                  </svg>
                </div>

                <!-- File info -->
                <div class="flex-1 min-w-0">
                  <p class="font-medium text-dark-900 dark:text-dark-50 truncate" [title]="document.name">
                    {{ document.name }}
                  </p>
                  <p class="text-sm text-dark-500 mt-1">
                    {{ getDocumentTypeLabel(document.type) }}
                  </p>
                  <div class="flex items-center gap-3 mt-2 text-xs text-dark-400">
                    <span>{{ formatFileSize(document.size) }}</span>
                    <span>{{ document.uploadedAt | date:'d MMM yyyy':'':'es-MX' }}</span>
                  </div>
                </div>
              </div>

              <!-- Actions -->
              <div class="mt-4 pt-3 border-t border-dark-200 dark:border-dark-700 flex justify-end gap-2">
                <button
                  (click)="downloadDocument(document.id)"
                  class="
                    flex items-center gap-1 px-3 py-1.5
                    text-sm font-medium
                    text-primary-600 dark:text-primary-400
                    hover:bg-primary-50 dark:hover:bg-primary-900/20
                    rounded-lg transition-colors
                  "
                >
                  <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  Descargar
                </button>
              </div>
            </div>
          }
        </div>
      }
    </div>
  `
})
export class PatientDocumentsComponent implements OnInit {
  private readonly facade = inject(PatientPortalFacade);

  readonly isLoading = this.facade.isLoading;
  readonly documents = this.facade.documents;

  ngOnInit(): void {
    this.facade.loadDocuments();
  }

  getDocumentTypeLabel(type: DocumentType): string {
    const labels: Record<DocumentType, string> = {
      'lab_results': 'Resultados de laboratorio',
      'prescription': 'Receta médica',
      'meal_plan': 'Plan alimenticio',
      'recipe': 'Receta',
      'educational': 'Material educativo',
      'other': 'Otro'
    };
    return labels[type] ?? type;
  }

  getDocumentIconClass(type: DocumentType): string {
    const classes: Record<DocumentType, string> = {
      'lab_results': 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400',
      'prescription': 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400',
      'meal_plan': 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400',
      'recipe': 'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400',
      'educational': 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400',
      'other': 'bg-dark-100 dark:bg-dark-700 text-dark-600 dark:text-dark-400'
    };
    return classes[type] ?? classes['other'];
  }

  formatFileSize(bytes: number): string {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }

  downloadDocument(id: string): void {
    this.facade.downloadDocument(id);
  }
}
