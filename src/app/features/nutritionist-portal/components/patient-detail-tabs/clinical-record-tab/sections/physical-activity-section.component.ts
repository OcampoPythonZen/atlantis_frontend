import { Component, Input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PhysicalActivity, ActivityIntensity } from '../../../../models/clinical-history.model';

@Component({
  selector: 'app-physical-activity-section',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="space-y-4">
      <div class="flex items-center justify-between">
        <h3 class="text-lg font-semibold text-dark-900 dark:text-dark-50 flex items-center gap-2">
          <svg class="w-5 h-5 text-navy-600 dark:text-navy-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          Actividad Física
        </h3>
        @if (data && !isEditing()) {
          <button (click)="isEditing.set(true)" class="px-3 py-1.5 text-sm bg-primary-500 hover:bg-primary-600 text-dark-950 font-medium rounded-lg transition-colors">
            Editar
          </button>
        }
      </div>

      @if (data) {
        <div class="bg-dark-50 dark:bg-dark-900 rounded-xl p-5">
          <div class="flex items-center gap-3 mb-4">
            <span class="text-sm text-dark-500 dark:text-dark-400">Nivel General:</span>
            <span class="px-2 py-0.5 text-xs font-medium rounded-full"
              [class]="getIntensityClasses(data.generalLevel)">
              {{ getIntensityLabel(data.generalLevel) }}
            </span>
          </div>

          @if (data.activities.length > 0) {
            <div class="space-y-2">
              @for (activity of data.activities; track activity.id) {
                <div class="flex items-center justify-between p-3 bg-white dark:bg-dark-800 rounded-lg border border-dark-200 dark:border-dark-700">
                  <div>
                    <p class="text-sm font-medium text-dark-900 dark:text-dark-50">{{ activity.activityType }}</p>
                    <p class="text-xs text-dark-500 dark:text-dark-400">
                      {{ activity.frequencyPerWeek }}x/semana · {{ activity.durationMinutes }} min
                      @if (activity.yearsOfPractice) {
                        · {{ activity.yearsOfPractice }} años
                      }
                    </p>
                  </div>
                  <span class="px-2 py-0.5 text-xs rounded-full" [class]="getIntensityClasses(activity.intensity)">
                    {{ getIntensityLabel(activity.intensity) }}
                  </span>
                </div>
              }
            </div>
          }
          @if (data.additionalNotes) {
            <div class="mt-4 pt-3 border-t border-dark-200 dark:border-dark-700">
              <p class="text-sm text-dark-600 dark:text-dark-400">{{ data.additionalNotes }}</p>
            </div>
          }
        </div>
      } @else {
        <div class="border-2 border-dashed border-teal-300 dark:border-teal-700 rounded-xl p-8 text-center">
          <svg class="w-12 h-12 mx-auto mb-3 text-teal-400 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          <p class="font-medium text-dark-700 dark:text-dark-300">Sin registros</p>
          <p class="text-sm text-dark-500 dark:text-dark-400 mt-1">Agrega la información de actividad física</p>
          <button (click)="isEditing.set(true)" class="mt-4 px-4 py-2 bg-primary-500 hover:bg-primary-600 text-dark-950 font-medium rounded-lg transition-colors text-sm">
            Agregar
          </button>
        </div>
      }
    </div>
  `
})
export class PhysicalActivitySectionComponent {
  @Input() data: PhysicalActivity | null = null;
  isEditing = signal(false);

  getIntensityLabel(intensity: ActivityIntensity): string {
    const labels: Record<ActivityIntensity, string> = {
      sedentary: 'Sedentario',
      light: 'Ligera',
      moderate: 'Moderada',
      intense: 'Intensa',
      very_intense: 'Muy Intensa'
    };
    return labels[intensity] || intensity;
  }

  getIntensityClasses(intensity: ActivityIntensity): string {
    const classes: Record<ActivityIntensity, string> = {
      sedentary: 'bg-dark-200 dark:bg-dark-700 text-dark-600 dark:text-dark-400',
      light: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400',
      moderate: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400',
      intense: 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400',
      very_intense: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
    };
    return classes[intensity] || '';
  }
}
