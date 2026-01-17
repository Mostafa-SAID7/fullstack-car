import { Component, input, output, signal, computed, forwardRef, inject, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, ReactiveFormsModule, NgControl } from '@angular/forms';

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
    templateUrl: './textarea.component.html',
    styleUrls: ['./textarea.component.scss']
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

    private _value = signal<string>('');
    value = computed(() => this._value());
    private ngControl = inject(NgControl, { optional: true });
    private onChange = (value: string) => { };
    private onTouched = () => { };

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
        this._value.set(newValue);
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
