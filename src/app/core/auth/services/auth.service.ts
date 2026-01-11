import { Injectable } from '@angular/core';
import { Observable, of, delay } from 'rxjs';
import { AuthResponse, LoginCredentials, RegisterData, User } from '../models/auth.models';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  login(credentials: LoginCredentials): Observable<AuthResponse> {
    return of({
      user: {
        id: '1',
        email: credentials.email,
        fullName: 'Usuario Demo',
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
