import { Component, input, output, signal, computed, forwardRef, inject, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, NgControl } from '@angular/forms';

/**
 * Checkbox Component - Shadcn/UI style checkbox with enhanced accessibility
 */
@Component({
  selector: 'ui-checkbox',
  standalone: true,
  imports: [CommonModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CheckboxComponent),
      multi: true
    }
  ],
  templateUrl: './checkbox.component.html',
  styleUrls: ['./checkbox.component.scss']
})
export class CheckboxComponent implements ControlValueAccessor {
  @ViewChild('checkboxElement') checkboxElement!: ElementRef<HTMLButtonElement>;

  disabled = input<boolean>(false);
  size = input<'sm' | 'md' | 'lg'>('md');
  checkboxId = input<string>('');
  ariaDescribedBy = input<string>('');
  required = input<boolean>(false);
  indeterminate = input<boolean>(false);

  checkedChange = output<boolean>();
  focus = output<void>();
  blur = output<void>();
  keyDown = output<KeyboardEvent>();

  checkedInput = input<boolean>(false, { alias: 'checked' });
  private _checked = signal<boolean>(false);
  isChecked = computed(() => this.checkedInput() || this._checked());
  private ngControl = inject(NgControl, { optional: true });
  private onChange = (value: boolean) => { };
  private onTouched = () => { };

  isInvalid = computed(() => {
    if (this.ngControl) {
      return this.ngControl.invalid && (this.ngControl.dirty || this.ngControl.touched);
    }
    return false;
  });

  checkboxClasses = computed(() => {
    const baseClasses = 'peer inline-flex items-center justify-center rounded-sm border border-primary ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-colors';

    const sizeClasses = {
      sm: 'h-3 w-3',
      md: 'h-4 w-4',
      lg: 'h-5 w-5'
    };

    const stateClasses = this.isChecked() || this.indeterminate()
      ? 'bg-primary text-primary-foreground'
      : 'bg-background hover:bg-accent hover:text-accent-foreground';

    const validationClasses = this.isInvalid() ? 'border-destructive' : '';

    return `${baseClasses} ${sizeClasses[this.size()]} ${stateClasses} ${validationClasses}`;
  });

  toggle(): void {
    if (!this.disabled()) {
      const newValue = !this._checked();
      this._checked.set(newValue);
      this.onChange(newValue);
      this.checkedChange.emit(newValue);
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
      this.toggle();
    }
    this.keyDown.emit(event);
  }

  focusCheckbox(): void {
    if (this.checkboxElement) {
      this.checkboxElement.nativeElement.focus();
    }
  }

  // ControlValueAccessor implementation
  writeValue(value: boolean): void {
    this._checked.set(!!value);
  }

  registerOnChange(fn: (value: boolean) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    // Handled by disabled input
  }
}

// Re-export sub-component for backward compatibility
export * from './checkbox-with-label.component';
