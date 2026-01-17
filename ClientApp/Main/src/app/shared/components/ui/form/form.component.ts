import { Component, input, output, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, AbstractControl, FormArray } from '@angular/forms';

/**
 * Form Component - Shadcn/UI style form wrapper
 * 
 * Provides consistent form styling and validation display with enhanced accessibility
 */
@Component({
  selector: 'ui-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss']
})
export class FormComponent {
  formGroup = input.required<FormGroup>();
  spacing = input<'sm' | 'md' | 'lg'>('md');
  novalidate = input<boolean>(true);
  ariaLabel = input<string>('');
  ariaDescribedBy = input<string>('');
  showErrorSummary = input<boolean>(false);

  formSubmit = output<void>();
  formInvalid = output<{ [key: string]: any }>();

  private hasSubmitted = signal<boolean>(false);

  formClasses = computed(() => {
    const spacingClasses = {
      sm: 'space-y-3',
      md: 'space-y-4',
      lg: 'space-y-6'
    };

    return `${spacingClasses[this.spacing()]}`;
  });

  hasErrors = computed(() => {
    return this.hasSubmitted() && !this.formGroup().valid;
  });

  onSubmit(): void {
    const form = this.formGroup();
    this.hasSubmitted.set(true);

    // Mark all fields as touched to show validation errors
    this.markFormGroupTouched(form);

    if (form.valid) {
      this.formSubmit.emit();
    } else {
      this.formInvalid.emit(this.getFormErrors(form));

      // Focus first invalid field for accessibility
    }
  }

  getErrorList(): Array<{ field: string; message: string }> {
    const errors: Array<{ field: string; message: string }> = [];
    const form = this.formGroup();

    Object.keys(form.controls).forEach(key => {
      const control = form.get(key);
      if (control && control.errors && control.touched) {
        const errorMessage = this.getErrorMessage(key, control.errors);
        if (errorMessage) {
          errors.push({ field: key, message: errorMessage });
        }
      }
    });

    return errors;
  }

  focusField(fieldName: string, event: Event): void {
    event.preventDefault();
    const element = document.getElementById(fieldName);
    if (element) {
      element.focus();
    }
  }

  private focusFirstInvalidField(): void {
    const form = this.formGroup();
    const firstInvalidField = Object.keys(form.controls).find(key => {
      const control = form.get(key);
      return control && control.invalid && control.touched;
    });

    if (firstInvalidField) {
      setTimeout(() => {
        const element = document.getElementById(firstInvalidField);
        if (element) {
          element.focus();
        }
      }, 100);
    }
  }

  private getErrorMessage(fieldName: string, errors: any): string {
    if (errors['required']) {
      return `${this.formatFieldName(fieldName)} is required`;
    }
    if (errors['email']) {
      return `${this.formatFieldName(fieldName)} must be a valid email address`;
    }
    if (errors['minlength']) {
      return `${this.formatFieldName(fieldName)} must be at least ${errors['minlength'].requiredLength} characters`;
    }
    if (errors['maxlength']) {
      return `${this.formatFieldName(fieldName)} must be no more than ${errors['maxlength'].requiredLength} characters`;
    }
    if (errors['pattern']) {
      return `${this.formatFieldName(fieldName)} format is invalid`;
    }
    if (errors['min']) {
      return `${this.formatFieldName(fieldName)} must be at least ${errors['min'].min}`;
    }
    if (errors['max']) {
      return `${this.formatFieldName(fieldName)} must be no more than ${errors['max'].max}`;
    }

    return `${this.formatFieldName(fieldName)} is invalid`;
  }

  private formatFieldName(fieldName: string): string {
    return fieldName
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, str => str.toUpperCase())
      .trim();
  }

  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      if (control) {
        control.markAsTouched();

        if (control instanceof FormGroup) {
          this.markFormGroupTouched(control);
        } else if (control instanceof FormArray) {
          control.controls.forEach(arrayControl => {
            if (arrayControl instanceof FormGroup) {
              this.markFormGroupTouched(arrayControl);
            } else {
              arrayControl.markAsTouched();
            }
          });
        }
      }
    });
  }

  private getFormErrors(form: FormGroup): { [key: string]: any } {
    const errors: { [key: string]: any } = {};

    Object.keys(form.controls).forEach(key => {
      const control = form.get(key);
      if (control && control.errors && control.touched) {
        errors[key] = control.errors;
      }
    });

    return errors;
  }
}

// Re-export sub-components for backward compatibility
export * from './form-field.component';
export * from './form-label.component';
export * from './form-message.component';
export * from './form-description.component';
