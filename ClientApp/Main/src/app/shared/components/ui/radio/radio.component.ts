import { Component, input, output, signal, computed, forwardRef, inject, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, NgControl } from '@angular/forms';

export interface RadioOption {
  value: string | number;
  label: string;
  disabled?: boolean;
  description?: string;
}

/**
 * Radio Component - Single radio button with enhanced accessibility
 */
@Component({
  selector: 'ui-radio',
  standalone: true,
  imports: [CommonModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => RadioComponent),
      multi: true
    }
  ],
  templateUrl: './radio.component.html',
  styleUrls: ['./radio.component.scss']
})
export class RadioComponent implements ControlValueAccessor {
  @ViewChild('radioElement') radioElement!: ElementRef<HTMLButtonElement>;

  value = input.required<string | number>();
  disabled = input<boolean>(false);
  size = input<'sm' | 'md' | 'lg'>('md');
  radioId = input<string>('');
  ariaDescribedBy = input<string>('');
  required = input<boolean>(false);

  checked = input<boolean>(false);

  selectionChange = output<string | number>();
  focus = output<void>();
  blur = output<void>();
  keyDown = output<KeyboardEvent>();

  private selectedValue = signal<string | number | null>(null);
  private ngControl = inject(NgControl, { optional: true });
  private onChange = (value: string | number | null) => { };
  private onTouched = () => { };

  isChecked = computed(() => this.checked() || this.selectedValue() === this.value());

  isInvalid = computed(() => {
    if (this.ngControl) {
      return this.ngControl.invalid && (this.ngControl.dirty || this.ngControl.touched);
    }
    return false;
  });

  radioClasses = computed(() => {
    const baseClasses = 'aspect-square rounded-full border border-primary text-primary ring-offset-background focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-colors';

    const sizeClasses = {
      sm: 'h-3 w-3',
      md: 'h-4 w-4',
      lg: 'h-5 w-5'
    };

    const stateClasses = this.isChecked()
      ? 'bg-background border-primary'
      : 'bg-background hover:bg-accent';

    const validationClasses = this.isInvalid() ? 'border-destructive' : '';

    return `${baseClasses} ${sizeClasses[this.size()]} ${stateClasses} ${validationClasses}`;
  });

  select(): void {
    if (!this.disabled()) {
      const newValue = this.value();
      this.selectedValue.set(newValue);
      this.onChange(newValue);
      this.selectionChange.emit(newValue);
    }
  }

  onBlur(): void {
    this.onTouched();
    this.blur.emit();
  }

  onFocus(): void {
    this.focus.emit();
  }

  onKeyDown(event: KeyboardEvent): void {
    if (event.key === ' ' || event.key === 'Enter') {
      event.preventDefault();
      this.select();
    }
    this.keyDown.emit(event);
  }

  focusRadio(): void {
    if (this.radioElement) {
      this.radioElement.nativeElement.focus();
    }
  }

  // ControlValueAccessor implementation
  writeValue(value: string | number | null): void {
    this.selectedValue.set(value);
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

// Re-export components for backward compatibility
export * from './radio-group.component';
