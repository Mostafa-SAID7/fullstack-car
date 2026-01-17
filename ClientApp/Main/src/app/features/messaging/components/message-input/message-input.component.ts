import { Component, input, output, signal, computed, inject, ViewChild, ElementRef, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MessageDto, MessageType, SendMessageRequest } from '../../../../core/models/messaging.model';
import { MessagingService } from '../../../../core/services/messaging.service';

/**
 * Message Input Component
 * 
 * Input field for composing and sending messages
 */
@Component({
  selector: 'app-message-input',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="message-input border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-4">
      <!-- Reply Context -->
      @if (replyToMessage()) {
        <div class="bg-gray-50 dark:bg-gray-800 border-l-4 border-primary p-3 mb-3 rounded">
          <div class="flex items-center justify-between">
            <div class="flex-1">
              <div class="text-sm font-medium text-gray-900 dark:text-white">
                Replying to {{ replyToMessage()!.senderName }}
              </div>
              <div class="text-sm text-gray-600 dark:text-gray-400 truncate">
                {{ replyToMessage()!.content }}
              </div>
            </div>
            <button 
              (click)="onCancelReply()"
              class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 ml-2">
              <i class="fa-solid fa-times"></i>
            </button>
          </div>
        </div>
      }

      <!-- Edit Context -->
      @if (editingMessage()) {
        <div class="bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-400 p-3 mb-3 rounded">
          <div class="flex items-center justify-between">
            <div class="flex-1">
              <div class="text-sm font-medium text-gray-900 dark:text-white">
                Editing message
              </div>
            </div>
            <button 
              (click)="onCancelEdit()"
              class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 ml-2">
              <i class="fa-solid fa-times"></i>
            </button>
          </div>
        </div>
      }

      <!-- File Preview -->
      @if (selectedFiles().length > 0) {
        <div class="mb-3">
          <div class="flex flex-wrap gap-2">
            @for (file of selectedFiles(); track $index) {
              <div class="relative bg-gray-100 dark:bg-gray-800 p-2 rounded flex items-center space-x-2">
                @if (isImageFile(file)) {
                  <img 
                    [src]="getFilePreview(file)" 
                    [alt]="file.name"
                    class="w-12 h-12 object-cover rounded">
                } @else {
                  <i class="fa-solid fa-file text-gray-500 text-xl"></i>
                }
                <div class="flex-1 min-w-0">
                  <div class="text-sm font-medium truncate">{{ file.name }}</div>
                  <div class="text-xs text-gray-500">{{ formatFileSize(file.size) }}</div>
                </div>
                <button 
                  (click)="removeFile($index)"
                  class="text-gray-400 hover:text-red-500 transition-colors">
                  <i class="fa-solid fa-times"></i>
                </button>
              </div>
            }
          </div>
        </div>
      }

      <!-- Input Area -->
      <div class="flex items-end space-x-3">
        <!-- Attachment Button -->
        <div class="relative">
          <input
            #fileInput
            type="file"
            multiple
            accept="image/*,video/*,audio/*,.pdf,.doc,.docx,.txt"
            (change)="onFileSelect($event)"
            class="hidden">
          <button
            (click)="fileInput.click()"
            [disabled]="disabled()"
            class="p-2 text-gray-500 hover:text-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            title="Attach files">
            <i class="fa-solid fa-paperclip"></i>
          </button>
        </div>

        <!-- Text Input -->
        <div class="flex-1 relative">
          <textarea
            #messageInput
            [(ngModel)]="messageText"
            (input)="onInput()"
            (keydown)="onKeyDown($event)"
            (focus)="onFocus()"
            (blur)="onBlur()"
            [disabled]="disabled()"
            [placeholder]="placeholder()"
            class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg resize-none bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-primary focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
            rows="1"
            style="max-height: 120px; overflow-y: auto;">
          </textarea>

          <!-- Emoji Button -->
          <button
            (click)="toggleEmojiPicker()"
            [disabled]="disabled()"
            class="absolute right-2 top-2 p-1 text-gray-500 hover:text-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            title="Add emoji">
            <i class="fa-solid fa-smile"></i>
          </button>
        </div>

        <!-- Send Button -->
        <button
          (click)="onSend()"
          [disabled]="!canSend()"
          class="p-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          title="Send message">
          @if (isSending()) {
            <i class="fa-solid fa-spinner animate-spin"></i>
          } @else {
            <i class="fa-solid fa-paper-plane"></i>
          }
        </button>
      </div>

      <!-- Character Count -->
      @if (messageText().length > 0) {
        <div class="flex justify-between items-center mt-2 text-xs text-gray-500">
          <div>
            @if (isTyping()) {
              <span class="text-primary">Typing...</span>
            }
          </div>
          <div>
            {{ messageText().length }}/{{ maxLength }}
          </div>
        </div>
      }
    </div>
  `
})
export class MessageInputComponent {
  private messagingService = inject(MessagingService);

  @ViewChild('messageInput') messageInput!: ElementRef<HTMLTextAreaElement>;
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  // Input properties
  conversationId = input.required<string>();
  replyToMessage = input<MessageDto | null>(null);
  editingMessage = input<MessageDto | null>(null);
  disabled = input<boolean>(false);

  // Output events
  messageSent = output<MessageDto>();
  typingStart = output<void>();
  typingStop = output<void>();
  cancelReply = output<void>();
  cancelEdit = output<void>();

  // Local state
  messageText = signal('');
  selectedFiles = signal<File[]>([]);
  isSending = signal(false);
  isTyping = signal(false);
  private typingTimeout: any = null;
  private showEmojiPicker = signal(false);

  // Constants
  readonly maxLength = 2000;
  readonly maxFiles = 10;
  readonly maxFileSize = 50 * 1024 * 1024; // 50MB

  // Computed properties
  readonly canSend = computed(() => {
    return !this.disabled() && 
           !this.isSending() && 
           (this.messageText().trim().length > 0 || this.selectedFiles().length > 0) &&
           this.messageText().length <= this.maxLength;
  });

  readonly placeholder = computed(() => {
    if (this.editingMessage()) return 'Edit your message...';
    if (this.replyToMessage()) return 'Reply to message...';
    return 'Type a message...';
  });

  constructor() {
    // Set initial message text when editing
    effect(() => {
      const editing = this.editingMessage();
      if (editing) {
        this.messageText.set(editing.content);
        setTimeout(() => this.focusInput(), 100);
      }
    });
  }

  private focusInput(): void {
    if (this.messageInput?.nativeElement) {
      this.messageInput.nativeElement.focus();
      this.autoResize();
    }
  }

  private autoResize(): void {
    if (this.messageInput?.nativeElement) {
      const element = this.messageInput.nativeElement;
      element.style.height = 'auto';
      element.style.height = Math.min(element.scrollHeight, 120) + 'px';
    }
  }

  onInput(): void {
    this.autoResize();
    
    if (!this.isTyping()) {
      this.isTyping.set(true);
      this.typingStart.emit();
    }

    // Reset typing timeout
    if (this.typingTimeout) {
      clearTimeout(this.typingTimeout);
    }

    this.typingTimeout = setTimeout(() => {
      this.isTyping.set(false);
      this.typingStop.emit();
    }, 1000);
  }

  onKeyDown(event: KeyboardEvent): void {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.onSend();
    }
  }

  onFocus(): void {
    // Could implement focus-related logic here
  }

  onBlur(): void {
    // Stop typing indicator when input loses focus
    if (this.isTyping()) {
      this.isTyping.set(false);
      this.typingStop.emit();
    }
  }

  onFileSelect(event: Event): void {
    const input = event.target as HTMLInputElement;
    const files = Array.from(input.files || []);
    
    // Validate files
    const validFiles = files.filter(file => {
      if (file.size > this.maxFileSize) {
        alert(`File "${file.name}" is too large. Maximum size is 50MB.`);
        return false;
      }
      return true;
    });

    // Add to selected files (up to max limit)
    const currentFiles = this.selectedFiles();
    const totalFiles = currentFiles.length + validFiles.length;
    
    if (totalFiles > this.maxFiles) {
      alert(`You can only attach up to ${this.maxFiles} files.`);
      const allowedCount = this.maxFiles - currentFiles.length;
      this.selectedFiles.set([...currentFiles, ...validFiles.slice(0, allowedCount)]);
    } else {
      this.selectedFiles.set([...currentFiles, ...validFiles]);
    }

    // Clear input
    input.value = '';
  }

  removeFile(index: number): void {
    this.selectedFiles.update(files => files.filter((_, i) => i !== index));
  }

  isImageFile(file: File): boolean {
    return file.type.startsWith('image/');
  }

  getFilePreview(file: File): string {
    return URL.createObjectURL(file);
  }

  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  toggleEmojiPicker(): void {
    this.showEmojiPicker.update(show => !show);
  }

  async onSend(): Promise<void> {
    if (!this.canSend()) return;

    const text = this.messageText().trim();
    const files = this.selectedFiles();
    const editing = this.editingMessage();

    this.isSending.set(true);

    try {
      if (editing) {
        // Edit existing message
        const updatedMessage = await this.messagingService.editMessage(editing.id, text).toPromise();
        if (updatedMessage) {
          this.messageSent.emit(updatedMessage);
        }
      } else {
        // Send new message
        const messageType = files.length > 0 
          ? (files.some(f => f.type.startsWith('image/')) ? MessageType.Image : MessageType.File)
          : MessageType.Text;

        const request: SendMessageRequest = {
          conversationId: this.conversationId(),
          type: messageType,
          content: text,
          attachments: files.length > 0 ? files : undefined,
          replyToId: this.replyToMessage()?.id
        };

        const message = await this.messagingService.sendMessage(request).toPromise();
        if (message) {
          this.messageSent.emit(message);
        }
      }

      // Clear input
      this.messageText.set('');
      this.selectedFiles.set([]);
      this.autoResize();

    } catch (error) {
      console.error('Failed to send message:', error);
      alert('Failed to send message. Please try again.');
    } finally {
      this.isSending.set(false);
      
      // Stop typing indicator
      if (this.isTyping()) {
        this.isTyping.set(false);
        this.typingStop.emit();
      }
    }
  }

  onCancelReply(): void {
    this.cancelReply.emit();
  }

  onCancelEdit(): void {
    this.messageText.set('');
    this.cancelEdit.emit();
  }
}