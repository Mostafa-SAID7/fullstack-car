import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-empty-state',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './empty-state.component.html',

})
export class EmptyStateComponent {
    @Input() icon = 'fa-inbox';
    @Input() message = 'No items found';
    @Input() description = 'Try adjusting your filters or search terms';
    @Input() actionText?: string;
    @Input() actionIcon?: string;
}
