import { Component, Input, Output, EventEmitter, forwardRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, FormsModule } from '@angular/forms';

@Component({
    selector: 'app-search-input',
    standalone: true,
    imports: [CommonModule, FormsModule],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => SearchInputComponent),
            multi: true
        }
    ],
    templateUrl: './search-input.component.html'
})
export class SearchInputComponent implements ControlValueAccessor {
    @Input() placeholder = 'Search...';
    @Input() inputClass = '';
    @Output() search = new EventEmitter<string>();
    @Output() clearSearch = new EventEmitter<void>();

    value = '';

    onChange = (_: any) => { };
    onTouched = () => { };

    writeValue(value: any): void {
        this.value = value;
    }

    registerOnChange(fn: any): void {
        this.onChange = fn;
    }

    registerOnTouched(fn: any): void {
        this.onTouched = fn;
    }

    onValueChange(value: string) {
        this.onChange(value);
        this.search.emit(value);
    }

    onBlur() {
        this.onTouched();
    }

    clear() {
        this.value = '';
        this.onChange('');
        this.search.emit('');
        this.clearSearch.emit();
    }
}
