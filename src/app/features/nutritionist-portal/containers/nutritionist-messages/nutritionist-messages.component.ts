import { Component, inject, OnInit, signal, ElementRef, ViewChild, AfterViewChecked } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NutritionistPortalFacade } from '../../facades/nutritionist-portal.facade';

@Component({
  selector: 'app-nutritionist-messages',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="h-[calc(100vh-8rem)] md:h-[calc(100vh-6rem)] flex overflow-hidden">
      <!-- Conversations List -->
      <div
        class="w-full md:w-80 border-r border-dark-200 dark:border-dark-700 bg-white dark:bg-dark-800 flex flex-col"
        [class.hidden]="isMobileView() && facade.activeConversation()"
        [class.md:flex]="true">
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
              placeholder="Buscar conversacion..."
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
                  <!-- Avatar with online indicator -->
                  <div class="relative">
                    <div class="w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center text-sm font-medium text-primary-600 dark:text-primary-400">
                      {{ getInitials(conv.participantName) }}
                    </div>
                    <span class="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white dark:border-dark-800 rounded-full"></span>
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
      <div
        class="flex-1 flex flex-col bg-dark-50 dark:bg-dark-900 min-h-0"
        [class.hidden]="isMobileView() && !facade.activeConversation()"
        [class.flex]="!isMobileView() || facade.activeConversation()">
        @if (facade.activeConversation(); as conversation) {
          <!-- Chat Header -->
          <div class="px-4 md:px-6 py-3 md:py-4 bg-white dark:bg-dark-800 border-b border-dark-200 dark:border-dark-700 flex-shrink-0">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-3">
                <!-- Back button for mobile -->
                <button
                  (click)="goBackToList()"
                  class="md:hidden p-2 -ml-2 text-dark-500 hover:text-dark-700 dark:hover:text-dark-300 hover:bg-dark-100 dark:hover:bg-dark-700 rounded-lg transition-colors">
                  <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                  </svg>
                </button>

                <div class="relative">
                  <div class="w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center text-sm font-medium text-primary-600 dark:text-primary-400">
                    {{ getInitials(conversation.participantName) }}
                  </div>
                  <span class="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white dark:border-dark-800 rounded-full"></span>
                </div>
                <div>
                  <h2 class="font-medium text-dark-900 dark:text-dark-50">
                    {{ conversation.participantName }}
                  </h2>
                  <p class="text-xs text-green-500 flex items-center gap-1">
                    <span class="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                    En linea
                  </p>
                </div>
              </div>

              <!-- Action buttons -->
              <div class="flex items-center gap-2">
                <button
                  class="p-2 text-dark-500 hover:text-dark-700 dark:hover:text-dark-300 hover:bg-dark-100 dark:hover:bg-dark-700 rounded-lg transition-colors"
                  title="Mas opciones">
                  <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          <!-- Messages -->
          <div #messagesContainer class="flex-1 overflow-y-auto p-4 md:p-6 space-y-3 min-h-0">
            @for (message of facade.messages(); track message.id) {
              <div
                class="flex"
                [class.justify-end]="message.senderId === 'nutritionist-1'">
                <div
                  class="max-w-[85%] md:max-w-[70%] rounded-2xl px-4 py-2.5"
                  [class]="message.senderId === 'nutritionist-1'
                    ? 'bg-primary-500 text-dark-950 rounded-br-md'
                    : 'bg-white dark:bg-dark-800 text-dark-900 dark:text-dark-50 border border-dark-200 dark:border-dark-700 rounded-bl-md'">
                  <p class="text-sm whitespace-pre-wrap">{{ message.content }}</p>
                  <div class="flex items-center justify-end gap-1.5 mt-1.5">
                    <span
                      class="text-xs"
                      [class]="message.senderId === 'nutritionist-1'
                        ? 'text-dark-800'
                        : 'text-dark-500 dark:text-dark-400'">
                      {{ message.timestamp | date:'shortTime' }}
                    </span>
                    @if (message.senderId === 'nutritionist-1') {
                      <!-- Status indicator -->
                      @if (message.status === 'read') {
                        <svg class="w-4 h-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      } @else if (message.status === 'delivered') {
                        <svg class="w-4 h-4 text-dark-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      } @else {
                        <svg class="w-4 h-4 text-dark-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                        </svg>
                      }
                    }
                  </div>
                </div>
              </div>
            }

            <!-- Typing indicator -->
            @if (isTyping()) {
              <div class="flex">
                <div class="bg-white dark:bg-dark-800 rounded-2xl rounded-bl-md px-4 py-3 border border-dark-200 dark:border-dark-700">
                  <div class="flex items-center gap-1">
                    <span class="w-2 h-2 bg-dark-400 rounded-full animate-bounce"></span>
                    <span class="w-2 h-2 bg-dark-400 rounded-full animate-bounce [animation-delay:150ms]"></span>
                    <span class="w-2 h-2 bg-dark-400 rounded-full animate-bounce [animation-delay:300ms]"></span>
                  </div>
                </div>
              </div>
            }
          </div>

          <!-- Message Input -->
          <div class="px-4 py-3 bg-white dark:bg-dark-800 border-t border-dark-200 dark:border-dark-700 flex-shrink-0">
            <div class="flex items-end gap-2 md:gap-3">
              <!-- Attachment button -->
              <button
                class="p-2 md:p-2.5 text-dark-500 hover:text-dark-700 dark:hover:text-dark-300 hover:bg-dark-100 dark:hover:bg-dark-700 rounded-xl transition-colors flex-shrink-0"
                title="Adjuntar archivo">
                <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                </svg>
              </button>

              <!-- Input -->
              <div class="flex-1 min-w-0">
                <textarea
                  [(ngModel)]="newMessage"
                  (keydown.enter)="sendMessage($event)"
                  rows="1"
                  placeholder="Escribe un mensaje..."
                  class="w-full px-4 py-2.5 rounded-xl border border-dark-200 dark:border-dark-700 bg-dark-50 dark:bg-dark-900 text-dark-900 dark:text-dark-50 placeholder-dark-400 resize-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm">
                </textarea>
              </div>

              <!-- Send button -->
              <button
                (click)="sendMessage()"
                [disabled]="!newMessage.trim()"
                class="p-2 md:p-2.5 bg-primary-500 hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed text-dark-950 rounded-xl transition-colors flex-shrink-0"
                title="Enviar mensaje">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </div>
          </div>
        } @else {
          <!-- No conversation selected -->
          <div class="flex-1 flex items-center justify-center">
            <div class="text-center text-dark-500 dark:text-dark-400 px-4">
              <svg class="w-16 h-16 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              <p class="text-lg font-medium">Selecciona una conversacion</p>
              <p class="text-sm mt-1">Elige un paciente para ver los mensajes</p>
            </div>
          </div>
        }
      </div>
    </div>
  `
})
export class NutritionistMessagesComponent implements OnInit, AfterViewChecked {
  @ViewChild('messagesContainer') private messagesContainer!: ElementRef;

  readonly facade = inject(NutritionistPortalFacade);

  newMessage = '';
  isTyping = signal(false);
  isMobileView = signal(false);
  private shouldScrollToBottom = false;

  ngOnInit(): void {
    this.facade.loadConversations();
    this.checkMobileView();

    if (typeof window !== 'undefined') {
      window.addEventListener('resize', () => this.checkMobileView());
    }
  }

  ngAfterViewChecked(): void {
    if (this.shouldScrollToBottom) {
      this.scrollToBottom();
      this.shouldScrollToBottom = false;
    }
  }

  private checkMobileView(): void {
    if (typeof window !== 'undefined') {
      this.isMobileView.set(window.innerWidth < 768);
    }
  }

  selectConversation(conversationId: string): void {
    this.facade.loadMessages(conversationId);
    this.shouldScrollToBottom = true;
  }

  goBackToList(): void {
    this.facade.clearActiveConversation();
  }

  async sendMessage(event?: Event): Promise<void> {
    if (event) {
      event.preventDefault();
    }

    if (!this.newMessage.trim()) return;

    const success = await this.facade.sendMessage(this.newMessage);
    if (success) {
      this.newMessage = '';
      this.shouldScrollToBottom = true;

      // Simulate typing indicator response
      setTimeout(() => {
        this.isTyping.set(true);
        setTimeout(() => {
          this.isTyping.set(false);
        }, 2000);
      }, 500);
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

  private scrollToBottom(): void {
    if (this.messagesContainer) {
      const container = this.messagesContainer.nativeElement;
      container.scrollTop = container.scrollHeight;
    }
  }
}
