import { Injectable, signal, effect, computed } from '@angular/core';

export type ThemeMode = 'light' | 'dark' | 'system';

const THEME_STORAGE_KEY = 'atlantis-theme-preference';

/**
 * Theme Service - Supports Light, Dark and System modes
 * User preference is persisted in localStorage
 */
@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private readonly _themeMode = signal<ThemeMode>('system');
  private readonly _isDarkMode = signal(false);

  readonly themeMode = this._themeMode.asReadonly();
  readonly isDarkMode = this._isDarkMode.asReadonly();

  readonly themeModeLabel = computed(() => {
    switch (this._themeMode()) {
      case 'light': return 'Claro';
      case 'dark': return 'Oscuro';
      case 'system': return 'Sistema';
    }
  });

  constructor() {
    this.initializeTheme();
    this.watchSystemPreference();

    effect(() => {
      this.applyTheme(this._isDarkMode());
    });
  }

  setThemeMode(mode: ThemeMode): void {
    this._themeMode.set(mode);
    localStorage.setItem(THEME_STORAGE_KEY, mode);
    this.updateDarkMode(mode);
  }

  private initializeTheme(): void {
    const savedMode = localStorage.getItem(THEME_STORAGE_KEY) as ThemeMode | null;
    const mode = savedMode && ['light', 'dark', 'system'].includes(savedMode)
      ? savedMode
      : 'system';

    this._themeMode.set(mode);
    this.updateDarkMode(mode);
  }

  private updateDarkMode(mode: ThemeMode): void {
    if (mode === 'system') {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      this._isDarkMode.set(prefersDark);
    } else {
      this._isDarkMode.set(mode === 'dark');
    }
  }

  private watchSystemPreference(): void {
    window.matchMedia('(prefers-color-scheme: dark)')
      .addEventListener('change', (e) => {
        if (this._themeMode() === 'system') {
          this._isDarkMode.set(e.matches);
        }
      });
  }

  private applyTheme(isDark: boolean): void {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }
}
