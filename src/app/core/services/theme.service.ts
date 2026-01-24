import { Injectable, signal, effect } from '@angular/core';

/**
 * Theme Service - Follows System Preference
 * Automatically syncs with OS dark/light mode setting
 */
@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private readonly _isDarkMode = signal(false);

  readonly isDarkMode = this._isDarkMode.asReadonly();

  constructor() {
    this.initializeTheme();
    this.watchSystemPreference();

    effect(() => {
      this.applyTheme(this._isDarkMode());
    });
  }

  private initializeTheme(): void {
    // Always follow system preference
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    this._isDarkMode.set(prefersDark);
  }

  private watchSystemPreference(): void {
    // Listen for system theme changes in real-time
    window.matchMedia('(prefers-color-scheme: dark)')
      .addEventListener('change', (e) => {
        this._isDarkMode.set(e.matches);
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
