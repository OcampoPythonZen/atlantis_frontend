import { Injectable, signal, computed } from '@angular/core';
import { User, AuthTokens } from '../models/auth.models';

@Injectable({
  providedIn: 'root'
})
export class AuthStore {
  private readonly _user = signal<User | null>(null);
  private readonly _tokens = signal<AuthTokens | null>(null);
  private readonly _isLoading = signal(false);
  private readonly _error = signal<string | null>(null);

  readonly user = this._user.asReadonly();
  readonly tokens = this._tokens.asReadonly();
  readonly isLoading = this._isLoading.asReadonly();
  readonly error = this._error.asReadonly();

  readonly isAuthenticated = computed(() => this._user() !== null);
  readonly accessToken = computed(() => this._tokens()?.accessToken ?? null);

  setUser(user: User | null): void {
    this._user.set(user);
  }

  setTokens(tokens: AuthTokens | null): void {
    this._tokens.set(tokens);
  }

  setLoading(isLoading: boolean): void {
    this._isLoading.set(isLoading);
  }

  setError(error: string | null): void {
    this._error.set(error);
  }

  clearAuth(): void {
    this._user.set(null);
    this._tokens.set(null);
    this._error.set(null);
  }
}
