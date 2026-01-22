import { Component, computed, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-nutritionist-message-card',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <article
      class="bg-white dark:bg-dark-800 rounded-xl border border-dark-200 dark:border-dark-700 p-6 hover:shadow-md transition-shadow"
      aria-labelledby="message-title"
    >
      <header class="flex items-center justify-between mb-4">
        <h2
          id="message-title"
          class="text-sm font-medium text-dark-600 dark:text-dark-400 uppercase tracking-wide"
        >
          Mensaje de tu nutriólogo
        </h2>
        <div class="w-10 h-10 bg-purple-500/10 dark:bg-purple-500/20 rounded-lg flex items-center justify-center">
          <svg class="w-5 h-5 text-purple-600 dark:text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        </div>
      </header>

      @if (message()) {
        <div class="space-y-4">
          <!-- Nutritionist info -->
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center">
              <span class="text-sm font-semibold text-primary-600 dark:text-primary-400">
                {{ nutritionistInitials() }}
              </span>
            </div>
            <div>
              <p class="text-sm font-medium text-dark-900 dark:text-dark-50">
                {{ nutritionistName() }}
              </p>
              <p class="text-xs text-dark-500">
                {{ timeAgo() }}
              </p>
            </div>
          </div>

          <!-- Message content -->
          <div class="bg-dark-50 dark:bg-dark-900 rounded-lg p-4">
            <p class="text-sm text-dark-700 dark:text-dark-300 line-clamp-3">
              "{{ message() }}"
            </p>
          </div>
        </div>
      } @else {
        <!-- Empty state -->
        <div class="text-center py-4">
          <svg class="w-12 h-12 text-dark-300 dark:text-dark-600 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
          <p class="text-dark-500 dark:text-dark-400 text-sm">
            No hay mensajes recientes
          </p>
        </div>
      }

      <!-- Link to messages page -->
      <footer class="mt-4 pt-4 border-t border-dark-200 dark:border-dark-700">
        <a
          routerLink="/patient/messages"
          class="text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium flex items-center gap-1"
        >
          Ver todos los mensajes
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
        </a>
      </footer>
    </article>
  `
})
export class NutritionistMessageCardComponent {
  nutritionistName = input<string | undefined>(undefined);
  message = input<string | undefined>(undefined);
  sentAt = input<Date | undefined>(undefined);

  nutritionistInitials = computed(() => {
    const name = this.nutritionistName();
    if (!name) return '?';
    const parts = name.replace('Dra. ', '').replace('Dr. ', '').split(' ');
    if (parts.length >= 2) {
      return `${parts[0]![0]}${parts[1]![0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  });

  timeAgo = computed(() => {
    const date = this.sentAt();
    if (!date) return '';

    const now = new Date();
    const diff = now.getTime() - new Date(date).getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (minutes < 1) return 'Justo ahora';
    if (minutes < 60) return `Hace ${minutes} min`;
    if (hours < 24) return `Hace ${hours} hora${hours > 1 ? 's' : ''}`;
    if (days < 7) return `Hace ${days} día${days > 1 ? 's' : ''}`;

    return new Date(date).toLocaleDateString('es-MX', {
      day: 'numeric',
      month: 'short'
    });
  });
}
