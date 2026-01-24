import { Component, input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PatientComplete } from '../../models/nutritionist.model';

interface ChatMessage {
  id: string;
  content: string;
  sentAt: Date;
  isFromNutritionist: boolean;
  status: 'sent' | 'delivered' | 'read';
}

@Component({
  selector: 'app-patient-messages-tab',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="flex flex-col h-[500px] bg-dark-50 dark:bg-dark-900 rounded-xl overflow-hidden">
      <!-- Chat Header -->
      <div class="flex items-center justify-between px-4 py-3 bg-white dark:bg-dark-800 border-b border-dark-200 dark:border-dark-700">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center">
            <span class="text-sm font-semibold text-primary-600 dark:text-primary-400">
              {{ getInitials() }}
            </span>
          </div>
          <div>
            <p class="font-medium text-dark-900 dark:text-dark-50">
              {{ patient()?.personalInfo?.fullName || 'Paciente' }}
            </p>
            <p class="text-xs text-green-500 flex items-center gap-1">
              <span class="w-2 h-2 bg-green-500 rounded-full"></span>
              En línea
            </p>
          </div>
        </div>
        <div class="flex items-center gap-2">
          <button class="p-2 text-dark-500 hover:text-dark-700 dark:hover:text-dark-300 hover:bg-dark-100 dark:hover:bg-dark-700 rounded-lg transition-colors">
            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
          </button>
          <button class="p-2 text-dark-500 hover:text-dark-700 dark:hover:text-dark-300 hover:bg-dark-100 dark:hover:bg-dark-700 rounded-lg transition-colors">
            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
            </svg>
          </button>
        </div>
      </div>

      <!-- Messages Area -->
      <div class="flex-1 overflow-y-auto p-4 space-y-4">
        @for (message of mockMessages; track message.id) {
          <div
            class="flex"
            [class.justify-end]="message.isFromNutritionist"
          >
            <div
              class="max-w-[70%] rounded-2xl px-4 py-2"
              [class]="message.isFromNutritionist
                ? 'bg-primary-500 text-dark-950 rounded-br-md'
                : 'bg-white dark:bg-dark-800 text-dark-900 dark:text-dark-50 border border-dark-200 dark:border-dark-700 rounded-bl-md'"
            >
              <p class="text-sm">{{ message.content }}</p>
              <div class="flex items-center justify-end gap-1 mt-1">
                <span
                  class="text-xs"
                  [class]="message.isFromNutritionist ? 'text-dark-800' : 'text-dark-500'"
                >
                  {{ formatTime(message.sentAt) }}
                </span>
                @if (message.isFromNutritionist) {
                  <svg
                    class="w-4 h-4"
                    [class]="message.status === 'read' ? 'text-blue-600' : 'text-dark-700'"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    @if (message.status === 'sent') {
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                    } @else {
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    }
                  </svg>
                }
              </div>
            </div>
          </div>
        }

        <!-- Typing indicator -->
        @if (isTyping()) {
          <div class="flex">
            <div class="bg-white dark:bg-dark-800 rounded-2xl rounded-bl-md px-4 py-2 border border-dark-200 dark:border-dark-700">
              <div class="flex items-center gap-1">
                <span class="w-2 h-2 bg-dark-400 rounded-full animate-bounce" style="animation-delay: 0ms"></span>
                <span class="w-2 h-2 bg-dark-400 rounded-full animate-bounce" style="animation-delay: 150ms"></span>
                <span class="w-2 h-2 bg-dark-400 rounded-full animate-bounce" style="animation-delay: 300ms"></span>
              </div>
            </div>
          </div>
        }
      </div>

      <!-- Quick Replies -->
      <div class="px-4 py-2 border-t border-dark-200 dark:border-dark-700 bg-white dark:bg-dark-800">
        <div class="flex gap-2 overflow-x-auto pb-2">
          @for (reply of quickReplies; track reply) {
            <button
              (click)="newMessage.set(reply)"
              class="flex-shrink-0 px-3 py-1.5 text-xs bg-dark-100 dark:bg-dark-700 text-dark-700 dark:text-dark-300 rounded-full hover:bg-dark-200 dark:hover:bg-dark-600 transition-colors"
            >
              {{ reply }}
            </button>
          }
        </div>
      </div>

      <!-- Message Input -->
      <div class="px-4 py-3 bg-white dark:bg-dark-800 border-t border-dark-200 dark:border-dark-700">
        <div class="flex items-end gap-3">
          <button class="p-2 text-dark-500 hover:text-dark-700 dark:hover:text-dark-300 hover:bg-dark-100 dark:hover:bg-dark-700 rounded-lg transition-colors">
            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
            </svg>
          </button>

          <div class="flex-1">
            <textarea
              [(ngModel)]="newMessage"
              (keydown.enter)="sendMessage($event)"
              placeholder="Escribe un mensaje..."
              rows="1"
              class="
                w-full px-4 py-2.5 rounded-xl resize-none
                bg-dark-50 dark:bg-dark-900
                border border-dark-200 dark:border-dark-700
                text-dark-900 dark:text-dark-50
                placeholder-dark-400
                focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent
              "
            ></textarea>
          </div>

          <button
            (click)="sendMessage()"
            [disabled]="!newMessage().trim()"
            class="
              p-2.5 rounded-xl
              bg-primary-500 hover:bg-primary-600
              text-dark-950
              transition-colors
              disabled:opacity-50 disabled:cursor-not-allowed
            "
          >
            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  `
})
export class PatientMessagesTabComponent {
  patient = input<PatientComplete | null>(null);

  newMessage = signal('');
  isTyping = signal(false);

  readonly quickReplies = [
    '¡Hola! ¿Cómo te sientes hoy?',
    '¿Seguiste el plan de ayer?',
    'Recuerda tu próxima cita',
    '¿Tienes alguna duda?'
  ];

  mockMessages: ChatMessage[] = [
    {
      id: '1',
      content: '¡Buenos días doctora! Tengo una duda sobre mi plan.',
      sentAt: new Date(Date.now() - 3600000 * 2),
      isFromNutritionist: false,
      status: 'read'
    },
    {
      id: '2',
      content: '¡Hola! Claro, dime ¿en qué puedo ayudarte?',
      sentAt: new Date(Date.now() - 3600000 * 1.9),
      isFromNutritionist: true,
      status: 'read'
    },
    {
      id: '3',
      content: '¿Puedo sustituir la avena del desayuno por otra cosa? No me gusta mucho.',
      sentAt: new Date(Date.now() - 3600000 * 1.8),
      isFromNutritionist: false,
      status: 'read'
    },
    {
      id: '4',
      content: 'Claro, puedes sustituirla por quinoa cocida o arroz integral. Ambas opciones tienen valores nutricionales similares.',
      sentAt: new Date(Date.now() - 3600000),
      isFromNutritionist: true,
      status: 'read'
    },
    {
      id: '5',
      content: '¡Perfecto! Muchas gracias por la información. Lo probaré mañana.',
      sentAt: new Date(Date.now() - 1800000),
      isFromNutritionist: false,
      status: 'read'
    },
    {
      id: '6',
      content: 'De nada, cualquier otra duda me dices. Recuerda que tu próxima cita es el viernes.',
      sentAt: new Date(Date.now() - 900000),
      isFromNutritionist: true,
      status: 'delivered'
    }
  ];

  getInitials(): string {
    const name = this.patient()?.personalInfo?.fullName;
    if (!name) return '?';
    const parts = name.split(' ');
    if (parts.length >= 2) {
      return `${parts[0]![0]}${parts[1]![0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  }

  formatTime(date: Date): string {
    return new Date(date).toLocaleTimeString('es-MX', {
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  sendMessage(event?: Event): void {
    if (event) {
      event.preventDefault();
    }

    const content = this.newMessage().trim();
    if (!content) return;

    this.mockMessages.push({
      id: Date.now().toString(),
      content,
      sentAt: new Date(),
      isFromNutritionist: true,
      status: 'sent'
    });

    this.newMessage.set('');

    // Simulate typing response
    setTimeout(() => {
      this.isTyping.set(true);
      setTimeout(() => {
        this.isTyping.set(false);
      }, 2000);
    }, 1000);
  }
}
