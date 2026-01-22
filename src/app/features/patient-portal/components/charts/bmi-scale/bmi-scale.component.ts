import { Component, input, computed } from '@angular/core';
import { CommonModule } from '@angular/common';

export type BmiCategory = 'underweight' | 'normal' | 'overweight' | 'obese';

@Component({
  selector: 'app-bmi-scale',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="space-y-4">
      <!-- BMI value display -->
      <div class="text-center">
        <p class="text-4xl font-bold" [class]="bmiColorClass()">
          {{ bmi() | number:'1.1-1' }}
        </p>
        <p class="text-lg font-medium" [class]="bmiColorClass()">
          {{ bmiLabel() }}
        </p>
      </div>

      <!-- BMI scale bar -->
      <div class="relative" role="img" [attr.aria-label]="'Escala de IMC: ' + bmiLabel() + ' con valor ' + bmi()">
        <div class="flex h-6 rounded-full overflow-hidden">
          <div
            class="flex-[18.5] bg-blue-400 dark:bg-blue-500"
            [attr.aria-label]="'Bajo peso: menos de 18.5'"
          ></div>
          <div
            class="flex-[6.4] bg-green-400 dark:bg-green-500"
            [attr.aria-label]="'Normal: 18.5 a 24.9'"
          ></div>
          <div
            class="flex-[5] bg-yellow-400 dark:bg-yellow-500"
            [attr.aria-label]="'Sobrepeso: 25 a 29.9'"
          ></div>
          <div
            class="flex-[10] bg-red-400 dark:bg-red-500"
            [attr.aria-label]="'Obesidad: 30 o más'"
          ></div>
        </div>

        <!-- Indicator -->
        @if (bmi()) {
          <div
            class="absolute top-0 w-1 h-8 bg-dark-900 dark:bg-dark-50 rounded -translate-x-1/2 transition-all duration-300"
            [style.left.%]="bmiPosition()"
          >
            <div class="absolute -top-1 left-1/2 -translate-x-1/2 w-3 h-3 bg-dark-900 dark:bg-dark-50 rotate-45"></div>
          </div>
        }
      </div>

      <!-- Scale labels -->
      <div class="flex justify-between text-xs text-dark-500 dark:text-dark-400">
        <span>15</span>
        <span>18.5</span>
        <span>25</span>
        <span>30</span>
        <span>40</span>
      </div>

      <!-- Category labels -->
      <div class="flex text-xs text-center">
        <div class="flex-[18.5] text-blue-600 dark:text-blue-400">Bajo peso</div>
        <div class="flex-[6.4] text-green-600 dark:text-green-400">Normal</div>
        <div class="flex-[5] text-yellow-600 dark:text-yellow-400">Sobrepeso</div>
        <div class="flex-[10] text-red-600 dark:text-red-400">Obesidad</div>
      </div>
    </div>
  `
})
export class BmiScaleComponent {
  bmi = input.required<number>();

  bmiCategory = computed((): BmiCategory => {
    const value = this.bmi();
    if (value < 18.5) return 'underweight';
    if (value < 25) return 'normal';
    if (value < 30) return 'overweight';
    return 'obese';
  });

  bmiLabel = computed((): string => {
    const labels: Record<BmiCategory, string> = {
      underweight: 'Bajo peso',
      normal: 'Normal',
      overweight: 'Sobrepeso',
      obese: 'Obesidad'
    };
    return labels[this.bmiCategory()];
  });

  bmiColorClass = computed((): string => {
    const classes: Record<BmiCategory, string> = {
      underweight: 'text-blue-600 dark:text-blue-400',
      normal: 'text-green-600 dark:text-green-400',
      overweight: 'text-yellow-600 dark:text-yellow-400',
      obese: 'text-red-600 dark:text-red-400'
    };
    return classes[this.bmiCategory()];
  });

  bmiPosition = computed((): number => {
    // Map BMI 15-40 to 0-100%
    const min = 15;
    const max = 40;
    const value = this.bmi();
    const clamped = Math.max(min, Math.min(max, value));
    return ((clamped - min) / (max - min)) * 100;
  });
}
