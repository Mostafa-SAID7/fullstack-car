import { Component, input, output, computed, signal, effect, inject, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ConversationDto, MessageDto, MessageType, TypingIndicator } from '../../../../core/models/messaging.model';
import { MessagingService } from '../../../../core/services/messaging.service';
import { AuthService } from '../../../../core/services/auth.service';
import { MessageListComponent } from '../message-list/message-list.component';
import { MessageInputComponent } from '../message-input/message-input.component';
import { ConversationHeaderComponent } from '../conversation-header/conversation-header.component';

/**
 * Chat Window Component
 * 
 * Main chat interface for real-time messaging
 */
@Component({
  selector: 'app-chat-window',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule, 
    MessageListComponent, 
    MessageInputComponent, 
    ConversationHeaderComponent
  ],
  template: `
    <div class="chat-window flex flex-col h-full bg-white dark:bg-gray-900">
      @if (conversation()) {
        <!-- Header -->
        <app-conversation-header
          [conversation]="conversation()!"
          [onlineUsers]="onlineUsers()"
          [typingUsers]="conversationTypingUsers()"
          (videoCallClick)="onVideoCall()"
          (audioCallClick)="onAudioCall()"
          (infoClick)="onShowInfo()"
          (settingsClick)="onShowSettings()">
        </app-conversation-header>

        <!-- Messages -->
        <div class="flex-1 overflow-hidden">
          <app-message-list
            [messages]="messages()"
            [currentUserId]="currentUserId()"
            [isLoading]="isLoading()"
            [hasMore]="hasMore()"
            (loadMore)="onLoadMore()"
            (messageReply)="onReplyToMessage($event)"
            (messageEdit)="onEditMessage($event)"
            (messageDelete)="onDeleteMessage($event)"
            (messageReact)="onReactToMessage($event)">
          </app-message-list>
        </div>

        <!-- Typing Indicator -->
        @if (conversationTypingUsers().length > 0) {
          <div class="px-4 py-2 text-sm text-gray-500 dark:text-gray-400 border-t border-gray-200 dark:border-gray-700">
            <div class="flex items-center space-x-2">
              <div class="flex space-x-1">
                <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 0.1s"></div>
                <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 0.2s"></div>
              </div>
              <span>{{ typingText() }}</span>
            </div>
          </div>
        }

        <!-- Message Input -->
        <app-message-input
          [conversationId]="conversation()!.id"
          [replyToMessage]="replyToMessage()"
          [editingMessage]="editingMessage()"
          [disabled]="!canSendMessages()"
          (messageSent)="onMessageSent($event)"
          (typingStart)="onTypingStart()"
          (typingStop)="onTypingStop()"
          (cancelReply)="onCancelReply()"
          (cancelEdit)="onCancelEdit()">
        </app-message-input>
      } @else {
        <!-- No Conversation Selected -->
        <div class="flex-1 flex items-center justify-center">
          <div class="text-center">
            <i class="fa-solid fa-comments text-6xl text-gray-300 dark:text-gray-600 mb-4"></i>
            <h3 class="text-xl font-medium text-gray-900 dark:text-white mb-2">
              Select a conversation
            </h3>
            <p class="text-gray-600 dark:text-gray-400">
              Choose a conversation from the sidebar to start messaging
            </p>
          </div>
        </div>
      }
    </div>
  `
})
export class ChatWindowComponent implements AfterViewInit {
  private messagingService = inject(MessagingService);
  private authService = inject(AuthService);

  @ViewChild('messagesContainer') messagesContainer!: ElementRef;

  // Input properties
  conversation = input<ConversationDto | null>(null);
  onlineUsers = input<any[]>([]);
  typingUsers = input<TypingIndicator[]>([]);

  // Output events
  videoCallClick = output<ConversationDto>();
  audioCallClick = output<ConversationDto>();
  showInfo = output<ConversationDto>();
  showSettings = output<ConversationDto>();
  messageSent = output<MessageDto>();

  // Local state
  private replyToMessage = signal<MessageDto | null>(null);
  private editingMessage = signal<MessageDto | null>(null);
  private isLoading = signal(false);
  private hasMore = signal(true);

  // Computed properties
  readonly messages = computed(() => this.messagingService.activeConversationMessages());
  readonly currentUserId = computed(() => this.authService.currentUser()?.id || '');
  readonly canSendMessages = computed(() => {
    const conv = this.conversation();
    return conv && !conv.isArchived;
  });

  readonly conversationTypingUsers = computed(() => {
    const convId = this.conversation()?.id;
    const currentUserId = this.currentUserId();
    return this.typingUsers().filter(t => 
      t.conversationId === convId && 
      t.userId !== currentUserId && 
      t.isTyping
    );
  });

  readonly typingText = computed(() => {
    const typing = this.conversationTypingUsers();
    if (typing.length === 0) return '';
    if (typing.length === 1) return `${typing[0].userName} is typing...`;
    if (typing.length === 2) return `${typing[0].userName} and ${typing[1].userName} are typing...`;
    return `${typing[0].userName} and ${typing.length - 1} others are typing...`;
  });

  constructor() {
    // Auto-scroll to bottom when new messages arrive
    effect(() => {
      const messages = this.messages();
      if (messages.length > 0) {
        setTimeout(() => this.scrollToBottom(), 100);
      }
    });

    // Join conversation when it changes
    effect(() => {
      const conv = this.conversation();
      if (conv) {
        this.messagingService.joinConversation(conv.id);
        this.loadMessages();
      }
    });
  }

  ngAfterViewInit(): void {
    this.scrollToBottom();
  }

  private async loadMessages(): Promise<void> {
    const conv = this.conversation();
    if (!conv) return;

    this.isLoading.set(true);
    
    try {
      await this.messagingService.getMessages(conv.id, { page: 1, pageSize: 50 }).toPromise();
      this.markConversationAsRead();
    } catch (error) {
      console.error('Failed to load messages:', error);
    } finally {
      this.isLoading.set(false);
    }
  }

  private async markConversationAsRead(): Promise<void> {
    const conv = this.conversation();
    if (conv && conv.unreadCount > 0) {
      try {
        await this.messagingService.markConversationAsRead(conv.id).toPromise();
      } catch (error) {
        console.error('Failed to mark conversation as read:', error);
      }
    }
  }

  private scrollToBottom(): void {
    if (this.messagesContainer?.nativeElement) {
      const element = this.messagesContainer.nativeElement;
      element.scrollTop = element.scrollHeight;
    }
  }

  // Event handlers
  onVideoCall(): void {
    const conv = this.conversation();
    if (conv) {
      this.videoCallClick.emit(conv);
    }
  }

  onAudioCall(): void {
    const conv = this.conversation();
    if (conv) {
      this.audioCallClick.emit(conv);
    }
  }

  onShowInfo(): void {
    const conv = this.conversation();
    if (conv) {
      this.showInfo.emit(conv);
    }
  }

  onShowSettings(): void {
    const conv = this.conversation();
    if (conv) {
      this.showSettings.emit(conv);
    }
  }

  onLoadMore(): void {
    // Implement pagination for older messages
    console.log('Load more messages');
  }

  onReplyToMessage(message: MessageDto): void {
    this.replyToMessage.set(message);
    this.editingMessage.set(null);
  }

  onEditMessage(message: MessageDto): void {
    this.editingMessage.set(message);
    this.replyToMessage.set(null);
  }

  onDeleteMessage(message: MessageDto): void {
    if (confirm('Are you sure you want to delete this message?')) {
      this.messagingService.deleteMessage(message.id).subscribe({
        next: () => {
          console.log('Message deleted successfully');
        },
        error: (error) => {
          console.error('Failed to delete message:', error);
        }
      });
    }
  }

  onReactToMessage(event: { message: MessageDto; emoji: string }): void {
    // Implement message reactions
    console.log('React to message:', event);
  }

  onMessageSent(message: MessageDto): void {
    this.replyToMessage.set(null);
    this.editingMessage.set(null);
    this.messageSent.emit(message);
    setTimeout(() => this.scrollToBottom(), 100);
  }

  onTypingStart(): void {
    const conv = this.conversation();
    if (conv) {
      this.messagingService.sendTypingIndicator(conv.id, true);
    }
  }

  onTypingStop(): void {
    const conv = this.conversation();
    if (conv) {
      this.messagingService.sendTypingIndicator(conv.id, false);
    }
  }

  onCancelReply(): void {
    this.replyToMessage.set(null);
  }

  onCancelEdit(): void {
    this.editingMessage.set(null);
  }
}