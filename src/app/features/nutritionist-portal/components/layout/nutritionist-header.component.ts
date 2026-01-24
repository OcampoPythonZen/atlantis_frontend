import { Component, input, output, HostListener, ElementRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-nutritionist-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <header class="
      sticky top-0 z-30
      bg-white dark:bg-dark-800
      border-b border-dark-200 dark:border-dark-700
      px-4 lg:px-6
    ">
      <div class="flex items-center justify-between h-16">
        <!-- Left side: Menu toggle + Title -->
        <div class="flex items-center gap-4">
          <!-- Mobile menu toggle -->
          <button
            type="button"
            class="
              lg:hidden
              p-2 rounded-lg
              text-dark-600 dark:text-dark-400
              hover:bg-dark-100 dark:hover:bg-dark-700
              transition-colors
            "
            (click)="toggleSidebar.emit()"
            aria-label="Abrir menú"
          >
            <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          <!-- Page title - shown on mobile -->
          <h2 class="text-lg font-semibold text-dark-900 dark:text-dark-50 lg:hidden">
            Portal del Nutriólogo
          </h2>
        </div>

        <!-- Right side: Actions -->
        <div class="flex items-center gap-2">
          <!-- Quick add patient button - prominent -->
          <button
            type="button"
            class="
              flex items-center gap-2
              px-5 py-2.5 rounded-xl
              bg-primary-500 hover:bg-primary-600
              text-dark-950 font-semibold text-base
              shadow-lg shadow-primary-500/30
              hover:shadow-xl hover:shadow-primary-500/40
              transform hover:scale-105
              transition-all duration-200
            "
            (click)="addPatient.emit()"
            aria-label="Agregar nuevo paciente"
          >
            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            <span class="hidden sm:inline">Nuevo Paciente</span>
            <span class="sm:hidden">Nuevo</span>
          </button>

          <!-- Notifications -->
          <button
            type="button"
            class="
              relative p-2 rounded-lg
              text-dark-600 dark:text-dark-400
              hover:bg-dark-100 dark:hover:bg-dark-700
              transition-colors
            "
            aria-label="Notificaciones"
          >
            <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            @if (notificationCount() > 0) {
              <span class="
                absolute -top-1 -right-1
                w-5 h-5 flex items-center justify-center
                text-xs font-medium
                bg-red-500 text-white rounded-full
              " aria-hidden="true">
                {{ notificationCount() > 9 ? '9+' : notificationCount() }}
              </span>
            }
          </button>

          <!-- User menu -->
          <div class="relative">
            <button
              type="button"
              class="
                flex items-center gap-2 p-1.5 rounded-lg
                hover:bg-dark-100 dark:hover:bg-dark-700
                transition-colors
              "
              [attr.aria-expanded]="isMenuOpen"
              aria-haspopup="true"
              aria-label="Menú de usuario"
              (click)="isMenuOpen = !isMenuOpen"
            >
              <div class="w-8 h-8 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center">
                @if (nutritionistPhotoUrl()) {
                  <img
                    [src]="nutritionistPhotoUrl()"
                    [alt]="nutritionistName()"
                    class="w-8 h-8 rounded-full object-cover"
                  />
                } @else {
                  <span class="text-xs font-semibold text-primary-600 dark:text-primary-400">
                    {{ getInitials() }}
                  </span>
                }
              </div>
              <svg class="w-4 h-4 text-dark-500 hidden sm:block" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            <!-- Dropdown menu -->
            @if (isMenuOpen) {
              <div
                class="
                  absolute right-0 mt-2 w-48
                  bg-white dark:bg-dark-800
                  border border-dark-200 dark:border-dark-700
                  rounded-lg shadow-lg
                  py-1
                "
              >
                <div class="px-4 py-2 border-b border-dark-200 dark:border-dark-700">
                  <p class="text-sm font-medium text-dark-900 dark:text-dark-50">
                    {{ nutritionistName() }}
                  </p>
                  <p class="text-xs text-dark-500">Nutriólogo</p>
                </div>
                <a
                  routerLink="/nutritionist/profile"
                  class="
                    flex items-center gap-2 px-4 py-2
                    text-sm text-dark-700 dark:text-dark-300
                    hover:bg-dark-100 dark:hover:bg-dark-700
                  "
                  (click)="isMenuOpen = false"
                >
                  <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  Mi Perfil
                </a>
                <button
                  class="
                    w-full flex items-center gap-2 px-4 py-2
                    text-sm text-red-600 dark:text-red-400
                    hover:bg-red-50 dark:hover:bg-red-900/20
                  "
                  (click)="onLogout()"
                >
                  <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  Cerrar sesión
                </button>
              </div>
            }
          </div>
        </div>
      </div>
    </header>
  `
})
export class NutritionistHeaderComponent {
  private readonly elementRef = inject(ElementRef);

  nutritionistName = input('');
  nutritionistPhotoUrl = input<string | undefined>(undefined);
  notificationCount = input(0);

  toggleSidebar = output<void>();
  logout = output<void>();
  addPatient = output<void>();

  isMenuOpen = false;

  @HostListener('document:keydown.escape')
  onEscapePress(): void {
    if (this.isMenuOpen) {
      this.isMenuOpen = false;
    }
  }

  @HostListener('document:click', ['$event'])
  onClickOutside(event: MouseEvent): void {
    if (this.isMenuOpen && !this.elementRef.nativeElement.contains(event.target)) {
      this.isMenuOpen = false;
    }
  }

  getInitials(): string {
    const name = this.nutritionistName();
    if (!name) return '?';
    const parts = name.replace('Dra. ', '').replace('Dr. ', '').split(' ');
    if (parts.length >= 2) {
      return `${parts[0]![0]}${parts[1]![0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  }

  onLogout(): void {
    this.isMenuOpen = false;
    this.logout.emit();
  }
}
