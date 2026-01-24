import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NutritionistPortalFacade } from '../../facades/nutritionist-portal.facade';
import { PatientProgressTabComponent } from '../../components/patient-detail-tabs/patient-progress-tab.component';
import { PatientPlanTabComponent } from '../../components/patient-detail-tabs/patient-plan-tab.component';
import { PatientAppointmentsTabComponent } from '../../components/patient-detail-tabs/patient-appointments-tab.component';
import { PatientMessagesTabComponent } from '../../components/patient-detail-tabs/patient-messages-tab.component';
import { PatientDocumentsTabComponent } from '../../components/patient-detail-tabs/patient-documents-tab.component';

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
    PatientDocumentsTabComponent
  ],
  template: `
    <div class="space-y-6">
      <!-- Breadcrumb -->
      <nav class="mb-2">
        <ol class="flex items-center gap-2 text-sm">
          <li>
            <a routerLink="/nutritionist" class="text-dark-500 hover:text-primary-500 dark:text-dark-400 transition-colors">
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
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
        </div>
      } @else if (facade.selectedPatient(); as patient) {
        <!-- Patient Header -->
        <div class="bg-white dark:bg-dark-800 rounded-xl border border-dark-200 dark:border-dark-700 p-6">
          <div class="flex flex-col lg:flex-row items-start gap-6">
            <!-- Avatar -->
            <div class="w-20 h-20 lg:w-24 lg:h-24 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center flex-shrink-0">
              @if (patient.personalInfo.photoUrl) {
                <img
                  [src]="patient.personalInfo.photoUrl"
                  [alt]="patient.personalInfo.fullName"
                  class="w-full h-full rounded-full object-cover"
                />
              } @else {
                <span class="text-2xl lg:text-3xl font-bold text-primary-600 dark:text-primary-400">
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
          <div class="border-b border-dark-200 dark:border-dark-700 overflow-x-auto">
            <nav class="flex min-w-max px-4 lg:px-6" role="tablist">
              @for (tab of tabs; track tab.id) {
                <button
                  (click)="activeTab = tab.id"
                  [attr.aria-selected]="activeTab === tab.id"
                  role="tab"
                  class="py-4 px-3 lg:px-4 text-sm font-medium border-b-2 transition-colors whitespace-nowrap"
                  [class]="activeTab === tab.id
                    ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                    : 'border-transparent text-dark-500 hover:text-dark-700 dark:text-dark-400 dark:hover:text-dark-200'">
                  {{ tab.label }}
                </button>
              }
            </nav>
          </div>

          <div class="p-4 lg:p-6">
            @switch (activeTab) {
              @case ('info') {
                <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <!-- Personal Info -->
                  <div class="bg-dark-50 dark:bg-dark-900 rounded-xl p-5">
                    <h3 class="text-lg font-semibold text-dark-900 dark:text-dark-50 mb-4 flex items-center gap-2">
                      <svg class="w-5 h-5 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      Información Personal
                    </h3>
                    <dl class="space-y-4">
                      <div class="flex justify-between">
                        <dt class="text-sm text-dark-500 dark:text-dark-400">Género</dt>
                        <dd class="text-sm font-medium text-dark-900 dark:text-dark-50">
                          {{ patient.personalInfo.gender === 'male' ? 'Masculino' : patient.personalInfo.gender === 'female' ? 'Femenino' : 'Otro' }}
                        </dd>
                      </div>
                      <div class="flex justify-between">
                        <dt class="text-sm text-dark-500 dark:text-dark-400">Fecha de Nacimiento</dt>
                        <dd class="text-sm font-medium text-dark-900 dark:text-dark-50">
                          {{ patient.personalInfo.birthDate | date:'longDate' }}
                        </dd>
                      </div>
                      @if (patient.personalInfo.address) {
                        <div>
                          <dt class="text-sm text-dark-500 dark:text-dark-400 mb-1">Dirección</dt>
                          <dd class="text-sm font-medium text-dark-900 dark:text-dark-50">{{ patient.personalInfo.address }}</dd>
                        </div>
                      }
                      @if (patient.personalInfo.emergencyContact) {
                        <div class="pt-3 border-t border-dark-200 dark:border-dark-700">
                          <dt class="text-sm text-dark-500 dark:text-dark-400 mb-2">Contacto de Emergencia</dt>
                          <dd class="text-sm text-dark-900 dark:text-dark-50">
                            <p class="font-medium">{{ patient.personalInfo.emergencyContact.name }}</p>
                            <p class="text-dark-500">{{ patient.personalInfo.emergencyContact.phone }} - {{ patient.personalInfo.emergencyContact.relationship }}</p>
                          </dd>
                        </div>
                      }
                    </dl>
                  </div>

                  <!-- Medical Info -->
                  <div class="bg-dark-50 dark:bg-dark-900 rounded-xl p-5">
                    <h3 class="text-lg font-semibold text-dark-900 dark:text-dark-50 mb-4 flex items-center gap-2">
                      <svg class="w-5 h-5 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      Información Médica
                    </h3>
                    <dl class="space-y-4">
                      @if (patient.medicalInfo.bloodType) {
                        <div class="flex justify-between">
                          <dt class="text-sm text-dark-500 dark:text-dark-400">Tipo de Sangre</dt>
                          <dd class="text-sm font-medium text-dark-900 dark:text-dark-50">{{ patient.medicalInfo.bloodType }}</dd>
                        </div>
                      }
                      @if (patient.medicalInfo.allergies.length > 0) {
                        <div>
                          <dt class="text-sm text-dark-500 dark:text-dark-400 mb-2">Alergias</dt>
                          <dd class="flex flex-wrap gap-2">
                            @for (allergy of patient.medicalInfo.allergies; track allergy) {
                              <span class="px-2 py-1 text-xs bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-lg">
                                {{ allergy }}
                              </span>
                            }
                          </dd>
                        </div>
                      }
                      @if (patient.medicalInfo.conditions.length > 0) {
                        <div>
                          <dt class="text-sm text-dark-500 dark:text-dark-400 mb-2">Condiciones</dt>
                          <dd class="flex flex-wrap gap-2">
                            @for (condition of patient.medicalInfo.conditions; track condition) {
                              <span class="px-2 py-1 text-xs bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 rounded-lg">
                                {{ condition }}
                              </span>
                            }
                          </dd>
                        </div>
                      }
                      @if (patient.medicalInfo.medications.length > 0) {
                        <div>
                          <dt class="text-sm text-dark-500 dark:text-dark-400 mb-2">Medicamentos</dt>
                          <dd class="flex flex-wrap gap-2">
                            @for (med of patient.medicalInfo.medications; track med) {
                              <span class="px-2 py-1 text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-lg">
                                {{ med }}
                              </span>
                            }
                          </dd>
                        </div>
                      }
                      @if (patient.medicalInfo.dietaryRestrictions && patient.medicalInfo.dietaryRestrictions.length > 0) {
                        <div>
                          <dt class="text-sm text-dark-500 dark:text-dark-400 mb-2">Restricciones Alimentarias</dt>
                          <dd class="flex flex-wrap gap-2">
                            @for (restriction of patient.medicalInfo.dietaryRestrictions; track restriction) {
                              <span class="px-2 py-1 text-xs bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 rounded-lg">
                                {{ restriction }}
                              </span>
                            }
                          </dd>
                        </div>
                      }
                    </dl>
                  </div>
                </div>
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
                                  ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400'
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
                        focus:ring-2 focus:ring-primary-500 focus:border-transparent
                        resize-none
                      "
                    ></textarea>
                    <div class="flex items-center justify-between mt-3">
                      <label class="flex items-center gap-2 text-sm text-dark-600 dark:text-dark-400 cursor-pointer">
                        <input
                          type="checkbox"
                          [(ngModel)]="isNotePrivate"
                          class="rounded border-dark-300 text-primary-500 focus:ring-primary-500"
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
            class="inline-flex items-center gap-2 text-primary-500 hover:text-primary-600 font-medium"
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

  activeTab = 'info';
  newNoteContent = '';
  isNotePrivate = false;

  readonly tabs = [
    { id: 'info', label: 'Información' },
    { id: 'progress', label: 'Progreso' },
    { id: 'plan', label: 'Plan Nutricional' },
    { id: 'appointments', label: 'Citas' },
    { id: 'messages', label: 'Mensajes' },
    { id: 'documents', label: 'Documentos' },
    { id: 'notes', label: 'Notas Clínicas' }
  ];

  ngOnInit(): void {
    const patientId = this.route.snapshot.paramMap.get('id');
    if (patientId) {
      this.facade.loadPatientDetail(patientId);
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
