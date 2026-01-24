import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeService } from '../../../../core/services/theme.service';

/**
 * Theme Toggle Component
 * Note: Theme now follows system preference automatically.
 * This component is kept for backwards compatibility but doesn't toggle.
 */
@Component({
  selector: 'app-theme-toggle',
  standalone: true,
  imports: [CommonModule],
  template: `
    <!-- Theme is now controlled by system preference -->
    <!-- This component is deprecated and hidden -->
  `
})
export class ThemeToggleComponent {
  private readonly themeService = inject(ThemeService);
  readonly isDarkMode = this.themeService.isDarkMode;
}
