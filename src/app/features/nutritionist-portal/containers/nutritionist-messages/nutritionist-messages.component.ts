import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NutritionistPortalFacade } from '../../facades/nutritionist-portal.facade';

@Component({
  selector: 'app-nutritionist-messages',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="h-[calc(100vh-4rem)] flex">
      <!-- Conversations List -->
      <div class="w-80 border-r border-dark-200 dark:border-dark-700 bg-white dark:bg-dark-800 flex flex-col">
        <div class="p-4 border-b border-dark-200 dark:border-dark-700">
          <h1 class="text-lg font-semibold text-dark-900 dark:text-dark-50">Mensajes</h1>
          <p class="text-sm text-dark-500 dark:text-dark-400 mt-1">
            {{ facade.conversations().length }} conversaciones
          </p>
        </div>

        <!-- Search -->
        <div class="p-4">
          <div class="relative">
            <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Buscar conversación..."
              class="w-full pl-9 pr-4 py-2 rounded-lg border border-dark-200 dark:border-dark-700 bg-white dark:bg-dark-900 text-dark-900 dark:text-dark-50 placeholder-dark-400 text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent">
          </div>
        </div>

        <!-- Conversations -->
        <div class="flex-1 overflow-y-auto">
          @if (facade.isLoading()) {
            <div class="flex items-center justify-center py-8">
              <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-500"></div>
            </div>
          } @else if (facade.conversations().length > 0) {
            @for (conv of facade.conversations(); track conv.id) {
              <button
                (click)="selectConversation(conv.id)"
                class="w-full p-4 text-left hover:bg-dark-50 dark:hover:bg-dark-700 transition-colors border-b border-dark-100 dark:border-dark-700"
                [class.bg-primary-50]="facade.activeConversation()?.id === conv.id"
                [class.dark:bg-primary-900/20]="facade.activeConversation()?.id === conv.id">
                <div class="flex items-center gap-3">
                  <!-- Avatar -->
                  <div class="w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center text-sm font-medium text-primary-600 dark:text-primary-400">
                    {{ getInitials(conv.participantName) }}
                  </div>

                  <div class="flex-1 min-w-0">
                    <div class="flex items-center justify-between">
                      <span class="font-medium text-dark-900 dark:text-dark-50 truncate">
                        {{ conv.participantName }}
                      </span>
                      @if (conv.lastMessageTime) {
                        <span class="text-xs text-dark-500 dark:text-dark-400">
                          {{ formatTime(conv.lastMessageTime) }}
                        </span>
                      }
                    </div>
                    <p class="text-sm text-dark-500 dark:text-dark-400 truncate mt-0.5">
                      {{ conv.lastMessage }}
                    </p>
                  </div>

                  @if (conv.unreadCount > 0) {
                    <span class="w-5 h-5 flex items-center justify-center text-xs font-medium bg-primary-500 text-dark-950 rounded-full">
                      {{ conv.unreadCount }}
                    </span>
                  }
                </div>
              </button>
            }
          } @else {
            <div class="text-center py-8 text-dark-500 dark:text-dark-400">
              <p class="text-sm">Sin conversaciones</p>
            </div>
          }
        </div>
      </div>

      <!-- Chat Area -->
      <div class="flex-1 flex flex-col bg-dark-50 dark:bg-dark-900">
        @if (facade.activeConversation(); as conversation) {
          <!-- Chat Header -->
          <div class="px-6 py-4 bg-white dark:bg-dark-800 border-b border-dark-200 dark:border-dark-700">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center text-sm font-medium text-primary-600 dark:text-primary-400">
                {{ getInitials(conversation.participantName) }}
              </div>
              <div>
                <h2 class="font-medium text-dark-900 dark:text-dark-50">
                  {{ conversation.participantName }}
                </h2>
                <p class="text-sm text-dark-500 dark:text-dark-400">
                  Paciente
                </p>
              </div>
            </div>
          </div>

          <!-- Messages -->
          <div class="flex-1 overflow-y-auto p-6 space-y-4">
            @for (message of facade.messages(); track message.id) {
              <div
                class="flex"
                [class.justify-end]="message.senderId === 'nutritionist-1'">
                <div
                  class="max-w-md px-4 py-3 rounded-2xl"
                  [class]="message.senderId === 'nutritionist-1'
                    ? 'bg-primary-500 text-dark-950'
                    : 'bg-white dark:bg-dark-800 text-dark-900 dark:text-dark-50'">
                  <p>{{ message.content }}</p>
                  <span
                    class="text-xs mt-1 block"
                    [class]="message.senderId === 'nutritionist-1'
                      ? 'text-dark-700'
                      : 'text-dark-500 dark:text-dark-400'">
                    {{ message.timestamp | date:'shortTime' }}
                  </span>
                </div>
              </div>
            }
          </div>

          <!-- Message Input -->
          <div class="p-4 bg-white dark:bg-dark-800 border-t border-dark-200 dark:border-dark-700">
            <div class="flex items-end gap-3">
              <div class="flex-1">
                <textarea
                  [(ngModel)]="newMessage"
                  (keydown.enter)="sendMessage($event)"
                  rows="1"
                  placeholder="Escribe un mensaje..."
                  class="w-full px-4 py-3 rounded-xl border border-dark-200 dark:border-dark-700 bg-dark-50 dark:bg-dark-900 text-dark-900 dark:text-dark-50 placeholder-dark-400 resize-none focus:ring-2 focus:ring-primary-500 focus:border-transparent">
                </textarea>
              </div>
              <button
                (click)="sendMessage()"
                [disabled]="!newMessage.trim()"
                class="p-3 bg-primary-500 hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed text-dark-950 rounded-xl transition-colors">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </div>
          </div>
        } @else {
          <!-- No conversation selected -->
          <div class="flex-1 flex items-center justify-center">
            <div class="text-center text-dark-500 dark:text-dark-400">
              <svg class="w-16 h-16 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              <p class="text-lg font-medium">Selecciona una conversación</p>
              <p class="text-sm">Elige un paciente para ver los mensajes</p>
            </div>
          </div>
        }
      </div>
    </div>
  `
})
export class NutritionistMessagesComponent implements OnInit {
  readonly facade = inject(NutritionistPortalFacade);

  newMessage = '';

  ngOnInit(): void {
    this.facade.loadConversations();
  }

  selectConversation(conversationId: string): void {
    this.facade.loadMessages(conversationId);
  }

  async sendMessage(event?: Event): Promise<void> {
    if (event) {
      event.preventDefault();
    }

    if (!this.newMessage.trim()) return;

    const success = await this.facade.sendMessage(this.newMessage);
    if (success) {
      this.newMessage = '';
    }
  }

  getInitials(name: string): string {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .substring(0, 2)
      .toUpperCase();
  }

  formatTime(date: Date): string {
    const now = new Date();
    const messageDate = new Date(date);

    if (messageDate.toDateString() === now.toDateString()) {
      return messageDate.toLocaleTimeString('es-MX', {
        hour: '2-digit',
        minute: '2-digit'
      });
    }

    return messageDate.toLocaleDateString('es-MX', {
      day: 'numeric',
      month: 'short'
    });
  }
}
