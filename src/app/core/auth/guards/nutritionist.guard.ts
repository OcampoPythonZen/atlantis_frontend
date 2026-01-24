import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthStore } from '../store/auth.store';

/**
 * Guard that protects nutritionist portal routes.
 * - Requires user to be authenticated
 * - Requires user to have 'nutritionist' role
 * - Redirects unauthenticated users to /auth/login
 * - Redirects non-nutritionist users to appropriate dashboard
 */
export const nutritionistGuard: CanActivateFn = () => {
  const authStore = inject(AuthStore);
  const router = inject(Router);

  // Check if user is authenticated
  if (!authStore.isAuthenticated()) {
    return router.createUrlTree(['/auth/login']);
  }

  const user = authStore.user();

  // Check if user has nutritionist role
  if (user?.role === 'nutritionist') {
    return true;
  }

  // Redirect patients to patient portal
  if (user?.role === 'patient') {
    return router.createUrlTree(['/patient']);
  }

  // Redirect admins to admin dashboard
  return router.createUrlTree(['/dashboard']);
};
