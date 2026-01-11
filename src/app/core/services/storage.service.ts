import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class StorageService {
  get<T>(key: string): T | null {
    if (typeof localStorage === 'undefined') return null;

    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch {
      return null;
    }
  }

  set<T>(key: string, value: T): void {
    if (typeof localStorage === 'undefined') return;

    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      console.error(`Failed to save ${key} to localStorage`);
    }
  }

  remove(key: string): void {
    if (typeof localStorage === 'undefined') return;
    localStorage.removeItem(key);
  }

  clear(): void {
    if (typeof localStorage === 'undefined') return;
    localStorage.clear();
  }
}
