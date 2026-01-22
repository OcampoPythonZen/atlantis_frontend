import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/auth/services/auth.service';
import { AuthStore } from '../../../core/auth/store/auth.store';
import { LoginCredentials, RegisterData } from '../../../core/auth/models/auth.models';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthFacade {
  private readonly authService = inject(AuthService);
  private readonly store = inject(AuthStore);
  private readonly router = inject(Router);

  readonly user = this.store.user;
  readonly isLoading = this.store.isLoading;
  readonly error = this.store.error;
  readonly isAuthenticated = this.store.isAuthenticated;

  async login(credentials: LoginCredentials, rememberMe: boolean): Promise<boolean> {
    this.store.setLoading(true);
    this.store.setError(null);

    try {
      const response = await firstValueFrom(this.authService.login(credentials));
      this.store.setUser(response.user);
      this.store.setTokens(response.tokens);

      if (rememberMe) {
        localStorage.setItem('atlantis-user', JSON.stringify(response.user));
      }

      this.store.setLoading(false);

      // Redirect based on user role
      const redirectPath = this.getRedirectPathForRole(response.user.role);
      await this.router.navigate([redirectPath]);
      return true;
    } catch (error: any) {
      this.store.setError(error.message || 'Error al iniciar sesión');
      this.store.setLoading(false);
      return false;
    }
  }

  /**
   * Returns the appropriate redirect path based on user role.
   * - patient -> /patient (Patient Portal)
   * - nutritionist, admin -> /dashboard (Main Dashboard)
   */
  private getRedirectPathForRole(role: string): string {
    switch (role) {
      case 'patient':
        return '/patient';
      case 'admin':
      case 'nutritionist':
      default:
        return '/dashboard';
    }
  }

  async register(data: RegisterData): Promise<boolean> {
    this.store.setLoading(true);
    this.store.setError(null);

    try {
      const response = await firstValueFrom(this.authService.register(data));
      this.store.setUser(response.user);
      this.store.setTokens(response.tokens);
      localStorage.setItem('atlantis-user', JSON.stringify(response.user));

      this.store.setLoading(false);
      await this.router.navigate(['/dashboard']);
      return true;
    } catch (error: any) {
      this.store.setError(error.message || 'Error al crear la cuenta');
      this.store.setLoading(false);
      return false;
    }
  }

  async requestPasswordReset(email: string): Promise<boolean> {
    this.store.setLoading(true);
    this.store.setError(null);

    try {
      await firstValueFrom(this.authService.requestPasswordReset(email));
      this.store.setLoading(false);
      return true;
    } catch (error: any) {
      this.store.setError(error.message || 'Error al enviar el correo');
      this.store.setLoading(false);
      return false;
    }
  }

  async logout(): Promise<void> {
    this.store.setLoading(true);

    try {
      await firstValueFrom(this.authService.logout());
      this.store.clearAuth();
      localStorage.removeItem('atlantis-user');
      localStorage.removeItem('atlantis-tokens');
      await this.router.navigate(['/auth/login']);
    } finally {
      this.store.setLoading(false);
    }
  }

  clearError(): void {
    this.store.setError(null);
  }
}
