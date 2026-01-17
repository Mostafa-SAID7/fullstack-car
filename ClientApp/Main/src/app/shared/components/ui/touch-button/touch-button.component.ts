import { Component, input, output, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';

export type TouchButtonVariant = 'primary' | 'secondary' | 'ghost' | 'destructive';
export type TouchButtonSize = 'sm' | 'md' | 'lg' | 'xl';

/**
 * Touch-Optimized Button Component
 * 
 * Mobile-first button with haptic feedback and touch gestures
 */
@Component({
  selector: 'app-touch-button',
  standalone: true,
  imports: [CommonModule],
  template: `
    <button
      [class]="buttonClasses()"
      [disabled]="disabled()"
      (click)="onClick()"
      (touchstart)="onTouchStart($event)"
      (touchend)="onTouchEnd($event)"
      (touchcancel)="onTouchCancel()"
      [attr.aria-label]="ariaLabel()">
      
      @if (loading()) {
        <div class="flex items-center justify-center">
          <i class="fa-solid fa-spinner animate-spin mr-2"></i>
          <span>{{ loadingText() || 'Loading...' }}</span>
        </div>
      } @else {
        <div class="flex items-center justify-center space-x-2">
          @if (icon()) {
            <i [class]="icon() + ' ' + getIconSize()"></i>
          }
          @if (label()) {
            <span>{{ label() }}</span>
          }
          <ng-content></ng-content>
        </div>
      }
    </button>
  `,
  styles: [`
    :host {
      display: inline-block;
    }
    
    button {
      touch-action: manipulation;
      -webkit-tap-highlight-color: transparent;
      user-select: none;
      transition: all 0.15s ease-in-out;
    }
    
    button:active {
      transform: scale(0.95);
    }
    
    button:disabled {
      transform: none !important;
    }
    
    /* Haptic feedback simulation */
    @keyframes haptic-light {
      0% { transform: scale(1); }
      50% { transform: scale(0.98); }
      100% { transform: scale(1); }
    }
    
    @keyframes haptic-medium {
      0% { transform: scale(1); }
      50% { transform: scale(0.95); }
      100% { transform: scale(1); }
    }
    
    .haptic-light {
      animation: haptic-light 0.1s ease-in-out;
    }
    
    .haptic-medium {
      animation: haptic-medium 0.15s ease-in-out;
    }
  `]
})
export class TouchButtonComponent {
  // Input signals
  variant = input<TouchButtonVariant>('primary');
  size = input<TouchButtonSize>('md');
  disabled = input<boolean>(false);
  loading = input<boolean>(false);
  icon = input<string>('');
  label = input<string>('');
  loadingText = input<string>('');
  ariaLabel = input<string>('');
  hapticFeedback = input<boolean>(true);
  className = input<string>('');

  // Output signals
  click = output<Event>();
  touchStart = output<TouchEvent>();
  touchEnd = output<TouchEvent>();

  // Local state
  private isPressed = signal(false);

  // Computed button classes
  buttonClasses = computed(() => {
    const classes = ['inline-flex', 'items-center', 'justify-center', 'font-medium', 'rounded-lg', 'transition-all', 'duration-150', 'ease-in-out', 'focus:outline-none', 'focus:ring-2', 'focus:ring-offset-2', 'active:scale-95', 'disabled:opacity-50', 'disabled:cursor-not-allowed', 'disabled:transform-none'];

    // Size classes
    switch (this.size()) {
      case 'sm':
        classes.push('px-3', 'py-2', 'text-sm', 'min-h-[36px]', 'min-w-[64px]');
        break;
      case 'md':
        classes.push('px-4', 'py-2.5', 'text-sm', 'min-h-[44px]', 'min-w-[80px]');
        break;
      case 'lg':
        classes.push('px-6', 'py-3', 'text-base', 'min-h-[48px]', 'min-w-[96px]');
        break;
      case 'xl':
        classes.push('px-8', 'py-4', 'text-lg', 'min-h-[56px]', 'min-w-[112px]');
        break;
    }

    // Variant classes
    switch (this.variant()) {
      case 'primary':
        classes.push('bg-primary', 'text-white', 'hover:bg-primary/90', 'focus:ring-primary/50', 'shadow-sm', 'hover:shadow-md');
        break;
      case 'secondary':
        classes.push('bg-gray-100', 'text-gray-900', 'hover:bg-gray-200', 'focus:ring-gray-500/50', 'dark:bg-gray-800', 'dark:text-white', 'dark:hover:bg-gray-700', 'shadow-sm', 'hover:shadow-md');
        break;
      case 'ghost':
        classes.push('bg-transparent', 'text-gray-700', 'hover:bg-gray-100', 'focus:ring-gray-500/50', 'dark:text-gray-300', 'dark:hover:bg-gray-800');
        break;
      case 'destructive':
        classes.push('bg-red-600', 'text-white', 'hover:bg-red-700', 'focus:ring-red-500/50', 'shadow-sm', 'hover:shadow-md');
        break;
    }

    // Additional classes
    if (this.className()) {
      classes.push(this.className());
    }

    return classes.join(' ');
  });

  onClick(): void {
    if (!this.disabled() && !this.loading()) {
      this.triggerHapticFeedback('light');
      this.click.emit(new Event('click'));
    }
  }

  onTouchStart(event: TouchEvent): void {
    if (!this.disabled() && !this.loading()) {
      this.isPressed.set(true);
      this.touchStart.emit(event);
    }
  }

  onTouchEnd(event: TouchEvent): void {
    if (this.isPressed()) {
      this.isPressed.set(false);
      this.touchEnd.emit(event);
    }
  }

  onTouchCancel(): void {
    this.isPressed.set(false);
  }

  private triggerHapticFeedback(intensity: 'light' | 'medium' | 'heavy' = 'light'): void {
    if (!this.hapticFeedback()) return;

    // Native haptic feedback for supported devices
    if ('vibrate' in navigator) {
      switch (intensity) {
        case 'light':
          navigator.vibrate(10);
          break;
        case 'medium':
          navigator.vibrate(25);
          break;
        case 'heavy':
          navigator.vibrate(50);
          break;
      }
    }

    // Visual feedback animation
    const button = document.activeElement as HTMLElement;
    if (button) {
      button.classList.add(`haptic-${intensity}`);
      setTimeout(() => {
        button.classList.remove(`haptic-${intensity}`);
      }, intensity === 'light' ? 100 : 150);
    }
  }

  private getIconSize(): string {
    switch (this.size()) {
      case 'sm':
        return 'text-sm';
      case 'md':
        return 'text-base';
      case 'lg':
        return 'text-lg';
      case 'xl':
        return 'text-xl';
      default:
        return 'text-base';
    }
  }
}