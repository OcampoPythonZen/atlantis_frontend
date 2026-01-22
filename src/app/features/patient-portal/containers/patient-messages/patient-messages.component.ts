import { Component, OnInit, inject, signal, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PatientPortalFacade } from '../../facades/patient-portal.facade';

@Component({
  selector: 'app-patient-messages',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="h-[calc(100vh-12rem)] flex flex-col">
      <!-- Page header -->
      <div class="mb-4">
        <h1 class="text-2xl font-display font-bold text-dark-900 dark:text-dark-50">
          Mensajes
        </h1>
        <p class="mt-1 text-dark-600 dark:text-dark-400">
          Comunicación con tu nutriólogo
        </p>
      </div>

      @if (isLoading() && messages().length === 0) {
        <!-- Loading state -->
        <div class="flex-1 flex items-center justify-center">
          <div class="text-center">
            <div class="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
            <p class="text-dark-500">Cargando mensajes...</p>
          </div>
        </div>
      } @else {
        <!-- Chat container -->
        <div class="flex-1 bg-white dark:bg-dark-800 rounded-xl border border-dark-200 dark:border-dark-700 flex flex-col overflow-hidden">
          <!-- Chat header -->
          @if (conversation()) {
            <div class="px-4 py-3 border-b border-dark-200 dark:border-dark-700 flex items-center gap-3">
              <div class="w-10 h-10 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center">
                @if (conversation()!.nutritionistPhotoUrl) {
                  <img
                    [src]="conversation()!.nutritionistPhotoUrl"
                    [alt]="conversation()!.nutritionistName"
                    class="w-10 h-10 rounded-full object-cover"
                  />
                } @else {
                  <span class="text-sm font-semibold text-primary-600 dark:text-primary-400">
                    {{ getInitials(conversation()!.nutritionistName) }}
                  </span>
                }
              </div>
              <div>
                <p class="font-medium text-dark-900 dark:text-dark-50">
                  {{ conversation()!.nutritionistName }}
                </p>
                <p class="text-xs text-green-500 flex items-center gap-1">
                  <span class="w-2 h-2 bg-green-500 rounded-full"></span>
                  En línea
                </p>
              </div>
            </div>
          }

          <!-- Messages area -->
          <div
            #messagesContainer
            class="flex-1 overflow-y-auto p-4 space-y-4"
          >
            @for (message of messages(); track message.id) {
              <div
                class="flex"
                [class.justify-end]="message.senderType === 'patient'"
              >
                <div
                  class="max-w-[75%] rounded-2xl px-4 py-2"
                  [class.bg-primary-500]="message.senderType === 'patient'"
                  [class.text-dark-950]="message.senderType === 'patient'"
                  [class.bg-dark-100]="message.senderType === 'nutritionist'"
                  [class.dark:bg-dark-700]="message.senderType === 'nutritionist'"
                  [class.text-dark-900]="message.senderType === 'nutritionist'"
                  [class.dark:text-dark-50]="message.senderType === 'nutritionist'"
                >
                  <p class="whitespace-pre-wrap">{{ message.content }}</p>
                  <p
                    class="text-xs mt-1 flex items-center justify-end gap-1"
                    [class.text-dark-800/70]="message.senderType === 'patient'"
                    [class.text-dark-500]="message.senderType === 'nutritionist'"
                  >
                    {{ message.sentAt | date:'HH:mm' }}
                    @if (message.senderType === 'patient') {
                      @if (message.status === 'read') {
                        <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      } @else if (message.status === 'delivered') {
                        <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                        </svg>
                      }
                    }
                  </p>
                </div>
              </div>
            }

            @if (messages().length === 0) {
              <div class="flex-1 flex items-center justify-center text-center py-12">
                <div>
                  <svg class="w-16 h-16 text-dark-300 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  <p class="text-dark-500">No hay mensajes aún</p>
                  <p class="text-sm text-dark-400 mt-1">Inicia una conversación con tu nutriólogo</p>
                </div>
              </div>
            }
          </div>

          <!-- Message input -->
          <div class="p-4 border-t border-dark-200 dark:border-dark-700">
            <form (ngSubmit)="sendMessage()" class="flex gap-2">
              <input
                type="text"
                [(ngModel)]="newMessage"
                name="message"
                placeholder="Escribe un mensaje..."
                class="
                  flex-1 px-4 py-2
                  bg-dark-50 dark:bg-dark-900
                  border border-dark-200 dark:border-dark-700
                  rounded-full
                  text-dark-900 dark:text-dark-50
                  placeholder-dark-400
                  focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent
                "
                [disabled]="isSending()"
              />
              <button
                type="submit"
                [disabled]="!newMessage.trim() || isSending()"
                class="
                  w-10 h-10 flex items-center justify-center
                  bg-primary-500 hover:bg-primary-600
                  text-dark-950 rounded-full
                  transition-colors
                  disabled:opacity-50 disabled:cursor-not-allowed
                "
              >
                @if (isSending()) {
                  <div class="w-5 h-5 border-2 border-dark-950 border-t-transparent rounded-full animate-spin"></div>
                } @else {
                  <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                }
              </button>
            </form>
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
  private shouldScrollToBottom = true;

  ngOnInit(): void {
    this.facade.loadMessages();
  }

  ngAfterViewChecked(): void {
    if (this.shouldScrollToBottom) {
      this.scrollToBottom();
    }
  }

  async sendMessage(): Promise<void> {
    if (!this.newMessage.trim() || this.isSending()) return;

    this.isSending.set(true);
    const message = this.newMessage;
    this.newMessage = '';

    const success = await this.facade.sendMessage(message);

    if (success) {
      this.shouldScrollToBottom = true;
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
