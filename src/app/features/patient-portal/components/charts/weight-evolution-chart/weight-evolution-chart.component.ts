import { Component, input, computed, signal, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface WeightDataPoint {
  date: Date;
  weight: number;
}

export type TimeRange = '1m' | '3m' | '6m' | '1y' | 'all';

@Component({
  selector: 'app-weight-evolution-chart',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="space-y-4">
      <!-- Time range selector -->
      <div class="flex items-center justify-between">
        <h3 class="text-lg font-semibold text-dark-900 dark:text-dark-50">
          Evolución de peso
        </h3>
        <div class="flex gap-1 bg-dark-100 dark:bg-dark-700 rounded-lg p-1">
          @for (range of timeRanges; track range.value) {
            <button
              type="button"
              (click)="selectedRange.set(range.value)"
              [class.bg-white]="selectedRange() === range.value"
              [class.dark:bg-dark-600]="selectedRange() === range.value"
              [class.shadow-sm]="selectedRange() === range.value"
              [class.text-dark-900]="selectedRange() === range.value"
              [class.dark:text-dark-50]="selectedRange() === range.value"
              class="px-3 py-1.5 text-sm rounded-md transition-colors text-dark-600 dark:text-dark-400"
              [attr.aria-pressed]="selectedRange() === range.value"
            >
              {{ range.label }}
            </button>
          }
        </div>
      </div>

      <!-- Chart -->
      <div class="relative h-64 bg-dark-50 dark:bg-dark-900 rounded-lg p-4">
        @if (filteredData().length > 1) {
          <!-- SVG Line Chart -->
          <svg
            viewBox="0 0 400 200"
            class="w-full h-full"
            preserveAspectRatio="none"
            role="img"
            [attr.aria-label]="'Gráfico de evolución de peso mostrando ' + filteredData().length + ' registros'"
          >
            <!-- Grid lines -->
            <g class="stroke-dark-200 dark:stroke-dark-700" stroke-width="0.5">
              @for (i of [0, 1, 2, 3, 4]; track i) {
                <line
                  [attr.x1]="40"
                  [attr.y1]="i * 40 + 20"
                  [attr.x2]="380"
                  [attr.y2]="i * 40 + 20"
                />
              }
            </g>

            <!-- Y-axis labels -->
            <g class="fill-dark-500 text-[10px]">
              @for (label of yAxisLabels(); track label.value) {
                <text
                  [attr.x]="35"
                  [attr.y]="label.y + 3"
                  text-anchor="end"
                >
                  {{ label.value }}
                </text>
              }
            </g>

            <!-- Target weight line (dashed) -->
            @if (targetWeight()) {
              <line
                [attr.x1]="40"
                [attr.y1]="getYPosition(targetWeight()!)"
                [attr.x2]="380"
                [attr.y2]="getYPosition(targetWeight()!)"
                class="stroke-teal-500"
                stroke-width="1"
                stroke-dasharray="5,5"
              />
              <text
                [attr.x]="385"
                [attr.y]="getYPosition(targetWeight()!) + 3"
                class="fill-teal-500 text-[9px]"
              >
                Meta
              </text>
            }

            <!-- Gradient definition -->
            <defs>
              <linearGradient id="weightGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stop-color="#3D9488" stop-opacity="0.4"/>
                <stop offset="100%" stop-color="#3D9488" stop-opacity="0.05"/>
              </linearGradient>
            </defs>

            <!-- Area fill -->
            <path
              [attr.d]="areaPath()"
              fill="url(#weightGradient)"
            />

            <!-- Line -->
            <path
              [attr.d]="linePath()"
              fill="none"
              class="stroke-teal-500"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />

            <!-- Data points -->
            @for (point of chartPoints(); track $index) {
              <circle
                [attr.cx]="point.x"
                [attr.cy]="point.y"
                r="4"
                class="fill-teal-500 stroke-white dark:stroke-dark-900"
                stroke-width="2"
              />
            }
          </svg>

          <!-- X-axis labels -->
          <div class="absolute bottom-0 left-10 right-4 flex justify-between text-xs text-dark-500">
            @for (label of xAxisLabels(); track label) {
              <span>{{ label }}</span>
            }
          </div>
        } @else {
          <!-- Empty/insufficient data state -->
          <div class="flex flex-col items-center justify-center h-full text-center">
            <svg class="w-12 h-12 text-dark-300 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            <p class="text-dark-500">No hay suficientes datos</p>
            <p class="text-xs text-dark-400 mt-1">
              Se necesitan al menos 2 registros para mostrar el gráfico
            </p>
          </div>
        }
      </div>

      <!-- Summary stats -->
      @if (filteredData().length > 0) {
        <div class="grid grid-cols-3 gap-4 text-center">
          <div class="p-3 bg-dark-50 dark:bg-dark-900 rounded-lg">
            <p class="text-sm text-dark-500">Inicial</p>
            <p class="text-lg font-bold text-dark-900 dark:text-dark-50">
              {{ firstWeight() | number:'1.1-1' }} kg
            </p>
          </div>
          <div class="p-3 bg-dark-50 dark:bg-dark-900 rounded-lg">
            <p class="text-sm text-dark-500">Actual</p>
            <p class="text-lg font-bold text-dark-900 dark:text-dark-50">
              {{ lastWeight() | number:'1.1-1' }} kg
            </p>
          </div>
          <div class="p-3 rounded-lg" [class]="changeClass()">
            <p class="text-sm opacity-80">Cambio</p>
            <p class="text-lg font-bold">
              {{ weightChange() > 0 ? '+' : '' }}{{ weightChange() | number:'1.1-1' }} kg
            </p>
          </div>
        </div>
      }
    </div>
  `
})
export class WeightEvolutionChartComponent {
  data = input.required<WeightDataPoint[]>();
  targetWeight = input<number>();

  selectedRange = signal<TimeRange>('3m');

  readonly timeRanges = [
    { value: '1m' as TimeRange, label: '1M' },
    { value: '3m' as TimeRange, label: '3M' },
    { value: '6m' as TimeRange, label: '6M' },
    { value: '1y' as TimeRange, label: '1A' },
    { value: 'all' as TimeRange, label: 'Todo' }
  ];

  // Chart dimensions
  private readonly chartLeft = 40;
  private readonly chartRight = 380;
  private readonly chartTop = 20;
  private readonly chartBottom = 180;
  private readonly chartWidth = this.chartRight - this.chartLeft;
  private readonly chartHeight = this.chartBottom - this.chartTop;

  filteredData = computed(() => {
    const allData = this.data();
    const range = this.selectedRange();
    const now = new Date();

    let cutoffDate: Date;
    switch (range) {
      case '1m':
        cutoffDate = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
        break;
      case '3m':
        cutoffDate = new Date(now.getFullYear(), now.getMonth() - 3, now.getDate());
        break;
      case '6m':
        cutoffDate = new Date(now.getFullYear(), now.getMonth() - 6, now.getDate());
        break;
      case '1y':
        cutoffDate = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());
        break;
      case 'all':
      default:
        return [...allData].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    }

    return allData
      .filter(d => new Date(d.date) >= cutoffDate)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  });

  // Calculate min/max for Y axis
  private minWeight = computed(() => {
    const weights = this.filteredData().map(d => d.weight);
    const target = this.targetWeight();
    if (target) weights.push(target);
    return Math.floor(Math.min(...weights) - 2);
  });

  private maxWeight = computed(() => {
    const weights = this.filteredData().map(d => d.weight);
    const target = this.targetWeight();
    if (target) weights.push(target);
    return Math.ceil(Math.max(...weights) + 2);
  });

  yAxisLabels = computed(() => {
    const min = this.minWeight();
    const max = this.maxWeight();
    const step = (max - min) / 4;
    return [0, 1, 2, 3, 4].map(i => ({
      value: Math.round(max - i * step),
      y: this.chartTop + i * 40
    }));
  });

  xAxisLabels = computed(() => {
    const data = this.filteredData();
    if (data.length === 0) return [];

    // Show up to 5 labels
    const labelCount = Math.min(5, data.length);
    const step = Math.max(1, Math.floor(data.length / (labelCount - 1)));
    const labels: string[] = [];

    for (let i = 0; i < data.length; i += step) {
      const date = new Date(data[i]!.date);
      labels.push(date.toLocaleDateString('es-MX', { month: 'short', day: 'numeric' }));
    }

    // Always include last date
    const lastDate = new Date(data[data.length - 1]!.date);
    const lastLabel = lastDate.toLocaleDateString('es-MX', { month: 'short', day: 'numeric' });
    if (labels[labels.length - 1] !== lastLabel) {
      labels.push(lastLabel);
    }

    return labels.slice(0, 5);
  });

  chartPoints = computed(() => {
    const data = this.filteredData();
    if (data.length === 0) return [];

    const min = this.minWeight();
    const max = this.maxWeight();

    return data.map((point, index) => ({
      x: this.chartLeft + (index / (data.length - 1)) * this.chartWidth,
      y: this.getYPosition(point.weight),
      weight: point.weight,
      date: point.date
    }));
  });

  linePath = computed(() => {
    const points = this.chartPoints();
    if (points.length < 2) return '';

    return points
      .map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`)
      .join(' ');
  });

  areaPath = computed(() => {
    const points = this.chartPoints();
    if (points.length < 2) return '';

    const linePath = this.linePath();
    const firstX = points[0]!.x;
    const lastX = points[points.length - 1]!.x;

    return `${linePath} L ${lastX} ${this.chartBottom} L ${firstX} ${this.chartBottom} Z`;
  });

  firstWeight = computed(() => {
    const data = this.filteredData();
    return data.length > 0 ? data[0]!.weight : 0;
  });

  lastWeight = computed(() => {
    const data = this.filteredData();
    return data.length > 0 ? data[data.length - 1]!.weight : 0;
  });

  weightChange = computed(() => {
    return this.lastWeight() - this.firstWeight();
  });

  changeClass = computed(() => {
    const change = this.weightChange();
    if (change < 0) {
      return 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300';
    }
    if (change > 0) {
      return 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300';
    }
    return 'bg-dark-50 dark:bg-dark-900 text-dark-700 dark:text-dark-300';
  });

  getYPosition(weight: number): number {
    const min = this.minWeight();
    const max = this.maxWeight();
    const normalizedValue = (weight - min) / (max - min);
    return this.chartBottom - normalizedValue * this.chartHeight;
  }
}
