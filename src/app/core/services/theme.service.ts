import { Injectable, signal, effect } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private readonly STORAGE_KEY = 'atlantis-theme';
  private readonly _isDarkMode = signal(false);

  readonly isDarkMode = this._isDarkMode.asReadonly();

  constructor() {
    this.initializeTheme();
    this.watchSystemPreference();

    effect(() => {
      this.applyTheme(this._isDarkMode());
    });
  }

  toggle(): void {
    this.setDarkMode(!this._isDarkMode());
  }

  setDarkMode(value: boolean): void {
    this._isDarkMode.set(value);
    localStorage.setItem(this.STORAGE_KEY, value ? 'dark' : 'light');
  }

  private initializeTheme(): void {
    const stored = localStorage.getItem(this.STORAGE_KEY);

    if (stored) {
      this._isDarkMode.set(stored === 'dark');
    } else {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      this._isDarkMode.set(prefersDark);
    }
  }

  private watchSystemPreference(): void {
    window.matchMedia('(prefers-color-scheme: dark)')
      .addEventListener('change', (e) => {
        if (!localStorage.getItem(this.STORAGE_KEY)) {
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
