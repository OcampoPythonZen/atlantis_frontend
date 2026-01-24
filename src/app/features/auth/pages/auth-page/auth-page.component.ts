import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { ThemeToggleComponent } from '../../../../shared/components/layout/theme-toggle/theme-toggle.component';
import { AuthBrandingComponent } from '../../components/auth-branding/auth-branding.component';
import { ThemeService } from '../../../../core/services/theme.service';

@Component({
  selector: 'app-auth-page',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    ThemeToggleComponent,
    AuthBrandingComponent
  ],
  templateUrl: './auth-page.component.html'
})
export class AuthPageComponent {
  private readonly themeService = inject(ThemeService);

  currentYear = new Date().getFullYear();
}
