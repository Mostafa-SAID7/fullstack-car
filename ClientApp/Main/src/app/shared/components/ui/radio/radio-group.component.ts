import { Component, input, output, signal, computed, forwardRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, NgControl } from '@angular/forms';
import { RadioComponent, RadioOption } from './radio.component';

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
    templateUrl: './radio-group.component.html',
    styleUrls: ['./radio-group.component.scss']
})
export class RadioGroupComponent implements ControlValueAccessor {
    options = input.required<RadioOption[]>();
    disabled = input<boolean>(false);
    size = input<'sm' | 'md' | 'lg'>('md');
    orientation = input<'horizontal' | 'vertical'>('vertical');
    ariaLabelledBy = input<string>('');
    ariaDescribedBy = input<string>('');
    required = input<boolean>(false);
    groupId = input<string>(`radio-group-${Math.random().toString(36).substr(2, 9)}`);

    selectionChange = output<RadioOption>();

    selectedValue = signal<string | number | null>(null);
    private focusedIndex = signal<number>(0);
    private ngControl = inject(NgControl, { optional: true });
    private onChange = (value: string | number | null) => { };
    private onTouched = () => { };

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
