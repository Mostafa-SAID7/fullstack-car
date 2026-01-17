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
  template: `
    <div class="p-6 max-w-4xl mx-auto">
      <h1 class="text-3xl font-bold mb-6">Angular 19 Features Demo</h1>
      
      <!-- @if Control Flow Demo -->
      <section class="mb-8 p-4 border rounded-lg">
        <h2 class="text-2xl font-semibold mb-4">@if Control Flow</h2>
        <button 
          (click)="toggleVisibility()"
          class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 mb-4">
          Toggle Content
        </button>
        
        @if (isVisible()) {
          <div class="p-4 bg-green-100 rounded">
            <p class="text-green-800">Content is visible! ✓</p>
            <p class="text-sm text-green-600 mt-2">
              This uses Angular 19's new @if syntax instead of *ngIf
            </p>
          </div>
        } @else {
          <div class="p-4 bg-gray-100 rounded">
            <p class="text-gray-600">Content is hidden</p>
          </div>
        }
      </section>

      <!-- @for Control Flow Demo -->
      <section class="mb-8 p-4 border rounded-lg">
        <h2 class="text-2xl font-semibold mb-4">@for Control Flow</h2>
        <button 
          (click)="addItem()"
          class="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 mb-4 mr-2">
          Add Item
        </button>
        <button 
          (click)="removeItem()"
          class="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 mb-4">
          Remove Item
        </button>
        
        <div class="space-y-2">
          @for (item of items(); track item.id) {
            <div class="p-3 bg-blue-50 rounded flex justify-between items-center">
              <span class="font-medium">{{ item.name }}</span>
              <span class="text-sm text-gray-500">ID: {{ item.id }}</span>
            </div>
          } @empty {
            <div class="p-4 bg-yellow-50 rounded">
              <p class="text-yellow-800">No items yet. Click "Add Item" to get started!</p>
            </div>
          }
        </div>
        
        <p class="text-sm text-gray-600 mt-4">
          Total items: {{ items().length }} (computed from signal)
        </p>
      </section>

      <!-- @switch Control Flow Demo -->
      <section class="mb-8 p-4 border rounded-lg">
        <h2 class="text-2xl font-semibold mb-4">@switch Control Flow</h2>
        <div class="flex gap-2 mb-4">
          <button 
            (click)="setStatus('loading')"
            class="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600">
            Loading
          </button>
          <button 
            (click)="setStatus('success')"
            class="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">
            Success
          </button>
          <button 
            (click)="setStatus('error')"
            class="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600">
            Error
          </button>
        </div>
        
        @switch (status()) {
          @case ('loading') {
            <div class="p-4 bg-yellow-100 rounded">
              <p class="text-yellow-800">⏳ Loading...</p>
            </div>
          }
          @case ('success') {
            <div class="p-4 bg-green-100 rounded">
              <p class="text-green-800">✓ Success! Operation completed.</p>
            </div>
          }
          @case ('error') {
            <div class="p-4 bg-red-100 rounded">
              <p class="text-red-800">✗ Error occurred. Please try again.</p>
            </div>
          }
          @default {
            <div class="p-4 bg-gray-100 rounded">
              <p class="text-gray-600">Ready to start</p>
            </div>
          }
        }
      </section>

      <!-- Angular Signals Demo -->
      <section class="mb-8 p-4 border rounded-lg">
        <h2 class="text-2xl font-semibold mb-4">Angular Signals</h2>
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium mb-2">Counter Signal:</label>
            <div class="flex gap-2 items-center">
              <button 
                (click)="decrementCounter()"
                class="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600">
                -
              </button>
              <span class="text-2xl font-bold px-4">{{ counter() }}</span>
              <button 
                (click)="incrementCounter()"
                class="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">
                +
              </button>
            </div>
          </div>
          
          <div class="p-4 bg-purple-50 rounded">
            <p class="font-medium mb-2">Computed Signal:</p>
            <p class="text-purple-800">
              Counter doubled: {{ doubledCounter() }}
            </p>
            <p class="text-sm text-purple-600 mt-2">
              This value is automatically computed from the counter signal
            </p>
          </div>
          
          <div class="p-4 bg-indigo-50 rounded">
            <p class="font-medium mb-2">Effect Execution Count:</p>
            <p class="text-indigo-800">
              Effect has run {{ effectCount() }} times
            </p>
            <p class="text-sm text-indigo-600 mt-2">
              Effects run automatically when their dependencies change
            </p>
          </div>
        </div>
      </section>

      <!-- Lazy Loading Demo -->
      <section class="mb-8 p-4 border rounded-lg">
        <h2 class="text-2xl font-semibold mb-4">🚀 Lazy Loading & Code Splitting</h2>
        <p class="text-gray-600 mb-4">
          Angular 19 with intelligent lazy loading, dynamic imports, and performance optimization.
        </p>
        <app-lazy-loading-demo></app-lazy-loading-demo>
      </section>
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }
  `]
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
