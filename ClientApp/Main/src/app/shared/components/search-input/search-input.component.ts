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
    template: `
    <div class="relative group">
      <i class="fas fa-search absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors duration-300"></i>
      <input
        type="text"
        [placeholder]="placeholder"
        [(ngModel)]="value"
        (ngModelChange)="onValueChange($event)"
        (blur)="onBlur()"
        class="w-full bg-secondary/30 dark:bg-white/5 border-2 border-transparent focus:border-primary/20 rounded-full pl-12 pr-12 py-3 outline-none transition-all text-foreground font-medium placeholder:text-muted-foreground/70"
        [class]="inputClass"
      >
      <button 
        *ngIf="value" 
        (click)="clear()"
        class="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
        type="button">
        <i class="fas fa-times"></i>
      </button>
    </div>
  `
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
