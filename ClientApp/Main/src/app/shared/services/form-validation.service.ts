import { Injectable } from '@angular/core';
import { AbstractControl, ValidationErrors, ValidatorFn, FormGroup, FormArray } from '@angular/forms';

/**
 * Form Validation Service
 * 
 * Provides custom validators and validation utilities for enhanced form components
 */
@Injectable({
  providedIn: 'root'
})
export class FormValidationService {

  /**
   * Custom validator for password strength
   */
  static passwordStrength(minLength: number = 8): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      
      if (!value) {
        return null; // Don't validate empty values, use required validator for that
      }
      
      const errors: ValidationErrors = {};
      
      if (value.length < minLength) {
        errors['minLength'] = { requiredLength: minLength, actualLength: value.length };
      }
      
      if (!/[A-Z]/.test(value)) {
        errors['uppercase'] = true;
      }
      
      if (!/[a-z]/.test(value)) {
        errors['lowercase'] = true;
      }
      
      if (!/[0-9]/.test(value)) {
        errors['number'] = true;
      }
      
      if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(value)) {
        errors['specialChar'] = true;
      }
      
      return Object.keys(errors).length > 0 ? { passwordStrength: errors } : null;
    };
  }

  /**
   * Custom validator for confirming password match
   */
  static confirmPassword(passwordControlName: string): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.parent) {
        return null;
      }
      
      const password = control.parent.get(passwordControlName);
      const confirmPassword = control;
      
      if (!password || !confirmPassword) {
        return null;
      }
      
      if (password.value !== confirmPassword.value) {
        return { confirmPassword: true };
      }
      
      return null;
    };
  }

  /**
   * Custom validator for phone numbers
   */
  static phoneNumber(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      
      if (!value) {
        return null;
      }
      
      // Basic phone number validation (can be enhanced for specific formats)
      const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
      
      if (!phoneRegex.test(value.replace(/[\s\-\(\)]/g, ''))) {
        return { phoneNumber: true };
      }
      
      return null;
    };
  }

  /**
   * Custom validator for URLs
   */
  static url(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      
      if (!value) {
        return null;
      }
      
      try {
        new URL(value);
        return null;
      } catch {
        return { url: true };
      }
    };
  }

  /**
   * Custom validator for file size
   */
  static fileSize(maxSizeInMB: number): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const file = control.value;
      
      if (!file || !(file instanceof File)) {
        return null;
      }
      
      const maxSizeInBytes = maxSizeInMB * 1024 * 1024;
      
      if (file.size > maxSizeInBytes) {
        return { 
          fileSize: { 
            maxSize: maxSizeInMB, 
            actualSize: Math.round(file.size / 1024 / 1024 * 100) / 100 
          } 
        };
      }
      
      return null;
    };
  }

  /**
   * Custom validator for file type
   */
  static fileType(allowedTypes: string[]): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const file = control.value;
      
      if (!file || !(file instanceof File)) {
        return null;
      }
      
      if (!allowedTypes.includes(file.type)) {
        return { 
          fileType: { 
            allowedTypes, 
            actualType: file.type 
          } 
        };
      }
      
      return null;
    };
  }

  /**
   * Custom validator for date range
   */
  static dateRange(minDate?: Date, maxDate?: Date): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      
      if (!value) {
        return null;
      }
      
      const date = new Date(value);
      
      if (isNaN(date.getTime())) {
        return { invalidDate: true };
      }
      
      const errors: ValidationErrors = {};
      
      if (minDate && date < minDate) {
        errors['minDate'] = { minDate: minDate.toISOString().split('T')[0] };
      }
      
      if (maxDate && date > maxDate) {
        errors['maxDate'] = { maxDate: maxDate.toISOString().split('T')[0] };
      }
      
      return Object.keys(errors).length > 0 ? { dateRange: errors } : null;
    };
  }

  /**
   * Custom validator for credit card numbers (basic Luhn algorithm)
   */
  static creditCard(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      
      if (!value) {
        return null;
      }
      
      const cardNumber = value.replace(/\s/g, '');
      
      if (!/^\d+$/.test(cardNumber)) {
        return { creditCard: true };
      }
      
      // Luhn algorithm
      let sum = 0;
      let isEven = false;
      
      for (let i = cardNumber.length - 1; i >= 0; i--) {
        let digit = parseInt(cardNumber.charAt(i), 10);
        
        if (isEven) {
          digit *= 2;
          if (digit > 9) {
            digit -= 9;
          }
        }
        
        sum += digit;
        isEven = !isEven;
      }
      
      if (sum % 10 !== 0) {
        return { creditCard: true };
      }
      
      return null;
    };
  }

  /**
   * Get user-friendly error message for validation errors
   */
  static getErrorMessage(fieldName: string, errors: ValidationErrors): string {
    const field = fieldName.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()).trim();
    
    if (errors['required']) {
      return `${field} is required`;
    }
    
    if (errors['email']) {
      return `${field} must be a valid email address`;
    }
    
    if (errors['minlength']) {
      return `${field} must be at least ${errors['minlength'].requiredLength} characters`;
    }
    
    if (errors['maxlength']) {
      return `${field} must be no more than ${errors['maxlength'].requiredLength} characters`;
    }
    
    if (errors['pattern']) {
      return `${field} format is invalid`;
    }
    
    if (errors['min']) {
      return `${field} must be at least ${errors['min'].min}`;
    }
    
    if (errors['max']) {
      return `${field} must be no more than ${errors['max'].max}`;
    }
    
    if (errors['passwordStrength']) {
      const strengthErrors = errors['passwordStrength'];
      const messages = [];
      
      if (strengthErrors['minLength']) {
        messages.push(`at least ${strengthErrors['minLength'].requiredLength} characters`);
      }
      if (strengthErrors['uppercase']) {
        messages.push('one uppercase letter');
      }
      if (strengthErrors['lowercase']) {
        messages.push('one lowercase letter');
      }
      if (strengthErrors['number']) {
        messages.push('one number');
      }
      if (strengthErrors['specialChar']) {
        messages.push('one special character');
      }
      
      return `${field} must contain ${messages.join(', ')}`;
    }
    
    if (errors['confirmPassword']) {
      return 'Passwords do not match';
    }
    
    if (errors['phoneNumber']) {
      return `${field} must be a valid phone number`;
    }
    
    if (errors['url']) {
      return `${field} must be a valid URL`;
    }
    
    if (errors['fileSize']) {
      return `File size must be less than ${errors['fileSize'].maxSize}MB (current: ${errors['fileSize'].actualSize}MB)`;
    }
    
    if (errors['fileType']) {
      return `File type must be one of: ${errors['fileType'].allowedTypes.join(', ')}`;
    }
    
    if (errors['dateRange']) {
      const rangeErrors = errors['dateRange'];
      if (rangeErrors['minDate']) {
        return `${field} must be after ${rangeErrors['minDate']}`;
      }
      if (rangeErrors['maxDate']) {
        return `${field} must be before ${rangeErrors['maxDate']}`;
      }
    }
    
    if (errors['creditCard']) {
      return `${field} must be a valid credit card number`;
    }
    
    return `${field} is invalid`;
  }

  /**
   * Get all validation errors from a form group
   */
  static getAllFormErrors(form: FormGroup | FormArray): { [key: string]: any } {
    const errors: { [key: string]: any } = {};
    
    Object.keys(form.controls).forEach(key => {
      const control = form.get(key);
      
      if (control && control.errors && control.touched) {
        errors[key] = control.errors;
      }
      
      if (control instanceof FormGroup || control instanceof FormArray) {
        const nestedErrors = this.getAllFormErrors(control);
        Object.keys(nestedErrors).forEach(nestedKey => {
          errors[`${key}.${nestedKey}`] = nestedErrors[nestedKey];
        });
      }
    });
    
    return errors;
  }

  /**
   * Mark all form controls as touched
   */
  static markAllAsTouched(form: FormGroup | FormArray): void {
    Object.keys(form.controls).forEach(key => {
      const control = form.get(key);
      
      if (control) {
        control.markAsTouched();
        
        if (control instanceof FormGroup || control instanceof FormArray) {
          this.markAllAsTouched(control);
        }
      }
    });
  }

  /**
   * Reset form validation state
   */
  static resetValidationState(form: FormGroup | FormArray): void {
    Object.keys(form.controls).forEach(key => {
      const control = form.get(key);
      
      if (control) {
        control.markAsUntouched();
        control.markAsPristine();
        
        if (control instanceof FormGroup || control instanceof FormArray) {
          this.resetValidationState(control);
        }
      }
    });
  }
}