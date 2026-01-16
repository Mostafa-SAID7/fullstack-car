/**
 * Product Form Validators
 * Custom Angular validators for product forms
 * These validators match the backend validation rules and Dashboard Zod schemas
 */

import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { ProductCategory, ProductStatus } from '../models/product.model';

/**
 * Validator for product name
 * Must be 2-200 characters
 */
export function productNameValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) {
      return null; // Let required validator handle empty values
    }

    const value = control.value.trim();
    
    if (value.length < 2) {
      return { minLength: { requiredLength: 2, actualLength: value.length, message: 'Product name must be at least 2 characters' } };
    }
    
    if (value.length > 200) {
      return { maxLength: { requiredLength: 200, actualLength: value.length, message: 'Product name must be less than 200 characters' } };
    }
    
    return null;
  };
}

/**
 * Validator for product description
 * Must be 10-2000 characters
 */
export function productDescriptionValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) {
      return null;
    }

    const value = control.value.trim();
    
    if (value.length < 10) {
      return { minLength: { requiredLength: 10, actualLength: value.length, message: 'Description must be at least 10 characters' } };
    }
    
    if (value.length > 2000) {
      return { maxLength: { requiredLength: 2000, actualLength: value.length, message: 'Description must be less than 2000 characters' } };
    }
    
    return null;
  };
}

/**
 * Validator for SKU
 * Must be 3-50 characters, uppercase letters, numbers, and hyphens only
 */
export function skuValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) {
      return null;
    }

    const value = control.value.trim();
    
    if (value.length < 3) {
      return { minLength: { requiredLength: 3, actualLength: value.length, message: 'SKU must be at least 3 characters' } };
    }
    
    if (value.length > 50) {
      return { maxLength: { requiredLength: 50, actualLength: value.length, message: 'SKU must be less than 50 characters' } };
    }
    
    const skuPattern = /^[A-Z0-9-]+$/;
    if (!skuPattern.test(value)) {
      return { pattern: { message: 'SKU must contain only uppercase letters, numbers, and hyphens' } };
    }
    
    return null;
  };
}

/**
 * Validator for price
 * Must be positive, max 1,000,000, at most 2 decimal places
 */
export function priceValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (control.value === null || control.value === undefined || control.value === '') {
      return null;
    }

    const value = Number(control.value);
    
    if (isNaN(value)) {
      return { invalidNumber: { message: 'Price must be a valid number' } };
    }
    
    if (value <= 0) {
      return { min: { min: 0, actual: value, message: 'Price must be greater than 0' } };
    }
    
    if (value > 1000000) {
      return { max: { max: 1000000, actual: value, message: 'Price must be less than 1,000,000' } };
    }
    
    // Check for at most 2 decimal places
    const decimalPlaces = (value.toString().split('.')[1] || '').length;
    if (decimalPlaces > 2) {
      return { decimalPlaces: { message: 'Price must have at most 2 decimal places' } };
    }
    
    return null;
  };
}

/**
 * Validator for discount price
 * Must be positive, max 1,000,000, at most 2 decimal places, and less than regular price
 */
export function discountPriceValidator(regularPriceControlName: string = 'price'): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) {
      return null; // Optional field
    }

    const value = Number(control.value);
    
    if (isNaN(value)) {
      return { invalidNumber: { message: 'Discount price must be a valid number' } };
    }
    
    if (value <= 0) {
      return { min: { min: 0, actual: value, message: 'Discount price must be greater than 0' } };
    }
    
    if (value > 1000000) {
      return { max: { max: 1000000, actual: value, message: 'Discount price must be less than 1,000,000' } };
    }
    
    // Check for at most 2 decimal places
    const decimalPlaces = (value.toString().split('.')[1] || '').length;
    if (decimalPlaces > 2) {
      return { decimalPlaces: { message: 'Discount price must have at most 2 decimal places' } };
    }
    
    // Check if discount price is less than regular price
    const parent = control.parent;
    if (parent) {
      const regularPrice = parent.get(regularPriceControlName)?.value;
      if (regularPrice && value >= regularPrice) {
        return { discountPriceTooHigh: { message: 'Discount price must be less than regular price' } };
      }
    }
    
    return null;
  };
}

/**
 * Validator for stock quantity
 * Must be non-negative integer, max 1,000,000
 */
export function stockQuantityValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (control.value === null || control.value === undefined || control.value === '') {
      return null;
    }

    const value = Number(control.value);
    
    if (isNaN(value)) {
      return { invalidNumber: { message: 'Stock quantity must be a valid number' } };
    }
    
    if (!Number.isInteger(value)) {
      return { integer: { message: 'Stock quantity must be a whole number' } };
    }
    
    if (value < 0) {
      return { min: { min: 0, actual: value, message: 'Stock quantity cannot be negative' } };
    }
    
    if (value > 1000000) {
      return { max: { max: 1000000, actual: value, message: 'Stock quantity must be less than 1,000,000' } };
    }
    
    return null;
  };
}

/**
 * Validator for minimum stock level
 * Must be non-negative integer, max 10,000
 */
export function minStockLevelValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (control.value === null || control.value === undefined || control.value === '') {
      return null;
    }

    const value = Number(control.value);
    
    if (isNaN(value)) {
      return { invalidNumber: { message: 'Minimum stock level must be a valid number' } };
    }
    
    if (!Number.isInteger(value)) {
      return { integer: { message: 'Minimum stock level must be a whole number' } };
    }
    
    if (value < 0) {
      return { min: { min: 0, actual: value, message: 'Minimum stock level cannot be negative' } };
    }
    
    if (value > 10000) {
      return { max: { max: 10000, actual: value, message: 'Minimum stock level must be less than 10,000' } };
    }
    
    return null;
  };
}

/**
 * Validator for weight
 * Must be positive, max 10,000 kg, at most 2 decimal places
 */
export function weightValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (control.value === null || control.value === undefined || control.value === '') {
      return null;
    }

    const value = Number(control.value);
    
    if (isNaN(value)) {
      return { invalidNumber: { message: 'Weight must be a valid number' } };
    }
    
    if (value <= 0) {
      return { min: { min: 0, actual: value, message: 'Weight must be greater than 0' } };
    }
    
    if (value > 10000) {
      return { max: { max: 10000, actual: value, message: 'Weight must be less than 10,000 kg' } };
    }
    
    // Check for at most 2 decimal places
    const decimalPlaces = (value.toString().split('.')[1] || '').length;
    if (decimalPlaces > 2) {
      return { decimalPlaces: { message: 'Weight must have at most 2 decimal places' } };
    }
    
    return null;
  };
}

/**
 * Validator for image URL
 * Must be valid URL, max 500 characters
 */
export function imageUrlValidator(): ValidatorFn {
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
 * Validator for brand name
 * Must be 2-100 characters
 */
export function brandValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) {
      return null; // Optional field
    }

    const value = control.value.trim();
    
    if (value.length < 2) {
      return { minLength: { requiredLength: 2, actualLength: value.length, message: 'Brand name must be at least 2 characters' } };
    }
    
    if (value.length > 100) {
      return { maxLength: { requiredLength: 100, actualLength: value.length, message: 'Brand name must be less than 100 characters' } };
    }
    
    return null;
  };
}

/**
 * Validator for model name
 * Must be 1-100 characters
 */
export function modelValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) {
      return null; // Optional field
    }

    const value = control.value.trim();
    
    if (value.length < 1) {
      return { minLength: { requiredLength: 1, actualLength: value.length, message: 'Model must be at least 1 character' } };
    }
    
    if (value.length > 100) {
      return { maxLength: { requiredLength: 100, actualLength: value.length, message: 'Model must be less than 100 characters' } };
    }
    
    return null;
  };
}

/**
 * Validator for dimensions
 * Must be in format: LxWxH (e.g., "10x20x30 cm")
 */
export function dimensionsValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) {
      return null; // Optional field
    }

    const value = control.value.trim();
    
    if (value.length > 100) {
      return { maxLength: { requiredLength: 100, actualLength: value.length, message: 'Dimensions must be less than 100 characters' } };
    }
    
    const dimensionsPattern = /^\d+(\.\d+)?\s*x\s*\d+(\.\d+)?\s*x\s*\d+(\.\d+)?(\s*(cm|m|in|ft))?$/i;
    if (!dimensionsPattern.test(value)) {
      return { pattern: { message: 'Dimensions must be in format: LxWxH (e.g., "10x20x30 cm")' } };
    }
    
    return null;
  };
}

/**
 * Validator for launch date
 * Cannot be in the past
 */
export function launchDateValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) {
      return null; // Optional field
    }

    const launchDate = new Date(control.value);
    const now = new Date();
    
    // Allow dates from yesterday onwards (to account for timezone differences)
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);
    yesterday.setHours(0, 0, 0, 0);
    
    if (launchDate < yesterday) {
      return { pastDate: { message: 'Launch date cannot be in the past' } };
    }
    
    return null;
  };
}

/**
 * Validator for tags
 * Max 500 characters, alphanumeric/commas/spaces/hyphens only
 */
export function tagsValidator(): ValidatorFn {
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
 * Validator for product category
 * Must be a valid ProductCategory enum value
 */
export function categoryValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) {
      return null;
    }

    const validCategories = Object.values(ProductCategory);
    if (!validCategories.includes(control.value)) {
      return { invalidCategory: { message: 'Please select a valid category' } };
    }
    
    return null;
  };
}

/**
 * Validator for product status
 * Must be a valid ProductStatus enum value
 */
export function statusValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) {
      return null;
    }

    const validStatuses = Object.values(ProductStatus);
    if (!validStatuses.includes(control.value)) {
      return { invalidStatus: { message: 'Please select a valid status' } };
    }
    
    return null;
  };
}

/**
 * Helper function to get error message from validation errors
 */
export function getValidationErrorMessage(errors: ValidationErrors | null): string {
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
