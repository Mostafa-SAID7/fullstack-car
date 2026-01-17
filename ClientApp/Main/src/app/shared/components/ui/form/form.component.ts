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
  template: `
    <form 
      [formGroup]="formGroup()" 
      (ngSubmit)="onSubmit()" 
      [class]="formClasses()"
      [attr.novalidate]="novalidate()"
      [attr.aria-label]="ariaLabel()"
      [attr.aria-describedby]="ariaDescribedBy()"
      role="form">
      <ng-content></ng-content>
      
      @if (showErrorSummary() && hasErrors()) {
        <div 
          class="mt-4 p-4 border border-destructive/20 bg-destructive/5 rounded-md"
          role="alert"
          aria-live="polite">
          <h3 class="text-sm font-medium text-destructive mb-2">
            Please correct the following errors:
          </h3>
          <ul class="text-sm text-destructive space-y-1">
            @for (error of getErrorList(); track error.field) {
              <li>
                <a 
                  [href]="'#' + error.field" 
                  class="underline hover:no-underline focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded"
                  (click)="focusField(error.field, $event)">
                  {{ error.message }}
                </a>
              </li>
            }
          </ul>
        </div>
      }
    </form>
  `
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
      this.focusFirstInvalidField();
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

/**
 * Form Field Component - Individual form field wrapper
 */
@Component({
  selector: 'ui-form-field',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div [class]="fieldClasses()">
      <ng-content></ng-content>
    </div>
  `
})
export class FormFieldComponent {
  fieldClasses = computed(() => 'space-y-2');
}

/**
 * Form Label Component
 */
@Component({
  selector: 'ui-form-label',
  standalone: true,
  imports: [CommonModule],
  template: `
    <label [class]="labelClasses()" [for]="htmlFor()">
      <ng-content></ng-content>
      @if (required()) {
        <span class="text-destructive ml-1">*</span>
      }
    </label>
  `
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

/**
 * Form Message Component - For validation messages with enhanced accessibility
 */
@Component({
  selector: 'ui-form-message',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (shouldShowMessage()) {
      <p 
        [class]="messageClasses()"
        [id]="messageId()"
        role="alert"
        aria-live="polite">
        @if (message()) {
          {{ message() }}
        } @else if (control() && control()!.errors && control()!.touched) {
          {{ getValidationMessage() }}
        }
        <ng-content></ng-content>
      </p>
    }
  `
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

/**
 * Form Description Component
 */
@Component({
  selector: 'ui-form-description',
  standalone: true,
  imports: [CommonModule],
  template: `
    <p [class]="descriptionClasses()">
      <ng-content></ng-content>
    </p>
  `
})
export class FormDescriptionComponent {
  descriptionClasses = computed(() => 'text-sm text-muted-foreground');
}