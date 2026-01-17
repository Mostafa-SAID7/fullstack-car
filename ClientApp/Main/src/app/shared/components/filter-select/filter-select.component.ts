import { Component, Input, Output, EventEmitter, forwardRef, ContentChild, TemplateRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, FormsModule } from '@angular/forms';

export interface FilterOption {
    value: any;
    label: string;
    icon?: string;
}

@Component({
    selector: 'app-filter-select',
    standalone: true,
    imports: [CommonModule, FormsModule],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => FilterSelectComponent),
            multi: true
        }
    ],
    templateUrl: './filter-select.component.html'
})
export class FilterSelectComponent implements ControlValueAccessor {
    @Input() options: FilterOption[] = [];
    @Input() placeholder = '';
    @Input() icon = '';
    @Output() selectionChange = new EventEmitter<any>();

    value: any = '';

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

    onValueChange(value: any) {
        this.onChange(value);
        this.selectionChange.emit(value);
    }
}
