import { Component, Input, Output, EventEmitter, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { CommonModule } from '@angular/common';


export type InputVariant = 'default' | 'filled' | 'outlined' | 'glass';

@Component({
  selector: 'app-form-input',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './form-input.component.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FormInputComponent),
      multi: true
    }
  ]
})
export class FormInputComponent implements ControlValueAccessor {
  @Input() type = 'text';
  @Input() placeholder = '';
  @Input() label = '';
  @Input() error = '';
  @Input() helperText = '';
  @Input() startIcon = '';
  @Input() endIcon = '';
  @Input() fullWidth = false;
  @Input() variant: InputVariant = 'default';
  @Input() required = false;
  @Input() disabled = false;

  @Output() valueChange = new EventEmitter<string>();
  @Output() blurEvent = new EventEmitter<Event>();
  @Output() focusEvent = new EventEmitter<Event>();

  value = '';
  inputId = `input-${Math.random().toString(36).substr(2, 9)}`;

  // ControlValueAccessor implementation
  private onChange = () => { /* empty */ };
  private onTouched = () => { /* empty */ };

  writeValue(value: string): void {
    this.value = value || '';
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = () => fn(this.value);
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  onInput(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.value = target.value;
    this.onChange();
    this.valueChange.emit(this.value);
  }

  onBlur(event: Event): void {
    this.onTouched();
    this.blurEvent.emit(event);
  }

  onFocus(event: Event): void {
    this.focusEvent.emit(event);
  }

  get inputClasses(): string {
    const baseClasses = 'flex h-10 w-full rounded-lg border px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-colors';

    const variantClasses = {
      default: 'border-gray-300 bg-white',
      filled: 'border-transparent bg-gray-100',
      outlined: 'border-gray-300 bg-white shadow-sm',
      glass: 'border-white/10 bg-black/20 text-white placeholder:text-gray-400 focus-visible:ring-blue-500/50 focus-visible:border-blue-500/50 backdrop-blur-md'
    };

    const errorClass = this.error ? 'border-red-500 focus-visible:ring-red-500' : '';
    const iconPadding = this.startIcon ? 'pl-10' : this.endIcon ? 'pr-10' : '';

    return [
      baseClasses,
      variantClasses[this.variant],
      errorClass,
      iconPadding
    ].join(' ');
  }

  get containerClasses(): string {
    return this.fullWidth ? 'w-full space-y-2' : 'space-y-2';
  }
}