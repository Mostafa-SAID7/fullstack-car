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
    template: `
    <div class="flex flex-wrap gap-2">
      <button 
        *ngFor="let option of options" 
        type="button"
        (click)="toggle(option)"
        [ngClass]="isSelected(option) ? 'bg-primary text-white' : 'bg-secondary/50 dark:bg-white/5 text-foreground hover:bg-secondary/70 dark:hover:bg-white/10'"
        class="px-4 py-2 rounded-2xl font-bold text-xs uppercase tracking-widest hover:scale-105 active:scale-95 transition-all flex items-center gap-2 border border-transparent">
        <i *ngIf="option.icon" class="fas" [ngClass]="option.icon"></i>
        <span>{{ option.label }}</span>
      </button>
    </div>
  `
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
