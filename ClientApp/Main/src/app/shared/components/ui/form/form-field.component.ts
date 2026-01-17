import { Component, computed } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'ui-form-field',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './form-field.component.html',
    styleUrls: ['./form-field.component.scss']
})
export class FormFieldComponent {
    fieldClasses = computed(() => 'space-y-2');
}
