import { Component, input, output, signal, computed, forwardRef, inject, ViewChild, ElementRef, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, NgControl } from '@angular/forms';

export interface SelectOption {
  value: string | number;
  label: string;
  disabled?: boolean;
  description?: string;
}

/**
 * Select Component - Shadcn/UI style select dropdown with enhanced accessibility
 */
@Component({
  selector: 'ui-select',
  standalone: true,
  imports: [CommonModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SelectComponent),
      multi: true
    }
  ],
  template: `
    <div class="relative">
      <button
        #triggerElement
        type="button"
        [class]="triggerClasses()"
        [disabled]="disabled()"
        [id]="selectId()"
        [attr.aria-expanded]="isOpen()"
        [attr.aria-haspopup]="'listbox'"
        [attr.aria-labelledby]="ariaLabelledBy()"
        [attr.aria-describedby]="ariaDescribedBy()"
        [attr.aria-invalid]="isInvalid()"
        [attr.aria-required]="required()"
        role="combobox"
        (click)="toggleDropdown()"
        (blur)="onBlur()"
        (keydown)="onTriggerKeyDown($event)"
      >
        <span class="block truncate text-left">
          @if (selectedOption()) {
            {{ selectedOption()!.label }}
          } @else {
            <span class="text-muted-foreground">{{ placeholder() }}</span>
          }
        </span>
        <span class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
          <svg 
            class="h-4 w-4 text-muted-foreground transition-transform duration-200"
            [class.rotate-180]="isOpen()"
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
            aria-hidden="true">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
          </svg>
        </span>
      </button>

      @if (isOpen()) {
        <div 
          class="absolute z-50 mt-1 w-full rounded-md border border-input bg-popover shadow-lg"
          role="listbox"
          [attr.aria-labelledby]="selectId()"
        >
          <div class="max-h-60 overflow-auto rounded-md py-1">
            @for (option of options(); track option.value; let i = $index) {
              <button
                type="button"
                [class]="optionClasses(option, i)"
                [disabled]="option.disabled"
                [id]="getOptionId(i)"
                [attr.aria-selected]="isSelected(option)"
                [attr.aria-describedby]="option.description ? getOptionDescriptionId(i) : null"
                role="option"
                (click)="selectOption(option)"
                (mouseenter)="setFocusedIndex(i)"
              >
                <span class="block truncate">{{ option.label }}</span>
                @if (option.description) {
                  <span 
                    [id]="getOptionDescriptionId(i)"
                    class="block text-xs text-muted-foreground truncate">
                    {{ option.description }}
                  </span>
                }
                @if (isSelected(option)) {
                  <span class="absolute inset-y-0 right-0 flex items-center pr-3">
                    <svg class="h-4 w-4" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                      <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
                    </svg>
                  </span>
                }
              </button>
            } @empty {
              <div class="px-3 py-2 text-sm text-muted-foreground">No options available</div>
            }
          </div>
        </div>
      }
    </div>
  `
})
export class SelectComponent implements ControlValueAccessor {
  @ViewChild('triggerElement') triggerElement!: ElementRef<HTMLButtonElement>;
  
  options = input.required<SelectOption[]>();
  placeholder = input<string>('Select an option');
  disabled = input<boolean>(false);
  size = input<'sm' | 'md' | 'lg'>('md');
  selectId = input<string>(() => `select-${Math.random().toString(36).substr(2, 9)}`);
  ariaLabelledBy = input<string>('');
  ariaDescribedBy = input<string>('');
  required = input<boolean>(false);
  
  selectionChange = output<SelectOption>();
  openChange = output<boolean>();
  
  private value = signal<string | number | null>(null);
  private isOpen = signal<boolean>(false);
  private focusedIndex = signal<number>(-1);
  private ngControl = inject(NgControl, { optional: true });
  private onChange = (value: string | number | null) => {};
  private onTouched = () => {};
  
  selectedOption = computed(() => {
    const currentValue = this.value();
    return this.options().find(option => option.value === currentValue) || null;
  });
  
  isInvalid = computed(() => {
    if (this.ngControl) {
      return this.ngControl.invalid && (this.ngControl.dirty || this.ngControl.touched);
    }
    return false;
  });
  
  triggerClasses = computed(() => {
    const baseClasses = 'relative w-full cursor-default rounded-md border border-input bg-background py-2 pl-3 pr-10 text-left shadow-sm focus:border-ring focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50 transition-colors';
    
    const sizeClasses = {
      sm: 'h-8 text-xs',
      md: 'h-10 text-sm',
      lg: 'h-12 text-base'
    };
    
    const validationClasses = this.isInvalid() ? 'border-destructive focus:border-destructive focus:ring-destructive' : '';
    
    return `${baseClasses} ${sizeClasses[this.size()]} ${validationClasses}`;
  });
  
  optionClasses = (option: SelectOption, index: number) => {
    const baseClasses = 'relative cursor-default select-none py-2 pl-3 pr-9 text-sm focus:bg-accent focus:text-accent-foreground focus:outline-none';
    const selectedClasses = this.isSelected(option) ? 'bg-accent text-accent-foreground' : '';
    const focusedClasses = this.focusedIndex() === index ? 'bg-accent text-accent-foreground' : '';
    const disabledClasses = option.disabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-accent hover:text-accent-foreground';
    
    return `${baseClasses} ${selectedClasses} ${focusedClasses} ${disabledClasses}`;
  };
  
  getOptionId(index: number): string {
    return `${this.selectId()}-option-${index}`;
  }
  
  getOptionDescriptionId(index: number): string {
    return `${this.selectId()}-option-${index}-description`;
  }
  
  toggleDropdown(): void {
    if (!this.disabled()) {
      const newOpenState = !this.isOpen();
      this.isOpen.set(newOpenState);
      this.openChange.emit(newOpenState);
      
      if (newOpenState) {
        // Set focus to selected option or first option
        const selectedIndex = this.options().findIndex(option => option.value === this.value());
        this.focusedIndex.set(selectedIndex >= 0 ? selectedIndex : 0);
      }
    }
  }
  
  selectOption(option: SelectOption): void {
    if (!option.disabled) {
      this.value.set(option.value);
      this.onChange(option.value);
      this.selectionChange.emit(option);
      this.isOpen.set(false);
      this.openChange.emit(false);
      
      // Return focus to trigger
      setTimeout(() => {
        if (this.triggerElement) {
          this.triggerElement.nativeElement.focus();
        }
      });
    }
  }
  
  setFocusedIndex(index: number): void {
    this.focusedIndex.set(index);
  }
  
  isSelected(option: SelectOption): boolean {
    return this.value() === option.value;
  }
  
  onTriggerKeyDown(event: KeyboardEvent): void {
    const options = this.options().filter(option => !option.disabled);
    
    if (options.length === 0) return;
    
    switch (event.key) {
      case 'Enter':
      case ' ':
        event.preventDefault();
        if (!this.isOpen()) {
          this.toggleDropdown();
        } else {
          const focusedOption = options[this.focusedIndex()];
          if (focusedOption) {
            this.selectOption(focusedOption);
          }
        }
        break;
      case 'ArrowDown':
        event.preventDefault();
        if (!this.isOpen()) {
          this.toggleDropdown();
        } else {
          const nextIndex = Math.min(this.focusedIndex() + 1, options.length - 1);
          this.focusedIndex.set(nextIndex);
        }
        break;
      case 'ArrowUp':
        event.preventDefault();
        if (!this.isOpen()) {
          this.toggleDropdown();
        } else {
          const prevIndex = Math.max(this.focusedIndex() - 1, 0);
          this.focusedIndex.set(prevIndex);
        }
        break;
      case 'Escape':
        event.preventDefault();
        this.isOpen.set(false);
        this.openChange.emit(false);
        break;
      case 'Home':
        if (this.isOpen()) {
          event.preventDefault();
          this.focusedIndex.set(0);
        }
        break;
      case 'End':
        if (this.isOpen()) {
          event.preventDefault();
          this.focusedIndex.set(options.length - 1);
        }
        break;
    }
  }
  
  onBlur(): void {
    setTimeout(() => {
      this.isOpen.set(false);
      this.openChange.emit(false);
      this.onTouched();
    }, 150);
  }
  
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event): void {
    const target = event.target as HTMLElement;
    if (!target.closest(`#${this.selectId()}`)) {
      this.isOpen.set(false);
      this.openChange.emit(false);
    }
  }
  
  // ControlValueAccessor implementation
  writeValue(value: string | number | null): void {
    this.value.set(value);
  }
  
  registerOnChange(fn: (value: string | number | null) => void): void {
    this.onChange = fn;
  }
  
  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }
  
  setDisabledState(isDisabled: boolean): void {
    // Handled by disabled input
  }
}