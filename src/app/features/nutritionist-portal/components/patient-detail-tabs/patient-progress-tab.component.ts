import { Component, input, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PatientComplete, PatientMetrics } from '../../models/nutritionist.model';

@Component({
  selector: 'app-patient-progress-tab',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="space-y-6">
      @if (patient()) {
        <!-- Current Metrics Summary -->
        <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <!-- Current Weight -->
          <div class="bg-dark-50 dark:bg-dark-900 rounded-xl p-4">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                <svg class="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
                </svg>
              </div>
              <div>
                <p class="text-2xl font-bold text-dark-900 dark:text-dark-50">
                  {{ currentMetrics()?.weight || '—' }} <span class="text-sm font-normal">kg</span>
                </p>
                <p class="text-xs text-dark-500">Peso actual</p>
              </div>
            </div>
          </div>

          <!-- BMI -->
          <div class="bg-dark-50 dark:bg-dark-900 rounded-xl p-4">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-lg flex items-center justify-center" [class]="getBmiColorClass()">
                <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <div>
                <p class="text-2xl font-bold text-dark-900 dark:text-dark-50">
                  {{ currentMetrics()?.bmi?.toFixed(1) || '—' }}
                </p>
                <p class="text-xs text-dark-500">IMC - {{ getBmiCategory() }}</p>
              </div>
            </div>
          </div>

          <!-- Height -->
          <div class="bg-dark-50 dark:bg-dark-900 rounded-xl p-4">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                <svg class="w-5 h-5 text-purple-600 dark:text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <p class="text-2xl font-bold text-dark-900 dark:text-dark-50">
                  {{ currentMetrics()?.height || '—' }} <span class="text-sm font-normal">cm</span>
                </p>
                <p class="text-xs text-dark-500">Estatura</p>
              </div>
            </div>
          </div>

          <!-- Body Fat -->
          <div class="bg-dark-50 dark:bg-dark-900 rounded-xl p-4">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 bg-amber-100 dark:bg-amber-900/30 rounded-lg flex items-center justify-center">
                <svg class="w-5 h-5 text-amber-600 dark:text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div>
                <p class="text-2xl font-bold text-dark-900 dark:text-dark-50">
                  {{ currentMetrics()?.bodyFatPercentage?.toFixed(1) || '—' }} <span class="text-sm font-normal">%</span>
                </p>
                <p class="text-xs text-dark-500">Grasa corporal</p>
              </div>
            </div>
          </div>
        </div>

        <!-- BMI Scale -->
        <div class="bg-dark-50 dark:bg-dark-900 rounded-xl p-6">
          <h4 class="text-sm font-medium text-dark-700 dark:text-dark-300 mb-4">Escala de IMC</h4>
          <div class="relative">
            <div class="flex h-4 rounded-full overflow-hidden">
              <div class="w-[18.5%] bg-blue-400" title="Bajo peso"></div>
              <div class="w-[6.4%] bg-green-400" title="Normal"></div>
              <div class="w-[5%] bg-yellow-400" title="Sobrepeso"></div>
              <div class="w-[5%] bg-orange-400" title="Obesidad I"></div>
              <div class="w-[5%] bg-red-400" title="Obesidad II"></div>
              <div class="flex-1 bg-red-600" title="Obesidad III"></div>
            </div>
            <div class="flex justify-between mt-2 text-xs text-dark-500">
              <span>0</span>
              <span>18.5</span>
              <span>25</span>
              <span>30</span>
              <span>35</span>
              <span>40+</span>
            </div>
            @if (currentMetrics()?.bmi) {
              <div
                class="absolute top-0 w-0.5 h-6 bg-dark-900 dark:bg-dark-50 -translate-x-1/2"
                [style.left.%]="getBmiPosition()"
              >
                <div class="absolute -top-6 left-1/2 -translate-x-1/2 bg-dark-900 dark:bg-dark-50 text-white dark:text-dark-900 text-xs px-2 py-0.5 rounded">
                  {{ currentMetrics()!.bmi.toFixed(1) }}
                </div>
              </div>
            }
          </div>
          <div class="flex flex-wrap gap-4 mt-4 text-xs">
            <span class="flex items-center gap-1"><span class="w-3 h-3 bg-blue-400 rounded"></span> Bajo peso (&lt;18.5)</span>
            <span class="flex items-center gap-1"><span class="w-3 h-3 bg-green-400 rounded"></span> Normal (18.5-24.9)</span>
            <span class="flex items-center gap-1"><span class="w-3 h-3 bg-yellow-400 rounded"></span> Sobrepeso (25-29.9)</span>
            <span class="flex items-center gap-1"><span class="w-3 h-3 bg-orange-400 rounded"></span> Obesidad I (30-34.9)</span>
            <span class="flex items-center gap-1"><span class="w-3 h-3 bg-red-400 rounded"></span> Obesidad II (35-39.9)</span>
            <span class="flex items-center gap-1"><span class="w-3 h-3 bg-red-600 rounded"></span> Obesidad III (40+)</span>
          </div>
        </div>

        <!-- Weight History Chart -->
        <div class="bg-dark-50 dark:bg-dark-900 rounded-xl p-6">
          <div class="flex items-center justify-between mb-4">
            <h4 class="text-sm font-medium text-dark-700 dark:text-dark-300">Historial de Peso</h4>
            <span class="text-xs text-dark-500">Últimos {{ metricsHistory().length }} registros</span>
          </div>

          @if (metricsHistory().length > 0) {
            <div class="h-48 flex items-end gap-2">
              @for (metric of metricsHistory(); track metric.id) {
                <div class="flex-1 flex flex-col items-center gap-1">
                  <span class="text-xs font-medium text-dark-700 dark:text-dark-300">
                    {{ metric.weight }}
                  </span>
                  <div
                    class="w-full bg-teal-500 rounded-t transition-all hover:bg-teal-600"
                    [style.height.%]="getBarHeight(metric.weight)"
                    [title]="metric.weight + ' kg - ' + formatDate(metric.date)"
                  ></div>
                  <span class="text-xs text-dark-500 truncate max-w-full">
                    {{ formatShortDate(metric.date) }}
                  </span>
                </div>
              }
            </div>

            <!-- Weight change summary -->
            <div class="mt-4 pt-4 border-t border-dark-200 dark:border-dark-700">
              <div class="flex items-center justify-between">
                <span class="text-sm text-dark-600 dark:text-dark-400">Cambio total:</span>
                <span
                  class="text-sm font-semibold"
                  [class]="weightChange() >= 0 ? 'text-red-500' : 'text-green-500'"
                >
                  {{ weightChange() >= 0 ? '+' : '' }}{{ weightChange().toFixed(1) }} kg
                </span>
              </div>
            </div>
          } @else {
            <div class="h-48 flex items-center justify-center text-dark-500">
              <p>No hay registros de peso aún</p>
            </div>
          }
        </div>

        <!-- Add New Measurement -->
        <div class="bg-teal-50 dark:bg-teal-900/20 rounded-xl p-6 border border-teal-200 dark:border-teal-800">
          <div class="flex items-start gap-4">
            <div class="w-10 h-10 bg-teal-500 rounded-lg flex items-center justify-center flex-shrink-0">
              <svg class="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
              </svg>
            </div>
            <div class="flex-1">
              <h4 class="font-medium text-dark-900 dark:text-dark-50">Registrar nueva medición</h4>
              <p class="text-sm text-dark-600 dark:text-dark-400 mt-1">
                Agrega un nuevo registro de peso y medidas corporales del paciente
              </p>
              <button class="mt-3 px-4 py-2 bg-primary-500 hover:bg-primary-600 text-dark-950 font-medium rounded-lg transition-colors text-sm">
                Nueva Medición
              </button>
            </div>
          </div>
        </div>
      }
    </div>
  `
})
export class PatientProgressTabComponent {
  patient = input<PatientComplete | null>(null);

  currentMetrics = computed(() => this.patient()?.currentMetrics);

  metricsHistory = computed(() => {
    const history = this.patient()?.metricsHistory || [];
    return history.slice(-10).reverse();
  });

  weightChange = computed(() => {
    const history = this.metricsHistory();
    if (history.length < 2) return 0;
    return history[0]!.weight - history[history.length - 1]!.weight;
  });

  getBmiColorClass(): string {
    const bmi = this.currentMetrics()?.bmi;
    if (!bmi) return 'bg-dark-100 dark:bg-dark-700 text-dark-500';
    if (bmi < 18.5) return 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400';
    if (bmi < 25) return 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400';
    if (bmi < 30) return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400';
    if (bmi < 35) return 'bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400';
    return 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400';
  }

  getBmiCategory(): string {
    const bmi = this.currentMetrics()?.bmi;
    if (!bmi) return 'Sin datos';
    if (bmi < 18.5) return 'Bajo peso';
    if (bmi < 25) return 'Normal';
    if (bmi < 30) return 'Sobrepeso';
    if (bmi < 35) return 'Obesidad I';
    if (bmi < 40) return 'Obesidad II';
    return 'Obesidad III';
  }

  getBmiPosition(): number {
    const bmi = this.currentMetrics()?.bmi || 0;
    return Math.min(Math.max((bmi / 45) * 100, 0), 100);
  }

  getBarHeight(weight: number): number {
    const history = this.metricsHistory();
    if (history.length === 0) return 0;
    const weights = history.map(m => m.weight);
    const min = Math.min(...weights) - 5;
    const max = Math.max(...weights) + 5;
    return ((weight - min) / (max - min)) * 100;
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('es-MX', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  }

  formatShortDate(date: Date): string {
    return new Date(date).toLocaleDateString('es-MX', {
      day: 'numeric',
      month: 'short'
    });
  }
}
