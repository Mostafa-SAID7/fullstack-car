/**
 * Service Form Validators
 * Custom Angular validators for service forms
 * These validators match the backend validation rules and Dashboard Zod schemas
 */

import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { ServiceType, ServiceStatus } from '../models/service.model';

/**
 * Validator for service name
 * Must be 2-200 characters
 */
export function serviceNameValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) {
      return null; // Let required validator handle empty values
    }

    const value = control.value.trim();
    
    if (value.length < 2) {
      return { minLength: { requiredLength: 2, actualLength: value.length, message: 'Service name must be at least 2 characters' } };
    }
    
    if (value.length > 200) {
      return { maxLength: { requiredLength: 200, actualLength: value.length, message: 'Service name must be less than 200 characters' } };
    }
    
    return null;
  };
}

/**
 * Validator for service title
 * Must be 5-200 characters
 */
export function serviceTitleValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) {
      return null;
    }

    const value = control.value.trim();
    
    if (value.length < 5) {
      return { minLength: { requiredLength: 5, actualLength: value.length, message: 'Service title must be at least 5 characters' } };
    }
    
    if (value.length > 200) {
      return { maxLength: { requiredLength: 200, actualLength: value.length, message: 'Service title must be less than 200 characters' } };
    }
    
    return null;
  };
}

/**
 * Validator for service description
 * Must be 20-2000 characters
 */
export function serviceDescriptionValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) {
      return null;
    }

    const value = control.value.trim();
    
    if (value.length < 20) {
      return { minLength: { requiredLength: 20, actualLength: value.length, message: 'Description must be at least 20 characters' } };
    }
    
    if (value.length > 2000) {
      return { maxLength: { requiredLength: 2000, actualLength: value.length, message: 'Description must be less than 2000 characters' } };
    }
    
    return null;
  };
}

/**
 * Validator for short description
 * Must be 10-500 characters
 */
export function shortDescriptionValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) {
      return null;
    }

    const value = control.value.trim();
    
    if (value.length < 10) {
      return { minLength: { requiredLength: 10, actualLength: value.length, message: 'Short description must be at least 10 characters' } };
    }
    
    if (value.length > 500) {
      return { maxLength: { requiredLength: 500, actualLength: value.length, message: 'Short description must be less than 500 characters' } };
    }
    
    return null;
  };
}

/**
 * Validator for base price
 * Must be positive, max 1,000,000, at most 2 decimal places
 */
export function basePriceValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (control.value === null || control.value === undefined || control.value === '') {
      return null;
    }

    const value = Number(control.value);
    
    if (isNaN(value)) {
      return { invalidNumber: { message: 'Base price must be a valid number' } };
    }
    
    if (value <= 0) {
      return { min: { min: 0, actual: value, message: 'Base price must be greater than 0' } };
    }
    
    if (value > 1000000) {
      return { max: { max: 1000000, actual: value, message: 'Base price must be less than 1,000,000' } };
    }
    
    // Check for at most 2 decimal places
    const decimalPlaces = (value.toString().split('.')[1] || '').length;
    if (decimalPlaces > 2) {
      return { decimalPlaces: { message: 'Base price must have at most 2 decimal places' } };
    }
    
    return null;
  };
}

/**
 * Validator for max price
 * Must be positive, max 1,000,000, at most 2 decimal places, and greater than base price
 */
export function maxPriceValidator(basePriceControlName: string = 'basePrice'): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) {
      return null; // Optional field
    }

    const value = Number(control.value);
    
    if (isNaN(value)) {
      return { invalidNumber: { message: 'Max price must be a valid number' } };
    }
    
    if (value <= 0) {
      return { min: { min: 0, actual: value, message: 'Max price must be greater than 0' } };
    }
    
    if (value > 1000000) {
      return { max: { max: 1000000, actual: value, message: 'Max price must be less than 1,000,000' } };
    }
    
    // Check for at most 2 decimal places
    const decimalPlaces = (value.toString().split('.')[1] || '').length;
    if (decimalPlaces > 2) {
      return { decimalPlaces: { message: 'Max price must have at most 2 decimal places' } };
    }
    
    // Check if max price is greater than base price
    const parent = control.parent;
    if (parent) {
      const basePrice = parent.get(basePriceControlName)?.value;
      if (basePrice && value <= basePrice) {
        return { maxPriceTooLow: { message: 'Max price must be greater than base price' } };
      }
    }
    
    return null;
  };
}

/**
 * Validator for estimated duration
 * Must be positive integer, max 10,080 minutes (1 week)
 */
export function estimatedDurationValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (control.value === null || control.value === undefined || control.value === '') {
      return null;
    }

    const value = Number(control.value);
    
    if (isNaN(value)) {
      return { invalidNumber: { message: 'Estimated duration must be a valid number' } };
    }
    
    if (!Number.isInteger(value)) {
      return { integer: { message: 'Estimated duration must be a whole number' } };
    }
    
    if (value <= 0) {
      return { min: { min: 0, actual: value, message: 'Estimated duration must be greater than 0 minutes' } };
    }
    
    if (value > 10080) {
      return { max: { max: 10080, actual: value, message: 'Estimated duration must be less than 10,080 minutes (1 week)' } };
    }
    
    return null;
  };
}

/**
 * Validator for max duration
 * Must be positive integer, max 10,080 minutes (1 week), and greater than estimated duration
 */
export function maxDurationValidator(estimatedDurationControlName: string = 'estimatedDuration'): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) {
      return null; // Optional field
    }

    const value = Number(control.value);
    
    if (isNaN(value)) {
      return { invalidNumber: { message: 'Max duration must be a valid number' } };
    }
    
    if (!Number.isInteger(value)) {
      return { integer: { message: 'Max duration must be a whole number' } };
    }
    
    if (value <= 0) {
      return { min: { min: 0, actual: value, message: 'Max duration must be greater than 0 minutes' } };
    }
    
    if (value > 10080) {
      return { max: { max: 10080, actual: value, message: 'Max duration must be less than 10,080 minutes (1 week)' } };
    }
    
    // Check if max duration is greater than estimated duration
    const parent = control.parent;
    if (parent) {
      const estimatedDuration = parent.get(estimatedDurationControlName)?.value;
      if (estimatedDuration && value <= estimatedDuration) {
        return { maxDurationTooLow: { message: 'Max duration must be greater than estimated duration' } };
      }
    }
    
    return null;
  };
}

/**
 * Validator for service category
 * Must be 2-100 characters
 */
export function serviceCategoryValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) {
      return null;
    }

    const value = control.value.trim();
    
    if (value.length < 2) {
      return { minLength: { requiredLength: 2, actualLength: value.length, message: 'Category must be at least 2 characters' } };
    }
    
    if (value.length > 100) {
      return { maxLength: { requiredLength: 100, actualLength: value.length, message: 'Category must be less than 100 characters' } };
    }
    
    return null;
  };
}

/**
 * Validator for service sub-category
 * Must be 2-100 characters
 */
export function serviceSubCategoryValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) {
      return null; // Optional field
    }

    const value = control.value.trim();
    
    if (value.length < 2) {
      return { minLength: { requiredLength: 2, actualLength: value.length, message: 'Sub-category must be at least 2 characters' } };
    }
    
    if (value.length > 100) {
      return { maxLength: { requiredLength: 100, actualLength: value.length, message: 'Sub-category must be less than 100 characters' } };
    }
    
    return null;
  };
}

/**
 * Validator for service requirements
 * Max 1000 characters
 */
export function requirementsValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) {
      return null; // Optional field
    }

    const value = control.value.trim();
    
    if (value.length > 1000) {
      return { maxLength: { requiredLength: 1000, actualLength: value.length, message: 'Requirements must be less than 1000 characters' } };
    }
    
    return null;
  };
}

/**
 * Validator for service inclusions
 * Max 1000 characters
 */
export function inclusionsValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) {
      return null; // Optional field
    }

    const value = control.value.trim();
    
    if (value.length > 1000) {
      return { maxLength: { requiredLength: 1000, actualLength: value.length, message: 'Inclusions must be less than 1000 characters' } };
    }
    
    return null;
  };
}

/**
 * Validator for service exclusions
 * Max 1000 characters
 */
export function exclusionsValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) {
      return null; // Optional field
    }

    const value = control.value.trim();
    
    if (value.length > 1000) {
      return { maxLength: { requiredLength: 1000, actualLength: value.length, message: 'Exclusions must be less than 1000 characters' } };
    }
    
    return null;
  };
}

/**
 * Validator for service tags
 * Max 500 characters, alphanumeric/commas/spaces/hyphens only
 */
export function serviceTagsValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) {
      return null; // Optional field
    }

    const value = control.value.trim();
    
    if (value.length > 500) {
      return { maxLength: { requiredLength: 500, actualLength: value.length, message: 'Tags must be less than 500 characters' } };
    }
    
    const tagsPattern = /^[a-zA-Z0-9,\s-]*$/;
    if (!tagsPattern.test(value)) {
      return { pattern: { message: 'Tags can only contain letters, numbers, commas, spaces, and hyphens' } };
    }
    
    return null;
  };
}

/**
 * Validator for service provider ID
 * Must be a valid GUID
 */
export function serviceProviderIdValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) {
      return null;
    }

    const value = control.value.trim();
    
    // GUID pattern validation
    const guidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!guidPattern.test(value)) {
      return { invalidGuid: { message: 'Service provider ID must be a valid GUID' } };
    }
    
    return null;
  };
}

/**
 * Validator for service type
 * Must be a valid ServiceType enum value
 */
export function serviceTypeValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) {
      return null;
    }

    const validTypes = Object.values(ServiceType);
    if (!validTypes.includes(control.value)) {
      return { invalidServiceType: { message: 'Please select a valid service type' } };
    }
    
    return null;
  };
}

/**
 * Validator for service status
 * Must be a valid ServiceStatus enum value
 */
export function serviceStatusValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) {
      return null;
    }

    const validStatuses = Object.values(ServiceStatus);
    if (!validStatuses.includes(control.value)) {
      return { invalidStatus: { message: 'Please select a valid status' } };
    }
    
    return null;
  };
}

/**
 * Validator for image URL
 * Must be valid URL, max 500 characters
 */
export function serviceImageUrlValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) {
      return null; // Optional field
    }

    const value = control.value.trim();
    
    if (value.length > 500) {
      return { maxLength: { requiredLength: 500, actualLength: value.length, message: 'Image URL must be less than 500 characters' } };
    }
    
    // Basic URL validation
    try {
      new URL(value);
    } catch {
      return { url: { message: 'Please enter a valid image URL' } };
    }
    
    return null;
  };
}

/**
 * Validator for sort order
 * Must be non-negative integer, max 10,000
 */
export function sortOrderValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (control.value === null || control.value === undefined || control.value === '') {
      return null;
    }

    const value = Number(control.value);
    
    if (isNaN(value)) {
      return { invalidNumber: { message: 'Sort order must be a valid number' } };
    }
    
    if (!Number.isInteger(value)) {
      return { integer: { message: 'Sort order must be a whole number' } };
    }
    
    if (value < 0) {
      return { min: { min: 0, actual: value, message: 'Sort order cannot be negative' } };
    }
    
    if (value > 10000) {
      return { max: { max: 10000, actual: value, message: 'Sort order must be less than 10,000' } };
    }
    
    return null;
  };
}

/**
 * Helper function to get error message from validation errors
 */
export function getServiceValidationErrorMessage(errors: ValidationErrors | null): string {
  if (!errors) {
    return '';
  }

  // Check for custom error messages first
  const errorKey = Object.keys(errors)[0];
  const error = errors[errorKey];
  
  if (error && error.message) {
    return error.message;
  }

  // Fallback to generic messages
  switch (errorKey) {
    case 'required':
      return 'This field is required';
    case 'minLength':
      return `Minimum length is ${error.requiredLength} characters`;
    case 'maxLength':
      return `Maximum length is ${error.requiredLength} characters`;
    case 'min':
      return `Minimum value is ${error.min}`;
    case 'max':
      return `Maximum value is ${error.max}`;
    case 'pattern':
      return 'Invalid format';
    case 'email':
      return 'Invalid email address';
    case 'url':
      return 'Invalid URL';
    default:
      return 'Invalid value';
  }
}
