import { Component, Input, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'success' | 'warning';
export type ButtonSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

@Component({
    selector: 'app-form-button',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './form-button.component.html',
    styleUrls: ['./form-button.component.scss']
})
export class FormButtonComponent {
    @Input() variant: ButtonVariant = 'primary';
    @Input() size: ButtonSize = 'md';
    @Input() type: 'button' | 'submit' | 'reset' = 'button';
    @Input() loading = false;
    @Input() disabled = false;
    @Input() fullWidth = false;
    @Input() rounded = false; // Fully rounded button
    @Input() icon?: string;
    @Input() iconPosition: 'left' | 'right' = 'left';
    @Input() iconOnly = false; // Icon-only button (no text)
    @Input() ripple = true; // Material Design ripple effect
    @Input() shadow = false; // Add shadow
    @Input() elevated = false; // Elevated style

    // Ripple effect state
    ripples: Array<{ x: number; y: number; id: number }> = [];
    private rippleId = 0;

    get buttonClasses(): string {
        const classes = [
            'form-button',
            `form-button--${this.variant}`,
            `form-button--${this.size}`
        ];

        if (this.fullWidth) classes.push('form-button--full-width');
        if (this.loading) classes.push('form-button--loading');
        if (this.rounded) classes.push('form-button--rounded');
        if (this.iconOnly) classes.push('form-button--icon-only');
        if (this.shadow) classes.push('form-button--shadow');
        if (this.elevated) classes.push('form-button--elevated');

        return classes.join(' ');
    }

    @HostListener('click', ['$event'])
    onClick(event: MouseEvent): void {
        if (this.ripple && !this.disabled && !this.loading) {
            this.createRipple(event);
        }
    }

    private createRipple(event: MouseEvent): void {
        const button = event.currentTarget as HTMLElement;
        const rect = button.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        const id = this.rippleId++;

        this.ripples.push({ x, y, id });

        // Remove ripple after animation
        setTimeout(() => {
            this.ripples = this.ripples.filter(r => r.id !== id);
        }, 600);
    }
}
