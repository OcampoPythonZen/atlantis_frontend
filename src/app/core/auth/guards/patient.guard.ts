import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthStore } from '../store/auth.store';

/**
 * Guard that protects patient portal routes.
 * - Requires user to be authenticated
 * - Requires user to have 'patient' role
 * - Redirects unauthenticated users to /auth/login
 * - Redirects non-patient users to appropriate dashboard
 */
export const patientGuard: CanActivateFn = () => {
  const authStore = inject(AuthStore);
  const router = inject(Router);

  // Check if user is authenticated
  if (!authStore.isAuthenticated()) {
    return router.createUrlTree(['/auth/login']);
  }

  const user = authStore.user();

  // Check if user has patient role
  if (user?.role === 'patient') {
    return true;
  }

  // Redirect non-patients to their appropriate dashboard
  // Nutritionists and admins go to the main dashboard
  return router.createUrlTree(['/dashboard']);
};
