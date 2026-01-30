import { Component, computed, inject, input, output, HostListener, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-patient-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <header class="
      sticky top-0 z-30
      h-16
      bg-white dark:bg-dark-800
      border-b border-dark-200 dark:border-dark-700
    ">
      <div class="
        h-full w-full
        px-4 lg:px-6 xl:px-8
        flex items-center justify-between
      ">
      <!-- Left side: Menu button (mobile) + Page title -->
      <div class="flex items-center gap-4">
        <!-- Mobile menu toggle -->
        <button
          type="button"
          class="
            lg:hidden
            p-2 rounded-lg
            text-dark-600 dark:text-dark-400
            hover:bg-dark-100 dark:hover:bg-dark-700
            focus:outline-none focus:ring-2 focus:ring-teal-500
          "
          (click)="toggleSidebar.emit()"
          aria-label="Abrir menú"
        >
          <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        <!-- Greeting and date -->
        <div>
          <h1 class="text-lg font-semibold text-dark-900 dark:text-dark-50">
            {{ greeting() }}, {{ patientFirstName() }}
          </h1>
          <p class="text-sm text-dark-500 dark:text-dark-400">
            {{ formattedDate }}
          </p>
        </div>
      </div>

      <!-- Right side: Actions -->
      <div class="flex items-center gap-2">
        <!-- Notifications -->
        <button
          type="button"
          class="
            relative p-2 rounded-lg
            text-dark-600 dark:text-dark-400
            hover:bg-dark-100 dark:hover:bg-dark-700
            focus:outline-none focus:ring-2 focus:ring-teal-500
          "
          aria-label="Notificaciones"
        >
          <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
          @if (notificationCount() > 0) {
            <span class="
              absolute top-1 right-1
              w-4 h-4
              flex items-center justify-center
              text-xs font-bold
              bg-red-500 text-white
              rounded-full
            ">
              {{ notificationCount() > 9 ? '9+' : notificationCount() }}
            </span>
          }
        </button>

        <!-- User menu / Logout -->
        <div class="relative">
          <button
            type="button"
            class="
              flex items-center gap-2 p-2 rounded-lg
              text-dark-600 dark:text-dark-400
              hover:bg-dark-100 dark:hover:bg-dark-700
              focus:outline-none focus:ring-2 focus:ring-teal-500
            "
            (click)="toggleUserMenu()"
            aria-haspopup="true"
            [attr.aria-expanded]="isUserMenuOpen"
          >
            <div class="w-8 h-8 rounded-full bg-teal-100 dark:bg-teal-900/30 flex items-center justify-center">
              @if (patientPhotoUrl()) {
                <img
                  [src]="patientPhotoUrl()"
                  [alt]="patientName()"
                  class="w-8 h-8 rounded-full object-cover"
                />
              } @else {
                <span class="text-xs font-semibold text-teal-600 dark:text-teal-400">
                  {{ patientInitials() }}
                </span>
              }
            </div>
            <svg class="w-4 h-4 hidden sm:block" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          <!-- Dropdown menu -->
          @if (isUserMenuOpen) {
            <div
              class="
                absolute right-0 mt-2 w-48
                bg-white dark:bg-dark-800
                border border-dark-200 dark:border-dark-700
                rounded-lg shadow-lg
                py-1
              "
              role="menu"
            >
              <a
                routerLink="/patient/profile"
                (click)="closeUserMenu()"
                class="
                  flex items-center gap-2 px-4 py-2
                  text-sm text-dark-700 dark:text-dark-300
                  hover:bg-dark-100 dark:hover:bg-dark-700
                "
                role="menuitem"
              >
                <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Mi Perfil
              </a>
              <hr class="my-1 border-dark-200 dark:border-dark-700" />
              <button
                type="button"
                class="
                  w-full flex items-center gap-2 px-4 py-2
                  text-sm text-red-600 dark:text-red-400
                  hover:bg-dark-100 dark:hover:bg-dark-700
                "
                role="menuitem"
                (click)="logout.emit()"
              >
                <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
export class PatientHeaderComponent {
  // Inputs
  patientName = input<string>('');
  patientPhotoUrl = input<string | undefined>(undefined);
  notificationCount = input<number>(0);

  // Outputs
  toggleSidebar = output<void>();
  logout = output<void>();

  private readonly elementRef = inject(ElementRef);

  // Local state
  isUserMenuOpen = false;
  currentDate = new Date();

  // Formatted date for template
  get formattedDate(): string {
    return this.currentDate.toLocaleDateString('es-MX', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  }

  patientFirstName = computed(() => {
    const name = this.patientName();
    return name.split(' ')[0] || 'Paciente';
  });

  patientInitials = computed(() => {
    const name = this.patientName();
    if (!name) return '?';
    const parts = name.split(' ');
    if (parts.length >= 2) {
      return `${parts[0]![0]}${parts[1]![0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  });

  greeting = computed(() => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Buenos días';
    if (hour < 19) return 'Buenas tardes';
    return 'Buenas noches';
  });

  // Handle escape key to close menu
  @HostListener('document:keydown.escape')
  onEscapeKey(): void {
    this.closeUserMenu();
  }

  // Handle click outside to close menu
  @HostListener('document:click', ['$event'])
  onClickOutside(event: MouseEvent): void {
    if (this.isUserMenuOpen && !this.elementRef.nativeElement.contains(event.target)) {
      this.closeUserMenu();
    }
  }

  toggleUserMenu(): void {
    this.isUserMenuOpen = !this.isUserMenuOpen;
  }

  closeUserMenu(): void {
    this.isUserMenuOpen = false;
  }
}
