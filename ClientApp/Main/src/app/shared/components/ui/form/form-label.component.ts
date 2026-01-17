import { Component, input, computed } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'ui-form-label',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './form-label.component.html',
    styleUrls: ['./form-label.component.scss']
})
export class FormLabelComponent {
    htmlFor = input<string>();
    required = input<boolean>(false);
    size = input<'sm' | 'md' | 'lg'>('md');

    labelClasses = computed(() => {
        const sizeClasses = {
            sm: 'text-sm',
            md: 'text-sm',
            lg: 'text-base'
        };

        return `font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ${sizeClasses[this.size()]}`;
    });
}
