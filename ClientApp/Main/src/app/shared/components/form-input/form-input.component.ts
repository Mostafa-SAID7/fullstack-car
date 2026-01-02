import { Component, Input, forwardRef, OnInit } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, FormControl, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

export type InputType = 'text' | 'email' | 'password' | 'tel' | 'number' | 'url';

@Component({
    selector: 'app-form-input',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule],
    templateUrl: './form-input.component.html',
    styleUrls: ['./form-input.component.scss'],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => FormInputComponent),
            multi: true
        }
    ]
})
export class FormInputComponent implements ControlValueAccessor, OnInit {
    @Input() label = '';
    @Input() placeholder = '';
    @Input() type: InputType = 'text';
    @Input() icon?: string;
    @Input() prefixIcon?: string;
    @Input() suffixIcon?: string;
    @Input() showToggle = false; // For password visibility toggle
    @Input() errorMessage?: string;
    @Input() hint?: string;
    @Input() required = false;
    @Input() disabled = false;
    @Input() formControl?: FormControl;

    value = '';
    isPasswordVisible = false;
    isTouched = false;
    isFocused = false;

    private onChange: (value: string) => void = () => { };
    private onTouched: () => void = () => { };

    ngOnInit() {
        // Support both formControl binding and ControlValueAccessor
    }

    get currentType(): string {
        if (this.type === 'password' && this.showToggle && this.isPasswordVisible) {
            return 'text';
        }
        return this.type;
    }

    get hasError(): boolean {
        if (this.formControl) {
            return this.formControl.invalid && (this.formControl.dirty || this.formControl.touched);
        }
        return false;
    }

    get errorMessages(): string[] {
        if (!this.formControl || !this.hasError) return [];

        const errors = this.formControl.errors;
        const messages: string[] = [];

        if (errors) {
            if (errors['required']) messages.push(`${this.label || 'This field'} is required`);
            if (errors['email']) messages.push('Please enter a valid email address');
            if (errors['minlength']) {
                messages.push(`Minimum ${errors['minlength'].requiredLength} characters required`);
            }
            if (errors['maxlength']) {
                messages.push(`Maximum ${errors['maxlength'].requiredLength} characters allowed`);
            }
            if (errors['pattern']) messages.push('Please enter a valid format');
        }

        return messages;
    }

    writeValue(value: string): void {
        this.value = value || '';
    }

    registerOnChange(fn: (value: string) => void): void {
        this.onChange = fn;
    }

    registerOnTouched(fn: () => void): void {
        this.onTouched = fn;
    }

    setDisabledState(isDisabled: boolean): void {
        this.disabled = isDisabled;
    }

    onInputChange(event: Event): void {
        const target = event.target as HTMLInputElement;
        this.value = target.value;
        this.onChange(this.value);
    }

    onBlur(): void {
        this.isTouched = true;
        this.isFocused = false;
        this.onTouched();
    }

    onFocus(): void {
        this.isFocused = true;
    }

    togglePasswordVisibility(): void {
        this.isPasswordVisible = !this.isPasswordVisible;
    }
}
