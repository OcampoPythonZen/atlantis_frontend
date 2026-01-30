import { Component, OnInit, inject, signal, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PatientPortalFacade } from '../../facades/patient-portal.facade';

@Component({
  selector: 'app-patient-messages',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="h-[calc(100vh-8rem)] sm:h-[calc(100vh-10rem)] flex flex-col">
      <!-- Page header -->
      <div class="mb-3 sm:mb-4 flex-shrink-0">
        <h1 class="text-xl sm:text-2xl font-display font-bold text-dark-900 dark:text-dark-50">
          Mensajes
        </h1>
        <p class="mt-1 text-sm sm:text-base text-dark-600 dark:text-dark-400">
          Comunicación con tu nutriólogo
        </p>
      </div>

      @if (isLoading() && messages().length === 0) {
        <!-- Loading state -->
        <div class="flex-1 flex items-center justify-center">
          <div class="text-center">
            <div class="w-8 h-8 border-2 border-teal-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
            <p class="text-dark-500">Cargando mensajes...</p>
          </div>
        </div>
      } @else {
        <!-- Chat container -->
        <div class="flex-1 min-h-0 bg-white dark:bg-dark-800 rounded-xl border border-dark-200 dark:border-dark-700 flex flex-col overflow-hidden">
          <!-- Chat header -->
          @if (conversation()) {
            <div class="px-3 sm:px-4 py-2.5 sm:py-3 border-b border-dark-200 dark:border-dark-700 flex items-center justify-between flex-shrink-0">
              <div class="flex items-center gap-2 sm:gap-3 min-w-0">
                <div class="relative flex-shrink-0">
                  <div class="w-9 h-9 sm:w-10 sm:h-10 bg-teal-100 dark:bg-teal-900/30 rounded-full flex items-center justify-center">
                    @if (conversation()!.nutritionistPhotoUrl) {
                      <img
                        [src]="conversation()!.nutritionistPhotoUrl"
                        [alt]="conversation()!.nutritionistName"
                        class="w-9 h-9 sm:w-10 sm:h-10 rounded-full object-cover"
                      />
                    } @else {
                      <span class="text-xs sm:text-sm font-semibold text-teal-600 dark:text-teal-400">
                        {{ getInitials(conversation()!.nutritionistName) }}
                      </span>
                    }
                  </div>
                  <span class="absolute bottom-0 right-0 w-2.5 h-2.5 sm:w-3 sm:h-3 bg-green-500 border-2 border-white dark:border-dark-800 rounded-full"></span>
                </div>
                <div class="min-w-0">
                  <p class="font-medium text-sm sm:text-base text-dark-900 dark:text-dark-50 truncate">
                    {{ conversation()!.nutritionistName }}
                  </p>
                  <p class="text-xs text-green-500 flex items-center gap-1">
                    <span class="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                    En línea
                  </p>
                </div>
              </div>

              <!-- Action buttons -->
              <div class="flex items-center flex-shrink-0">
                <button
                  class="p-2 text-dark-500 hover:text-dark-700 dark:hover:text-dark-300 hover:bg-dark-100 dark:hover:bg-dark-700 rounded-lg transition-colors"
                  title="Más opciones">
                  <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                  </svg>
                </button>
              </div>
            </div>
          }

          <!-- Messages area -->
          <div
            #messagesContainer
            class="flex-1 min-h-0 overflow-y-auto p-3 sm:p-4 space-y-3 bg-dark-50 dark:bg-dark-900"
          >
            @for (message of messages(); track message.id) {
              <div
                class="flex"
                [class.justify-end]="message.senderType === 'patient'"
              >
                <div
                  class="max-w-[85%] sm:max-w-[70%] rounded-2xl px-3 sm:px-4 py-2 sm:py-2.5"
                  [class]="message.senderType === 'patient'
                    ? 'bg-navy-700 text-white dark:bg-navy-600 rounded-br-md'
                    : 'bg-white dark:bg-dark-800 text-dark-900 dark:text-dark-50 border border-dark-200 dark:border-dark-700 rounded-bl-md'"
                >
                  <p class="text-sm whitespace-pre-wrap">{{ message.content }}</p>
                  <div class="flex items-center justify-end gap-1.5 mt-1.5">
                    <span
                      class="text-xs"
                      [class]="message.senderType === 'patient'
                        ? 'text-navy-200'
                        : 'text-dark-500 dark:text-dark-400'"
                    >
                      {{ message.sentAt | date:'HH:mm' }}
                    </span>
                    @if (message.senderType === 'patient') {
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

            @if (messages().length === 0) {
              <div class="flex-1 flex items-center justify-center text-center py-8 sm:py-12">
                <div>
                  <svg class="w-12 h-12 sm:w-16 sm:h-16 text-dark-300 mx-auto mb-3 sm:mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  <p class="text-dark-500">No hay mensajes aún</p>
                  <p class="text-sm text-dark-400 mt-1">Inicia una conversación con tu nutriólogo</p>
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

          <!-- Message input -->
          <div class="px-3 sm:px-4 py-2.5 sm:py-3 border-t border-dark-200 dark:border-dark-700 bg-white dark:bg-dark-800 flex-shrink-0">
            <div class="flex items-end gap-2 sm:gap-3">
              <!-- Attachment button -->
              <button
                class="p-2 sm:p-2.5 text-dark-500 hover:text-dark-700 dark:hover:text-dark-300 hover:bg-dark-100 dark:hover:bg-dark-700 rounded-xl transition-colors flex-shrink-0"
                title="Adjuntar archivo">
                <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                </svg>
              </button>

              <!-- Input -->
              <div class="flex-1 min-w-0">
                <textarea
                  [(ngModel)]="newMessage"
                  (keydown.enter)="onEnterKey($event)"
                  rows="1"
                  placeholder="Escribe un mensaje..."
                  class="w-full px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl border border-dark-200 dark:border-dark-700 bg-dark-50 dark:bg-dark-900 text-dark-900 dark:text-dark-50 placeholder-dark-400 resize-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm"
                  [disabled]="isSending()">
                </textarea>
              </div>

              <!-- Send button -->
              <button
                (click)="sendMessage()"
                [disabled]="!newMessage.trim() || isSending()"
                class="p-2 sm:p-2.5 bg-primary-500 hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed text-dark-950 rounded-xl transition-colors flex-shrink-0"
                title="Enviar mensaje">
                @if (isSending()) {
                  <div class="w-5 h-5 border-2 border-dark-950 border-t-transparent rounded-full animate-spin"></div>
                } @else {
                  <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                }
              </button>
            </div>
          </div>
        </div>
      }
    </div>
  `
})
export class PatientMessagesComponent implements OnInit, AfterViewChecked {
  @ViewChild('messagesContainer') messagesContainer!: ElementRef;

  private readonly facade = inject(PatientPortalFacade);

  readonly isLoading = this.facade.isLoading;
  readonly conversation = this.facade.conversation;
  readonly messages = this.facade.messages;

  newMessage = '';
  isSending = signal(false);
  isTyping = signal(false);
  private shouldScrollToBottom = true;

  ngOnInit(): void {
    this.facade.loadMessages();
  }

  ngAfterViewChecked(): void {
    if (this.shouldScrollToBottom) {
      this.scrollToBottom();
    }
  }

  onEnterKey(event: Event): void {
    event.preventDefault();
    this.sendMessage();
  }

  async sendMessage(): Promise<void> {
    if (!this.newMessage.trim() || this.isSending()) return;

    this.isSending.set(true);
    const message = this.newMessage;
    this.newMessage = '';

    const success = await this.facade.sendMessage(message);

    if (success) {
      this.shouldScrollToBottom = true;

      // Simulate typing indicator response
      setTimeout(() => {
        this.isTyping.set(true);
        setTimeout(() => {
          this.isTyping.set(false);
        }, 2000);
      }, 500);
    } else {
      this.newMessage = message; // Restore message on failure
    }

    this.isSending.set(false);
  }

  getInitials(name: string): string {
    const parts = name.replace('Dra. ', '').replace('Dr. ', '').split(' ');
    if (parts.length >= 2) {
      return `${parts[0]![0]}${parts[1]![0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  }

  private scrollToBottom(): void {
    if (this.messagesContainer) {
      const element = this.messagesContainer.nativeElement;
      element.scrollTop = element.scrollHeight;
      this.shouldScrollToBottom = false;
    }
  }
}
