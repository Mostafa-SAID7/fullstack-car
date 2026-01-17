import { Component, input, output, signal, computed, forwardRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { CheckboxComponent } from './checkbox.component';

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
    templateUrl: './checkbox-with-label.component.html',
    styleUrls: ['./checkbox-with-label.component.scss']
})
export class CheckboxWithLabelComponent implements ControlValueAccessor {
    disabled = input<boolean>(false);
    size = input<'sm' | 'md' | 'lg'>('md');
    label = input<string>('');
    description = input<string>('');
    checkboxId = input<string>(`checkbox-${Math.random().toString(36).substr(2, 9)}`);
    required = input<boolean>(false);
    indeterminate = input<boolean>(false);

    checkedChange = output<boolean>();

    checked = signal<boolean>(false);
    private onChange = (value: boolean) => { };
    private onTouched = () => { };

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
