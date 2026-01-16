/**
 * Product Validation Hook
 * React hook for validating product forms with Zod schemas
 */

import { useState, useCallback } from 'react';
import { z } from 'zod';
import {
  createProductSchema,
  updateProductSchema,
  productFiltersSchema,
  bulkProductOperationSchema,
  type CreateProductInput,
  type UpdateProductInput,
  type ProductFiltersInput,
  type BulkProductOperationInput
} from '../../lib/validation/marketplace.validation';

export interface ValidationError {
  field: string;
  message: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
  errorMap: Record<string, string>;
}

/**
 * Hook for product form validation
 */
export function useProductValidation() {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isValidating, setIsValidating] = useState(false);

  /**
   * Validate product creation data
   */
  const validateCreateProduct = useCallback(
    async (data: unknown): Promise<ValidationResult> => {
      setIsValidating(true);
      try {
        const validated = createProductSchema.parse(data);
        setErrors({});
        setIsValidating(false);
        return {
          isValid: true,
          errors: [],
          errorMap: {}
        };
      } catch (error) {
        if (error instanceof z.ZodError) {
          const errorMap: Record<string, string> = {};
          const errorList: ValidationError[] = [];

          error.errors.forEach((err) => {
            const field = err.path.join('.');
            errorMap[field] = err.message;
            errorList.push({
              field,
              message: err.message
            });
          });

          setErrors(errorMap);
          setIsValidating(false);
          return {
            isValid: false,
            errors: errorList,
            errorMap
          };
        }

        setIsValidating(false);
        return {
          isValid: false,
          errors: [{ field: 'general', message: 'Validation failed' }],
          errorMap: { general: 'Validation failed' }
        };
      }
    },
    []
  );

  /**
   * Validate product update data
   */
  const validateUpdateProduct = useCallback(
    async (data: unknown): Promise<ValidationResult> => {
      setIsValidating(true);
      try {
        const validated = updateProductSchema.parse(data);
        setErrors({});
        setIsValidating(false);
        return {
          isValid: true,
          errors: [],
          errorMap: {}
        };
      } catch (error) {
        if (error instanceof z.ZodError) {
          const errorMap: Record<string, string> = {};
          const errorList: ValidationError[] = [];

          error.errors.forEach((err) => {
            const field = err.path.join('.');
            errorMap[field] = err.message;
            errorList.push({
              field,
              message: err.message
            });
          });

          setErrors(errorMap);
          setIsValidating(false);
          return {
            isValid: false,
            errors: errorList,
            errorMap
          };
        }

        setIsValidating(false);
        return {
          isValid: false,
          errors: [{ field: 'general', message: 'Validation failed' }],
          errorMap: { general: 'Validation failed' }
        };
      }
    },
    []
  );

  /**
   * Validate a single field
   */
  const validateField = useCallback(
    (fieldName: string, value: unknown, schema: 'create' | 'update' = 'create'): string | null => {
      try {
        const schemaToUse = schema === 'create' ? createProductSchema : updateProductSchema;
        
        // Extract the field schema
        const fieldSchema = (schemaToUse as any).shape[fieldName];
        
        if (!fieldSchema) {
          return null;
        }

        fieldSchema.parse(value);
        
        // Clear error for this field
        setErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors[fieldName];
          return newErrors;
        });
        
        return null;
      } catch (error) {
        if (error instanceof z.ZodError) {
          const errorMessage = error.errors[0]?.message || 'Invalid value';
          
          // Set error for this field
          setErrors((prev) => ({
            ...prev,
            [fieldName]: errorMessage
          }));
          
          return errorMessage;
        }
        return 'Invalid value';
      }
    },
    []
  );

  /**
   * Validate product filters
   */
  const validateFilters = useCallback(
    async (data: unknown): Promise<ValidationResult> => {
      try {
        const validated = productFiltersSchema.parse(data);
        return {
          isValid: true,
          errors: [],
          errorMap: {}
        };
      } catch (error) {
        if (error instanceof z.ZodError) {
          const errorMap: Record<string, string> = {};
          const errorList: ValidationError[] = [];

          error.errors.forEach((err) => {
            const field = err.path.join('.');
            errorMap[field] = err.message;
            errorList.push({
              field,
              message: err.message
            });
          });

          return {
            isValid: false,
            errors: errorList,
            errorMap
          };
        }

        return {
          isValid: false,
          errors: [{ field: 'general', message: 'Validation failed' }],
          errorMap: { general: 'Validation failed' }
        };
      }
    },
    []
  );

  /**
   * Validate bulk operation
   */
  const validateBulkOperation = useCallback(
    async (data: unknown): Promise<ValidationResult> => {
      try {
        const validated = bulkProductOperationSchema.parse(data);
        return {
          isValid: true,
          errors: [],
          errorMap: {}
        };
      } catch (error) {
        if (error instanceof z.ZodError) {
          const errorMap: Record<string, string> = {};
          const errorList: ValidationError[] = [];

          error.errors.forEach((err) => {
            const field = err.path.join('.');
            errorMap[field] = err.message;
            errorList.push({
              field,
              message: err.message
            });
          });

          return {
            isValid: false,
            errors: errorList,
            errorMap
          };
        }

        return {
          isValid: false,
          errors: [{ field: 'general', message: 'Validation failed' }],
          errorMap: { general: 'Validation failed' }
        };
      }
    },
    []
  );

  /**
   * Clear all validation errors
   */
  const clearErrors = useCallback(() => {
    setErrors({});
  }, []);

  /**
   * Clear error for a specific field
   */
  const clearFieldError = useCallback((fieldName: string) => {
    setErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[fieldName];
      return newErrors;
    });
  }, []);

  /**
   * Get error message for a specific field
   */
  const getFieldError = useCallback(
    (fieldName: string): string | undefined => {
      return errors[fieldName];
    },
    [errors]
  );

  /**
   * Check if a field has an error
   */
  const hasFieldError = useCallback(
    (fieldName: string): boolean => {
      return fieldName in errors;
    },
    [errors]
  );

  return {
    // Validation functions
    validateCreateProduct,
    validateUpdateProduct,
    validateField,
    validateFilters,
    validateBulkOperation,
    
    // Error management
    errors,
    clearErrors,
    clearFieldError,
    getFieldError,
    hasFieldError,
    
    // State
    isValidating
  };
}

/**
 * Type-safe validation helpers
 */
export const productValidation = {
  /**
   * Validate and parse create product data
   */
  parseCreateProduct: (data: unknown): CreateProductInput => {
    return createProductSchema.parse(data);
  },

  /**
   * Validate and parse update product data
   */
  parseUpdateProduct: (data: unknown): UpdateProductInput => {
    return updateProductSchema.parse(data);
  },

  /**
   * Validate and parse product filters
   */
  parseFilters: (data: unknown): ProductFiltersInput => {
    return productFiltersSchema.parse(data);
  },

  /**
   * Validate and parse bulk operation
   */
  parseBulkOperation: (data: unknown): BulkProductOperationInput => {
    return bulkProductOperationSchema.parse(data);
  },

  /**
   * Safe parse with error handling
   */
  safeParseCreateProduct: (data: unknown) => {
    return createProductSchema.safeParse(data);
  },

  /**
   * Safe parse update with error handling
   */
  safeParseUpdateProduct: (data: unknown) => {
    return updateProductSchema.safeParse(data);
  }
};
