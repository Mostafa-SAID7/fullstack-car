import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-typing-indicator',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div class="flex items-center space-x-2 text-sm text-gray-500 animate-pulse">
      <div class="flex space-x-1">
        <div class="w-2 h-2 bg-primary rounded-full animate-bounce" style="animation-delay: 0ms"></div>
        <div class="w-2 h-2 bg-primary rounded-full animate-bounce" style="animation-delay: 150ms"></div>
        <div class="w-2 h-2 bg-primary rounded-full animate-bounce" style="animation-delay: 300ms"></div>
      </div>
      <span *ngIf="message" class="text-xs font-medium">{{ message }}</span>
    </div>
  `
})
export class TypingIndicatorComponent {
    @Input() message = '';
}
