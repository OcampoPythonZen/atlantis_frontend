import { Component, inject, OnInit } from '@angular/core';
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
export class DashboardComponent implements OnInit {
  private readonly authFacade = inject(AuthFacade);
  private readonly router = inject(Router);

  readonly user = this.authFacade.user;

  ngOnInit(): void {
    // Redirect based on user role
    const currentUser = this.user();
    if (currentUser) {
      if (currentUser.role === 'patient') {
        this.router.navigate(['/patient']);
      } else if (currentUser.role === 'nutritionist') {
        this.router.navigate(['/nutritionist']);
      }
    }
  }

  async logout(): Promise<void> {
    await this.authFacade.logout();
  }
}
