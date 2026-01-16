# Product Form Validation

This directory contains comprehensive validation schemas and utilities for marketplace product forms using Zod.

## Overview

The validation implementation follows these principles:
- **Type Safety**: All validation schemas are fully typed with TypeScript
- **Consistency**: Validation rules match backend FluentValidation rules
- **Reusability**: Schemas can be used across multiple components
- **User-Friendly**: Clear, actionable error messages

## Files

### `marketplace.validation.ts`
Contains Zod schemas for:
- `createProductSchema` - Validates product creation data
- `updateProductSchema` - Validates product update data
- `productFiltersSchema` - Validates product filter parameters
- `bulkProductOperationSchema` - Validates bulk operations
- `productImageSchema` - Validates product image uploads

### Type Exports
```typescript
export type CreateProductInput = z.infer<typeof createProductSchema>;
export type UpdateProductInput = z.infer<typeof updateProductSchema>;
export type ProductFiltersInput = z.infer<typeof productFiltersSchema>;
export type BulkProductOperationInput = z.infer<typeof bulkProductOperationSchema>;
export type ProductImageInput = z.infer<typeof productImageSchema>;
```

## Validation Rules

### Required Fields
- **name**: 2-200 characters, trimmed
- **description**: 10-2000 characters, trimmed
- **sku**: 3-50 characters, uppercase letters/numbers/hyphens only
- **price**: Positive number, max 1,000,000, 2 decimal places
- **stockQuantity**: Non-negative integer, max 1,000,000
- **minStockLevel**: Non-negative integer, max 10,000
- **category**: Valid ProductCategory enum value
- **weight**: Positive number, max 10,000 kg, 2 decimal places

### Optional Fields
- **discountPrice**: Must be less than regular price if provided
- **imageUrl**: Valid URL, max 500 characters
- **brand**: 2-100 characters
- **model**: 1-100 characters
- **dimensions**: Format "LxWxH" (e.g., "10x20x30 cm")
- **isFeatured**: Boolean, defaults to false
- **isDigital**: Boolean, defaults to false
- **launchDate**: ISO datetime, cannot be in the past
- **tags**: Max 500 characters, alphanumeric/commas/spaces/hyphens only

### Cross-Field Validation
- Discount price must be less than regular price
- Launch date cannot be in the past
- Max price must be greater than min price (in filters)

## Usage Examples

### Basic Validation

```typescript
import { createProductSchema } from '@/lib/validation/marketplace.validation';

// Validate product data
try {
  const validatedData = createProductSchema.parse(formData);
  // Data is valid, proceed with submission
} catch (error) {
  if (error instanceof z.ZodError) {
    // Handle validation errors
    error.errors.forEach(err => {
      console.log(`${err.path}: ${err.message}`);
    });
  }
}
```

### Using the Hook

```typescript
import { useProductValidation } from '@/hooks/validation/useProductValidation';

function MyComponent() {
  const {
    validateCreateProduct,
    validateField,
    errors,
    hasFieldError,
    getFieldError
  } = useProductValidation();

  const handleSubmit = async (data) => {
    const result = await validateCreateProduct(data);
    
    if (!result.isValid) {
      console.error('Validation errors:', result.errors);
      return;
    }
    
    // Submit valid data
    await submitProduct(data);
  };

  const handleFieldChange = (field, value) => {
    // Validate on change
    validateField(field, value, 'create');
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        name="name"
        onChange={(e) => handleFieldChange('name', e.target.value)}
        className={hasFieldError('name') ? 'error' : ''}
      />
      {hasFieldError('name') && (
        <span className="error">{getFieldError('name')}</span>
      )}
    </form>
  );
}
```

### Safe Parsing

```typescript
import { productValidation } from '@/hooks/validation/useProductValidation';

// Safe parse without throwing
const result = productValidation.safeParseCreateProduct(formData);

if (result.success) {
  // Data is valid
  const validData = result.data;
} else {
  // Handle errors
  result.error.errors.forEach(err => {
    console.log(err.message);
  });
}
```

### Field-Level Validation

```typescript
const { validateField } = useProductValidation();

// Validate single field
const error = validateField('price', 99.99, 'create');

if (error) {
  console.log('Price validation error:', error);
}
```

## Integration with Forms

### React Hook Form Integration

```typescript
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { createProductSchema } from '@/lib/validation/marketplace.validation';

function ProductForm() {
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(createProductSchema)
  });

  const onSubmit = (data) => {
    // Data is automatically validated
    console.log('Valid data:', data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register('name')} />
      {errors.name && <span>{errors.name.message}</span>}
    </form>
  );
}
```

### Manual Form Integration

See `ClientApp/Dashboard/src/components/marketplace/ProductForm.tsx` for a complete example of manual form integration with validation.

## Error Messages

All validation errors include clear, user-friendly messages:

```typescript
// Examples of error messages
"Product name must be at least 2 characters"
"Price must be greater than 0"
"SKU must contain only uppercase letters, numbers, and hyphens"
"Discount price must be less than regular price"
"Dimensions must be in format: LxWxH (e.g., '10x20x30 cm')"
```

## Testing

### Unit Testing Validation

```typescript
import { createProductSchema } from '@/lib/validation/marketplace.validation';

describe('Product Validation', () => {
  it('should validate valid product data', () => {
    const validData = {
      name: 'Test Product',
      description: 'This is a test product description',
      sku: 'TEST-001',
      price: 99.99,
      stockQuantity: 100,
      minStockLevel: 10,
      category: 'Electronics',
      weight: 1.5
    };

    expect(() => createProductSchema.parse(validData)).not.toThrow();
  });

  it('should reject invalid price', () => {
    const invalidData = {
      // ... other valid fields
      price: -10 // Invalid: negative price
    };

    expect(() => createProductSchema.parse(invalidData)).toThrow();
  });

  it('should reject discount price >= regular price', () => {
    const invalidData = {
      // ... other valid fields
      price: 100,
      discountPrice: 100 // Invalid: must be less than price
    };

    expect(() => createProductSchema.parse(invalidData)).toThrow();
  });
});
```

## Backend Consistency

These validation rules are designed to match the backend FluentValidation rules. When updating validation:

1. Check backend validators in `src/Application/Features/Marketplace/Products/Commands/`
2. Update Zod schemas to match
3. Update error messages to be consistent
4. Test both frontend and backend validation

## Performance Considerations

- Validation is synchronous and fast
- Field-level validation prevents unnecessary full-form validation
- Schemas are compiled once and reused
- No network requests during validation

## Accessibility

- Error messages are associated with form fields
- ARIA attributes should be added to form inputs
- Error messages should be announced to screen readers
- Focus should move to first error on validation failure

## Future Enhancements

- [ ] Add async validation for SKU uniqueness
- [ ] Add image file validation with preview
- [ ] Add batch validation for bulk operations
- [ ] Add custom validation rules via configuration
- [ ] Add validation analytics/tracking
