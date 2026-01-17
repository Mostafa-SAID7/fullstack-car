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
  template: `
    <button
      #radioElement
      type="button"
      role="radio"
      [attr.aria-checked]="checked()"
      [attr.aria-describedby]="ariaDescribedBy()"
      [attr.aria-invalid]="isInvalid()"
      [attr.aria-required]="required()"
      [id]="radioId()"
      [class]="radioClasses()"
      [disabled]="disabled()"
      (click)="select()"
      (blur)="onBlur()"
      (focus)="onFocus()"
      (keydown)="onKeyDown($event)"
    >
      @if (checked()) {
        <div class="h-2 w-2 rounded-full bg-current"></div>
      }
    </button>
  `
})
export class RadioComponent implements ControlValueAccessor {
  @ViewChild('radioElement') radioElement!: ElementRef<HTMLButtonElement>;
  
  value = input.required<string | number>();
  disabled = input<boolean>(false);
  size = input<'sm' | 'md' | 'lg'>('md');
  radioId = input<string>('');
  ariaDescribedBy = input<string>('');
  required = input<boolean>(false);
  
  selectionChange = output<string | number>();
  focus = output<void>();
  blur = output<void>();
  keyDown = output<KeyboardEvent>();
  
  private selectedValue = signal<string | number | null>(null);
  private ngControl = inject(NgControl, { optional: true });
  private onChange = (value: string | number | null) => {};
  private onTouched = () => {};
  
  checked = computed(() => this.selectedValue() === this.value());
  
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
    
    const stateClasses = this.checked() 
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

/**
 * Radio Group Component - Group of radio buttons with enhanced accessibility
 */
@Component({
  selector: 'ui-radio-group',
  standalone: true,
  imports: [CommonModule, RadioComponent],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => RadioGroupComponent),
      multi: true
    }
  ],
  template: `
    <div 
      [class]="groupClasses()" 
      role="radiogroup"
      [attr.aria-labelledby]="ariaLabelledBy()"
      [attr.aria-describedby]="ariaDescribedBy()"
      [attr.aria-invalid]="isInvalid()"
      [attr.aria-required]="required()"
      (keydown)="onKeyDown($event)"
    >
      @for (option of options(); track option.value; let i = $index) {
        <div class="flex items-start space-x-2">
          <ui-radio
            [value]="option.value"
            [disabled]="disabled() || option.disabled"
            [size]="size()"
            [radioId]="getRadioId(option, i)"
            [ariaDescribedBy]="option.description ? getDescriptionId(option, i) : ''"
            [required]="required()"
            [(ngModel)]="selectedValue"
            (selectionChange)="onSelectionChange($event)"
            (keyDown)="onRadioKeyDown($event, i)"
          ></ui-radio>
          <div class="grid gap-1.5 leading-none">
            <label 
              [for]="getRadioId(option, i)"
              [class]="labelClasses(option)"
              (click)="selectOption(option)"
            >
              {{ option.label }}
            </label>
            @if (option.description) {
              <p 
                [id]="getDescriptionId(option, i)"
                class="text-sm text-muted-foreground">
                {{ option.description }}
              </p>
            }
          </div>
        </div>
      }
    </div>
  `
})
export class RadioGroupComponent implements ControlValueAccessor {
  options = input.required<RadioOption[]>();
  disabled = input<boolean>(false);
  size = input<'sm' | 'md' | 'lg'>('md');
  orientation = input<'horizontal' | 'vertical'>('vertical');
  ariaLabelledBy = input<string>('');
  ariaDescribedBy = input<string>('');
  required = input<boolean>(false);
  groupId = input<string>(() => `radio-group-${Math.random().toString(36).substr(2, 9)}`);
  
  selectionChange = output<RadioOption>();
  
  selectedValue = signal<string | number | null>(null);
  private focusedIndex = signal<number>(0);
  private ngControl = inject(NgControl, { optional: true });
  private onChange = (value: string | number | null) => {};
  private onTouched = () => {};
  
  isInvalid = computed(() => {
    if (this.ngControl) {
      return this.ngControl.invalid && (this.ngControl.dirty || this.ngControl.touched);
    }
    return false;
  });
  
  groupClasses = computed(() => {
    const orientationClasses = {
      horizontal: 'flex flex-wrap gap-4',
      vertical: 'space-y-3'
    };
    
    return orientationClasses[this.orientation()];
  });
  
  getRadioId(option: RadioOption, index: number): string {
    return `${this.groupId()}-${index}`;
  }
  
  getDescriptionId(option: RadioOption, index: number): string {
    return `${this.groupId()}-${index}-description`;
  }
  
  labelClasses = (option: RadioOption) => {
    const baseClasses = 'text-sm font-medium leading-none cursor-pointer';
    const disabledClasses = (this.disabled() || option.disabled) ? 'cursor-not-allowed opacity-70' : '';
    
    return `${baseClasses} ${disabledClasses}`;
  };
  
  onSelectionChange(value: string | number): void {
    this.selectedValue.set(value);
    this.onChange(value);
    
    const selectedOption = this.options().find(option => option.value === value);
    if (selectedOption) {
      this.selectionChange.emit(selectedOption);
    }
  }
  
  selectOption(option: RadioOption): void {
    if (!this.disabled() && !option.disabled) {
      this.onSelectionChange(option.value);
    }
  }
  
  onKeyDown(event: KeyboardEvent): void {
    const options = this.options();
    const enabledOptions = options.filter(option => !option.disabled);
    
    if (enabledOptions.length === 0) return;
    
    let newIndex = this.focusedIndex();
    
    switch (event.key) {
      case 'ArrowDown':
      case 'ArrowRight':
        event.preventDefault();
        newIndex = (newIndex + 1) % enabledOptions.length;
        break;
      case 'ArrowUp':
      case 'ArrowLeft':
        event.preventDefault();
        newIndex = newIndex === 0 ? enabledOptions.length - 1 : newIndex - 1;
        break;
      case 'Home':
        event.preventDefault();
        newIndex = 0;
        break;
      case 'End':
        event.preventDefault();
        newIndex = enabledOptions.length - 1;
        break;
      default:
        return;
    }
    
    this.focusedIndex.set(newIndex);
    const selectedOption = enabledOptions[newIndex];
    this.onSelectionChange(selectedOption.value);
    
    // Focus the radio button
    setTimeout(() => {
      const radioElement = document.getElementById(this.getRadioId(selectedOption, options.indexOf(selectedOption)));
      if (radioElement) {
        radioElement.focus();
      }
    });
  }
  
  onRadioKeyDown(event: KeyboardEvent, index: number): void {
    this.focusedIndex.set(index);
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