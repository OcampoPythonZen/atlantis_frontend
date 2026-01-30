import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeService, ThemeMode } from '../../../../core/services/theme.service';

interface ThemeOption {
  readonly mode: ThemeMode;
  readonly label: string;
  readonly description: string;
  readonly icon: string;
}

@Component({
  selector: 'app-appearance-settings',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="space-y-6">
      <!-- Section Header -->
      <div>
        <h3 class="text-lg font-semibold text-dark-900 dark:text-dark-50">
          Apariencia
        </h3>
        <p class="mt-1 text-sm text-dark-500 dark:text-dark-400">
          Personaliza cómo se ve la aplicación en tu dispositivo
        </p>
      </div>

      <!-- Theme Options -->
      <div class="space-y-3">
        <label class="text-sm font-medium text-dark-700 dark:text-dark-300">
          Tema
        </label>

        <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
          @for (option of themeOptions; track option.mode) {
            <button
              (click)="selectTheme(option.mode)"
              [attr.aria-pressed]="themeService.themeMode() === option.mode"
              class="
                relative flex flex-col items-center p-4 rounded-xl border-2 transition-all duration-200
                focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2
                dark:focus:ring-offset-dark-800
              "
              [class]="themeService.themeMode() === option.mode
                ? 'border-teal-500 bg-teal-50 dark:bg-teal-900/20'
                : 'border-dark-200 dark:border-dark-700 bg-white dark:bg-dark-800 hover:border-dark-300 dark:hover:border-dark-600'"
            >
              <!-- Theme Preview -->
              <div
                class="w-full h-20 rounded-lg mb-3 overflow-hidden border"
                [class]="getPreviewClasses(option.mode)"
              >
                <div class="h-full flex">
                  <!-- Sidebar preview -->
                  <div
                    class="w-1/4 h-full"
                    [class]="getSidebarPreviewClasses(option.mode)"
                  >
                    <div class="p-1 space-y-1">
                      <div class="w-full h-1.5 rounded-full" [class]="getAccentClasses(option.mode)"></div>
                      <div class="w-3/4 h-1 rounded-full" [class]="getLineClasses(option.mode)"></div>
                      <div class="w-3/4 h-1 rounded-full" [class]="getLineClasses(option.mode)"></div>
                    </div>
                  </div>
                  <!-- Content preview -->
                  <div class="flex-1 p-2">
                    <div class="w-1/2 h-2 rounded mb-2" [class]="getAccentClasses(option.mode)"></div>
                    <div class="w-full h-1 rounded mb-1" [class]="getLineClasses(option.mode)"></div>
                    <div class="w-4/5 h-1 rounded" [class]="getLineClasses(option.mode)"></div>
                  </div>
                </div>
              </div>

              <!-- Icon -->
              <div
                class="w-10 h-10 rounded-full flex items-center justify-center mb-2"
                [class]="themeService.themeMode() === option.mode
                  ? 'bg-teal-500 text-white'
                  : 'bg-dark-100 dark:bg-dark-700 text-dark-600 dark:text-dark-400'"
              >
                <span [innerHTML]="option.icon" class="w-5 h-5"></span>
              </div>

              <!-- Label -->
              <span
                class="text-sm font-medium"
                [class]="themeService.themeMode() === option.mode
                  ? 'text-teal-700 dark:text-teal-400'
                  : 'text-dark-700 dark:text-dark-300'"
              >
                {{ option.label }}
              </span>

              <!-- Description -->
              <span class="text-xs text-dark-500 dark:text-dark-400 mt-1 text-center">
                {{ option.description }}
              </span>

              <!-- Selected indicator -->
              @if (themeService.themeMode() === option.mode) {
                <div class="absolute top-2 right-2">
                  <div class="w-5 h-5 bg-teal-500 rounded-full flex items-center justify-center">
                    <svg class="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="3">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                </div>
              }
            </button>
          }
        </div>
      </div>

      <!-- Current theme info -->
      <div class="flex items-center gap-3 p-4 rounded-xl bg-dark-50 dark:bg-dark-900 border border-dark-200 dark:border-dark-700">
        <div class="w-10 h-10 rounded-full bg-navy-100 dark:bg-navy-900/30 flex items-center justify-center">
          <svg class="w-5 h-5 text-navy-600 dark:text-navy-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <div>
          <p class="text-sm font-medium text-dark-900 dark:text-dark-50">
            Tema actual: {{ themeService.themeModeLabel() }}
          </p>
          <p class="text-xs text-dark-500 dark:text-dark-400">
            @if (themeService.themeMode() === 'system') {
              Se ajusta automáticamente según la configuración de tu dispositivo
            } @else {
              El tema permanecerá {{ themeService.themeMode() === 'dark' ? 'oscuro' : 'claro' }} independientemente de tu sistema
            }
          </p>
        </div>
      </div>
    </div>
  `
})
export class AppearanceSettingsComponent {
  readonly themeService = inject(ThemeService);

  readonly themeOptions: ThemeOption[] = [
    {
      mode: 'light',
      label: 'Claro',
      description: 'Fondo blanco',
      icon: `<svg fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
        <path stroke-linecap="round" stroke-linejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
      </svg>`
    },
    {
      mode: 'dark',
      label: 'Oscuro',
      description: 'Fondo oscuro',
      icon: `<svg fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
        <path stroke-linecap="round" stroke-linejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
      </svg>`
    },
    {
      mode: 'system',
      label: 'Sistema',
      description: 'Sigue tu dispositivo',
      icon: `<svg fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
        <path stroke-linecap="round" stroke-linejoin="round" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>`
    }
  ];

  selectTheme(mode: ThemeMode): void {
    this.themeService.setThemeMode(mode);
  }

  getPreviewClasses(mode: ThemeMode): string {
    if (mode === 'system') {
      return 'bg-gradient-to-r from-white to-dark-900 border-dark-300';
    }
    return mode === 'dark'
      ? 'bg-dark-900 border-dark-700'
      : 'bg-white border-dark-200';
  }

  getSidebarPreviewClasses(mode: ThemeMode): string {
    if (mode === 'system') {
      return 'bg-gradient-to-r from-dark-100 to-dark-800';
    }
    return mode === 'dark'
      ? 'bg-dark-800'
      : 'bg-dark-100';
  }

  getAccentClasses(mode: ThemeMode): string {
    if (mode === 'dark') return 'bg-navy-600';
    if (mode === 'light') return 'bg-teal-500';
    return 'bg-primary-500';
  }

  getLineClasses(mode: ThemeMode): string {
    if (mode === 'system') {
      return 'bg-gradient-to-r from-dark-300 to-dark-600';
    }
    return mode === 'dark'
      ? 'bg-dark-600'
      : 'bg-dark-300';
  }
}
