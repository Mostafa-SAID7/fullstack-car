# Validation Hooks

This directory contains React hooks for form validation using Zod schemas.

## Available Hooks

### useProductValidation

Hook for validating product forms.

```typescript
import { useProductValidation } from './hooks/validation';

function ProductForm() {
  const {
    validateCreateProduct,
    validateUpdateProduct,
    validateField,
    errors,
    getFieldError,
    hasFieldError,
    clearErrors
  } = useProductValidation();

  const handleSubmit = async (data) => {
    const result = await validateCreateProduct(data);
    if (result.isValid) {
      // Submit the form
    } else {
      // Display errors
      console.log(result.errors);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Form fields */}
    </form>
  );
}
```

### useServiceValidation

Hook for validating service forms.

```typescript
import { useServiceValidation } from './hooks/validation';

function ServiceForm() {
  const {
    validateCreateService,
    validateUpdateService,
    validateField,
    validateLocationSearch,
    errors,
    getFieldError,
    hasFieldError,
    clearErrors
  } = useServiceValidation();

  const handleSubmit = async (data) => {
    const result = await validateCreateService(data);
    if (result.isValid) {
      // Submit the form
    } else {
      // Display errors
      console.log(result.errors);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Form fields */}
    </form>
  );
}
```

## Validation Schemas

All validation schemas are defined in `lib/validation/marketplace.validation.ts` and include:

### Product Schemas
- `createProductSchema` - For creating new products
- `updateProductSchema` - For updating existing products
- `productFiltersSchema` - For validating product filters
- `bulkProductOperationSchema` - For bulk operations

### Service Schemas
- `createServiceSchema` - For creating new services
- `updateServiceSchema` - For updating existing services
- `serviceFiltersSchema` - For validating service filters
- `bulkServiceOperationSchema` - For bulk operations
- `locationSearchSchema` - For location-based searches

## Field-Level Validation

Both hooks support field-level validation:

```typescript
const { validateField, getFieldError } = useServiceValidation();

const handleFieldChange = (fieldName: string, value: any) => {
  const error = validateField(fieldName, value, 'create');
  if (error) {
    console.log(`${fieldName} error:`, error);
  }
};
```

## Type-Safe Helpers

Use the exported validation helpers for type-safe parsing:

```typescript
import { serviceValidation } from './hooks/validation';

// Parse and validate
try {
  const validData = serviceValidation.parseCreateService(formData);
  // validData is now typed as CreateServiceInput
} catch (error) {
  // Handle validation error
}

// Safe parse (returns result object)
const result = serviceValidation.safeParseCreateService(formData);
if (result.success) {
  // result.data is typed as CreateServiceInput
} else {
  // result.error contains validation errors
}
```

## Validation Rules

### Service Validation Rules

**Required Fields:**
- `serviceProviderId` - Must be a valid UUID
- `name` - 2-200 characters
- `title` - 5-250 characters
- `description` - 20-5000 characters
- `shortDescription` - 10-500 characters
- `basePrice` - Positive number, max 1,000,000, 2 decimal places
- `estimatedDuration` - Positive integer, max 10,080 minutes (1 week)
- `serviceType` - Must be a valid ServiceType enum value
- `category` - 2-100 characters

**Optional Fields:**
- `maxPrice` - Must be greater than basePrice
- `maxDuration` - Must be greater than estimatedDuration
- `subCategory` - 2-100 characters
- `requirements` - Max 2000 characters
- `inclusions` - Max 2000 characters
- `exclusions` - Max 2000 characters
- `tags` - Max 500 characters, alphanumeric with commas/spaces/hyphens
- `requiresApproval` - Boolean, defaults to false
- `sortOrder` - Integer 0-10,000, defaults to 0

**Cross-Field Validations:**
- `maxPrice` must be greater than `basePrice`
- `maxDuration` must be greater than `estimatedDuration`

### Location Search Validation

```typescript
const locationData = {
  latitude: 40.7128,  // -90 to 90
  longitude: -74.0060, // -180 to 180
  radiusKm: 10,       // 0 to 500, defaults to 10
  filters: {
    // Optional service filters
  }
};

const result = await validateLocationSearch(locationData);
```

## Error Handling

Validation errors are returned in a structured format:

```typescript
interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
  errorMap: Record<string, string>;
}

interface ValidationError {
  field: string;
  message: string;
}
```

Example error handling:

```typescript
const result = await validateCreateService(data);

if (!result.isValid) {
  // Access errors by field
  const nameError = result.errorMap['name'];
  
  // Or iterate through all errors
  result.errors.forEach(error => {
    console.log(`${error.field}: ${error.message}`);
  });
}
```
