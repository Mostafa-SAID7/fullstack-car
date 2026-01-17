import { Component, input, output, computed, signal, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MessageDto, MessageType } from '../../../../core/models/messaging.model';
import { MessageItemComponent } from '../message-item/message-item.component';

/**
 * Message List Component
 * 
 * Displays a scrollable list of messages in a conversation
 */
@Component({
  selector: 'app-message-list',
  standalone: true,
  imports: [CommonModule, MessageItemComponent],
  template: `
    <div 
      #messagesContainer
      class="message-list flex-1 overflow-y-auto p-4 space-y-4"
      (scroll)="onScroll($event)">
      
      <!-- Load More Button -->
      @if (hasMore() && !isLoading()) {
        <div class="text-center">
          <button 
            (click)="onLoadMore()"
            class="px-4 py-2 text-sm text-primary hover:text-primary/80 transition-colors">
            Load older messages
          </button>
        </div>
      }

      <!-- Loading Indicator -->
      @if (isLoading()) {
        <div class="text-center py-4">
          <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto"></div>
        </div>
      }

      <!-- Messages -->
      @if (groupedMessages().length > 0) {
        @for (group of groupedMessages(); track group.date) {
          <!-- Date Separator -->
          <div class="flex items-center justify-center py-2">
            <div class="bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-full">
              <span class="text-xs text-gray-600 dark:text-gray-400 font-medium">
                {{ group.dateLabel }}
              </span>
            </div>
          </div>

          <!-- Messages for this date -->
          @for (message of group.messages; track message.id) {
            <app-message-item
              [message]="message"
              [isOwn]="message.senderId === currentUserId()"
              [showAvatar]="shouldShowAvatar(message, $index, group.messages)"
              [showTimestamp]="shouldShowTimestamp(message, $index, group.messages)"
              (replyClick)="onReplyClick($event)"
              (editClick)="onEditClick($event)"
              (deleteClick)="onDeleteClick($event)"
              (reactClick)="onReactClick($event)">
            </app-message-item>
          }
        }
      } @else if (!isLoading()) {
        <!-- Empty State -->
        <div class="flex-1 flex items-center justify-center">
          <div class="text-center">
            <i class="fa-solid fa-comment-dots text-4xl text-gray-300 dark:text-gray-600 mb-4"></i>
            <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No messages yet
            </h3>
            <p class="text-gray-600 dark:text-gray-400">
              Start the conversation by sending a message
            </p>
          </div>
        </div>
      }

      <!-- Scroll to Bottom Button -->
      @if (showScrollButton()) {
        <button
          (click)="scrollToBottom()"
          class="fixed bottom-20 right-6 bg-primary text-white p-3 rounded-full shadow-lg hover:bg-primary/90 transition-colors z-10">
          <i class="fa-solid fa-arrow-down"></i>
        </button>
      }
    </div>
  `
})
export class MessageListComponent implements AfterViewInit {
  @ViewChild('messagesContainer') messagesContainer!: ElementRef;

  // Input properties
  messages = input.required<MessageDto[]>();
  currentUserId = input.required<string>();
  isLoading = input<boolean>(false);
  hasMore = input<boolean>(false);

  // Output events
  loadMore = output<void>();
  messageReply = output<MessageDto>();
  messageEdit = output<MessageDto>();
  messageDelete = output<MessageDto>();
  messageReact = output<{ message: MessageDto; emoji: string }>();

  // Local state
  showScrollButton = signal(false);
  private lastScrollTop = 0;

  // Computed properties
  readonly groupedMessages = computed(() => {
    const messages = this.messages();
    const groups: { date: string; dateLabel: string; messages: MessageDto[] }[] = [];
    
    messages.forEach(message => {
      const messageDate = new Date(message.createdAt);
      const dateKey = messageDate.toDateString();
      const dateLabel = this.formatDateLabel(messageDate);
      
      let group = groups.find(g => g.date === dateKey);
      if (!group) {
        group = { date: dateKey, dateLabel, messages: [] };
        groups.push(group);
      }
      
      group.messages.push(message);
    });
    
    return groups;
  });

  ngAfterViewInit(): void {
    this.scrollToBottom();
  }

  private formatDateLabel(date: Date): string {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000);
    const messageDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());

    if (messageDate.getTime() === today.getTime()) {
      return 'Today';
    } else if (messageDate.getTime() === yesterday.getTime()) {
      return 'Yesterday';
    } else if (now.getTime() - messageDate.getTime() < 7 * 24 * 60 * 60 * 1000) {
      return date.toLocaleDateString('en-US', { weekday: 'long' });
    } else {
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric',
        year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
      });
    }
  }

  shouldShowAvatar(message: MessageDto, index: number, messages: MessageDto[]): boolean {
    // Show avatar for the last message from each sender in a group
    const nextMessage = messages[index + 1];
    return !nextMessage || nextMessage.senderId !== message.senderId;
  }

  shouldShowTimestamp(message: MessageDto, index: number, messages: MessageDto[]): boolean {
    // Show timestamp every 5 minutes or when sender changes
    const nextMessage = messages[index + 1];
    if (!nextMessage || nextMessage.senderId !== message.senderId) {
      return true;
    }
    
    const currentTime = new Date(message.createdAt).getTime();
    const nextTime = new Date(nextMessage.createdAt).getTime();
    return (nextTime - currentTime) > 5 * 60 * 1000; // 5 minutes
  }

  onScroll(event: Event): void {
    const element = event.target as HTMLElement;
    const scrollTop = element.scrollTop;
    const scrollHeight = element.scrollHeight;
    const clientHeight = element.clientHeight;

    // Show/hide scroll to bottom button
    const isNearBottom = scrollTop + clientHeight >= scrollHeight - 100;
    this.showScrollButton.set(!isNearBottom);

    // Load more messages when scrolling to top
    if (scrollTop === 0 && this.hasMore() && !this.isLoading()) {
      this.onLoadMore();
    }

    this.lastScrollTop = scrollTop;
  }

  scrollToBottom(): void {
    if (this.messagesContainer?.nativeElement) {
      const element = this.messagesContainer.nativeElement;
      element.scrollTop = element.scrollHeight;
      this.showScrollButton.set(false);
    }
  }

  onLoadMore(): void {
    this.loadMore.emit();
  }

  onReplyClick(message: MessageDto): void {
    this.messageReply.emit(message);
  }

  onEditClick(message: MessageDto): void {
    this.messageEdit.emit(message);
  }

  onDeleteClick(message: MessageDto): void {
    this.messageDelete.emit(message);
  }

  onReactClick(event: { message: MessageDto; emoji: string }): void {
    this.messageReact.emit(event);
  }
}