import { Component, input, output, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConversationDto, ConversationType, TypingIndicator, OnlineStatus } from '../../../../core/models/messaging.model';

/**
 * Conversation Header Component
 * 
 * Header for chat window showing conversation info and actions
 */
@Component({
  selector: 'app-conversation-header',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="conversation-header flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
      <!-- Conversation Info -->
      <div class="flex items-center space-x-3">
        <!-- Avatar -->
        <div class="relative">
          @if (conversation().avatar) {
            <img 
              [src]="conversation().avatar" 
              [alt]="conversationName()"
              class="w-10 h-10 rounded-full">
          } @else {
            <div class="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
              <span class="text-lg font-medium text-primary">
                {{ conversationInitial() }}
              </span>
            </div>
          }
          
          <!-- Online Status (for direct conversations) -->
          @if (conversation().type === ConversationType.Direct && isOnline()) {
            <div class="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-white dark:border-gray-900 rounded-full"></div>
          }
        </div>

        <!-- Name and Status -->
        <div class="flex-1 min-w-0">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white truncate">
            {{ conversationName() }}
          </h3>
          
          <div class="text-sm text-gray-600 dark:text-gray-400">
            @if (typingUsers().length > 0) {
              <span class="text-primary">{{ typingText() }}</span>
            } @else if (conversation().type === ConversationType.Direct) {
              @if (isOnline()) {
                <span class="text-green-600">Online</span>
              } @else if (lastSeen()) {
                <span>Last seen {{ formatLastSeen(lastSeen()!) }}</span>
              } @else {
                <span>Offline</span>
              }
            } @else {
              <span>{{ memberCount() }} members</span>
            }
          </div>
        </div>
      </div>

      <!-- Actions -->
      <div class="flex items-center space-x-2">
        <!-- Video Call -->
        @if (conversation().type === ConversationType.Direct) {
          <button
            (click)="onVideoCall()"
            class="p-2 text-gray-500 hover:text-primary hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
            title="Video call">
            <i class="fa-solid fa-video"></i>
          </button>

          <!-- Audio Call -->
          <button
            (click)="onAudioCall()"
            class="p-2 text-gray-500 hover:text-primary hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
            title="Audio call">
            <i class="fa-solid fa-phone"></i>
          </button>
        }

        <!-- Search -->
        <button
          (click)="onSearch()"
          class="p-2 text-gray-500 hover:text-primary hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
          title="Search messages">
          <i class="fa-solid fa-search"></i>
        </button>

        <!-- Info -->
        <button
          (click)="onInfo()"
          class="p-2 text-gray-500 hover:text-primary hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
          title="Conversation info">
          <i class="fa-solid fa-info-circle"></i>
        </button>

        <!-- More Options -->
        <div class="relative">
          <button
            (click)="toggleMenu()"
            class="p-2 text-gray-500 hover:text-primary hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
            title="More options">
            <i class="fa-solid fa-ellipsis-vertical"></i>
          </button>

          <!-- Dropdown Menu -->
          @if (showMenu()) {
            <div class="absolute right-0 top-full mt-1 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-10">
              <div class="py-1">
                <!-- Mute/Unmute -->
                <button
                  (click)="onToggleMute()"
                  class="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                  <i [class]="conversation().isMuted ? 'fa-solid fa-volume-up' : 'fa-solid fa-volume-mute'" class="mr-2"></i>
                  {{ conversation().isMuted ? 'Unmute' : 'Mute' }}
                </button>

                <!-- Archive/Unarchive -->
                <button
                  (click)="onToggleArchive()"
                  class="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                  <i [class]="conversation().isArchived ? 'fa-solid fa-box-open' : 'fa-solid fa-archive'" class="mr-2"></i>
                  {{ conversation().isArchived ? 'Unarchive' : 'Archive' }}
                </button>

                <!-- Clear History -->
                <button
                  (click)="onClearHistory()"
                  class="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                  <i class="fa-solid fa-trash mr-2"></i>
                  Clear history
                </button>

                @if (conversation().type === ConversationType.Group) {
                  <hr class="my-1 border-gray-200 dark:border-gray-700">
                  
                  <!-- Leave Group -->
                  <button
                    (click)="onLeaveGroup()"
                    class="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
                    <i class="fa-solid fa-sign-out-alt mr-2"></i>
                    Leave group
                  </button>
                }
              </div>
            </div>
          }
        </div>
      </div>
    </div>
  `
})
export class ConversationHeaderComponent {
  // Input properties
  conversation = input.required<ConversationDto>();
  onlineUsers = input<OnlineStatus[]>([]);
  typingUsers = input<TypingIndicator[]>([]);

  // Output events
  videoCallClick = output<void>();
  audioCallClick = output<void>();
  infoClick = output<void>();
  settingsClick = output<void>();

  // Local state
  private showMenu = signal(false);

  // Expose enums for template
  readonly ConversationType = ConversationType;

  // Computed properties
  readonly conversationName = computed(() => {
    const conv = this.conversation();
    if (conv.type === ConversationType.Group) {
      return conv.name || 'Group Chat';
    } else {
      // For direct conversations, show the other participant's name
      const otherParticipant = conv.participants.find(p => p.userId !== this.getCurrentUserId());
      return otherParticipant?.userName || 'Unknown User';
    }
  });

  readonly conversationInitial = computed(() => {
    const name = this.conversationName();
    return name.charAt(0).toUpperCase();
  });

  readonly memberCount = computed(() => {
    return this.conversation().participants.length;
  });

  readonly isOnline = computed(() => {
    if (this.conversation().type !== ConversationType.Direct) return false;
    
    const otherParticipant = this.conversation().participants.find(p => p.userId !== this.getCurrentUserId());
    if (!otherParticipant) return false;
    
    const onlineStatus = this.onlineUsers().find(u => u.userId === otherParticipant.userId);
    return onlineStatus?.isOnline || false;
  });

  readonly lastSeen = computed(() => {
    if (this.conversation().type !== ConversationType.Direct) return null;
    
    const otherParticipant = this.conversation().participants.find(p => p.userId !== this.getCurrentUserId());
    if (!otherParticipant) return null;
    
    const onlineStatus = this.onlineUsers().find(u => u.userId === otherParticipant.userId);
    return onlineStatus?.lastSeen || otherParticipant.lastSeen;
  });

  readonly typingText = computed(() => {
    const typing = this.typingUsers();
    if (typing.length === 0) return '';
    if (typing.length === 1) return `${typing[0].userName} is typing...`;
    if (typing.length === 2) return `${typing[0].userName} and ${typing[1].userName} are typing...`;
    return `${typing[0].userName} and ${typing.length - 1} others are typing...`;
  });

  private getCurrentUserId(): string {
    // This should be injected from AuthService in a real implementation
    return 'current-user-id';
  }

  formatLastSeen(timestamp: string): string {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 1) return 'just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    
    return date.toLocaleDateString();
  }

  toggleMenu(): void {
    this.showMenu.update(show => !show);
  }

  onVideoCall(): void {
    this.showMenu.set(false);
    this.videoCallClick.emit();
  }

  onAudioCall(): void {
    this.showMenu.set(false);
    this.audioCallClick.emit();
  }

  onSearch(): void {
    this.showMenu.set(false);
    // Implement search functionality
    console.log('Search messages');
  }

  onInfo(): void {
    this.showMenu.set(false);
    this.infoClick.emit();
  }

  onToggleMute(): void {
    this.showMenu.set(false);
    // Implement mute/unmute functionality
    console.log('Toggle mute');
  }

  onToggleArchive(): void {
    this.showMenu.set(false);
    // Implement archive/unarchive functionality
    console.log('Toggle archive');
  }

  onClearHistory(): void {
    this.showMenu.set(false);
    if (confirm('Are you sure you want to clear the conversation history? This action cannot be undone.')) {
      // Implement clear history functionality
      console.log('Clear history');
    }
  }

  onLeaveGroup(): void {
    this.showMenu.set(false);
    if (confirm('Are you sure you want to leave this group?')) {
      // Implement leave group functionality
      console.log('Leave group');
    }
  }
}