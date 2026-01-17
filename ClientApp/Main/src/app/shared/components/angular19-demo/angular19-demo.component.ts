import { Component, signal, computed, effect, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LazyLoadingDemoComponent } from '../lazy-loading-demo/lazy-loading-demo.component';

/**
 * Angular 19 Demo Component
 * 
 * Demonstrates modern Angular 19 features:
 * - New control flow syntax (@if, @for, @switch)
 * - Angular Signals for reactive state management
 * - Computed signals for derived state
 * - Effects for side effect management
 * - Input/Output signals
 * - Lazy loading and code splitting
 */
@Component({
  selector: 'app-angular19-demo',
  standalone: true,
  imports: [CommonModule, LazyLoadingDemoComponent],
  templateUrl: './angular19-demo.component.html',
  styleUrls: ['./angular19-demo.component.scss']
})
export class Angular19DemoComponent {
  // Signal for visibility toggle
  isVisible = signal(true);

  // Signal for items list
  items = signal<Array<{ id: number; name: string }>>([
    { id: 1, name: 'Item 1' },
    { id: 2, name: 'Item 2' },
    { id: 3, name: 'Item 3' }
  ]);

  // Signal for status
  status = signal<'loading' | 'success' | 'error' | 'idle'>('idle');

  // Signal for counter
  counter = signal(0);

  // Computed signal - automatically updates when counter changes
  doubledCounter = computed(() => this.counter() * 2);

  // Signal to track effect executions
  effectCount = signal(0);

  private nextId = 4;

  constructor() {
    // Effect - runs whenever counter changes
    effect(() => {
      const currentCount = this.counter();
      console.log(`Counter changed to: ${currentCount}`);
      this.effectCount.update(count => count + 1);
    });
  }

  // Methods for @if demo
  toggleVisibility(): void {
    this.isVisible.update(visible => !visible);
  }

  // Methods for @for demo
  addItem(): void {
    this.items.update(currentItems => [
      ...currentItems,
      { id: this.nextId++, name: `Item ${this.nextId - 1}` }
    ]);
  }

  removeItem(): void {
    this.items.update(currentItems => {
      if (currentItems.length > 0) {
        return currentItems.slice(0, -1);
      }
      return currentItems;
    });
  }

  // Methods for @switch demo
  setStatus(newStatus: 'loading' | 'success' | 'error'): void {
    this.status.set(newStatus);
  }

  // Methods for signals demo
  incrementCounter(): void {
    this.counter.update(count => count + 1);
  }

  decrementCounter(): void {
    this.counter.update(count => count - 1);
  }
}
