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
  template: `
    <button
      #checkboxElement
      type="button"
      role="checkbox"
      [attr.aria-checked]="checked()"
      [attr.aria-describedby]="ariaDescribedBy()"
      [attr.aria-invalid]="isInvalid()"
      [attr.aria-required]="required()"
      [id]="checkboxId()"
      [class]="checkboxClasses()"
      [disabled]="disabled()"
      (click)="toggle()"
      (blur)="onBlur()"
      (focus)="onFocus()"
      (keydown)="onKeyDown($event)"
    >
      @if (checked()) {
        <svg class="h-4 w-4 text-current" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
          <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
        </svg>
      } @else if (indeterminate()) {
        <svg class="h-4 w-4 text-current" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
          <path fill-rule="evenodd" d="M4 10a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1z" clip-rule="evenodd"></path>
        </svg>
      }
    </button>
  `
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
  
  private checked = signal<boolean>(false);
  private ngControl = inject(NgControl, { optional: true });
  private onChange = (value: boolean) => {};
  private onTouched = () => {};
  
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
    
    const stateClasses = this.checked() || this.indeterminate()
      ? 'bg-primary text-primary-foreground' 
      : 'bg-background hover:bg-accent hover:text-accent-foreground';
    
    const validationClasses = this.isInvalid() ? 'border-destructive' : '';
    
    return `${baseClasses} ${sizeClasses[this.size()]} ${stateClasses} ${validationClasses}`;
  });
  
  toggle(): void {
    if (!this.disabled()) {
      const newValue = !this.checked();
      this.checked.set(newValue);
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
    this.checked.set(!!value);
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

/**
 * Checkbox with Label Component - Enhanced with better accessibility
 */
@Component({
  selector: 'ui-checkbox-with-label',
  standalone: true,
  imports: [CommonModule, CheckboxComponent],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CheckboxWithLabelComponent),
      multi: true
    }
  ],
  template: `
    <div class="flex items-start space-x-2">
      <ui-checkbox
        [disabled]="disabled()"
        [size]="size()"
        [checkboxId]="checkboxId()"
        [ariaDescribedBy]="descriptionId()"
        [required]="required()"
        [indeterminate]="indeterminate()"
        [(ngModel)]="checked"
        (checkedChange)="onCheckedChange($event)"
      ></ui-checkbox>
      <div class="grid gap-1.5 leading-none">
        <label 
          [for]="checkboxId()"
          [class]="labelClasses()"
          (click)="toggleCheckbox()"
        >
          @if (label()) {
            {{ label() }}
          } @else {
            <ng-content select="[slot=label]"></ng-content>
          }
        </label>
        @if (description() || hasDescriptionContent()) {
          <p 
            [id]="descriptionId()"
            class="text-sm text-muted-foreground">
            @if (description()) {
              {{ description() }}
            } @else {
              <ng-content select="[slot=description]"></ng-content>
            }
          </p>
        }
      </div>
    </div>
  `
})
export class CheckboxWithLabelComponent implements ControlValueAccessor {
  disabled = input<boolean>(false);
  size = input<'sm' | 'md' | 'lg'>('md');
  label = input<string>('');
  description = input<string>('');
  checkboxId = input<string>(() => `checkbox-${Math.random().toString(36).substr(2, 9)}`);
  required = input<boolean>(false);
  indeterminate = input<boolean>(false);
  
  checkedChange = output<boolean>();
  
  checked = signal<boolean>(false);
  private onChange = (value: boolean) => {};
  private onTouched = () => {};
  
  descriptionId = computed(() => `${this.checkboxId()}-description`);
  
  hasDescriptionContent = computed(() => {
    // This would need to be implemented to check for projected content
    // For now, we'll assume false
    return false;
  });
  
  labelClasses = computed(() => {
    const baseClasses = 'text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer';
    const disabledClasses = this.disabled() ? 'cursor-not-allowed opacity-70' : '';
    
    return `${baseClasses} ${disabledClasses}`;
  });
  
  onCheckedChange(checked: boolean): void {
    this.checked.set(checked);
    this.onChange(checked);
    this.checkedChange.emit(checked);
  }
  
  toggleCheckbox(): void {
    if (!this.disabled()) {
      const newValue = !this.checked();
      this.onCheckedChange(newValue);
    }
  }
  
  // ControlValueAccessor implementation
  writeValue(value: boolean): void {
    this.checked.set(!!value);
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