import { Component, inject, OnInit, signal, computed, HostListener, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NutritionistPortalFacade } from '../../facades/nutritionist-portal.facade';
import { PatientProgressTabComponent } from '../../components/patient-detail-tabs/patient-progress-tab.component';
import { PatientPlanTabComponent } from '../../components/patient-detail-tabs/patient-plan-tab.component';
import { PatientAppointmentsTabComponent } from '../../components/patient-detail-tabs/patient-appointments-tab.component';
import { PatientMessagesTabComponent } from '../../components/patient-detail-tabs/patient-messages-tab.component';
import { PatientDocumentsTabComponent } from '../../components/patient-detail-tabs/patient-documents-tab.component';
import { ClinicalRecordTabComponent } from '../../components/patient-detail-tabs/clinical-record-tab/clinical-record-tab.component';

@Component({
  selector: 'app-patient-detail',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    FormsModule,
    PatientProgressTabComponent,
    PatientPlanTabComponent,
    PatientAppointmentsTabComponent,
    PatientMessagesTabComponent,
    PatientDocumentsTabComponent,
    ClinicalRecordTabComponent
  ],
  template: `
    <div class="space-y-6">
      <!-- Breadcrumb -->
      <nav class="mb-2">
        <ol class="flex items-center gap-2 text-sm">
          <li>
            <a routerLink="/nutritionist" class="text-dark-500 hover:text-teal-500 dark:text-dark-400 transition-colors">
              Dashboard
            </a>
          </li>
          <li class="text-dark-400 dark:text-dark-500">/</li>
          <li class="text-dark-900 dark:text-dark-50 font-medium">
            Detalle del Paciente
          </li>
        </ol>
      </nav>

      @if (facade.isLoading()) {
        <div class="flex items-center justify-center py-12">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-500"></div>
        </div>
      } @else if (facade.selectedPatient(); as patient) {
        <!-- Patient Header -->
        <div class="bg-white dark:bg-dark-800 rounded-xl border border-dark-200 dark:border-dark-700 p-6">
          <div class="flex flex-col lg:flex-row items-start gap-6">
            <!-- Avatar -->
            <div class="w-20 h-20 lg:w-24 lg:h-24 rounded-full bg-teal-100 dark:bg-teal-900/30 flex items-center justify-center flex-shrink-0">
              @if (patient.personalInfo.photoUrl) {
                <img
                  [src]="patient.personalInfo.photoUrl"
                  [alt]="patient.personalInfo.fullName"
                  class="w-full h-full rounded-full object-cover"
                />
              } @else {
                <span class="text-2xl lg:text-3xl font-bold text-teal-600 dark:text-teal-400">
                  {{ getInitials(patient.personalInfo.fullName) }}
                </span>
              }
            </div>

            <!-- Info -->
            <div class="flex-1">
              <div class="flex flex-wrap items-center gap-3 mb-2">
                <h1 class="text-xl lg:text-2xl font-bold text-dark-900 dark:text-dark-50">
                  {{ patient.personalInfo.fullName }}
                </h1>
                <span
                  class="px-3 py-1 text-xs font-medium rounded-full"
                  [class]="patient.status === 'active'
                    ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                    : 'bg-dark-100 dark:bg-dark-700 text-dark-600 dark:text-dark-400'">
                  {{ patient.status === 'active' ? 'Activo' : 'Inactivo' }}
                </span>
              </div>
              <p class="text-dark-600 dark:text-dark-400 mb-4">
                Expediente: <span class="font-medium">{{ patient.expedienteNumber }}</span>
              </p>

              <div class="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
                <div class="flex items-center gap-2">
                  <svg class="w-4 h-4 text-dark-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <span class="text-dark-900 dark:text-dark-50">{{ patient.personalInfo.email }}</span>
                </div>
                <div class="flex items-center gap-2">
                  <svg class="w-4 h-4 text-dark-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <span class="text-dark-900 dark:text-dark-50">{{ patient.personalInfo.phone }}</span>
                </div>
                <div class="flex items-center gap-2">
                  <svg class="w-4 h-4 text-dark-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span class="text-dark-900 dark:text-dark-50">{{ patient.personalInfo.age }} años</span>
                </div>
              </div>
            </div>

            <!-- Actions -->
            <div class="flex items-center gap-2 self-start">
              <button
                class="px-4 py-2 bg-primary-500 hover:bg-primary-600 text-dark-950 font-medium rounded-lg transition-colors text-sm">
                Editar Paciente
              </button>
              <button
                class="px-4 py-2 bg-dark-100 hover:bg-dark-200 dark:bg-dark-700 dark:hover:bg-dark-600 text-dark-800 dark:text-dark-100 rounded-lg transition-colors text-sm">
                Agendar Cita
              </button>
            </div>
          </div>
        </div>

        <!-- Tabs -->
        <div class="bg-white dark:bg-dark-800 rounded-xl border border-dark-200 dark:border-dark-700 overflow-hidden">
          <!-- Mobile: Dropdown selector -->
          <div class="md:hidden relative border-b border-dark-200 dark:border-dark-700">
            <button
              (click)="toggleTabMenu()"
              class="
                w-full flex items-center justify-between
                px-4 py-3.5
                text-left font-medium
                text-dark-900 dark:text-dark-50
                hover:bg-dark-50 dark:hover:bg-dark-700/50
                transition-colors
              "
              [attr.aria-expanded]="isTabMenuOpen()"
              aria-haspopup="listbox"
            >
              <span class="flex items-center gap-3">
                <span class="w-8 h-8 rounded-lg bg-teal-100 dark:bg-teal-900/30 flex items-center justify-center">
                  @switch (activeTab) {
                    @case ('expediente') {
                      <svg class="w-4 h-4 text-teal-600 dark:text-teal-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                      </svg>
                    }
                    @case ('progress') {
                      <svg class="w-4 h-4 text-teal-600 dark:text-teal-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                    }
                    @case ('plan') {
                      <svg class="w-4 h-4 text-teal-600 dark:text-teal-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                    }
                    @case ('appointments') {
                      <svg class="w-4 h-4 text-teal-600 dark:text-teal-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    }
                    @case ('messages') {
                      <svg class="w-4 h-4 text-teal-600 dark:text-teal-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                    }
                    @case ('documents') {
                      <svg class="w-4 h-4 text-teal-600 dark:text-teal-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                      </svg>
                    }
                    @case ('notes') {
                      <svg class="w-4 h-4 text-teal-600 dark:text-teal-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    }
                  }
                </span>
                <span>{{ activeTabLabel() }}</span>
              </span>
              <svg
                class="w-5 h-5 text-dark-400 transition-transform duration-200"
                [class.rotate-180]="isTabMenuOpen()"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            <!-- Dropdown menu -->
            @if (isTabMenuOpen()) {
              <div
                class="
                  absolute left-0 right-0 top-full z-50
                  bg-white dark:bg-dark-800
                  border-x border-b border-dark-200 dark:border-dark-700
                  rounded-b-xl
                  shadow-lg
                  max-h-80 overflow-y-auto
                "
                role="listbox"
              >
                @for (tab of tabs; track tab.id) {
                  <button
                    (click)="selectTab(tab.id)"
                    role="option"
                    [attr.aria-selected]="activeTab === tab.id"
                    class="
                      w-full flex items-center gap-3 px-4 py-3
                      text-left text-sm
                      transition-colors
                    "
                    [class]="activeTab === tab.id
                      ? 'bg-teal-50 dark:bg-teal-900/20 text-teal-700 dark:text-teal-400'
                      : 'text-dark-700 dark:text-dark-300 hover:bg-dark-50 dark:hover:bg-dark-700/50'"
                  >
                    @if (activeTab === tab.id) {
                      <svg class="w-4 h-4 text-teal-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                      </svg>
                    } @else {
                      <span class="w-4"></span>
                    }
                    <span class="font-medium">{{ tab.label }}</span>
                  </button>
                }
              </div>
            }
          </div>

          <!-- Desktop: Traditional tabs -->
          <div class="hidden md:block border-b border-dark-200 dark:border-dark-700">
            <nav class="flex px-4 lg:px-6" role="tablist">
              @for (tab of tabs; track tab.id) {
                <button
                  (click)="activeTab = tab.id"
                  [attr.aria-selected]="activeTab === tab.id"
                  role="tab"
                  class="py-4 px-3 lg:px-4 text-sm font-medium border-b-2 transition-colors whitespace-nowrap"
                  [class]="activeTab === tab.id
                    ? 'border-teal-500 text-teal-600 dark:text-teal-400'
                    : 'border-transparent text-dark-500 hover:text-dark-700 dark:text-dark-400 dark:hover:text-dark-200'">
                  {{ tab.label }}
                </button>
              }
            </nav>
          </div>

          <div class="p-4 lg:p-6">
            @switch (activeTab) {
              @case ('expediente') {
                <app-clinical-record-tab [patient]="patient" />
              }
              @case ('progress') {
                <app-patient-progress-tab [patient]="patient" />
              }
              @case ('plan') {
                <app-patient-plan-tab [patient]="patient" />
              }
              @case ('appointments') {
                <app-patient-appointments-tab [patient]="patient" />
              }
              @case ('messages') {
                <app-patient-messages-tab [patient]="patient" />
              }
              @case ('documents') {
                <app-patient-documents-tab [patient]="patient" />
              }
              @case ('notes') {
                <div class="space-y-6">
                  @if (patient.clinicalNotes.length > 0) {
                    <div class="space-y-4">
                      @for (note of patient.clinicalNotes; track note.id) {
                        <div class="p-4 bg-dark-50 dark:bg-dark-900 rounded-xl">
                          <div class="flex items-center justify-between mb-3">
                            <div class="flex items-center gap-2">
                              <span class="font-medium text-dark-900 dark:text-dark-50">
                                {{ note.authorName }}
                              </span>
                              <span
                                class="px-2 py-0.5 text-xs rounded-full"
                                [class]="note.authorRole === 'owner'
                                  ? 'bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-400'
                                  : 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400'">
                                {{ note.authorRole === 'owner' ? 'Titular' : 'Consultor' }}
                              </span>
                              @if (note.isPrivate) {
                                <span class="px-2 py-0.5 text-xs bg-dark-200 dark:bg-dark-700 text-dark-600 dark:text-dark-400 rounded-full flex items-center gap-1">
                                  <svg class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                  </svg>
                                  Privada
                                </span>
                              }
                            </div>
                            <span class="text-sm text-dark-500 dark:text-dark-400">
                              {{ note.createdAt | date:'medium' }}
                            </span>
                          </div>
                          <p class="text-dark-700 dark:text-dark-300 whitespace-pre-wrap">{{ note.content }}</p>
                        </div>
                      }
                    </div>
                  } @else {
                    <div class="text-center py-8 text-dark-500 dark:text-dark-400">
                      <svg class="w-12 h-12 mx-auto mb-3 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                      <p class="font-medium">Sin Notas Clínicas</p>
                      <p class="text-sm">Agrega la primera nota clínica</p>
                    </div>
                  }

                  <!-- Add note form -->
                  <div class="pt-6 border-t border-dark-200 dark:border-dark-700">
                    <h4 class="text-sm font-medium text-dark-900 dark:text-dark-50 mb-3">
                      Agregar Nota Clínica
                    </h4>
                    <textarea
                      [(ngModel)]="newNoteContent"
                      rows="4"
                      placeholder="Escribe una nota clínica..."
                      class="
                        w-full px-4 py-3 rounded-xl
                        border border-dark-200 dark:border-dark-700
                        bg-dark-50 dark:bg-dark-900
                        text-dark-900 dark:text-dark-50
                        placeholder-dark-400
                        focus:ring-2 focus:ring-teal-500 focus:border-transparent
                        resize-none
                      "
                    ></textarea>
                    <div class="flex items-center justify-between mt-3">
                      <label class="flex items-center gap-2 text-sm text-dark-600 dark:text-dark-400 cursor-pointer">
                        <input
                          type="checkbox"
                          [(ngModel)]="isNotePrivate"
                          class="rounded border-dark-300 text-teal-500 focus:ring-teal-500"
                        />
                        Nota privada (solo profesionales)
                      </label>
                      <button
                        (click)="addClinicalNote(patient.id)"
                        [disabled]="!newNoteContent.trim()"
                        class="
                          px-4 py-2 bg-primary-500 hover:bg-primary-600
                          text-dark-950 font-medium rounded-lg
                          transition-colors
                          disabled:opacity-50 disabled:cursor-not-allowed
                        "
                      >
                        Guardar Nota
                      </button>
                    </div>
                  </div>
                </div>
              }
            }
          </div>
        </div>
      } @else {
        <div class="text-center py-12 bg-white dark:bg-dark-800 rounded-xl border border-dark-200 dark:border-dark-700">
          <svg class="w-16 h-16 mx-auto mb-4 text-dark-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p class="text-dark-500 dark:text-dark-400 mb-4">Paciente no encontrado</p>
          <a
            routerLink="/nutritionist"
            class="inline-flex items-center gap-2 text-teal-500 hover:text-teal-600 font-medium"
          >
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Volver al Dashboard
          </a>
        </div>
      }
    </div>
  `
})
export class PatientDetailComponent implements OnInit {
  readonly facade = inject(NutritionistPortalFacade);
  private readonly route = inject(ActivatedRoute);
  private readonly elementRef = inject(ElementRef);

  activeTab = 'expediente';
  newNoteContent = '';
  isNotePrivate = false;

  // Mobile tab menu state
  isTabMenuOpen = signal(false);

  readonly tabs = [
    { id: 'expediente', label: 'Expediente' },
    { id: 'progress', label: 'Progreso' },
    { id: 'plan', label: 'Plan Nutricional' },
    { id: 'appointments', label: 'Citas' },
    { id: 'messages', label: 'Mensajes' },
    { id: 'documents', label: 'Documentos' },
    { id: 'notes', label: 'Notas Clínicas' }
  ];

  // Computed label for active tab
  activeTabLabel = computed(() => {
    const tab = this.tabs.find(t => t.id === this.activeTab);
    return tab?.label || 'Expediente';
  });

  // Close dropdown when clicking outside
  @HostListener('document:click', ['$event'])
  onClickOutside(event: MouseEvent): void {
    if (this.isTabMenuOpen() && !this.elementRef.nativeElement.contains(event.target)) {
      this.isTabMenuOpen.set(false);
    }
  }

  // Close dropdown on escape key
  @HostListener('document:keydown.escape')
  onEscapePress(): void {
    if (this.isTabMenuOpen()) {
      this.isTabMenuOpen.set(false);
    }
  }

  ngOnInit(): void {
    const patientId = this.route.snapshot.paramMap.get('id');
    const tab = this.route.snapshot.queryParamMap.get('tab');

    if (patientId) {
      this.facade.loadPatientDetail(patientId);
    }

    // Set active tab from query params if valid
    if (tab && this.tabs.some(t => t.id === tab)) {
      this.activeTab = tab;
    }
  }

  getInitials(name: string): string {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .substring(0, 2)
      .toUpperCase();
  }

  toggleTabMenu(): void {
    this.isTabMenuOpen.update(v => !v);
  }

  selectTab(tabId: string): void {
    this.activeTab = tabId;
    this.isTabMenuOpen.set(false);
  }

  async addClinicalNote(patientId: string): Promise<void> {
    if (!this.newNoteContent.trim()) return;

    const success = await this.facade.addClinicalNote(
      patientId,
      this.newNoteContent,
      this.isNotePrivate
    );

    if (success) {
      this.newNoteContent = '';
      this.isNotePrivate = false;
    }
  }
}
