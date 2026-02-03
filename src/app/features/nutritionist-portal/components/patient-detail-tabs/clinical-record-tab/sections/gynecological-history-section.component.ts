import { Component, Input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GynecologicalHistory } from '../../../../models/clinical-history.model';

@Component({
  selector: 'app-gynecological-history-section',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="space-y-4">
      <div class="flex items-center justify-between">
        <h3 class="text-lg font-semibold text-dark-900 dark:text-dark-50 flex items-center gap-2">
          <svg class="w-5 h-5 text-navy-600 dark:text-navy-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
          Antecedentes Gineco-Obstétricos
        </h3>
        @if (data && !isEditing()) {
          <button (click)="isEditing.set(true)" class="px-3 py-1.5 text-sm bg-primary-500 hover:bg-primary-600 text-dark-950 font-medium rounded-lg transition-colors">
            Editar
          </button>
        }
      </div>

      @if (data) {
        <div class="bg-dark-50 dark:bg-dark-900 rounded-xl p-5 space-y-4">
          <!-- Menstrual data -->
          <div>
            <h4 class="text-xs font-semibold text-dark-500 dark:text-dark-400 uppercase tracking-wider mb-3">Datos Menstruales</h4>
            <dl class="grid grid-cols-1 md:grid-cols-2 gap-4">
              @if (data.menarcheAge) {
                <div>
                  <dt class="text-sm text-dark-500 dark:text-dark-400">Menarca</dt>
                  <dd class="text-sm font-medium text-dark-900 dark:text-dark-50 mt-0.5">{{ data.menarcheAge }} años</dd>
                </div>
              }
              <div>
                <dt class="text-sm text-dark-500 dark:text-dark-400">Ciclo Regular</dt>
                <dd class="text-sm font-medium text-dark-900 dark:text-dark-50 mt-0.5">{{ data.cycleRegular ? 'Sí' : 'No' }}</dd>
              </div>
              @if (data.cycleDurationDays) {
                <div>
                  <dt class="text-sm text-dark-500 dark:text-dark-400">Duración del Ciclo</dt>
                  <dd class="text-sm font-medium text-dark-900 dark:text-dark-50 mt-0.5">{{ data.cycleDurationDays }} días</dd>
                </div>
              }
              <div>
                <dt class="text-sm text-dark-500 dark:text-dark-400">Dismenorrea</dt>
                <dd class="text-sm font-medium text-dark-900 dark:text-dark-50 mt-0.5">{{ data.dysmenorrhea ? 'Sí' : 'No' }}</dd>
              </div>
            </dl>
          </div>

          <!-- Obstetric data -->
          <div class="pt-3 border-t border-dark-200 dark:border-dark-700">
            <h4 class="text-xs font-semibold text-dark-500 dark:text-dark-400 uppercase tracking-wider mb-3">Datos Obstétricos (GPAC)</h4>
            <div class="flex gap-4">
              <div class="text-center">
                <span class="text-lg font-bold text-dark-900 dark:text-dark-50">{{ data.pregnancies }}</span>
                <p class="text-xs text-dark-500">Gestas</p>
              </div>
              <div class="text-center">
                <span class="text-lg font-bold text-dark-900 dark:text-dark-50">{{ data.deliveries }}</span>
                <p class="text-xs text-dark-500">Partos</p>
              </div>
              <div class="text-center">
                <span class="text-lg font-bold text-dark-900 dark:text-dark-50">{{ data.abortions }}</span>
                <p class="text-xs text-dark-500">Abortos</p>
              </div>
              <div class="text-center">
                <span class="text-lg font-bold text-dark-900 dark:text-dark-50">{{ data.cesareans }}</span>
                <p class="text-xs text-dark-500">Cesáreas</p>
              </div>
            </div>
            @if (data.currentlyPregnant) {
              <div class="mt-3 px-3 py-2 bg-pink-100 dark:bg-pink-900/30 text-pink-700 dark:text-pink-400 rounded-lg text-sm">
                Actualmente embarazada{{ data.gestationalWeeks ? ' — ' + data.gestationalWeeks + ' semanas' : '' }}
              </div>
            }
          </div>

          <!-- Menopause & Contraception -->
          <div class="pt-3 border-t border-dark-200 dark:border-dark-700">
            <dl class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <dt class="text-sm text-dark-500 dark:text-dark-400">Menopausia</dt>
                <dd class="text-sm font-medium text-dark-900 dark:text-dark-50 mt-0.5">
                  {{ data.menopause ? 'Sí' + (data.menopauseAge ? ' (a los ' + data.menopauseAge + ' años)' : '') : 'No' }}
                </dd>
              </div>
              <div>
                <dt class="text-sm text-dark-500 dark:text-dark-400">Método Anticonceptivo</dt>
                <dd class="text-sm font-medium text-dark-900 dark:text-dark-50 mt-0.5">{{ getContraceptiveLabel(data.contraceptiveMethod) }}</dd>
              </div>
              <div>
                <dt class="text-sm text-dark-500 dark:text-dark-400">SOP</dt>
                <dd class="text-sm font-medium text-dark-900 dark:text-dark-50 mt-0.5">{{ data.hasPCOS ? 'Sí' : 'No' }}</dd>
              </div>
            </dl>
          </div>
        </div>
      } @else {
        <div class="border-2 border-dashed border-teal-300 dark:border-teal-700 rounded-xl p-8 text-center">
          <svg class="w-12 h-12 mx-auto mb-3 text-teal-400 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
          <p class="font-medium text-dark-700 dark:text-dark-300">Sin registros</p>
          <p class="text-sm text-dark-500 dark:text-dark-400 mt-1">Agrega los antecedentes gineco-obstétricos</p>
          <button (click)="isEditing.set(true)" class="mt-4 px-4 py-2 bg-primary-500 hover:bg-primary-600 text-dark-950 font-medium rounded-lg transition-colors text-sm">
            Agregar
          </button>
        </div>
      }
    </div>
  `
})
export class GynecologicalHistorySectionComponent {
  @Input() data: GynecologicalHistory | null = null;
  isEditing = signal(false);

  getContraceptiveLabel(method: string): string {
    const labels: Record<string, string> = {
      none: 'Ninguno',
      oral_pills: 'Pastillas Orales',
      iud: 'DIU',
      implant: 'Implante',
      injection: 'Inyección',
      condom: 'Condón',
      patch: 'Parche',
      ring: 'Anillo',
      other: 'Otro'
    };
    return labels[method] || method;
  }
}
