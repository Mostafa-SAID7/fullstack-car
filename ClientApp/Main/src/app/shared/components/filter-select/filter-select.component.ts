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
    template: `
    <div class="relative">
      <i *ngIf="icon" [class]="'fas ' + icon + ' absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none'"></i>
      
      <select
        [(ngModel)]="value"
        (ngModelChange)="onValueChange($event)"
        (blur)="onTouched()"
        class="w-full bg-secondary/30 dark:bg-white/5 border-none rounded-2xl pl-12 pr-10 py-3 outline-none transition-all text-sm font-bold cursor-pointer appearance-none text-foreground hover:bg-secondary/50 dark:hover:bg-white/10"
        [class.pl-4]="!icon">
        <option *ngIf="placeholder" value="" disabled selected>{{ placeholder }}</option>
        <option *ngFor="let option of options" [value]="option.value">
          {{ option.label }}
        </option>
      </select>
      
      <i class="fas fa-chevron-down absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none text-xs"></i>
    </div>
  `
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
