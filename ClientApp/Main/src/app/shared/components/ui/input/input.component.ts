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
  template: `
    <input
      #inputElement
      [type]="type()"
      [placeholder]="placeholder()"
      [disabled]="disabled()"
      [readonly]="readonly()"
      [class]="inputClasses()"
      [value]="value()"
      [id]="inputId()"
      [attr.aria-describedby]="ariaDescribedBy()"
      [attr.aria-invalid]="isInvalid()"
      [attr.aria-required]="required()"
      [attr.autocomplete]="autocomplete()"
      [attr.maxlength]="maxLength()"
      [attr.minlength]="minLength()"
      [attr.min]="min()"
      [attr.max]="max()"
      [attr.step]="step()"
      (input)="onInput($event)"
      (blur)="onBlur()"
      (focus)="onFocus()"
      (keydown)="onKeyDown($event)"
    />
  `
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
  
  private value = signal<string>('');
  private isFocused = signal<boolean>(false);
  private ngControl = inject(NgControl, { optional: true });
  
  private onChange = (value: string) => {};
  private onTouched = () => {};
  
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
    this.value.set(newValue);
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
    this.value.set(value || '');
  }
  
  registerOnChange(fn: (value: string) => void): void {
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
 * Textarea Component - Shadcn/UI style textarea with enhanced accessibility
 */
@Component({
  selector: 'ui-textarea',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TextareaComponent),
      multi: true
    }
  ],
  template: `
    <textarea
      #textareaElement
      [placeholder]="placeholder()"
      [disabled]="disabled()"
      [readonly]="readonly()"
      [rows]="rows()"
      [class]="textareaClasses()"
      [value]="value()"
      [id]="textareaId()"
      [attr.aria-describedby]="ariaDescribedBy()"
      [attr.aria-invalid]="isInvalid()"
      [attr.aria-required]="required()"
      [attr.maxlength]="maxLength()"
      [attr.minlength]="minLength()"
      (input)="onInput($event)"
      (blur)="onBlur()"
      (focus)="onFocus()"
      (keydown)="onKeyDown($event)"
    ></textarea>
  `
})
export class TextareaComponent implements ControlValueAccessor {
  @ViewChild('textareaElement') textareaElement!: ElementRef<HTMLTextAreaElement>;
  
  placeholder = input<string>('');
  disabled = input<boolean>(false);
  readonly = input<boolean>(false);
  rows = input<number>(3);
  variant = input<'default' | 'destructive'>('default');
  textareaId = input<string>('');
  ariaDescribedBy = input<string>('');
  required = input<boolean>(false);
  maxLength = input<number | null>(null);
  minLength = input<number | null>(null);
  resize = input<'none' | 'vertical' | 'horizontal' | 'both'>('vertical');
  
  textareaChange = output<string>();
  textareaBlur = output<void>();
  textareaFocus = output<void>();
  keyDown = output<KeyboardEvent>();
  
  private value = signal<string>('');
  private ngControl = inject(NgControl, { optional: true });
  private onChange = (value: string) => {};
  private onTouched = () => {};
  
  isInvalid = computed(() => {
    if (this.ngControl) {
      return this.ngControl.invalid && (this.ngControl.dirty || this.ngControl.touched);
    }
    return false;
  });
  
  textareaClasses = computed(() => {
    const baseClasses = 'flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-colors';
    
    const variantClasses = {
      default: '',
      destructive: 'border-destructive focus-visible:ring-destructive'
    };
    
    const resizeClasses = {
      none: 'resize-none',
      vertical: 'resize-y',
      horizontal: 'resize-x',
      both: 'resize'
    };
    
    const validationClasses = this.isInvalid() ? 'border-destructive focus-visible:ring-destructive' : '';
    
    return `${baseClasses} ${variantClasses[this.variant()]} ${resizeClasses[this.resize()]} ${validationClasses}`;
  });
  
  onInput(event: Event): void {
    const target = event.target as HTMLTextAreaElement;
    const newValue = target.value;
    this.value.set(newValue);
    this.onChange(newValue);
    this.textareaChange.emit(newValue);
  }
  
  onBlur(): void {
    this.onTouched();
    this.textareaBlur.emit();
  }
  
  onFocus(): void {
    this.textareaFocus.emit();
  }
  
  onKeyDown(event: KeyboardEvent): void {
    this.keyDown.emit(event);
  }
  
  focus(): void {
    if (this.textareaElement) {
      this.textareaElement.nativeElement.focus();
    }
  }
  
  blur(): void {
    if (this.textareaElement) {
      this.textareaElement.nativeElement.blur();
    }
  }
  
  // ControlValueAccessor implementation
  writeValue(value: string): void {
    this.value.set(value || '');
  }
  
  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }
  
  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }
  
  setDisabledState(isDisabled: boolean): void {
    // Handled by disabled input
  }
}