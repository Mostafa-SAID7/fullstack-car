import { Component, Input, ContentChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';

export type CardVariant = 'default' | 'elevated' | 'outlined' | 'filled';
export type CardSize = 'sm' | 'md' | 'lg';

@Component({
    selector: 'app-card',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './card.component.html',
    styleUrls: ['./card.component.scss']
})
export class CardComponent {
    /**
     * Visual variant of the card
     */
    @Input() variant: CardVariant = 'default';

    /**
     * Size of the card
     */
    @Input() size: CardSize = 'md';

    /**
     * Whether the card is clickable
     */
    @Input() clickable = false;

    /**
     * Whether the card is currently selected/active
     */
    @Input() selected = false;

    /**
     * Whether to show hover effects
     */
    @Input() hoverable = true;

    /**
     * Custom CSS classes
     */
    @Input() customClass = '';

    /**
     * Whether to add padding to the card
     */
    @Input() noPadding = false;

    // Content detection
    hasHeaderContent = false;
    hasMediaContent = false;
    hasFooterContent = false;
    hasActionsContent = false;

    ngAfterContentInit() {
        // Detection logic would go here if needed
        // For simplicity, we'll rely on *ngIf with content projection
    }

    get cardClasses(): string {
        const classes = [
            'app-card',
            `app-card--${this.variant}`,
            `app-card--${this.size}`,
            this.customClass
        ];

        if (this.clickable) classes.push('app-card--clickable');
        if (this.selected) classes.push('app-card--selected');
        if (this.hoverable) classes.push('app-card--hoverable');
        if (this.noPadding) classes.push('app-card--no-padding');

        return classes.filter(Boolean).join(' ');
    }
}
