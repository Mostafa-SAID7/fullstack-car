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
  templateUrl: './swipe-card.component.html',
  styleUrls: ['./swipe-card.component.scss']
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