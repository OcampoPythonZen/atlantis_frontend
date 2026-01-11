import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ThemeToggleComponent } from '../../shared/components/layout/theme-toggle/theme-toggle.component';
import { AuthFacade } from '../auth/facades/auth.facade';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, ThemeToggleComponent],
  templateUrl: './dashboard.component.html'
})
export class DashboardComponent {
  private readonly authFacade = inject(AuthFacade);
  private readonly router = inject(Router);

  readonly user = this.authFacade.user;

  async logout(): Promise<void> {
    await this.authFacade.logout();
  }
}
