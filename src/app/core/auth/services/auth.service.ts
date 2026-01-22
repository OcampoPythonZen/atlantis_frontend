import { Injectable } from '@angular/core';
import { Observable, of, delay } from 'rxjs';
import { AuthResponse, LoginCredentials, RegisterData, UserRole } from '../models/auth.models';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  /**
   * Mock login service for development.
   *
   * Role detection for testing:
   * - Email containing 'patient' -> patient role (redirects to /patient)
   * - Email containing 'admin' -> admin role
   * - Any other email -> nutritionist role (redirects to /dashboard)
   *
   * Test credentials:
   * - patient@test.com / any password -> Patient Portal
   * - admin@test.com / any password -> Admin Dashboard
   * - Any other email / any password -> Nutritionist Dashboard
   */
  login(credentials: LoginCredentials): Observable<AuthResponse> {
    const role = this.detectRoleFromEmail(credentials.email);
    const names: Record<UserRole, string> = {
      patient: 'María García López',
      nutritionist: 'Dr. Ana López',
      admin: 'Administrador Sistema'
    };

    return of({
      user: {
        id: role === 'patient' ? 'patient-001' : '1',
        email: credentials.email,
        fullName: names[role],
        role,
        createdAt: new Date().toISOString()
      },
      tokens: {
        accessToken: `mock-${role}-token`,
        refreshToken: `mock-refresh-${role}-token`,
        expiresIn: 3600
      }
    }).pipe(delay(1000));
  }

  /**
   * Detects user role based on email for testing purposes.
   * In production, this would be determined by the backend.
   */
  private detectRoleFromEmail(email: string): UserRole {
    const lowerEmail = email.toLowerCase();
    if (lowerEmail.includes('patient') || lowerEmail.includes('paciente')) {
      return 'patient';
    }
    if (lowerEmail.includes('admin')) {
      return 'admin';
    }
    return 'nutritionist';
  }

  register(data: RegisterData): Observable<AuthResponse> {
    return of({
      user: {
        id: '1',
        email: data.email,
        fullName: data.fullName,
        role: 'nutritionist' as const,
        createdAt: new Date().toISOString()
      },
      tokens: {
        accessToken: 'mock-access-token',
        refreshToken: 'mock-refresh-token',
        expiresIn: 3600
      }
    }).pipe(delay(1000));
  }

  requestPasswordReset(email: string): Observable<void> {
    return of(void 0).pipe(delay(1000));
  }

  logout(): Observable<void> {
    return of(void 0).pipe(delay(500));
  }
}
