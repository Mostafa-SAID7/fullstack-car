import { Component, Input, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { TranslationService } from '../../../../core/services/translation.service';

export interface Message {
  id: string;
  senderId: string;
  senderName: string;
  content: string;
  timestamp: Date;
  isRead: boolean;
  isOwn: boolean;
}

export interface Conversation {
  id: string;
  participantId: string;
  participantName: string;
  participantAvatar?: string;
  lastMessage?: Message;
  unreadCount: number;
  isOnline: boolean;
}

@Component({
  selector: 'app-message-interface',
  standalone: true,
  imports: [CommonModule, TranslateModule, ReactiveFormsModule],
  template: `
    <div class="bg-white dark:bg-[#111] rounded-[2.5rem] shadow-xl border border-black/5 dark:border-white/5 overflow-hidden">
      <!-- Header -->
      <div class="p-6 border-b border-black/5 dark:border-white/5">
        <div class="flex items-center gap-4">
          <div class="relative">
            <div class="w-12 h-12 rounded-xl bg-gradient-to-tr from-primary/10 to-primary/5 border border-primary/10 overflow-hidden shadow-sm">
              <img *ngIf="conversation?.participantAvatar" [src]="conversation!.participantAvatar" class="w-full h-full object-cover">
              <div *ngIf="!conversation?.participantAvatar" class="w-full h-full flex items-center justify-center font-black text-primary">
                {{ getInitials(conversation?.participantName || '') }}
              </div>
            </div>
            <div *ngIf="conversation?.isOnline" 
                 class="absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-background bg-emerald-500 shadow-sm"
                 [title]="'status.online' | translate">
            </div>
          </div>
          <div class="flex-1">
            <h3 class="text-lg font-black text-foreground">{{ conversation?.participantName }}</h3>
            <p class="text-xs text-muted-foreground font-bold uppercase tracking-widest">
              {{ conversation?.isOnline ? ('status.online' | translate) : ('status.offline' | translate) }}
            </p>
          </div>
          <button class="w-10 h-10 rounded-xl hover:bg-secondary/10 flex items-center justify-center text-muted-foreground hover:text-primary transition-all"
                  [title]="'messaging.chatSettings' | translate">
            <i class="fas fa-cog text-sm"></i>
          </button>
        </div>
      </div>

      <!-- Messages Area -->
      <div class="h-96 overflow-y-auto p-6 space-y-4" #messagesContainer>
        <div *ngIf="messages.length === 0" class="flex items-center justify-center h-full">
          <div class="text-center">
            <div class="w-16 h-16 bg-secondary/30 dark:bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
              <i class="fas fa-comments text-2xl text-muted-foreground/30"></i>
            </div>
            <p class="text-muted-foreground font-bold text-sm">{{ 'messaging.noMessages' | translate }}</p>
            <p class="text-muted-foreground/60 font-bold text-xs mt-1">{{ 'messaging.startConversation' | translate }}</p>
          </div>
        </div>

        <div *ngFor="let message of messages" 
             class="flex gap-3"
             [ngClass]="message.isOwn ? 'flex-row-reverse' : 'flex-row'">
          <div *ngIf="!message.isOwn" class="w-8 h-8 rounded-lg bg-gradient-to-tr from-primary/10 to-primary/5 border border-primary/10 overflow-hidden shadow-sm flex-shrink-0">
            <div class="w-full h-full flex items-center justify-center text-xs font-black text-primary">
              {{ getInitials(message.senderName) }}
            </div>
          </div>
          
          <div class="max-w-[70%]">
            <div class="p-3 rounded-2xl"
                 [ngClass]="message.isOwn ? 'bg-primary text-white ml-auto' : 'bg-secondary/20 dark:bg-white/5 text-foreground'">
              <p class="text-sm">{{ message.content }}</p>
            </div>
            <div class="flex items-center gap-2 mt-1 px-1"
                 [ngClass]="message.isOwn ? 'justify-end' : 'justify-start'">
              <span class="text-xs text-muted-foreground/60 font-bold">
                {{ message.timestamp | date:'shortTime' }}
              </span>
              <div *ngIf="message.isOwn" class="flex items-center gap-1">
                <i class="fas fa-check text-xs text-muted-foreground/60" 
                   [ngClass]="message.isRead ? 'text-primary' : 'text-muted-foreground/60'"
                   [title]="message.isRead ? ('messaging.read' | translate) : ('messaging.delivered' | translate)"></i>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Message Input -->
      <div class="p-6 border-t border-black/5 dark:border-white/5">
        <form [formGroup]="messageForm" (ngSubmit)="sendMessage()" class="flex gap-3">
          <div class="flex-1 relative">
            <input formControlName="content" 
                   type="text" 
                   [placeholder]="'messaging.messagePlaceholder' | translate"
                   class="w-full bg-secondary/30 dark:bg-white/5 border-2 border-transparent focus:border-primary/20 rounded-full px-6 py-3 outline-none transition-all text-foreground font-bold">
            <button type="button" 
                    class="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full hover:bg-primary/5 flex items-center justify-center text-muted-foreground hover:text-primary transition-all"
                    [title]="'messaging.attachFile' | translate">
              <i class="fas fa-paperclip text-sm"></i>
            </button>
          </div>
          <button type="submit" 
                  [disabled]="!messageForm.valid || sending"
                  class="w-12 h-12 bg-primary text-white rounded-full hover:scale-105 active:scale-95 transition-all shadow-lg shadow-primary/25 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed">
            <i *ngIf="!sending" class="fas fa-paper-plane text-sm"></i>
            <i *ngIf="sending" class="fas fa-spinner fa-spin text-sm"></i>
          </button>
        </form>
      </div>
    </div>
  `,
  host: { 'class': 'block' }
})
export class MessageInterfaceComponent implements OnInit, OnDestroy {
  @Input() conversation: Conversation | null = null;
  
  messages: Message[] = [];
  messageForm: FormGroup;
  sending = false;
  
  private destroy$ = new Subject<void>();
  private translationService = inject(TranslationService);

  constructor(
    private fb: FormBuilder,
    private translate: TranslateService
  ) {
    this.messageForm = this.fb.group({
      content: ['', [Validators.required, Validators.minLength(1)]]
    });
  }

  async ngOnInit(): Promise<void> {
    // Load social feature translations for messaging from backend API
    await this.loadSocialTranslations();
    
    // Load mock messages for demonstration
    this.loadMessages();
    
    // Subscribe to language changes to reload translations and messages
    this.translationService.currentLanguage$
      .pipe(takeUntil(this.destroy$))
      .subscribe(async (newLanguage) => {
        await this.loadSocialTranslations();
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private async loadSocialTranslations(): Promise<void> {
    try {
      const currentLanguage = this.translationService.getCurrentLanguage().code;
      
      // Load social translations from backend API
      await this.translationService.loadSingleFeatureTranslations(currentLanguage, 'social');
      
      // Update ngx-translate with the loaded translations
      const translations = await this.translationService.loadTranslations(currentLanguage, 'social').toPromise();
      this.translate.setTranslation(currentLanguage, translations, true);
      
      console.log('Social translations loaded for messaging interface from backend API');
      
      // Reload messages with new translations
      this.loadMessages();
    } catch (error) {
      console.error('Failed to load social translations for messaging:', error);
      // Fallback to English if current language fails
      if (this.translationService.getCurrentLanguage().code !== 'en-US') {
        try {
          const fallbackTranslations = await this.translationService.loadTranslations('en-US', 'social').toPromise();
          this.translate.setTranslation('en-US', fallbackTranslations, true);
          this.loadMessages(); // Reload with fallback translations
        } catch (fallbackError) {
          console.error('Failed to load fallback translations:', fallbackError);
        }
      }
    }
  }

  private loadMessages(): void {
    // Mock messages for demonstration
    this.messages = [
      {
        id: '1',
        senderId: 'other',
        senderName: this.conversation?.participantName || 'Friend',
        content: this.translate.instant('messaging.sampleMessage1', { default: 'Hello! How are you doing?' }),
        timestamp: new Date(Date.now() - 3600000), // 1 hour ago
        isRead: true,
        isOwn: false
      },
      {
        id: '2',
        senderId: 'me',
        senderName: 'Me',
        content: this.translate.instant('messaging.sampleMessage2', { default: 'Hi! I\'m doing great, thanks for asking!' }),
        timestamp: new Date(Date.now() - 3000000), // 50 minutes ago
        isRead: true,
        isOwn: true
      },
      {
        id: '3',
        senderId: 'other',
        senderName: this.conversation?.participantName || 'Friend',
        content: this.translate.instant('messaging.sampleMessage3', { default: 'That\'s wonderful to hear! Are you free to chat about cars?' }),
        timestamp: new Date(Date.now() - 1800000), // 30 minutes ago
        isRead: true,
        isOwn: false
      }
    ];
  }

  sendMessage(): void {
    if (!this.messageForm.valid || this.sending) return;

    const content = this.messageForm.get('content')?.value?.trim();
    if (!content) return;

    this.sending = true;

    // Simulate sending message
    setTimeout(() => {
      const newMessage: Message = {
        id: Date.now().toString(),
        senderId: 'me',
        senderName: 'Me',
        content: content,
        timestamp: new Date(),
        isRead: false,
        isOwn: true
      };

      this.messages.push(newMessage);
      this.messageForm.reset();
      this.sending = false;

      // Show localized success notification with RTL support
      const successMessage = this.translate.instant('messaging.messageSent');
      const isRTL = this.translationService.isCurrentLanguageRTL();
      
      console.log(`${successMessage} (${isRTL ? 'RTL' : 'LTR'})`);
      this.showLocalizedMessageNotification(successMessage, 'success', isRTL);

      // Simulate auto-reply after a delay
      setTimeout(() => {
        this.simulateLocalizedReply();
      }, 2000);
    }, 1000);
  }

  private simulateLocalizedReply(): void {
    const replies = [
      'messaging.autoReply1',
      'messaging.autoReply2', 
      'messaging.autoReply3'
    ];
    
    const randomReply = replies[Math.floor(Math.random() * replies.length)];
    const replyContent = this.translate.instant(randomReply, { 
      default: 'Thanks for your message! I\'ll get back to you soon.' 
    });

    const replyMessage: Message = {
      id: Date.now().toString(),
      senderId: 'other',
      senderName: this.conversation?.participantName || 'Friend',
      content: replyContent,
      timestamp: new Date(),
      isRead: false,
      isOwn: false
    };

    this.messages.push(replyMessage);
    
    // Show localized notification for received message
    const receivedMessage = this.translate.instant('messaging.messageReceived');
    const isRTL = this.translationService.isCurrentLanguageRTL();
    this.showLocalizedMessageNotification(receivedMessage, 'info', isRTL);
  }

  private showLocalizedMessageNotification(message: string, type: 'success' | 'info' | 'error', isRTL: boolean): void {
    // Create a temporary notification element for visual feedback
    const notification = document.createElement('div');
    notification.className = `fixed bottom-4 ${isRTL ? 'left-4' : 'right-4'} z-50 p-3 rounded-lg shadow-lg transition-all duration-300 ${
      type === 'success' ? 'bg-green-500 text-white' : 
      type === 'info' ? 'bg-blue-500 text-white' : 'bg-red-500 text-white'
    }`;
    notification.textContent = message;
    notification.style.direction = isRTL ? 'rtl' : 'ltr';
    notification.style.fontFamily = isRTL ? 'Arial, sans-serif' : 'inherit';
    
    document.body.appendChild(notification);
    
    // Remove after 2 seconds
    setTimeout(() => {
      notification.remove();
    }, 2000);
  }

  getInitials(name: string): string {
    if (!name) return '?';
    const parts = name.split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name[0].toUpperCase();
  }
}