import { Component, input, output, signal, computed, forwardRef, inject, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, ReactiveFormsModule, NgControl } from '@angular/forms';

/**
 * Input Component - Shadcn/UI style input with enhanced accessibility
 * 
 * Supports all standard input types with consistent styling and validation
 */
@Component({
  selector: 'ui-input',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputComponent),
      multi: true
    }
  ],
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.scss']
})
export class InputComponent implements ControlValueAccessor {
  @ViewChild('inputElement') inputElement!: ElementRef<HTMLInputElement>;

  type = input<string>('text');
  placeholder = input<string>('');
  disabled = input<boolean>(false);
  readonly = input<boolean>(false);
  size = input<'sm' | 'md' | 'lg'>('md');
  variant = input<'default' | 'destructive'>('default');
  inputId = input<string>('');
  ariaDescribedBy = input<string>('');
  required = input<boolean>(false);
  autocomplete = input<string>('');
  maxLength = input<number | null>(null);
  minLength = input<number | null>(null);
  min = input<number | string | null>(null);
  max = input<number | string | null>(null);
  step = input<number | string | null>(null);

  inputChange = output<string>();
  inputBlur = output<void>();
  inputFocus = output<void>();
  keyDown = output<KeyboardEvent>();

  private _value = signal<string>('');
  value = computed(() => this._value());
  private isFocused = signal<boolean>(false);
  private ngControl = inject(NgControl, { optional: true });

  private onChange = (value: string) => { };
  private onTouched = () => { };

  isInvalid = computed(() => {
    if (this.ngControl) {
      return this.ngControl.invalid && (this.ngControl.dirty || this.ngControl.touched);
    }
    return false;
  });

  inputClasses = computed(() => {
    const baseClasses = 'flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-colors';

    const sizeClasses = {
      sm: 'h-8 px-2 text-xs',
      md: 'h-10 px-3 text-sm',
      lg: 'h-12 px-4 text-base'
    };

    const variantClasses = {
      default: '',
      destructive: 'border-destructive focus-visible:ring-destructive'
    };

    const validationClasses = this.isInvalid() ? 'border-destructive focus-visible:ring-destructive' : '';

    return `${baseClasses} ${sizeClasses[this.size()]} ${variantClasses[this.variant()]} ${validationClasses}`;
  });

  onInput(event: Event): void {
    const target = event.target as HTMLInputElement;
    const newValue = target.value;
    this._value.set(newValue);
    this.onChange(newValue);
    this.inputChange.emit(newValue);
  }

  onBlur(): void {
    this.isFocused.set(false);
    this.onTouched();
    this.inputBlur.emit();
  }

  onFocus(): void {
    this.isFocused.set(true);
    this.inputFocus.emit();
  }

  onKeyDown(event: KeyboardEvent): void {
    this.keyDown.emit(event);
  }

  focus(): void {
    if (this.inputElement) {
      this.inputElement.nativeElement.focus();
    }
  }

  blur(): void {
    if (this.inputElement) {
      this.inputElement.nativeElement.blur();
    }
  }

  // ControlValueAccessor implementation
  writeValue(value: string): void {
    this._value.set(value || '');
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(_isDisabled: boolean): void {
    // Handled by disabled input
  }
}

// Re-export sub-component for backward compatibility
export * from './textarea.component';
