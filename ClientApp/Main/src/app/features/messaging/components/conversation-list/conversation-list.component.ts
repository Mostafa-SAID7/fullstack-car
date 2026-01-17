import { Component, input, output, computed, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ConversationDto, ConversationType } from '../../../../core/models/messaging.model';
import { MessagingService } from '../../../../core/services/messaging.service';

/**
 * Conversation List Component
 * 
 * Sidebar showing list of conversations
 */
@Component({
  selector: 'app-conversation-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="conversation-list flex flex-col h-full bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700">
      <!-- Header -->
      <div class="p-4 border-b border-gray-200 dark:border-gray-700">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-xl font-semibold text-gray-900 dark:text-white">
            Messages
          </h2>
          <button
            (click)="onNewConversation()"
            class="p-2 text-gray-500 hover:text-primary hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
            title="New conversation">
            <i class="fa-solid fa-plus"></i>
          </button>
        </div>

        <!-- Search -->
        <div class="relative">
          <input
            type="text"
            [(ngModel)]="searchQuery"
            (input)="onSearchInput()"
            placeholder="Search conversations..."
            class="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-primary focus:border-transparent">
          <i class="fa-solid fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
          
          @if (searchQuery()) {
            <button
              (click)="clearSearch()"
              class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
              <i class="fa-solid fa-times"></i>
            </button>
          }
        </div>
      </div>

      <!-- Filter Tabs -->
      <div class="flex border-b border-gray-200 dark:border-gray-700">
        <button
          (click)="setFilter('all')"
          [class]="getTabClasses('all')"
          class="flex-1 px-4 py-3 text-sm font-medium transition-colors">
          All
          @if (totalCount() > 0) {
            <span class="ml-1 text-xs bg-gray-200 dark:bg-gray-700 px-2 py-0.5 rounded-full">
              {{ totalCount() }}
            </span>
          }
        </button>
        <button
          (click)="setFilter('unread')"
          [class]="getTabClasses('unread')"
          class="flex-1 px-4 py-3 text-sm font-medium transition-colors">
          Unread
          @if (unreadCount() > 0) {
            <span class="ml-1 text-xs bg-primary text-white px-2 py-0.5 rounded-full">
              {{ unreadCount() }}
            </span>
          }
        </button>
        <button
          (click)="setFilter('archived')"
          [class]="getTabClasses('archived')"
          class="flex-1 px-4 py-3 text-sm font-medium transition-colors">
          Archived
        </button>
      </div>

      <!-- Conversation List -->
      <div class="flex-1 overflow-y-auto">
        @if (isLoading()) {
          <div class="flex items-center justify-center py-8">
            <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
          </div>
        } @else if (filteredConversations().length === 0) {
          <!-- Empty State -->
          <div class="flex flex-col items-center justify-center py-8 px-4">
            <i class="fa-solid fa-comments text-4xl text-gray-300 dark:text-gray-600 mb-4"></i>
            <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">
              {{ getEmptyStateTitle() }}
            </h3>
            <p class="text-gray-600 dark:text-gray-400 text-center text-sm">
              {{ getEmptyStateMessage() }}
            </p>
            @if (activeFilter() === 'all') {
              <button
                (click)="onNewConversation()"
                class="mt-4 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors">
                Start a conversation
              </button>
            }
          </div>
        } @else {
          <!-- Conversations -->
          @for (conversation of filteredConversations(); track conversation.id) {
            <div
              (click)="onSelectConversation(conversation)"
              [class]="getConversationClasses(conversation)"
              class="flex items-center p-4 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-colors border-b border-gray-100 dark:border-gray-800">
              
              <!-- Avatar -->
              <div class="relative flex-shrink-0 mr-3">
                @if (conversation.avatar) {
                  <img 
                    [src]="conversation.avatar" 
                    [alt]="getConversationName(conversation)"
                    class="w-12 h-12 rounded-full">
                } @else {
                  <div class="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                    <span class="text-lg font-medium text-primary">
                      {{ getConversationInitial(conversation) }}
                    </span>
                  </div>
                }
                
                <!-- Online Status -->
                @if (conversation.type === ConversationType.Direct && isUserOnline(conversation)) {
                  <div class="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-white dark:border-gray-900 rounded-full"></div>
                }

                <!-- Unread Badge -->
                @if (conversation.unreadCount > 0) {
                  <div class="absolute -top-1 -right-1 bg-primary text-white text-xs rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1">
                    {{ conversation.unreadCount > 99 ? '99+' : conversation.unreadCount }}
                  </div>
                }
              </div>

              <!-- Content -->
              <div class="flex-1 min-w-0">
                <!-- Name and Time -->
                <div class="flex items-center justify-between mb-1">
                  <h4 class="text-sm font-medium text-gray-900 dark:text-white truncate">
                    {{ getConversationName(conversation) }}
                  </h4>
                  <span class="text-xs text-gray-500 dark:text-gray-400 flex-shrink-0 ml-2">
                    {{ formatTime(conversation.updatedAt || conversation.createdAt) }}
                  </span>
                </div>

                <!-- Last Message -->
                <div class="flex items-center justify-between">
                  <p class="text-sm text-gray-600 dark:text-gray-400 truncate">
                    @if (conversation.lastMessage) {
                      @if (conversation.lastMessage.type === 'text') {
                        {{ conversation.lastMessage.content }}
                      } @else {
                        <span class="italic">
                          <i [class]="getMessageTypeIcon(conversation.lastMessage.type)" class="mr-1"></i>
                          {{ getMessageTypeLabel(conversation.lastMessage.type) }}
                        </span>
                      }
                    } @else {
                      <span class="italic">No messages yet</span>
                    }
                  </p>

                  <!-- Status Icons -->
                  <div class="flex items-center space-x-1 flex-shrink-0 ml-2">
                    @if (conversation.isMuted) {
                      <i class="fa-solid fa-volume-mute text-gray-400 text-xs"></i>
                    }
                    @if (conversation.isArchived) {
                      <i class="fa-solid fa-archive text-gray-400 text-xs"></i>
                    }
                  </div>
                </div>
              </div>
            </div>
          }
        }
      </div>
    </div>
  `
})
export class ConversationListComponent {
  private messagingService = inject(MessagingService);

  // Input properties
  conversations = input.required<ConversationDto[]>();
  selectedConversation = input<ConversationDto | null>(null);
  isLoading = input<boolean>(false);

  // Output events
  conversationSelect = output<ConversationDto>();
  newConversation = output<void>();

  // Local state
  searchQuery = signal('');
  activeFilter = signal<'all' | 'unread' | 'archived'>('all');

  // Expose enums for template
  readonly ConversationType = ConversationType;

  // Computed properties
  readonly filteredConversations = computed(() => {
    let filtered = this.conversations();
    
    // Apply filter
    switch (this.activeFilter()) {
      case 'unread':
        filtered = filtered.filter(c => c.unreadCount > 0);
        break;
      case 'archived':
        filtered = filtered.filter(c => c.isArchived);
        break;
      default:
        filtered = filtered.filter(c => !c.isArchived);
    }
    
    // Apply search
    const query = this.searchQuery().toLowerCase();
    if (query) {
      filtered = filtered.filter(c => {
        const name = this.getConversationName(c).toLowerCase();
        const lastMessage = c.lastMessage?.content?.toLowerCase() || '';
        return name.includes(query) || lastMessage.includes(query);
      });
    }
    
    // Sort by last activity
    return filtered.sort((a, b) => {
      const aTime = new Date(a.updatedAt || a.createdAt).getTime();
      const bTime = new Date(b.updatedAt || b.createdAt).getTime();
      return bTime - aTime;
    });
  });

  readonly totalCount = computed(() => 
    this.conversations().filter(c => !c.isArchived).length
  );

  readonly unreadCount = computed(() => 
    this.conversations().filter(c => !c.isArchived && c.unreadCount > 0).length
  );

  getConversationName(conversation: ConversationDto): string {
    if (conversation.type === ConversationType.Group) {
      return conversation.name || 'Group Chat';
    } else {
      // For direct conversations, show the other participant's name
      const otherParticipant = conversation.participants.find(p => p.userId !== this.getCurrentUserId());
      return otherParticipant?.userName || 'Unknown User';
    }
  }

  getConversationInitial(conversation: ConversationDto): string {
    const name = this.getConversationName(conversation);
    return name.charAt(0).toUpperCase();
  }

  getConversationClasses(conversation: ConversationDto): string {
    const base = '';
    const selected = this.selectedConversation()?.id === conversation.id;
    const unread = conversation.unreadCount > 0;
    
    let classes = base;
    if (selected) classes += ' bg-primary/10 border-r-2 border-primary';
    if (unread) classes += ' font-medium';
    
    return classes;
  }

  getTabClasses(filter: 'all' | 'unread' | 'archived'): string {
    const base = 'border-b-2 transition-colors';
    const active = this.activeFilter() === filter;
    
    return active 
      ? `${base} border-primary text-primary`
      : `${base} border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white`;
  }

  getMessageTypeIcon(type: string): string {
    switch (type) {
      case 'image': return 'fa-solid fa-image';
      case 'file': return 'fa-solid fa-file';
      case 'audio': return 'fa-solid fa-microphone';
      case 'video': return 'fa-solid fa-video';
      default: return 'fa-solid fa-comment';
    }
  }

  getMessageTypeLabel(type: string): string {
    switch (type) {
      case 'image': return 'Photo';
      case 'file': return 'File';
      case 'audio': return 'Audio';
      case 'video': return 'Video';
      default: return 'Message';
    }
  }

  getEmptyStateTitle(): string {
    switch (this.activeFilter()) {
      case 'unread': return 'No unread messages';
      case 'archived': return 'No archived conversations';
      default: return 'No conversations';
    }
  }

  getEmptyStateMessage(): string {
    switch (this.activeFilter()) {
      case 'unread': return 'All caught up! No unread messages.';
      case 'archived': return 'No archived conversations found.';
      default: return this.searchQuery() 
        ? 'No conversations match your search.'
        : 'Start a new conversation to get started.';
    }
  }

  isUserOnline(conversation: ConversationDto): boolean {
    // This would check online status from the service
    // For now, return false as placeholder
    return false;
  }

  formatTime(timestamp: string): string {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 1) return 'now';
    if (diffMins < 60) return `${diffMins}m`;
    if (diffHours < 24) return `${diffHours}h`;
    if (diffDays < 7) return `${diffDays}d`;
    
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  }

  private getCurrentUserId(): string {
    // This should be injected from AuthService in a real implementation
    return 'current-user-id';
  }

  setFilter(filter: 'all' | 'unread' | 'archived'): void {
    this.activeFilter.set(filter);
  }

  onSearchInput(): void {
    // Search is reactive through the signal
  }

  clearSearch(): void {
    this.searchQuery.set('');
  }

  onSelectConversation(conversation: ConversationDto): void {
    this.conversationSelect.emit(conversation);
  }

  onNewConversation(): void {
    this.newConversation.emit();
  }
}