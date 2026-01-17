import { Component, computed } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'ui-form-description',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './form-description.component.html',
    styleUrls: ['./form-description.component.scss']
})
export class FormDescriptionComponent {
    descriptionClasses = computed(() => 'text-sm text-muted-foreground');
}
