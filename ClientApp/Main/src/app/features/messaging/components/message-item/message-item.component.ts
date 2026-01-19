import { Component, input, output, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MessageDto, MessageType, MessageStatus } from '../../models/messaging.model';

/**
 * Message Item Component
 * 
 * Displays a single message with appropriate styling and actions
 */
@Component({
  selector: 'app-message-item',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div [class]="messageClasses()">
      <!-- Avatar (for received messages) -->
      @if (!isOwn() && showAvatar()) {
        <div class="flex-shrink-0">
          @if (message().senderAvatar) {
            <img 
              [src]="message().senderAvatar" 
              [alt]="message().senderName"
              class="w-8 h-8 rounded-full">
          } @else {
            <div class="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
              <span class="text-sm font-medium text-primary">
                {{ message().senderName.charAt(0).toUpperCase() }}
              </span>
            </div>
          }
        </div>
      }

      <!-- Message Content -->
      <div [class]="contentClasses()">
        <!-- Sender Name (for received messages) -->
        @if (!isOwn() && showAvatar()) {
          <div class="text-xs text-gray-600 dark:text-gray-400 mb-1">
            {{ message().senderName }}
          </div>
        }

        <!-- Reply Context -->
        @if (message().replyToId) {
          <div class="bg-gray-100 dark:bg-gray-800 border-l-2 border-primary p-2 mb-2 rounded text-sm">
            <div class="text-gray-600 dark:text-gray-400">
              Replying to a message
            </div>
          </div>
        }

        <!-- Message Bubble -->
        <div 
          [class]="bubbleClasses()"
          (contextmenu)="onContextMenu($event)">
          
          <!-- Text Content -->
          @if (message().type === MessageType.Text) {
            <div class="whitespace-pre-wrap break-words">
              {{ message().content }}
            </div>
          }

          <!-- Image Content -->
          @if (message().type === MessageType.Image) {
            <div class="space-y-2">
              @if (message().content) {
                <div class="whitespace-pre-wrap break-words">
                  {{ message().content }}
                </div>
              }
              @if (message().attachments?.length) {
                <div class="grid grid-cols-1 gap-2">
                  @for (attachment of message().attachments; track attachment.id) {
                    <img 
                      [src]="attachment.url" 
                      [alt]="attachment.fileName"
                      class="max-w-xs rounded cursor-pointer hover:opacity-90 transition-opacity"
                      (click)="onImageClick(attachment.url)">
                  }
                </div>
              }
            </div>
          }

          <!-- File Content -->
          @if (message().type === MessageType.File) {
            <div class="space-y-2">
              @if (message().content) {
                <div class="whitespace-pre-wrap break-words">
                  {{ message().content }}
                </div>
              }
              @if (message().attachments?.length) {
                <div class="space-y-2">
                  @for (attachment of message().attachments; track attachment.id) {
                    <div class="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-800 rounded">
                      <i class="fa-solid fa-file text-gray-500"></i>
                      <div class="flex-1 min-w-0">
                        <div class="text-sm font-medium truncate">
                          {{ attachment.fileName }}
                        </div>
                        <div class="text-xs text-gray-500">
                          {{ formatFileSize(attachment.fileSize) }}
                        </div>
                      </div>
                      <button 
                        (click)="onFileDownload(attachment.url, attachment.fileName)"
                        class="text-primary hover:text-primary/80 transition-colors">
                        <i class="fa-solid fa-download"></i>
                      </button>
                    </div>
                  }
                </div>
              }
            </div>
          }

          <!-- System Message -->
          @if (message().type === MessageType.System) {
            <div class="text-center text-sm text-gray-600 dark:text-gray-400 italic">
              {{ message().content }}
            </div>
          }

          <!-- Edited Indicator -->
          @if (message().isEdited) {
            <div class="text-xs text-gray-500 mt-1">
              (edited)
            </div>
          }
        </div>

        <!-- Message Actions -->
        @if (showActions()) {
          <div class="flex items-center space-x-2 mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <!-- React -->
            <button 
              (click)="onReact('👍')"
              class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              title="React">
              <i class="fa-solid fa-smile text-sm"></i>
            </button>

            <!-- Reply -->
            <button 
              (click)="onReply()"
              class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              title="Reply">
              <i class="fa-solid fa-reply text-sm"></i>
            </button>

            <!-- Edit (own messages only) -->
            @if (isOwn() && canEdit()) {
              <button 
                (click)="onEdit()"
                class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                title="Edit">
                <i class="fa-solid fa-edit text-sm"></i>
              </button>
            }

            <!-- Delete (own messages only) -->
            @if (isOwn()) {
              <button 
                (click)="onDelete()"
                class="text-gray-400 hover:text-red-500 transition-colors"
                title="Delete">
                <i class="fa-solid fa-trash text-sm"></i>
              </button>
            }
          </div>
        }

        <!-- Timestamp and Status -->
        @if (showTimestamp()) {
          <div [class]="timestampClasses()">
            <span>{{ formatTime(message().createdAt) }}</span>
            
            <!-- Message Status (own messages only) -->
            @if (isOwn()) {
              <span class="ml-1">
                @switch (message().status) {
                  @case (MessageStatus.Sending) {
                    <i class="fa-solid fa-clock text-gray-400" title="Sending"></i>
                  }
                  @case (MessageStatus.Sent) {
                    <i class="fa-solid fa-check text-gray-400" title="Sent"></i>
                  }
                  @case (MessageStatus.Delivered) {
                    <i class="fa-solid fa-check-double text-gray-400" title="Delivered"></i>
                  }
                  @case (MessageStatus.Read) {
                    <i class="fa-solid fa-check-double text-primary" title="Read"></i>
                  }
                  @case (MessageStatus.Failed) {
                    <i class="fa-solid fa-exclamation-triangle text-red-500" title="Failed to send"></i>
                  }
                }
              </span>
            }
          </div>
        }
      </div>
    </div>
  `
})
export class MessageItemComponent {
  // Input properties
  message = input.required<MessageDto>();
  isOwn = input.required<boolean>();
  showAvatar = input<boolean>(true);
  showTimestamp = input<boolean>(true);

  // Output events
  replyClick = output<MessageDto>();
  editClick = output<MessageDto>();
  deleteClick = output<MessageDto>();
  reactClick = output<{ message: MessageDto; emoji: string }>();

  // Expose enums for template
  readonly MessageType = MessageType;
  readonly MessageStatus = MessageStatus;

  // Computed properties
  readonly messageClasses = computed(() => {
    const base = 'group flex space-x-3 hover:bg-gray-50 dark:hover:bg-gray-800/50 p-2 rounded transition-colors';
    return this.isOwn() 
      ? `${base} flex-row-reverse space-x-reverse`
      : base;
  });

  readonly contentClasses = computed(() => {
    return this.isOwn() 
      ? 'flex flex-col items-end max-w-xs lg:max-w-md'
      : 'flex flex-col items-start max-w-xs lg:max-w-md';
  });

  readonly bubbleClasses = computed(() => {
    const base = 'px-4 py-2 rounded-lg break-words';
    const systemMessage = this.message().type === MessageType.System;
    
    if (systemMessage) {
      return `${base} bg-transparent`;
    }
    
    return this.isOwn()
      ? `${base} bg-primary text-white`
      : `${base} bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white`;
  });

  readonly timestampClasses = computed(() => {
    const base = 'flex items-center text-xs text-gray-500 mt-1';
    return this.isOwn() 
      ? `${base} justify-end`
      : base;
  });

  readonly showActions = computed(() => {
    return this.message().type !== MessageType.System;
  });

  readonly canEdit = computed(() => {
    const message = this.message();
    return message.type === MessageType.Text && 
           new Date().getTime() - new Date(message.createdAt).getTime() < 15 * 60 * 1000; // 15 minutes
  });

  formatTime(timestamp: string): string {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });
  }

  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  onContextMenu(event: MouseEvent): void {
    event.preventDefault();
    // Could implement context menu here
  }

  onImageClick(url: string): void {
    // Open image in modal or new tab
    window.open(url, '_blank');
  }

  onFileDownload(url: string, filename: string): void {
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  onReact(emoji: string): void {
    this.reactClick.emit({ message: this.message(), emoji });
  }

  onReply(): void {
    this.replyClick.emit(this.message());
  }

  onEdit(): void {
    this.editClick.emit(this.message());
  }

  onDelete(): void {
    this.deleteClick.emit(this.message());
  }
}