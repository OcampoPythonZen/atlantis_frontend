import { Component, computed, inject, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';

interface NavItem {
  readonly id: string;
  readonly label: string;
  readonly icon: string;
  readonly route: string;
  readonly badge?: number;
}

@Component({
  selector: 'app-patient-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  styles: [`
    /* Ensure sidebar is always visible on desktop (lg: 1024px+) */
    @media (min-width: 1024px) {
      aside {
        transform: translateX(0) !important;
      }
    }
  `],
  template: `
    <aside
      class="
        fixed inset-y-0 left-0 z-40
        w-64
        bg-white dark:bg-dark-800
        border-r border-dark-200 dark:border-dark-700
        transform transition-transform duration-300 ease-in-out
        -translate-x-full
      "
      [class.translate-x-0]="isOpen()"
      [class.-translate-x-full]="!isOpen()"
      role="navigation"
      aria-label="Navegación principal"
    >
      <!-- Logo / Brand -->
      <div class="h-16 flex items-center px-6 border-b border-dark-200 dark:border-dark-700">
        <a routerLink="/patient" class="flex items-center gap-3">
          <div class="w-10 h-10 bg-navy-800 dark:bg-navy-700 rounded-lg flex items-center justify-center">
            <svg class="w-6 h-6 text-primary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </div>
          <span class="text-lg font-display font-semibold text-dark-900 dark:text-dark-50">
            Atlantis
          </span>
        </a>
      </div>

      <!-- Navigation Links -->
      <nav class="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
        @for (item of navItems; track item.id) {
          <a
            [routerLink]="item.route"
            routerLinkActive="bg-teal-500/10 text-teal-600 dark:text-teal-400 border-r-2 border-teal-500"
            [routerLinkActiveOptions]="{ exact: item.route === '/patient' }"
            class="
              flex items-center gap-3 px-4 py-3 rounded-lg
              text-dark-600 dark:text-dark-400
              hover:bg-dark-100 dark:hover:bg-dark-700
              hover:text-dark-900 dark:hover:text-dark-50
              transition-colors duration-200
              group
            "
            (click)="onNavClick()"
          >
            <span
              class="w-5 h-5 flex-shrink-0 transition-colors"
              [innerHTML]="item.icon"
            ></span>
            <span class="flex-1 font-medium">{{ item.label }}</span>
            @if (item.badge && item.badge > 0) {
              <span class="
                px-2 py-0.5 text-xs font-semibold rounded-full
                bg-navy-700 text-white dark:bg-navy-600
              ">
                {{ item.badge > 99 ? '99+' : item.badge }}
              </span>
            }
          </a>
        }
      </nav>

      <!-- Footer / User Info -->
      <div class="p-4 border-t border-dark-200 dark:border-dark-700">
        <div class="flex items-center gap-3 px-2">
          <div class="w-10 h-10 rounded-full bg-teal-100 dark:bg-teal-900/30 flex items-center justify-center">
            @if (patientPhotoUrl()) {
              <img
                [src]="patientPhotoUrl()"
                [alt]="patientName()"
                class="w-10 h-10 rounded-full object-cover"
              />
            } @else {
              <span class="text-sm font-semibold text-teal-600 dark:text-teal-400">
                {{ patientInitials() }}
              </span>
            }
          </div>
          <div class="flex-1 min-w-0">
            <p class="text-sm font-medium text-dark-900 dark:text-dark-50 truncate">
              {{ patientName() }}
            </p>
            <p class="text-xs text-dark-500 dark:text-dark-400">
              Paciente
            </p>
          </div>
        </div>
      </div>
    </aside>

    <!-- Backdrop for mobile -->
    @if (isOpen()) {
      <div
        class="fixed inset-0 z-30 bg-black/50 lg:hidden"
        (click)="closeSidebar.emit()"
        aria-hidden="true"
      ></div>
    }
  `
})
export class PatientSidebarComponent {
  // Inputs
  isOpen = input<boolean>(false);
  patientName = input<string>('');
  patientPhotoUrl = input<string | undefined>(undefined);
  unreadMessages = input<number>(0);

  // Outputs
  closeSidebar = output<void>();

  // Computed
  patientInitials = computed(() => {
    const name = this.patientName();
    if (!name) return '?';
    const parts = name.split(' ');
    if (parts.length >= 2) {
      return `${parts[0]![0]}${parts[1]![0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  });

  // Navigation items
  readonly navItems: NavItem[] = [
    {
      id: 'dashboard',
      label: 'Inicio',
      route: '/patient',
      icon: `<svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>`
    },
    {
      id: 'profile',
      label: 'Mi Perfil',
      route: '/patient/profile',
      icon: `<svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>`
    },
    {
      id: 'progress',
      label: 'Mi Progreso',
      route: '/patient/progress',
      icon: `<svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>`
    },
    {
      id: 'plan',
      label: 'Mi Plan',
      route: '/patient/plan',
      icon: `<svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>`
    },
    {
      id: 'appointments',
      label: 'Mis Citas',
      route: '/patient/appointments',
      icon: `<svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>`
    },
    {
      id: 'messages',
      label: 'Mensajes',
      route: '/patient/messages',
      icon: `<svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>`
    },
    {
      id: 'documents',
      label: 'Documentos',
      route: '/patient/documents',
      icon: `<svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>`
    },
    {
      id: 'settings',
      label: 'Configuración',
      route: '/patient/settings',
      icon: `<svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>`
    }
  ];

  // Update badge for messages dynamically
  constructor() {
    // This would be updated from a service in real implementation
  }

  onNavClick(): void {
    // Close sidebar on mobile after navigation
    if (window.innerWidth < 1024) {
      this.closeSidebar.emit();
    }
  }
}
