import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PatientPortalFacade } from '../../facades/patient-portal.facade';
import { TimeRange, BmiCategory } from '../../models/patient.model';
import { BmiScaleComponent } from '../../components/charts/bmi-scale/bmi-scale.component';
import { WeightEvolutionChartComponent, WeightDataPoint } from '../../components/charts/weight-evolution-chart/weight-evolution-chart.component';

@Component({
  selector: 'app-patient-progress',
  standalone: true,
  imports: [CommonModule, BmiScaleComponent, WeightEvolutionChartComponent],
  template: `
    <div class="space-y-6">
      <!-- Page header -->
      <div>
        <h1 class="text-2xl font-display font-bold text-dark-900 dark:text-dark-50">
          Mi Progreso
        </h1>
        <p class="mt-1 text-dark-600 dark:text-dark-400">
          Visualiza tu evolución y métricas corporales
        </p>
      </div>

      @if (isLoading()) {
        <!-- Loading state -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          @for (i of [1, 2, 3, 4]; track i) {
            <div class="bg-white dark:bg-dark-800 rounded-xl p-6 animate-pulse">
              <div class="h-4 bg-dark-200 dark:bg-dark-700 rounded w-1/2 mb-2"></div>
              <div class="h-8 bg-dark-200 dark:bg-dark-700 rounded w-2/3"></div>
            </div>
          }
        </div>
      } @else {
        <!-- Metrics cards -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <!-- Current weight -->
          <div class="bg-white dark:bg-dark-800 rounded-xl border border-dark-200 dark:border-dark-700 p-6">
            <p class="text-sm text-dark-500 mb-1">Peso actual</p>
            <p class="text-3xl font-bold text-dark-900 dark:text-dark-50">
              {{ currentMetrics()?.weight | number:'1.1-1' }}
              <span class="text-lg font-normal text-dark-500">kg</span>
            </p>
          </div>

          <!-- BMI -->
          <div class="bg-white dark:bg-dark-800 rounded-xl border border-dark-200 dark:border-dark-700 p-6">
            <p class="text-sm text-dark-500 mb-1">IMC</p>
            <div class="flex items-baseline gap-2">
              <p class="text-3xl font-bold" [class]="getBmiColorClass(currentMetrics()?.bmi)">
                {{ currentMetrics()?.bmi | number:'1.1-1' }}
              </p>
              <span class="text-sm font-medium" [class]="getBmiColorClass(currentMetrics()?.bmi)">
                {{ getBmiLabel(currentMetrics()?.bmi) }}
              </span>
            </div>
          </div>

          <!-- Body fat -->
          <div class="bg-white dark:bg-dark-800 rounded-xl border border-dark-200 dark:border-dark-700 p-6">
            <p class="text-sm text-dark-500 mb-1">Grasa corporal</p>
            <p class="text-3xl font-bold text-dark-900 dark:text-dark-50">
              {{ currentMetrics()?.bodyFatPercentage | number:'1.0-0' }}
              <span class="text-lg font-normal text-dark-500">%</span>
            </p>
          </div>

          <!-- Goal -->
          <div class="bg-white dark:bg-dark-800 rounded-xl border border-dark-200 dark:border-dark-700 p-6">
            <p class="text-sm text-dark-500 mb-1">Meta</p>
            <p class="text-3xl font-bold text-teal-600 dark:text-teal-400">
              {{ targetWeight() }}
              <span class="text-lg font-normal text-dark-500">kg</span>
            </p>
            @if (weightToGoal() !== null) {
              <p class="text-sm text-dark-500 mt-1">
                @if (weightToGoal()! > 0) {
                  Faltan {{ weightToGoal() | number:'1.1-1' }} kg
                } @else {
                  ¡Meta alcanzada!
                }
              </p>
            }
          </div>
        </div>

        <!-- BMI Scale -->
        @if (currentMetrics()?.bmi) {
          <div class="bg-white dark:bg-dark-800 rounded-xl border border-dark-200 dark:border-dark-700 p-6">
            <h2 class="text-lg font-semibold text-dark-900 dark:text-dark-50 mb-4">
              Índice de Masa Corporal (IMC)
            </h2>
            <app-bmi-scale [bmi]="currentMetrics()!.bmi" />
          </div>
        }

        <!-- Weight evolution chart -->
        <div class="bg-white dark:bg-dark-800 rounded-xl border border-dark-200 dark:border-dark-700 p-6">
          <app-weight-evolution-chart
            [data]="chartData()"
            [targetWeight]="chartTargetWeight()"
          />
        </div>

        <!-- Before/After comparison -->
        <div class="bg-white dark:bg-dark-800 rounded-xl border border-dark-200 dark:border-dark-700 p-6">
          <h2 class="text-lg font-semibold text-dark-900 dark:text-dark-50 mb-4">
            Tu progreso
          </h2>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
            <!-- Initial -->
            <div class="text-center p-4 bg-dark-50 dark:bg-dark-900 rounded-lg">
              <p class="text-sm text-dark-500 mb-2">INICIO</p>
              <p class="text-3xl font-bold text-dark-700 dark:text-dark-300">
                {{ initialWeight() }} kg
              </p>
              <p class="text-xs text-dark-400 mt-1">Agosto 2024</p>
            </div>

            <!-- Arrow -->
            <div class="flex justify-center">
              <div class="flex items-center gap-2">
                <div class="h-0.5 w-8 bg-teal-500"></div>
                <svg class="w-6 h-6 text-teal-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </div>
            </div>

            <!-- Current -->
            <div class="text-center p-4 bg-teal-50 dark:bg-teal-900/20 rounded-lg">
              <p class="text-sm text-teal-600 dark:text-teal-400 mb-2">ACTUAL</p>
              <p class="text-3xl font-bold text-teal-700 dark:text-teal-300">
                {{ currentMetrics()?.weight | number:'1.1-1' }} kg
              </p>
              <p class="text-xs text-teal-500 mt-1">Enero 2025</p>
            </div>
          </div>

          <!-- Result -->
          @if (weightLost() !== null) {
            <div class="mt-6 text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <div class="flex items-center justify-center gap-2 mb-1">
                <svg class="w-6 h-6 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p class="text-2xl font-bold text-green-600 dark:text-green-400">
                  {{ weightLost() | number:'1.1-1' }} kg perdidos
                </p>
              </div>
              <p class="text-sm text-green-600 dark:text-green-400">
                Excelente progreso
              </p>
            </div>
          }
        </div>

        <!-- Measurements table -->
        <div class="bg-white dark:bg-dark-800 rounded-xl border border-dark-200 dark:border-dark-700 p-6">
          <h2 class="text-lg font-semibold text-dark-900 dark:text-dark-50 mb-4">
            Medidas corporales
          </h2>
          <div class="overflow-x-auto">
            <table class="w-full text-sm">
              <thead>
                <tr class="border-b border-dark-200 dark:border-dark-700">
                  <th class="text-left py-3 px-4 text-dark-500 font-medium">Medida</th>
                  <th class="text-center py-3 px-4 text-dark-500 font-medium">Inicial</th>
                  <th class="text-center py-3 px-4 text-dark-500 font-medium">Actual</th>
                  <th class="text-center py-3 px-4 text-dark-500 font-medium">Cambio</th>
                </tr>
              </thead>
              <tbody>
                @for (measurement of measurementRows; track measurement.label) {
                  <tr class="border-b border-dark-100 dark:border-dark-700">
                    <td class="py-3 px-4 text-dark-900 dark:text-dark-50">{{ measurement.label }}</td>
                    <td class="py-3 px-4 text-center text-dark-600 dark:text-dark-400">{{ measurement.initial }} cm</td>
                    <td class="py-3 px-4 text-center text-dark-900 dark:text-dark-50">{{ measurement.current }} cm</td>
                    <td class="py-3 px-4 text-center">
                      <span class="font-medium" [class]="measurement.change < 0 ? 'text-green-600' : 'text-red-600'">
                        {{ measurement.change > 0 ? '+' : '' }}{{ measurement.change }} cm
                      </span>
                    </td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
          <p class="text-xs text-dark-500 mt-4">
            Última actualización: {{ currentMeasurements()?.date | date:'d MMM yyyy':'':'es-MX' }}
          </p>
        </div>

        <!-- Metrics history -->
        <div class="bg-white dark:bg-dark-800 rounded-xl border border-dark-200 dark:border-dark-700 p-6">
          <h2 class="text-lg font-semibold text-dark-900 dark:text-dark-50 mb-4">
            Historial de registros
          </h2>
          <div class="overflow-x-auto">
            <table class="w-full text-sm">
              <thead>
                <tr class="border-b border-dark-200 dark:border-dark-700">
                  <th class="text-left py-3 px-4 text-dark-500 font-medium">Fecha</th>
                  <th class="text-center py-3 px-4 text-dark-500 font-medium">Peso</th>
                  <th class="text-center py-3 px-4 text-dark-500 font-medium">IMC</th>
                  <th class="text-center py-3 px-4 text-dark-500 font-medium">Grasa</th>
                  <th class="text-left py-3 px-4 text-dark-500 font-medium">Registrado por</th>
                </tr>
              </thead>
              <tbody>
                @for (record of metricsHistory(); track record.id) {
                  <tr class="border-b border-dark-100 dark:border-dark-700">
                    <td class="py-3 px-4 text-dark-900 dark:text-dark-50">
                      {{ record.date | date:'d MMM yyyy':'':'es-MX' }}
                    </td>
                    <td class="py-3 px-4 text-center text-dark-900 dark:text-dark-50">
                      {{ record.weight | number:'1.1-1' }} kg
                    </td>
                    <td class="py-3 px-4 text-center">
                      <span [class]="getBmiColorClass(record.bmi)">
                        {{ record.bmi | number:'1.1-1' }}
                      </span>
                    </td>
                    <td class="py-3 px-4 text-center text-dark-600 dark:text-dark-400">
                      {{ record.bodyFatPercentage }}%
                    </td>
                    <td class="py-3 px-4 text-dark-600 dark:text-dark-400">
                      {{ record.registeredBy }}
                    </td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        </div>
      }
    </div>
  `
})
export class PatientProgressComponent implements OnInit {
  private readonly facade = inject(PatientPortalFacade);

  readonly isLoading = this.facade.isLoading;
  readonly currentMetrics = this.facade.currentMetrics;
  readonly metricsHistory = this.facade.metricsHistory;
  readonly currentMeasurements = this.facade.currentMeasurements;
  readonly weightHistory = this.facade.weightHistory;
  readonly targetWeight = this.facade.targetWeight;
  readonly initialWeight = this.facade.initialWeight;
  readonly weightLost = this.facade.weightLost;
  readonly weightToGoal = this.facade.weightToGoal;

  // Transform weight history to chart data format
  chartData = computed((): WeightDataPoint[] => {
    return this.weightHistory().map(record => ({
      date: record.date,
      weight: record.weight
    }));
  });

  // Transform targetWeight from null to undefined for component compatibility
  chartTargetWeight = computed((): number | undefined => {
    const target = this.targetWeight();
    return target ?? undefined;
  });

  selectedRange = signal<TimeRange>('3m');

  readonly timeRanges = [
    { value: '1m' as TimeRange, label: '1M' },
    { value: '3m' as TimeRange, label: '3M' },
    { value: '6m' as TimeRange, label: '6M' },
    { value: '1y' as TimeRange, label: '1A' },
    { value: 'all' as TimeRange, label: 'Todo' }
  ];

  // Mock measurement data - would come from store in real implementation
  measurementRows = [
    { label: 'Cintura', initial: 92, current: 85, change: -7 },
    { label: 'Cadera', initial: 98, current: 94, change: -4 },
    { label: 'Pecho', initial: 102, current: 99, change: -3 },
    { label: 'Brazo', initial: 32, current: 31, change: -1 },
    { label: 'Muslo', initial: 58, current: 55, change: -3 }
  ];

  ngOnInit(): void {
    this.facade.loadProgress();
  }

  getBmiColorClass(bmi: number | undefined): string {
    if (!bmi) return 'text-dark-500';
    if (bmi < 18.5) return 'text-blue-600 dark:text-blue-400';
    if (bmi < 25) return 'text-green-600 dark:text-green-400';
    if (bmi < 30) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  }

  getBmiLabel(bmi: number | undefined): string {
    if (!bmi) return '';
    if (bmi < 18.5) return 'Bajo peso';
    if (bmi < 25) return 'Normal';
    if (bmi < 30) return 'Sobrepeso';
    return 'Obesidad';
  }

  getBmiPosition(bmi: number): number {
    // Map BMI 15-40 to 0-100%
    const min = 15;
    const max = 40;
    const clamped = Math.max(min, Math.min(max, bmi));
    return ((clamped - min) / (max - min)) * 100;
  }

  getTimeRangeLabel(): string {
    const labels: Record<TimeRange, string> = {
      '1m': '1 mes',
      '3m': '3 meses',
      '6m': '6 meses',
      '1y': '1 año',
      'all': 'todo el tiempo'
    };
    return labels[this.selectedRange()];
  }
}
