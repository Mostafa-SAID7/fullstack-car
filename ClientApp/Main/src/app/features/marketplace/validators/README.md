# Marketplace Validators

This directory contains Angular form validators for marketplace features (Products and Services).

## Overview

The validators in this directory provide comprehensive form validation that matches:
- Backend validation rules (FluentValidation)
- Dashboard validation schemas (Zod)
- Business requirements from the specification

## Files

### `product.validators.ts`
Contains validators for product forms including:
- Product name, description, SKU validation
- Price and discount price validation
- Stock quantity and minimum stock level validation
- Weight, dimensions, and image URL validation
- Brand, model, and tags validation
- Category and status enum validation

### `service.validators.ts`
Contains validators for service forms including:
- Service name, title, and description validation
- Base price and max price validation
- Estimated duration and max duration validation
- Category and sub-category validation
- Requirements, inclusions, and exclusions validation
- Service provider ID (GUID) validation
- Service type and status enum validation
- Tags and image URL validation

### `service-form.example.ts`
Provides a complete example of how to use service validators in an Angular component with:
- FormGroup creation with all validators
- HTML template example
- Error message handling
- Form submission logic

## Usage

### Basic Usage

```typescript
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  serviceNameValidator,
  basePriceValidator,
  estimatedDurationValidator,
  getServiceValidationErrorMessage
} from './validators';

export class MyComponent {
  serviceForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.serviceForm = this.fb.group({
      name: ['', [Validators.required, serviceNameValidator()]],
      basePrice: [null, [Validators.required, basePriceValidator()]],
      estimatedDuration: [null, [Validators.required, estimatedDurationValidator()]]
    });
  }

  getErrorMessage(fieldName: string): string {
    const control = this.serviceForm.get(fieldName);
    if (control && control.touched && control.errors) {
      return getServiceValidationErrorMessage(control.errors);
    }
    return '';
  }
}
```

### Dependent Validators

Some validators depend on other form fields (e.g., maxPrice must be greater than basePrice):

```typescript
this.serviceForm = this.fb.group({
  basePrice: [null, [Validators.required, basePriceValidator()]],
  maxPrice: [null, [maxPriceValidator('basePrice')]], // Pass the control name
  estimatedDuration: [null, [Validators.required, estimatedDurationValidator()]],
  maxDuration: [null, [maxDurationValidator('estimatedDuration')]]
});
```

## Validation Rules

### Service Name
- **Required**: Yes
- **Min Length**: 2 characters
- **Max Length**: 200 characters

### Service Title
- **Required**: Yes
- **Min Length**: 5 characters
- **Max Length**: 200 characters

### Description
- **Required**: Yes
- **Min Length**: 20 characters
- **Max Length**: 2000 characters

### Short Description
- **Required**: Yes
- **Min Length**: 10 characters
- **Max Length**: 500 characters

### Base Price
- **Required**: Yes
- **Min Value**: > 0
- **Max Value**: 1,000,000
- **Decimal Places**: Max 2

### Max Price
- **Required**: No
- **Min Value**: > 0
- **Max Value**: 1,000,000
- **Decimal Places**: Max 2
- **Constraint**: Must be greater than base price

### Estimated Duration
- **Required**: Yes
- **Min Value**: > 0 minutes
- **Max Value**: 10,080 minutes (1 week)
- **Type**: Integer

### Max Duration
- **Required**: No
- **Min Value**: > 0 minutes
- **Max Value**: 10,080 minutes (1 week)
- **Type**: Integer
- **Constraint**: Must be greater than estimated duration

### Category
- **Required**: Yes
- **Min Length**: 2 characters
- **Max Length**: 100 characters

### Sub-Category
- **Required**: No
- **Min Length**: 2 characters
- **Max Length**: 100 characters

### Requirements, Inclusions, Exclusions
- **Required**: No
- **Max Length**: 1000 characters each

### Tags
- **Required**: No
- **Max Length**: 500 characters
- **Pattern**: Alphanumeric, commas, spaces, hyphens only

### Service Provider ID
- **Required**: Yes
- **Format**: Valid GUID (e.g., "123e4567-e89b-12d3-a456-426614174000")

### Service Type
- **Required**: Yes
- **Valid Values**: Maintenance, Repair, Inspection, Cleaning, Towing, Insurance, Rental, Parts, Consultation, Emergency

### Service Status
- **Required**: No (defaults to Draft)
- **Valid Values**: Draft, Active, Inactive, Suspended, Archived

### Image URL
- **Required**: No
- **Max Length**: 500 characters
- **Format**: Valid URL

### Sort Order
- **Required**: No
- **Min Value**: 0
- **Max Value**: 10,000
- **Type**: Integer

## Error Messages

All validators provide custom error messages that are user-friendly and specific to the validation failure. Use the `getServiceValidationErrorMessage()` helper function to retrieve these messages:

```typescript
const control = this.serviceForm.get('basePrice');
if (control?.errors) {
  const errorMessage = getServiceValidationErrorMessage(control.errors);
  // Display errorMessage to user
}
```

## Testing

When testing components that use these validators:

```typescript
import { FormBuilder } from '@angular/forms';
import { serviceNameValidator } from './service.validators';

describe('Service Form Validation', () => {
  let fb: FormBuilder;

  beforeEach(() => {
    fb = new FormBuilder();
  });

  it('should validate service name length', () => {
    const control = fb.control('A', [serviceNameValidator()]);
    expect(control.valid).toBe(false);
    expect(control.errors?.['minLength']).toBeDefined();

    control.setValue('Valid Service Name');
    expect(control.valid).toBe(true);
  });
});
```

## Integration with Backend

These validators are designed to match the backend validation rules. When a form passes frontend validation, it should also pass backend validation (assuming no business rule changes).

However, always handle backend validation errors gracefully:

```typescript
this.serviceService.createService(serviceData).subscribe({
  next: (result) => {
    // Success
  },
  error: (error) => {
    // Handle backend validation errors
    if (error.status === 400 && error.error.errors) {
      // Map backend errors to form controls
      Object.keys(error.error.errors).forEach(key => {
        const control = this.serviceForm.get(key);
        if (control) {
          control.setErrors({ backend: error.error.errors[key] });
        }
      });
    }
  }
});
```

## Best Practices

1. **Always use required validator first**: `[Validators.required, serviceNameValidator()]`
2. **Mark fields as touched on submit**: Show validation errors when user tries to submit
3. **Provide real-time feedback**: Show errors as user types (after field is touched)
4. **Use helper functions**: Use `getServiceValidationErrorMessage()` for consistent error display
5. **Test edge cases**: Test minimum/maximum values, special characters, etc.
6. **Handle backend errors**: Always handle validation errors from the backend API

## See Also

- `product.validators.ts` - Product form validators
- `service-form.example.ts` - Complete form implementation example
- Backend validation: `src/Application/Features/Marketplace/Services/Commands/CreateServiceCommandValidator.cs`
- Dashboard validation: `ClientApp/Dashboard/src/types/marketplace/service.types.ts`
