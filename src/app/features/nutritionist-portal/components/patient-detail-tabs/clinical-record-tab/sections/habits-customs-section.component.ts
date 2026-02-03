import { Component, Input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HabitsAndCustoms } from '../../../../models/clinical-history.model';

@Component({
  selector: 'app-habits-customs-section',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="space-y-4">
      <div class="flex items-center justify-between">
        <h3 class="text-lg font-semibold text-dark-900 dark:text-dark-50 flex items-center gap-2">
          <svg class="w-5 h-5 text-navy-600 dark:text-navy-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Hábitos y Costumbres
        </h3>
        @if (data && !isEditing()) {
          <button (click)="isEditing.set(true)" class="px-3 py-1.5 text-sm bg-primary-500 hover:bg-primary-600 text-dark-950 font-medium rounded-lg transition-colors">
            Editar
          </button>
        }
      </div>

      @if (data) {
        <div class="bg-dark-50 dark:bg-dark-900 rounded-xl p-5 space-y-4">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <!-- Smoking -->
            <div class="p-3 bg-white dark:bg-dark-800 rounded-lg border border-dark-200 dark:border-dark-700">
              <h4 class="text-xs font-semibold text-dark-500 dark:text-dark-400 uppercase tracking-wider mb-2">Tabaquismo</h4>
              <p class="text-sm font-medium text-dark-900 dark:text-dark-50">
                {{ data.smokingStatus === 'never' ? 'Nunca' : data.smokingStatus === 'former' ? 'Exfumador' : 'Fumador activo' }}
              </p>
              @if (data.smokingStatus === 'current' && data.cigarettesPerDay) {
                <p class="text-xs text-dark-500 dark:text-dark-400">{{ data.cigarettesPerDay }} cigarrillos/día</p>
              }
            </div>

            <!-- Alcohol -->
            <div class="p-3 bg-white dark:bg-dark-800 rounded-lg border border-dark-200 dark:border-dark-700">
              <h4 class="text-xs font-semibold text-dark-500 dark:text-dark-400 uppercase tracking-wider mb-2">Alcohol</h4>
              <p class="text-sm font-medium text-dark-900 dark:text-dark-50">
                {{ data.alcoholConsumption === 'never' ? 'Nunca' : data.alcoholConsumption === 'occasional' ? 'Ocasional' : data.alcoholConsumption === 'moderate' ? 'Moderado' : 'Frecuente' }}
              </p>
              @if (data.alcoholType) {
                <p class="text-xs text-dark-500 dark:text-dark-400">{{ data.alcoholType }}</p>
              }
            </div>

            <!-- Hydration -->
            <div class="p-3 bg-white dark:bg-dark-800 rounded-lg border border-dark-200 dark:border-dark-700">
              <h4 class="text-xs font-semibold text-dark-500 dark:text-dark-400 uppercase tracking-wider mb-2">Hidratación</h4>
              <p class="text-sm font-medium text-dark-900 dark:text-dark-50">{{ data.dailyWaterIntakeLiters }} L/día</p>
            </div>

            <!-- Sleep -->
            <div class="p-3 bg-white dark:bg-dark-800 rounded-lg border border-dark-200 dark:border-dark-700">
              <h4 class="text-xs font-semibold text-dark-500 dark:text-dark-400 uppercase tracking-wider mb-2">Sueño</h4>
              <p class="text-sm font-medium text-dark-900 dark:text-dark-50">{{ data.sleepHoursPerNight }} hrs/noche</p>
              <p class="text-xs text-dark-500 dark:text-dark-400">Calidad: {{ getSleepQualityLabel(data.sleepQuality) }}</p>
            </div>

            <!-- Stress -->
            <div class="p-3 bg-white dark:bg-dark-800 rounded-lg border border-dark-200 dark:border-dark-700">
              <h4 class="text-xs font-semibold text-dark-500 dark:text-dark-400 uppercase tracking-wider mb-2">Estrés</h4>
              <p class="text-sm font-medium text-dark-900 dark:text-dark-50">{{ getStressLabel(data.stressLevel) }}</p>
            </div>

            <!-- Caffeine -->
            <div class="p-3 bg-white dark:bg-dark-800 rounded-lg border border-dark-200 dark:border-dark-700">
              <h4 class="text-xs font-semibold text-dark-500 dark:text-dark-400 uppercase tracking-wider mb-2">Cafeína</h4>
              <p class="text-sm font-medium text-dark-900 dark:text-dark-50">{{ data.dailyCaffeineServings }} tazas/día</p>
            </div>
          </div>

          @if (data.usesSupplements && data.supplements && data.supplements.length > 0) {
            <div class="pt-3 border-t border-dark-200 dark:border-dark-700">
              <h4 class="text-xs font-semibold text-dark-500 dark:text-dark-400 uppercase tracking-wider mb-2">Suplementos</h4>
              <div class="flex flex-wrap gap-2">
                @for (supp of data.supplements; track supp) {
                  <span class="px-2 py-1 text-xs bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-400 rounded-lg">{{ supp }}</span>
                }
              </div>
            </div>
          }
        </div>
      } @else {
        <div class="border-2 border-dashed border-teal-300 dark:border-teal-700 rounded-xl p-8 text-center">
          <svg class="w-12 h-12 mx-auto mb-3 text-teal-400 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p class="font-medium text-dark-700 dark:text-dark-300">Sin registros</p>
          <p class="text-sm text-dark-500 dark:text-dark-400 mt-1">Agrega los hábitos y costumbres del paciente</p>
          <button (click)="isEditing.set(true)" class="mt-4 px-4 py-2 bg-primary-500 hover:bg-primary-600 text-dark-950 font-medium rounded-lg transition-colors text-sm">
            Agregar
          </button>
        </div>
      }
    </div>
  `
})
export class HabitsCustomsSectionComponent {
  @Input() data: HabitsAndCustoms | null = null;
  isEditing = signal(false);

  getSleepQualityLabel(quality: string): string {
    const labels: Record<string, string> = { poor: 'Mala', fair: 'Regular', good: 'Buena', excellent: 'Excelente' };
    return labels[quality] || quality;
  }

  getStressLabel(level: string): string {
    const labels: Record<string, string> = { low: 'Bajo', moderate: 'Moderado', high: 'Alto', very_high: 'Muy Alto' };
    return labels[level] || level;
  }
}
