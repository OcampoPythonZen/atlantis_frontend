import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppearanceSettingsComponent } from '../../../../shared/components/settings/appearance-settings/appearance-settings.component';

@Component({
  selector: 'app-nutritionist-settings',
  standalone: true,
  imports: [CommonModule, AppearanceSettingsComponent],
  template: `
    <div class="space-y-6">
      <!-- Page Header -->
      <div>
        <h1 class="text-2xl font-display font-bold text-dark-900 dark:text-dark-50">
          Configuración
        </h1>
        <p class="mt-1 text-dark-600 dark:text-dark-400">
          Personaliza tu experiencia en la aplicación
        </p>
      </div>

      <!-- Settings Sections -->
      <div class="grid gap-6">
        <!-- Appearance Section -->
        <section class="bg-white dark:bg-dark-800 rounded-xl border border-dark-200 dark:border-dark-700 p-6">
          <app-appearance-settings />
        </section>

        <!-- Additional sections can be added here in the future -->
        <!-- Example: Notifications, Calendar preferences, etc. -->
      </div>
    </div>
  `
})
export class NutritionistSettingsComponent {}
