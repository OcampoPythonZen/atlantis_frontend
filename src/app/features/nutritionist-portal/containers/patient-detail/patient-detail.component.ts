import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { NutritionistPortalFacade } from '../../facades/nutritionist-portal.facade';

@Component({
  selector: 'app-patient-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="p-6">
      <!-- Breadcrumb -->
      <nav class="mb-6">
        <ol class="flex items-center gap-2 text-sm">
          <li>
            <a routerLink="/nutritionist" class="text-dark-500 hover:text-primary-500 dark:text-dark-400">
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
        <div class="bg-white dark:bg-dark-800 rounded-xl border border-dark-200 dark:border-dark-700 p-6 mb-6">
          <div class="flex items-start gap-6">
            <!-- Avatar -->
            <div class="w-24 h-24 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center text-3xl font-bold text-primary-600 dark:text-primary-400">
              {{ getInitials(patient.personalInfo.fullName) }}
            </div>

            <!-- Info -->
            <div class="flex-1">
              <div class="flex items-center gap-3 mb-2">
                <h1 class="text-2xl font-bold text-dark-900 dark:text-dark-50">
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
                Expediente: {{ patient.expedienteNumber }}
              </p>

              <div class="flex items-center gap-6 text-sm">
                <div>
                  <span class="text-dark-500 dark:text-dark-400">Email:</span>
                  <span class="ml-2 text-dark-900 dark:text-dark-50">{{ patient.personalInfo.email }}</span>
                </div>
                <div>
                  <span class="text-dark-500 dark:text-dark-400">Teléfono:</span>
                  <span class="ml-2 text-dark-900 dark:text-dark-50">{{ patient.personalInfo.phone }}</span>
                </div>
                <div>
                  <span class="text-dark-500 dark:text-dark-400">Edad:</span>
                  <span class="ml-2 text-dark-900 dark:text-dark-50">{{ patient.personalInfo.age }} años</span>
                </div>
              </div>
            </div>

            <!-- Actions -->
            <div class="flex items-center gap-2">
              <button
                class="px-4 py-2 bg-primary-500 hover:bg-primary-600 text-dark-950 font-medium rounded-lg transition-colors">
                Editar Paciente
              </button>
              <button
                class="px-4 py-2 bg-dark-100 hover:bg-dark-200 dark:bg-dark-700 dark:hover:bg-dark-600 text-dark-800 dark:text-dark-100 rounded-lg transition-colors">
                Agendar Cita
              </button>
            </div>
          </div>
        </div>

        <!-- Tabs -->
        <div class="bg-white dark:bg-dark-800 rounded-xl border border-dark-200 dark:border-dark-700">
          <div class="border-b border-dark-200 dark:border-dark-700">
            <nav class="flex gap-4 px-6">
              @for (tab of tabs; track tab.id) {
                <button
                  (click)="activeTab = tab.id"
                  class="py-4 px-2 text-sm font-medium border-b-2 transition-colors"
                  [class]="activeTab === tab.id
                    ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                    : 'border-transparent text-dark-500 hover:text-dark-700 dark:text-dark-400 dark:hover:text-dark-200'">
                  {{ tab.label }}
                </button>
              }
            </nav>
          </div>

          <div class="p-6">
            @switch (activeTab) {
              @case ('info') {
                <div class="grid grid-cols-2 gap-6">
                  <!-- Personal Info -->
                  <div>
                    <h3 class="text-lg font-semibold text-dark-900 dark:text-dark-50 mb-4">
                      Información Personal
                    </h3>
                    <dl class="space-y-3">
                      <div>
                        <dt class="text-sm text-dark-500 dark:text-dark-400">Género</dt>
                        <dd class="text-dark-900 dark:text-dark-50">
                          {{ patient.personalInfo.gender === 'male' ? 'Masculino' : patient.personalInfo.gender === 'female' ? 'Femenino' : 'Otro' }}
                        </dd>
                      </div>
                      <div>
                        <dt class="text-sm text-dark-500 dark:text-dark-400">Fecha de Nacimiento</dt>
                        <dd class="text-dark-900 dark:text-dark-50">
                          {{ patient.personalInfo.birthDate | date:'longDate' }}
                        </dd>
                      </div>
                      @if (patient.personalInfo.address) {
                        <div>
                          <dt class="text-sm text-dark-500 dark:text-dark-400">Dirección</dt>
                          <dd class="text-dark-900 dark:text-dark-50">{{ patient.personalInfo.address }}</dd>
                        </div>
                      }
                    </dl>
                  </div>

                  <!-- Medical Info -->
                  <div>
                    <h3 class="text-lg font-semibold text-dark-900 dark:text-dark-50 mb-4">
                      Información Médica
                    </h3>
                    <dl class="space-y-3">
                      @if (patient.medicalInfo.allergies.length > 0) {
                        <div>
                          <dt class="text-sm text-dark-500 dark:text-dark-400">Alergias</dt>
                          <dd class="flex flex-wrap gap-2 mt-1">
                            @for (allergy of patient.medicalInfo.allergies; track allergy) {
                              <span class="px-2 py-1 text-xs bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded">
                                {{ allergy }}
                              </span>
                            }
                          </dd>
                        </div>
                      }
                      @if (patient.medicalInfo.conditions.length > 0) {
                        <div>
                          <dt class="text-sm text-dark-500 dark:text-dark-400">Condiciones</dt>
                          <dd class="flex flex-wrap gap-2 mt-1">
                            @for (condition of patient.medicalInfo.conditions; track condition) {
                              <span class="px-2 py-1 text-xs bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 rounded">
                                {{ condition }}
                              </span>
                            }
                          </dd>
                        </div>
                      }
                      @if (patient.medicalInfo.medications.length > 0) {
                        <div>
                          <dt class="text-sm text-dark-500 dark:text-dark-400">Medicamentos</dt>
                          <dd class="flex flex-wrap gap-2 mt-1">
                            @for (med of patient.medicalInfo.medications; track med) {
                              <span class="px-2 py-1 text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded">
                                {{ med }}
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
                <div class="text-center py-12 text-dark-500 dark:text-dark-400">
                  <svg class="w-16 h-16 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  <p class="text-lg font-medium">Progreso y Métricas</p>
                  <p class="text-sm">Próximamente - Gráficas de peso e IMC</p>
                </div>
              }
              @case ('plan') {
                <div class="text-center py-12 text-dark-500 dark:text-dark-400">
                  <svg class="w-16 h-16 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  <p class="text-lg font-medium">Plan Nutricional</p>
                  <p class="text-sm">Próximamente - Menú semanal y listas de alimentos</p>
                </div>
              }
              @case ('appointments') {
                <div class="text-center py-12 text-dark-500 dark:text-dark-400">
                  <svg class="w-16 h-16 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <p class="text-lg font-medium">Historial de Citas</p>
                  <p class="text-sm">Próximamente - Lista de citas pasadas y futuras</p>
                </div>
              }
              @case ('messages') {
                <div class="text-center py-12 text-dark-500 dark:text-dark-400">
                  <svg class="w-16 h-16 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  <p class="text-lg font-medium">Mensajes</p>
                  <p class="text-sm">Próximamente - Chat con el paciente</p>
                </div>
              }
              @case ('documents') {
                <div class="text-center py-12 text-dark-500 dark:text-dark-400">
                  <svg class="w-16 h-16 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                  <p class="text-lg font-medium">Documentos</p>
                  <p class="text-sm">Próximamente - Archivos adjuntos</p>
                </div>
              }
              @case ('notes') {
                <div>
                  @if (patient.clinicalNotes.length > 0) {
                    <div class="space-y-4">
                      @for (note of patient.clinicalNotes; track note.id) {
                        <div class="p-4 bg-dark-50 dark:bg-dark-900 rounded-lg">
                          <div class="flex items-center justify-between mb-2">
                            <div class="flex items-center gap-2">
                              <span class="font-medium text-dark-900 dark:text-dark-50">
                                {{ note.authorName }}
                              </span>
                              <span
                                class="px-2 py-0.5 text-xs rounded"
                                [class]="note.authorRole === 'owner'
                                  ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400'
                                  : 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400'">
                                {{ note.authorRole === 'owner' ? 'Titular' : 'Consultor' }}
                              </span>
                              @if (note.isPrivate) {
                                <span class="px-2 py-0.5 text-xs bg-dark-200 dark:bg-dark-700 text-dark-600 dark:text-dark-400 rounded">
                                  Privada
                                </span>
                              }
                            </div>
                            <span class="text-sm text-dark-500 dark:text-dark-400">
                              {{ note.createdAt | date:'short' }}
                            </span>
                          </div>
                          <p class="text-dark-700 dark:text-dark-300">{{ note.content }}</p>
                        </div>
                      }
                    </div>
                  } @else {
                    <div class="text-center py-12 text-dark-500 dark:text-dark-400">
                      <svg class="w-16 h-16 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                      <p class="text-lg font-medium">Sin Notas Clínicas</p>
                      <p class="text-sm">Agrega la primera nota clínica</p>
                    </div>
                  }

                  <!-- Add note form -->
                  <div class="mt-6 pt-6 border-t border-dark-200 dark:border-dark-700">
                    <h4 class="text-sm font-medium text-dark-900 dark:text-dark-50 mb-3">
                      Agregar Nota Clínica
                    </h4>
                    <textarea
                      rows="3"
                      placeholder="Escribe una nota clínica..."
                      class="w-full px-4 py-3 rounded-lg border border-dark-200 dark:border-dark-700 bg-white dark:bg-dark-900 text-dark-900 dark:text-dark-50 placeholder-dark-400 focus:ring-2 focus:ring-primary-500 focus:border-transparent">
                    </textarea>
                    <div class="flex items-center justify-between mt-3">
                      <label class="flex items-center gap-2 text-sm text-dark-600 dark:text-dark-400">
                        <input type="checkbox" class="rounded border-dark-300 text-primary-500 focus:ring-primary-500">
                        Nota privada (solo profesionales)
                      </label>
                      <button class="px-4 py-2 bg-primary-500 hover:bg-primary-600 text-dark-950 font-medium rounded-lg transition-colors">
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
        <div class="text-center py-12">
          <p class="text-dark-500 dark:text-dark-400">Paciente no encontrado</p>
          <a routerLink="/nutritionist" class="text-primary-500 hover:text-primary-600 mt-2 inline-block">
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
}
