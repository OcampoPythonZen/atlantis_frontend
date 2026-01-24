import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NutritionistPortalFacade } from '../../facades/nutritionist-portal.facade';

@Component({
  selector: 'app-consultations',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="p-6">
      <!-- Header -->
      <div class="flex items-center justify-between mb-6">
        <div>
          <h1 class="text-2xl font-bold text-dark-900 dark:text-dark-50">Consultas con Especialistas</h1>
          <p class="text-dark-600 dark:text-dark-400 mt-1">
            Gestiona las colaboraciones con otros profesionales
          </p>
        </div>
        <button
          (click)="facade.openInviteSpecialistModal()"
          class="flex items-center gap-2 px-4 py-2 bg-primary-500 hover:bg-primary-600 text-dark-950 font-medium rounded-lg transition-colors">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
          </svg>
          Invitar Especialista
        </button>
      </div>

      <!-- Tabs -->
      <div class="flex gap-4 mb-6 border-b border-dark-200 dark:border-dark-700">
        <button
          (click)="activeTab = 'my-requests'"
          class="pb-3 px-1 text-sm font-medium border-b-2 transition-colors"
          [class]="activeTab === 'my-requests'
            ? 'border-primary-500 text-primary-600 dark:text-primary-400'
            : 'border-transparent text-dark-500 hover:text-dark-700 dark:text-dark-400 dark:hover:text-dark-200'">
          Mis Solicitudes
          @if (facade.myConsultationRequests().length > 0) {
            <span class="ml-2 px-2 py-0.5 text-xs bg-dark-100 dark:bg-dark-700 rounded-full">
              {{ facade.myConsultationRequests().length }}
            </span>
          }
        </button>
        <button
          (click)="activeTab = 'shared-with-me'"
          class="pb-3 px-1 text-sm font-medium border-b-2 transition-colors"
          [class]="activeTab === 'shared-with-me'
            ? 'border-primary-500 text-primary-600 dark:text-primary-400'
            : 'border-transparent text-dark-500 hover:text-dark-700 dark:text-dark-400 dark:hover:text-dark-200'">
          Compartidos Conmigo
          @if (pendingSharedCount > 0) {
            <span class="ml-2 px-2 py-0.5 text-xs bg-primary-500 text-dark-950 rounded-full">
              {{ pendingSharedCount }}
            </span>
          }
        </button>
      </div>

      @if (facade.isLoading()) {
        <div class="flex items-center justify-center py-12">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
        </div>
      } @else {
        @switch (activeTab) {
          @case ('my-requests') {
            @if (facade.myConsultationRequests().length > 0) {
              <div class="space-y-4">
                @for (consultation of facade.myConsultationRequests(); track consultation.id) {
                  <div class="bg-white dark:bg-dark-800 rounded-xl border border-dark-200 dark:border-dark-700 p-6">
                    <div class="flex items-start justify-between">
                      <div>
                        <div class="flex items-center gap-3 mb-2">
                          <h3 class="text-lg font-semibold text-dark-900 dark:text-dark-50">
                            {{ consultation.patientName }}
                          </h3>
                          <span
                            class="px-2 py-0.5 text-xs rounded-full"
                            [class]="getStatusClasses(consultation.status)">
                            {{ getStatusLabel(consultation.status) }}
                          </span>
                        </div>
                        <p class="text-dark-600 dark:text-dark-400 mb-3">
                          {{ consultation.reason }}
                        </p>
                        <div class="flex items-center gap-4 text-sm">
                          <div class="flex items-center gap-2">
                            <svg class="w-4 h-4 text-dark-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                            <span class="text-dark-600 dark:text-dark-400">
                              Especialista: <span class="font-medium text-dark-900 dark:text-dark-50">{{ consultation.invitedSpecialistName }}</span>
                            </span>
                          </div>
                          <div class="flex items-center gap-2">
                            <svg class="w-4 h-4 text-dark-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <span class="text-dark-600 dark:text-dark-400">
                              {{ consultation.createdAt | date:'mediumDate' }}
                            </span>
                          </div>
                        </div>
                      </div>

                      @if (consultation.status === 'pending') {
                        <button class="text-red-500 hover:text-red-600 text-sm font-medium">
                          Cancelar
                        </button>
                      }
                    </div>

                    @if (consultation.notes.length > 0) {
                      <div class="mt-4 pt-4 border-t border-dark-200 dark:border-dark-700">
                        <h4 class="text-sm font-medium text-dark-900 dark:text-dark-50 mb-3">
                          Notas del Especialista
                        </h4>
                        <div class="space-y-2">
                          @for (note of consultation.notes; track note.id) {
                            <div class="p-3 bg-dark-50 dark:bg-dark-900 rounded-lg">
                              <div class="flex items-center justify-between mb-1">
                                <span class="text-sm font-medium text-dark-900 dark:text-dark-50">
                                  {{ note.authorName }}
                                </span>
                                <span class="text-xs text-dark-500 dark:text-dark-400">
                                  {{ note.createdAt | date:'short' }}
                                </span>
                              </div>
                              <p class="text-sm text-dark-600 dark:text-dark-400">{{ note.content }}</p>
                            </div>
                          }
                        </div>
                      </div>
                    }
                  </div>
                }
              </div>
            } @else {
              <div class="text-center py-12 bg-white dark:bg-dark-800 rounded-xl border border-dark-200 dark:border-dark-700">
                <svg class="w-16 h-16 mx-auto mb-4 text-dark-400 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <p class="text-lg font-medium text-dark-900 dark:text-dark-50">Sin consultas activas</p>
                <p class="text-dark-500 dark:text-dark-400 mt-1">
                  Invita a un especialista para colaborar en un caso
                </p>
              </div>
            }
          }

          @case ('shared-with-me') {
            @if (facade.sharedWithMe().length > 0) {
              <div class="space-y-4">
                @for (consultation of facade.sharedWithMe(); track consultation.id) {
                  <div class="bg-white dark:bg-dark-800 rounded-xl border border-dark-200 dark:border-dark-700 p-6">
                    <div class="flex items-start justify-between">
                      <div>
                        <div class="flex items-center gap-3 mb-2">
                          <h3 class="text-lg font-semibold text-dark-900 dark:text-dark-50">
                            {{ consultation.patientName }}
                          </h3>
                          <span
                            class="px-2 py-0.5 text-xs rounded-full"
                            [class]="getStatusClasses(consultation.status)">
                            {{ getStatusLabel(consultation.status) }}
                          </span>
                        </div>
                        <p class="text-dark-600 dark:text-dark-400 mb-3">
                          {{ consultation.reason }}
                        </p>
                        <div class="flex items-center gap-4 text-sm">
                          <div class="flex items-center gap-2">
                            <svg class="w-4 h-4 text-dark-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                            <span class="text-dark-600 dark:text-dark-400">
                              Solicitado por: <span class="font-medium text-dark-900 dark:text-dark-50">{{ consultation.requestingNutritionistName }}</span>
                            </span>
                          </div>
                          <div class="flex items-center gap-2">
                            <svg class="w-4 h-4 text-dark-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                            </svg>
                            <span class="text-dark-600 dark:text-dark-400">
                              Permisos: {{ consultation.permissions === 'read' ? 'Solo lectura' : 'Lectura + Notas' }}
                            </span>
                          </div>
                        </div>
                      </div>

                      @if (consultation.status === 'pending') {
                        <div class="flex items-center gap-2">
                          <button
                            (click)="respondToConsultation(consultation.id, true)"
                            class="px-4 py-2 bg-green-500 hover:bg-green-600 text-white font-medium rounded-lg transition-colors">
                            Aceptar
                          </button>
                          <button
                            (click)="respondToConsultation(consultation.id, false)"
                            class="px-4 py-2 bg-dark-100 hover:bg-dark-200 dark:bg-dark-700 dark:hover:bg-dark-600 text-dark-800 dark:text-dark-100 rounded-lg transition-colors">
                            Rechazar
                          </button>
                        </div>
                      } @else if (consultation.status === 'accepted') {
                        <button class="px-4 py-2 bg-primary-500 hover:bg-primary-600 text-dark-950 font-medium rounded-lg transition-colors">
                          Ver Expediente
                        </button>
                      }
                    </div>

                    @if (consultation.status === 'accepted' && consultation.permissions === 'read_notes') {
                      <div class="mt-4 pt-4 border-t border-dark-200 dark:border-dark-700">
                        <h4 class="text-sm font-medium text-dark-900 dark:text-dark-50 mb-3">
                          Agregar Nota
                        </h4>
                        <div class="flex gap-3">
                          <input
                            type="text"
                            placeholder="Escribe una nota sobre este caso..."
                            class="flex-1 px-4 py-2 rounded-lg border border-dark-200 dark:border-dark-700 bg-white dark:bg-dark-900 text-dark-900 dark:text-dark-50 placeholder-dark-400 focus:ring-2 focus:ring-primary-500 focus:border-transparent">
                          <button class="px-4 py-2 bg-primary-500 hover:bg-primary-600 text-dark-950 font-medium rounded-lg transition-colors">
                            Agregar
                          </button>
                        </div>
                      </div>
                    }
                  </div>
                }
              </div>
            } @else {
              <div class="text-center py-12 bg-white dark:bg-dark-800 rounded-xl border border-dark-200 dark:border-dark-700">
                <svg class="w-16 h-16 mx-auto mb-4 text-dark-400 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                </svg>
                <p class="text-lg font-medium text-dark-900 dark:text-dark-50">Sin casos compartidos</p>
                <p class="text-dark-500 dark:text-dark-400 mt-1">
                  Aquí aparecerán los pacientes que otros profesionales compartan contigo
                </p>
              </div>
            }
          }
        }
      }
    </div>
  `
})
export class ConsultationsComponent implements OnInit {
  readonly facade = inject(NutritionistPortalFacade);

  activeTab: 'my-requests' | 'shared-with-me' = 'my-requests';

  get pendingSharedCount(): number {
    return this.facade.sharedWithMe().filter(c => c.status === 'pending').length;
  }

  ngOnInit(): void {
    this.facade.loadConsultations();
  }

  respondToConsultation(consultationId: string, accept: boolean): void {
    this.facade.respondToConsultation(consultationId, accept);
  }

  getStatusClasses(status: string): string {
    switch (status) {
      case 'pending':
        return 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400';
      case 'accepted':
        return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400';
      case 'declined':
        return 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400';
      case 'completed':
        return 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400';
      default:
        return 'bg-dark-100 dark:bg-dark-700 text-dark-600 dark:text-dark-400';
    }
  }

  getStatusLabel(status: string): string {
    switch (status) {
      case 'pending': return 'Pendiente';
      case 'accepted': return 'Aceptada';
      case 'declined': return 'Rechazada';
      case 'completed': return 'Completada';
      default: return status;
    }
  }
}
