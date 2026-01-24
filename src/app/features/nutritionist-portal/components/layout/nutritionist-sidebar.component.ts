import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-nutritionist-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <!-- Backdrop for mobile -->
    @if (isOpen()) {
      <div
        class="fixed inset-0 z-40 bg-dark-900/50 lg:hidden"
        (click)="closeSidebar.emit()"
        aria-hidden="true"
      ></div>
    }

    <!-- Sidebar -->
    <aside
      class="
        fixed top-0 left-0 z-50
        w-64 h-full
        bg-white dark:bg-dark-800
        border-r border-dark-200 dark:border-dark-700
        transform transition-transform duration-300 ease-in-out
        lg:translate-x-0
      "
      [class.-translate-x-full]="!isOpen()"
      [class.translate-x-0]="isOpen()"
      role="navigation"
      aria-label="Menú principal"
    >
      <div class="flex flex-col h-full">
        <!-- Logo and branding -->
        <div class="flex items-center gap-3 px-6 py-5 border-b border-dark-200 dark:border-dark-700">
          <div class="w-10 h-10 bg-primary-500 rounded-lg flex items-center justify-center">
            <svg class="w-6 h-6 text-dark-950" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </div>
          <div>
            <h1 class="text-lg font-display font-bold text-dark-900 dark:text-dark-50">
              Atlantis
            </h1>
            <p class="text-xs text-dark-500">Portal Profesional</p>
          </div>
        </div>

        <!-- User info -->
        <div class="px-4 py-4 border-b border-dark-200 dark:border-dark-700">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center flex-shrink-0">
              @if (nutritionistPhotoUrl()) {
                <img
                  [src]="nutritionistPhotoUrl()"
                  [alt]="nutritionistName()"
                  class="w-10 h-10 rounded-full object-cover"
                />
              } @else {
                <span class="text-sm font-semibold text-primary-600 dark:text-primary-400">
                  {{ getInitials() }}
                </span>
              }
            </div>
            <div class="min-w-0">
              <p class="text-sm font-medium text-dark-900 dark:text-dark-50 truncate">
                {{ nutritionistName() }}
              </p>
              <p class="text-xs text-dark-500 truncate">Nutriólogo</p>
            </div>
          </div>
        </div>

        <!-- Navigation -->
        <nav class="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          <!-- Dashboard -->
          <a
            routerLink="/nutritionist"
            routerLinkActive="bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300"
            [routerLinkActiveOptions]="{ exact: true }"
            class="
              flex items-center gap-3 px-3 py-2.5 rounded-lg
              text-dark-700 dark:text-dark-300
              hover:bg-dark-100 dark:hover:bg-dark-700
              transition-colors
            "
            (click)="closeSidebar.emit()"
          >
            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
            <span class="font-medium">Dashboard</span>
          </a>

          <!-- Calendar -->
          <a
            routerLink="/nutritionist/calendar"
            routerLinkActive="bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300"
            class="
              flex items-center gap-3 px-3 py-2.5 rounded-lg
              text-dark-700 dark:text-dark-300
              hover:bg-dark-100 dark:hover:bg-dark-700
              transition-colors
            "
            (click)="closeSidebar.emit()"
          >
            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span class="font-medium">Calendario</span>
          </a>

          <!-- Messages -->
          <a
            routerLink="/nutritionist/messages"
            routerLinkActive="bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300"
            class="
              flex items-center justify-between px-3 py-2.5 rounded-lg
              text-dark-700 dark:text-dark-300
              hover:bg-dark-100 dark:hover:bg-dark-700
              transition-colors
            "
            (click)="closeSidebar.emit()"
          >
            <div class="flex items-center gap-3">
              <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              <span class="font-medium">Mensajes</span>
            </div>
            @if (unreadMessages() > 0) {
              <span class="px-2 py-0.5 text-xs font-medium bg-red-500 text-white rounded-full" aria-label="mensajes sin leer">
                {{ unreadMessages() }}
              </span>
            }
          </a>

          <!-- Consultations -->
          <a
            routerLink="/nutritionist/consultations"
            routerLinkActive="bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300"
            class="
              flex items-center justify-between px-3 py-2.5 rounded-lg
              text-dark-700 dark:text-dark-300
              hover:bg-dark-100 dark:hover:bg-dark-700
              transition-colors
            "
            (click)="closeSidebar.emit()"
          >
            <div class="flex items-center gap-3">
              <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <span class="font-medium">Consultas</span>
            </div>
            @if (pendingConsultations() > 0) {
              <span class="px-2 py-0.5 text-xs font-medium bg-amber-500 text-white rounded-full" aria-label="consultas pendientes">
                {{ pendingConsultations() }}
              </span>
            }
          </a>

          <div class="border-t border-dark-200 dark:border-dark-700 my-4" aria-hidden="true"></div>

          <!-- Profile -->
          <a
            routerLink="/nutritionist/profile"
            routerLinkActive="bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300"
            class="
              flex items-center gap-3 px-3 py-2.5 rounded-lg
              text-dark-700 dark:text-dark-300
              hover:bg-dark-100 dark:hover:bg-dark-700
              transition-colors
            "
            (click)="closeSidebar.emit()"
          >
            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <span class="font-medium">Mi Perfil</span>
          </a>

          <!-- Settings -->
          <a
            routerLink="/nutritionist/settings"
            routerLinkActive="bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300"
            class="
              flex items-center gap-3 px-3 py-2.5 rounded-lg
              text-dark-700 dark:text-dark-300
              hover:bg-dark-100 dark:hover:bg-dark-700
              transition-colors
            "
            (click)="closeSidebar.emit()"
          >
            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span class="font-medium">Configuración</span>
          </a>
        </nav>
      </div>
    </aside>
  `
})
export class NutritionistSidebarComponent {
  isOpen = input(false);
  nutritionistName = input('');
  nutritionistPhotoUrl = input<string | undefined>(undefined);
  unreadMessages = input(0);
  pendingConsultations = input(0);

  closeSidebar = output<void>();
  logout = output<void>();

  getInitials(): string {
    const name = this.nutritionistName();
    if (!name) return '?';
    const parts = name.replace('Dra. ', '').replace('Dr. ', '').split(' ');
    if (parts.length >= 2) {
      return `${parts[0]![0]}${parts[1]![0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  }
}
