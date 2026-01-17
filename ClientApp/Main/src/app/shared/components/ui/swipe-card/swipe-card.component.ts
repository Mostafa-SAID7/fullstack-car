import { Component, input, output, signal, computed, effect, ElementRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface SwipeAction {
  id: string;
  label: string;
  icon: string;
  color: string;
  action: () => void;
}

/**
 * Swipe Card Component
 * 
 * Mobile-optimized card with swipe gestures for actions
 */
@Component({
  selector: 'app-swipe-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div 
      class="relative overflow-hidden bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 touch-manipulation"
      (touchstart)="onTouchStart($event)"
      (touchmove)="onTouchMove($event)"
      (touchend)="onTouchEnd($event)"
      (mousedown)="onMouseDown($event)"
      (mousemove)="onMouseMove($event)"
      (mouseup)="onMouseUp($event)"
      (mouseleave)="onMouseLeave($event)">
      
      <!-- Swipe Actions Background -->
      @if (leftActions().length > 0) {
        <div class="absolute inset-y-0 left-0 flex items-center justify-start bg-green-500 text-white px-4 rounded-l-lg"
             [style.width.px]="getMaxWidth(translateX())">
          @if (translateX() > 60) {
            <div class="flex items-center space-x-2">
              <i [class]="getActiveLeftAction()?.icon + ' text-xl'"></i>
              <span class="font-medium">{{ getActiveLeftAction()?.label }}</span>
            </div>
          }
        </div>
      }
      
      @if (rightActions().length > 0) {
        <div class="absolute inset-y-0 right-0 flex items-center justify-end bg-red-500 text-white px-4 rounded-r-lg"
             [style.width.px]="getMaxWidth(-translateX())">
          @if (translateX() < -60) {
            <div class="flex items-center space-x-2">
              <span class="font-medium">{{ getActiveRightAction()?.label }}</span>
              <i [class]="getActiveRightAction()?.icon + ' text-xl'"></i>
            </div>
          }
        </div>
      }
      
      <!-- Card Content -->
      <div 
        class="relative z-10 transition-transform duration-200 ease-out"
        [style.transform]="'translateX(' + translateX() + 'px)'">
        <ng-content></ng-content>
      </div>
      
      <!-- Swipe Indicators -->
      @if (showIndicators()) {
        <div class="absolute top-2 right-2 flex space-x-1">
          @if (leftActions().length > 0) {
            <div class="w-2 h-2 bg-green-500 rounded-full opacity-50"></div>
          }
          @if (rightActions().length > 0) {
            <div class="w-2 h-2 bg-red-500 rounded-full opacity-50"></div>
          }
        </div>
      }
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }
    
    .touch-manipulation {
      touch-action: pan-y;
      -webkit-tap-highlight-color: transparent;
      user-select: none;
    }
  `]
})
export class SwipeCardComponent {
  private elementRef = inject(ElementRef);

  // Input signals
  leftActions = input<SwipeAction[]>([]);
  rightActions = input<SwipeAction[]>([]);
  swipeThreshold = input<number>(80);
  showIndicators = input<boolean>(true);
  disabled = input<boolean>(false);

  // Output signals
  swipeLeft = output<SwipeAction>();
  swipeRight = output<SwipeAction>();
  swipeStart = output<void>();
  swipeEnd = output<void>();

  // Local state
  private isDragging = signal(false);
  private startX = signal(0);
  private startY = signal(0);
  private currentX = signal(0);
  private currentY = signal(0);
  translateX = signal(0);

  // Computed values
  private swipeDistance = computed(() => this.currentX() - this.startX());
  private isHorizontalSwipe = computed(() => {
    const deltaX = Math.abs(this.currentX() - this.startX());
    const deltaY = Math.abs(this.currentY() - this.startY());
    return deltaX > deltaY && deltaX > 10;
  });

  constructor() {
    // Effect to update transform based on swipe distance
    effect(() => {
      if (this.isDragging() && this.isHorizontalSwipe()) {
        const distance = this.swipeDistance();
        const maxDistance = 120;
        const clampedDistance = Math.max(-maxDistance, Math.min(maxDistance, distance));
        this.translateX.set(clampedDistance);
      }
    });
  }

  // Touch event handlers
  onTouchStart(event: TouchEvent): void {
    if (this.disabled()) return;
    
    const touch = event.touches[0];
    this.startDrag(touch.clientX, touch.clientY);
  }

  onTouchMove(event: TouchEvent): void {
    if (!this.isDragging() || this.disabled()) return;
    
    event.preventDefault();
    const touch = event.touches[0];
    this.updateDrag(touch.clientX, touch.clientY);
  }

  onTouchEnd(event: TouchEvent): void {
    if (!this.isDragging() || this.disabled()) return;
    
    this.endDrag();
  }

  // Mouse event handlers (for desktop testing)
  onMouseDown(event: MouseEvent): void {
    if (this.disabled()) return;
    
    this.startDrag(event.clientX, event.clientY);
  }

  onMouseMove(event: MouseEvent): void {
    if (!this.isDragging() || this.disabled()) return;
    
    event.preventDefault();
    this.updateDrag(event.clientX, event.clientY);
  }

  onMouseUp(event: MouseEvent): void {
    if (!this.isDragging() || this.disabled()) return;
    
    this.endDrag();
  }

  onMouseLeave(event: MouseEvent): void {
    if (this.isDragging()) {
      this.endDrag();
    }
  }

  private startDrag(x: number, y: number): void {
    this.isDragging.set(true);
    this.startX.set(x);
    this.startY.set(y);
    this.currentX.set(x);
    this.currentY.set(y);
    this.swipeStart.emit();
  }

  private updateDrag(x: number, y: number): void {
    this.currentX.set(x);
    this.currentY.set(y);
  }

  private endDrag(): void {
    if (!this.isDragging()) return;

    const distance = this.swipeDistance();
    const threshold = this.swipeThreshold();

    // Check for swipe actions
    if (this.isHorizontalSwipe()) {
      if (distance > threshold && this.leftActions().length > 0) {
        // Swipe right (left action)
        const action = this.getActiveLeftAction();
        if (action) {
          this.triggerHapticFeedback();
          this.swipeRight.emit(action);
          action.action();
        }
      } else if (distance < -threshold && this.rightActions().length > 0) {
        // Swipe left (right action)
        const action = this.getActiveRightAction();
        if (action) {
          this.triggerHapticFeedback();
          this.swipeLeft.emit(action);
          action.action();
        }
      }
    }

    // Reset state
    this.isDragging.set(false);
    this.translateX.set(0);
    this.swipeEnd.emit();
  }

  getActiveLeftAction(): SwipeAction | undefined {
    return this.leftActions()[0];
  }

  getActiveRightAction(): SwipeAction | undefined {
    return this.rightActions()[0];
  }

  getMaxWidth(value: number): number {
    return Math.max(0, value);
  }

  private triggerHapticFeedback(): void {
    if ('vibrate' in navigator) {
      navigator.vibrate(25);
    }
  }
}