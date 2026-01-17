import { Component, computed, signal, inject, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConversationDto, MessageDto, TypingIndicator, OnlineStatus } from '../../../../core/models/messaging.model';
import { MessagingService } from '../../../../core/services/messaging.service';
import { ConversationListComponent } from '../../components/conversation-list/conversation-list.component';
import { ChatWindowComponent } from '../../components/chat-window/chat-window.component';
import { Subscription } from 'rxjs';

/**
 * Messaging Page Component
 * 
 * Main messaging interface with conversation list and chat window
 */
@Component({
  selector: 'app-messaging-page',
  standalone: true,
  imports: [CommonModule, ConversationListComponent, ChatWindowComponent],
  template: `
    <div class="messaging-page flex h-screen bg-gray-50 dark:bg-gray-900">
      <!-- Sidebar -->
      <div class="w-80 flex-shrink-0">
        <app-conversation-list
          [conversations]="conversations()"
          [selectedConversation]="selectedConversation()"
          [isLoading]="isLoading()"
          (conversationSelect)="onConversationSelect($event)"
          (newConversation)="onNewConversation()">
        </app-conversation-list>
      </div>

      <!-- Main Chat Area -->
      <div class="flex-1 flex flex-col">
        <app-chat-window
          [conversation]="selectedConversation()"
          [onlineUsers]="onlineUsers()"
          [typingUsers]="typingUsers()"
          (videoCallClick)="onVideoCall($event)"
          (audioCallClick)="onAudioCall($event)"
          (showInfo)="onShowInfo($event)"
          (showSettings)="onShowSettings($event)"
          (messageSent)="onMessageSent($event)">
        </app-chat-window>
      </div>

      <!-- Info Panel (if shown) -->
      @if (showInfoPanel()) {
        <div class="w-80 flex-shrink-0 border-l border-gray-200 dark:border-gray-700">
          <!-- Conversation Info Panel -->
          <div class="h-full bg-white dark:bg-gray-900 p-6">
            <div class="flex items-center justify-between mb-6">
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
                Conversation Info
              </h3>
              <button
                (click)="closeInfoPanel()"
                class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                <i class="fa-solid fa-times"></i>
              </button>
            </div>

            @if (selectedConversation()) {
              <!-- Conversation Details -->
              <div class="space-y-6">
                <!-- Avatar and Name -->
                <div class="text-center">
                  @if (selectedConversation()!.avatar) {
                    <img 
                      [src]="selectedConversation()!.avatar" 
                      [alt]="conversationName()"
                      class="w-20 h-20 rounded-full mx-auto mb-4">
                  } @else {
                    <div class="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4">
                      <span class="text-2xl font-medium text-primary">
                        {{ conversationInitial() }}
                      </span>
                    </div>
                  }
                  <h4 class="text-xl font-semibold text-gray-900 dark:text-white">
                    {{ conversationName() }}
                  </h4>
                  @if (selectedConversation()!.description) {
                    <p class="text-gray-600 dark:text-gray-400 mt-2">
                      {{ selectedConversation()!.description }}
                    </p>
                  }
                </div>

                <!-- Participants -->
                <div>
                  <h5 class="text-sm font-medium text-gray-900 dark:text-white mb-3">
                    Participants ({{ selectedConversation()!.participants.length }})
                  </h5>
                  <div class="space-y-2">
                    @for (participant of selectedConversation()!.participants; track participant.userId) {
                      <div class="flex items-center space-x-3">
                        @if (participant.userAvatar) {
                          <img 
                            [src]="participant.userAvatar" 
                            [alt]="participant.userName"
                            class="w-8 h-8 rounded-full">
                        } @else {
                          <div class="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                            <span class="text-sm font-medium text-gray-600 dark:text-gray-400">
                              {{ participant.userName.charAt(0).toUpperCase() }}
                            </span>
                          </div>
                        }
                        <div class="flex-1">
                          <div class="text-sm font-medium text-gray-900 dark:text-white">
                            {{ participant.userName }}
                          </div>
                          <div class="text-xs text-gray-500 dark:text-gray-400">
                            {{ participant.role }}
                          </div>
                        </div>
                        @if (participant.isOnline) {
                          <div class="w-2 h-2 bg-green-500 rounded-full"></div>
                        }
                      </div>
                    }
                  </div>
                </div>

                <!-- Actions -->
                <div class="space-y-2">
                  <button class="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors">
                    <i class="fa-solid fa-search mr-3"></i>
                    Search in conversation
                  </button>
                  <button class="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors">
                    <i class="fa-solid fa-bell mr-3"></i>
                    Notification settings
                  </button>
                  <button class="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors">
                    <i class="fa-solid fa-palette mr-3"></i>
                    Change theme
                  </button>
                </div>
              </div>
            }
          </div>
        </div>
      }
    </div>

    <!-- New Conversation Modal -->
    @if (showNewConversationModal()) {
      <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div class="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md mx-4">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
              New Conversation
            </h3>
            <button
              (click)="closeNewConversationModal()"
              class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
              <i class="fa-solid fa-times"></i>
            </button>
          </div>

          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Search users
              </label>
              <input
                type="text"
                placeholder="Type to search users..."
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-primary focus:border-transparent">
            </div>

            <div class="flex justify-end space-x-3">
              <button
                (click)="closeNewConversationModal()"
                class="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                Cancel
              </button>
              <button
                class="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors">
                Start Conversation
              </button>
            </div>
          </div>
        </div>
      </div>
    }
  `
})
export class MessagingPageComponent implements OnInit, OnDestroy {
  private messagingService = inject(MessagingService);
  private subscriptions = new Subscription();

  // Local state
  selectedConversation = signal<ConversationDto | null>(null);
  showInfoPanel = signal(false);
  showNewConversationModal = signal(false);
  onlineUsers = signal<OnlineStatus[]>([]);
  typingUsers = signal<TypingIndicator[]>([]);

  // Computed properties from service
  readonly conversations = computed(() => this.messagingService.conversations());
  readonly isLoading = computed(() => this.messagingService.isLoading());
  readonly isConnected = computed(() => this.messagingService.isConnected());

  readonly conversationName = computed(() => {
    const conv = this.selectedConversation();
    if (!conv) return '';
    
    if (conv.type === 'group') {
      return conv.name || 'Group Chat';
    } else {
      const otherParticipant = conv.participants.find(p => p.userId !== this.getCurrentUserId());
      return otherParticipant?.userName || 'Unknown User';
    }
  });

  readonly conversationInitial = computed(() => {
    const name = this.conversationName();
    return name.charAt(0).toUpperCase();
  });

  ngOnInit(): void {
    // Load conversations
    this.messagingService.loadConversations().subscribe();

    // Subscribe to real-time events
    this.subscriptions.add(
      this.messagingService.messageReceived$.subscribe(message => {
        this.handleNewMessage(message);
      })
    );

    this.subscriptions.add(
      this.messagingService.typingIndicator$.subscribe(indicator => {
        this.handleTypingIndicator(indicator);
      })
    );

    this.subscriptions.add(
      this.messagingService.onlineStatusChanged$.subscribe(status => {
        this.handleOnlineStatusChange(status);
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  private getCurrentUserId(): string {
    // This should be injected from AuthService in a real implementation
    return 'current-user-id';
  }

  private handleNewMessage(message: MessageDto): void {
    // Show notification if message is not from current conversation
    if (this.selectedConversation()?.id !== message.conversationId) {
      this.showNotification(message);
    }
  }

  private handleTypingIndicator(indicator: TypingIndicator): void {
    this.typingUsers.update(users => {
      const filtered = users.filter(u => 
        u.userId !== indicator.userId || u.conversationId !== indicator.conversationId
      );
      
      if (indicator.isTyping) {
        return [...filtered, indicator];
      } else {
        return filtered;
      }
    });

    // Auto-remove typing indicator after 3 seconds
    if (indicator.isTyping) {
      setTimeout(() => {
        this.typingUsers.update(users => 
          users.filter(u => 
            u.userId !== indicator.userId || 
            u.conversationId !== indicator.conversationId ||
            new Date().getTime() - new Date(u.timestamp).getTime() < 3000
          )
        );
      }, 3000);
    }
  }

  private handleOnlineStatusChange(status: OnlineStatus): void {
    this.onlineUsers.update(users => {
      const filtered = users.filter(u => u.userId !== status.userId);
      return [...filtered, status];
    });
  }

  private showNotification(message: MessageDto): void {
    if ('Notification' in window && Notification.permission === 'granted') {
      const notification = new Notification(`New message from ${message.senderName}`, {
        body: message.content,
        icon: message.senderAvatar || '/assets/icons/default-avatar.png'
      });

      notification.onclick = () => {
        window.focus();
        // Find and select the conversation
        const conversation = this.conversations().find(c => c.id === message.conversationId);
        if (conversation) {
          this.onConversationSelect(conversation);
        }
        notification.close();
      };
    }
  }

  // Event handlers
  onConversationSelect(conversation: ConversationDto): void {
    this.selectedConversation.set(conversation);
    this.showInfoPanel.set(false);
  }

  onNewConversation(): void {
    this.showNewConversationModal.set(true);
  }

  onVideoCall(conversation: ConversationDto): void {
    console.log('Start video call with:', conversation.id);
    // Implement video call functionality
  }

  onAudioCall(conversation: ConversationDto): void {
    console.log('Start audio call with:', conversation.id);
    // Implement audio call functionality
  }

  onShowInfo(conversation: ConversationDto): void {
    this.showInfoPanel.set(true);
  }

  onShowSettings(conversation: ConversationDto): void {
    console.log('Show settings for:', conversation.id);
    // Implement settings functionality
  }

  onMessageSent(message: MessageDto): void {
    console.log('Message sent:', message);
    // Message is already handled by the service
  }

  closeInfoPanel(): void {
    this.showInfoPanel.set(false);
  }

  closeNewConversationModal(): void {
    this.showNewConversationModal.set(false);
  }
}