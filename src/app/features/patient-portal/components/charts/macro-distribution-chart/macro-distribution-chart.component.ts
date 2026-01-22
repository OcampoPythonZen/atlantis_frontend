import { Component, input, computed } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';

export interface MacroData {
  protein: number;
  carbohydrates: number;
  fat: number;
}

@Component({
  selector: 'app-macro-distribution-chart',
  standalone: true,
  imports: [CommonModule, DecimalPipe],
  template: `
    <div class="flex flex-col items-center">
      <!-- Donut chart using SVG -->
      <div class="relative w-48 h-48">
        <svg
          viewBox="0 0 100 100"
          class="w-full h-full -rotate-90"
          role="img"
          [attr.aria-label]="ariaLabel()"
        >
          <!-- Background circle -->
          <circle
            cx="50"
            cy="50"
            r="40"
            fill="none"
            class="stroke-dark-200 dark:stroke-dark-700"
            stroke-width="12"
          />

          <!-- Protein segment (purple) -->
          <circle
            cx="50"
            cy="50"
            r="40"
            fill="none"
            class="stroke-purple-500"
            stroke-width="12"
            [attr.stroke-dasharray]="proteinDash()"
            stroke-dashoffset="0"
            stroke-linecap="round"
          />

          <!-- Carbs segment (amber) -->
          <circle
            cx="50"
            cy="50"
            r="40"
            fill="none"
            class="stroke-amber-500"
            stroke-width="12"
            [attr.stroke-dasharray]="carbsDash()"
            [attr.stroke-dashoffset]="carbsOffset()"
            stroke-linecap="round"
          />

          <!-- Fat segment (pink) -->
          <circle
            cx="50"
            cy="50"
            r="40"
            fill="none"
            class="stroke-pink-500"
            stroke-width="12"
            [attr.stroke-dasharray]="fatDash()"
            [attr.stroke-dashoffset]="fatOffset()"
            stroke-linecap="round"
          />
        </svg>

        <!-- Center content -->
        <div class="absolute inset-0 flex flex-col items-center justify-center">
          <span class="text-2xl font-bold text-dark-900 dark:text-dark-50">
            {{ totalCalories() | number:'1.0-0' }}
          </span>
          <span class="text-sm text-dark-500">kcal</span>
        </div>
      </div>

      <!-- Legend -->
      <div class="mt-6 grid grid-cols-3 gap-4 w-full max-w-xs">
        <!-- Protein -->
        <div class="text-center">
          <div class="flex items-center justify-center gap-1.5 mb-1">
            <div class="w-3 h-3 bg-purple-500 rounded-full"></div>
            <span class="text-xs text-dark-500 dark:text-dark-400">Proteína</span>
          </div>
          <p class="text-lg font-bold text-purple-600 dark:text-purple-400">
            {{ macros().protein }}g
          </p>
          <p class="text-xs text-dark-400">{{ proteinPercent() | number:'1.0-0' }}%</p>
        </div>

        <!-- Carbs -->
        <div class="text-center">
          <div class="flex items-center justify-center gap-1.5 mb-1">
            <div class="w-3 h-3 bg-amber-500 rounded-full"></div>
            <span class="text-xs text-dark-500 dark:text-dark-400">Carbos</span>
          </div>
          <p class="text-lg font-bold text-amber-600 dark:text-amber-400">
            {{ macros().carbohydrates }}g
          </p>
          <p class="text-xs text-dark-400">{{ carbsPercent() | number:'1.0-0' }}%</p>
        </div>

        <!-- Fat -->
        <div class="text-center">
          <div class="flex items-center justify-center gap-1.5 mb-1">
            <div class="w-3 h-3 bg-pink-500 rounded-full"></div>
            <span class="text-xs text-dark-500 dark:text-dark-400">Grasas</span>
          </div>
          <p class="text-lg font-bold text-pink-600 dark:text-pink-400">
            {{ macros().fat }}g
          </p>
          <p class="text-xs text-dark-400">{{ fatPercent() | number:'1.0-0' }}%</p>
        </div>
      </div>
    </div>
  `
})
export class MacroDistributionChartComponent {
  macros = input.required<MacroData>();

  private readonly circumference = 2 * Math.PI * 40; // 2πr where r=40

  // Calculate total calories from macros
  // Protein: 4 kcal/g, Carbs: 4 kcal/g, Fat: 9 kcal/g
  totalCalories = computed(() => {
    const m = this.macros();
    return (m.protein * 4) + (m.carbohydrates * 4) + (m.fat * 9);
  });

  // Accessible label for screen readers
  ariaLabel = computed(() => {
    const m = this.macros();
    const proteinPct = Math.round(this.proteinPercent());
    const carbsPct = Math.round(this.carbsPercent());
    const fatPct = Math.round(this.fatPercent());
    const totalCal = Math.round(this.totalCalories());
    return `Distribución de macronutrientes: ${m.protein}g de proteína (${proteinPct}%), ${m.carbohydrates}g de carbohidratos (${carbsPct}%), ${m.fat}g de grasas (${fatPct}%). Total: ${totalCal} kcal`;
  });

  // Calculate percentages
  proteinPercent = computed(() => {
    const m = this.macros();
    const proteinCal = m.protein * 4;
    return (proteinCal / this.totalCalories()) * 100;
  });

  carbsPercent = computed(() => {
    const m = this.macros();
    const carbsCal = m.carbohydrates * 4;
    return (carbsCal / this.totalCalories()) * 100;
  });

  fatPercent = computed(() => {
    const m = this.macros();
    const fatCal = m.fat * 9;
    return (fatCal / this.totalCalories()) * 100;
  });

  // SVG dash arrays for donut segments
  proteinDash = computed(() => {
    const percent = this.proteinPercent() / 100;
    const dash = this.circumference * percent;
    return `${dash} ${this.circumference}`;
  });

  carbsDash = computed(() => {
    const percent = this.carbsPercent() / 100;
    const dash = this.circumference * percent;
    return `${dash} ${this.circumference}`;
  });

  fatDash = computed(() => {
    const percent = this.fatPercent() / 100;
    const dash = this.circumference * percent;
    return `${dash} ${this.circumference}`;
  });

  // Offsets for positioning segments
  carbsOffset = computed(() => {
    const proteinPercent = this.proteinPercent() / 100;
    return -this.circumference * proteinPercent;
  });

  fatOffset = computed(() => {
    const proteinPercent = this.proteinPercent() / 100;
    const carbsPercent = this.carbsPercent() / 100;
    return -this.circumference * (proteinPercent + carbsPercent);
  });
}
