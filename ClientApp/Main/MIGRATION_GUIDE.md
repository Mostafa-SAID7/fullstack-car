# Angular 19 Migration Guide

This guide helps you migrate existing Angular components to use Angular 19's modern features.

## Table of Contents

1. [Control Flow Syntax Migration](#control-flow-syntax-migration)
2. [Signals Migration](#signals-migration)
3. [Observable to Signal Conversion](#observable-to-signal-conversion)
4. [Component Migration Example](#component-migration-example)

## Control Flow Syntax Migration

### @if Directive

**Before (Old Syntax):**
```html
<div *ngIf="isVisible">Content</div>
<div *ngIf="isVisible; else elseBlock">Content</div>
<ng-template #elseBlock>Alternative</ng-template>
```

**After (New Syntax):**
```html
@if (isVisible()) {
  <div>Content</div>
}

@if (isVisible()) {
  <div>Content</div>
} @else {
  <div>Alternative</div>
}
```

### @for Directive

**Before (Old Syntax):**
```html
<div *ngFor="let item of items; trackBy: trackByFn">
  {{ item.name }}
</div>
```

**After (New Syntax):**
```html
@for (item of items(); track item.id) {
  <div>{{ item.name }}</div>
} @empty {
  <div>No items available</div>
}
```

### @switch Directive

**Before (Old Syntax):**
```html
<div [ngSwitch]="status">
  <div *ngSwitchCase="'loading'">Loading...</div>
  <div *ngSwitchCase="'success'">Success!</div>
  <div *ngSwitchDefault>Unknown</div>
</div>
```

**After (New Syntax):**
```html
@switch (status()) {
  @case ('loading') {
    <div>Loading...</div>
  }
  @case ('success') {
    <div>Success!</div>
  }
  @default {
    <div>Unknown</div>
  }
}
```

## Signals Migration

### Basic State

**Before (Old Approach):**
```typescript
export class MyComponent {
  count = 0;
  
  increment(): void {
    this.count++;
  }
}
```

**After (Signals):**
```typescript
export class MyComponent {
  count = signal(0);
  
  increment(): void {
    this.count.update(c => c + 1);
  }
}
```

### Derived State

**Before (Old Approach):**
```typescript
export class MyComponent {
  count = 0;
  
  get doubleCount(): number {
    return this.count * 2;
  }
}
```

**After (Computed Signals):**
```typescript
export class MyComponent {
  count = signal(0);
  doubleCount = computed(() => this.count() * 2);
}
```

### Side Effects

**Before (Old Approach):**
```typescript
export class MyComponent implements OnChanges {
  @Input() value: number = 0;
  
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['value']) {
      console.log('Value changed:', this.value);
    }
  }
}
```

**After (Effects):**
```typescript
export class MyComponent {
  value = input<number>(0);
  
  constructor() {
    effect(() => {
      console.log('Value changed:', this.value());
    });
  }
}
```

## Observable to Signal Conversion

### Using toSignal()

**Before (Observables):**
```typescript
export class MyComponent {
  user$ = this.authService.currentUser$;
  
  constructor(private authService: AuthService) {}
}

// Template
<div *ngIf="user$ | async as user">
  {{ user.name }}
</div>
```

**After (Signals with toSignal):**
```typescript
export class MyComponent {
  private authService = inject(AuthService);
  user = toSignal(this.authService.currentUser$, { initialValue: null });
}

// Template
@if (user()) {
  <div>{{ user()!.name }}</div>
}
```

### Multiple Observables

**Before (Observables):**
```typescript
export class MyComponent {
  user$ = this.authService.currentUser$;
  notifications$ = this.notificationService.notifications$;
  
  constructor(
    private authService: AuthService,
    private notificationService: NotificationService
  ) {}
}

// Template
<div *ngIf="user$ | async as user">
  <span>{{ user.name }}</span>
  <span *ngIf="notifications$ | async as notifications">
    {{ notifications.length }}
  </span>
</div>
```

**After (Signals):**
```typescript
export class MyComponent {
  private authService = inject(AuthService);
  private notificationService = inject(NotificationService);
  
  user = toSignal(this.authService.currentUser$, { initialValue: null });
  notifications = toSignal(this.notificationService.notifications$, { initialValue: [] });
  
  notificationCount = computed(() => this.notifications().length);
}

// Template
@if (user()) {
  <div>
    <span>{{ user()!.name }}</span>
    <span>{{ notificationCount() }}</span>
  </div>
}
```

## Component Migration Example

### Complete Before/After Example

**Before (Old Component):**
```typescript
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-example',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div *ngIf="isLoading">Loading...</div>
    <div *ngIf="!isLoading && items.length > 0">
      <div *ngFor="let item of items">{{ item.name }}</div>
    </div>
    <div *ngIf="!isLoading && items.length === 0">No items</div>
  `
})
export class ExampleComponent implements OnInit {
  isLoading = true;
  items: any[] = [];
  
  ngOnInit(): void {
    this.loadItems();
  }
  
  loadItems(): void {
    // Load items...
    this.isLoading = false;
  }
}
```

**After (Modern Angular 19):**
```typescript
import { Component, signal, computed, effect } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-example',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (isLoading()) {
      <div>Loading...</div>
    } @else if (hasItems()) {
      @for (item of items(); track item.id) {
        <div>{{ item.name }}</div>
      }
    } @else {
      <div>No items</div>
    }
  `
})
export class ExampleComponent {
  isLoading = signal(true);
  items = signal<any[]>([]);
  
  hasItems = computed(() => this.items().length > 0);
  
  constructor() {
    this.loadItems();
    
    // Effect to log when items change
    effect(() => {
      console.log('Items count:', this.items().length);
    });
  }
  
  async loadItems(): Promise<void> {
    // Load items...
    this.items.set([/* loaded items */]);
    this.isLoading.set(false);
  }
}
```

## Migration Checklist

### For Each Component:

- [ ] Replace `*ngIf` with `@if`
- [ ] Replace `*ngFor` with `@for` (don't forget `track`)
- [ ] Replace `[ngSwitch]` with `@switch`
- [ ] Convert component properties to signals
- [ ] Convert getters to computed signals
- [ ] Convert `ngOnChanges` to effects
- [ ] Convert Observables to signals using `toSignal()`
- [ ] Update template to call signals with `()`
- [ ] Replace constructor DI with `inject()`
- [ ] Test thoroughly!

## Best Practices

### 1. Always Track Items in @for

```typescript
// ✅ Good - track by unique ID
@for (item of items(); track item.id) { }

// ❌ Bad - track by index (less efficient)
@for (item of items(); track $index) { }
```

### 2. Use Readonly Signals for Public API

```typescript
// ✅ Good
private _count = signal(0);
readonly count = this._count.asReadonly();

// ❌ Bad - allows external mutation
count = signal(0);
```

### 3. Prefer Computed Over Methods

```typescript
// ✅ Good - computed (cached)
total = computed(() => this.items().reduce((sum, item) => sum + item.price, 0));

// ❌ Bad - method (recalculated every time)
getTotal(): number {
  return this.items().reduce((sum, item) => sum + item.price, 0);
}
```

### 4. Use Effects for Side Effects Only

```typescript
// ✅ Good - logging, API calls, DOM manipulation
effect(() => {
  console.log('Count changed:', this.count());
});

// ❌ Bad - deriving state (use computed instead)
effect(() => {
  this.doubleCount = this.count() * 2; // Use computed!
});
```

## Common Pitfalls

### 1. Forgetting to Call Signals

```typescript
// ❌ Wrong
if (isVisible) { }

// ✅ Correct
if (isVisible()) { }
```

### 2. Mutating Signal Values Directly

```typescript
// ❌ Wrong
items().push(newItem);

// ✅ Correct
items.update(current => [...current, newItem]);
```

### 3. Missing Track in @for

```typescript
// ❌ Wrong - will cause errors
@for (item of items()) {
  <div>{{ item.name }}</div>
}

// ✅ Correct
@for (item of items(); track item.id) {
  <div>{{ item.name }}</div>
}
```

## Resources

- [Angular 19 Documentation](https://angular.dev)
- [Signals Guide](https://angular.dev/guide/signals)
- [Control Flow Guide](https://angular.dev/guide/templates/control-flow)
- [Migration Tool](https://angular.dev/cli/migrations)

## Automated Migration

Angular CLI provides automated migration tools:

```bash
# Migrate to new control flow syntax
ng generate @angular/core:control-flow

# Migrate to standalone components
ng generate @angular/core:standalone
```

Note: Always review automated migrations and test thoroughly!
