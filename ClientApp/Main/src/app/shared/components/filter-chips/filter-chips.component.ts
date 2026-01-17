import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface ChipOption {
    value: any;
    label: string;
    icon?: string;
    selected?: boolean;
}

@Component({
    selector: 'app-filter-chips',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './filter-chips.component.html'
})
export class FilterChipsComponent {
    @Input() options: ChipOption[] = [];
    @Input() selectedValue: any = null; // Single value
    @Input() selectedValues: any[] = []; // Multiple values (if multi-select)
    @Input() multiple = false;

    @Output() selectionChange = new EventEmitter<any>(); // Emits value or array of values

    isSelected(option: ChipOption): boolean {
        if (this.multiple) {
            return this.selectedValues.includes(option.value);
        }
        return this.selectedValue === option.value;
    }

    toggle(option: ChipOption): void {
        if (this.multiple) {
            const index = this.selectedValues.indexOf(option.value);
            if (index === -1) {
                this.selectedValues = [...this.selectedValues, option.value];
            } else {
                this.selectedValues = this.selectedValues.filter(v => v !== option.value);
            }
            this.selectionChange.emit(this.selectedValues);
        } else {
            if (this.selectedValue === option.value) {
                this.selectedValue = null; // Toggle off if already selected
            } else {
                this.selectedValue = option.value;
            }
            this.selectionChange.emit(this.selectedValue);
        }
    }
}
