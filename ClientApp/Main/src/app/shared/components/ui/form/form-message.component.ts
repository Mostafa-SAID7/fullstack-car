import { Component, input, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AbstractControl } from '@angular/forms';

@Component({
    selector: 'ui-form-message',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './form-message.component.html',
    styleUrls: ['./form-message.component.scss']
})
export class FormMessageComponent {
    message = input<string>('');
    type = input<'error' | 'success' | 'warning' | 'info'>('error');
    control = input<AbstractControl | null>(null);
    fieldName = input<string>('');
    messageId = input<string>('');

    shouldShowMessage = computed(() => {
        if (this.message()) return true;

        const ctrl = this.control();
        return ctrl && ctrl.errors && ctrl.touched;
    });

    messageClasses = computed(() => {
        const typeClasses = {
            error: 'text-destructive',
            success: 'text-green-600 dark:text-green-400',
            warning: 'text-yellow-600 dark:text-yellow-400',
            info: 'text-blue-600 dark:text-blue-400'
        };

        return `text-sm font-medium ${typeClasses[this.type()]}`;
    });

    getValidationMessage(): string {
        const ctrl = this.control();
        const fieldName = this.fieldName() || 'Field';

        if (!ctrl || !ctrl.errors) return '';

        const errors = ctrl.errors;

        if (errors['required']) {
            return `${fieldName} is required`;
        }
        if (errors['email']) {
            return `${fieldName} must be a valid email address`;
        }
        if (errors['minlength']) {
            return `${fieldName} must be at least ${errors['minlength'].requiredLength} characters`;
        }
        if (errors['maxlength']) {
            return `${fieldName} must be no more than ${errors['maxlength'].requiredLength} characters`;
        }
        if (errors['pattern']) {
            return `${fieldName} format is invalid`;
        }
        if (errors['min']) {
            return `${fieldName} must be at least ${errors['min'].min}`;
        }
        if (errors['max']) {
            return `${fieldName} must be no more than ${errors['max'].max}`;
        }

        return `${fieldName} is invalid`;
    }
}
