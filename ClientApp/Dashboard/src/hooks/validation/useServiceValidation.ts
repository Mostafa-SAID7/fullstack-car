/**
 * Service Validation Hook
 * React hook for validating service forms with Zod schemas
 */

import { useState, useCallback } from 'react';
import { z } from 'zod';
import {
  createServiceSchema,
  updateServiceSchema,
  serviceFiltersSchema,
  bulkServiceOperationSchema,
  locationSearchSchema,
  type CreateServiceInput,
  type UpdateServiceInput,
  type ServiceFiltersInput,
  type BulkServiceOperationInput,
  type LocationSearchInput
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
 * Hook for service form validation
 */
export function useServiceValidation() {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isValidating, setIsValidating] = useState(false);

  /**
   * Validate service creation data
   */
  const validateCreateService = useCallback(
    async (data: unknown): Promise<ValidationResult> => {
      setIsValidating(true);
      try {
        const validated = createServiceSchema.parse(data);
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
   * Validate service update data
   */
  const validateUpdateService = useCallback(
    async (data: unknown): Promise<ValidationResult> => {
      setIsValidating(true);
      try {
        const validated = updateServiceSchema.parse(data);
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
        const schemaToUse = schema === 'create' ? createServiceSchema : updateServiceSchema;
        
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
   * Validate service filters
   */
  const validateFilters = useCallback(
    async (data: unknown): Promise<ValidationResult> => {
      try {
        const validated = serviceFiltersSchema.parse(data);
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
        const validated = bulkServiceOperationSchema.parse(data);
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
   * Validate location search
   */
  const validateLocationSearch = useCallback(
    async (data: unknown): Promise<ValidationResult> => {
      try {
        const validated = locationSearchSchema.parse(data);
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
    validateCreateService,
    validateUpdateService,
    validateField,
    validateFilters,
    validateBulkOperation,
    validateLocationSearch,
    
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
export const serviceValidation = {
  /**
   * Validate and parse create service data
   */
  parseCreateService: (data: unknown): CreateServiceInput => {
    return createServiceSchema.parse(data);
  },

  /**
   * Validate and parse update service data
   */
  parseUpdateService: (data: unknown): UpdateServiceInput => {
    return updateServiceSchema.parse(data);
  },

  /**
   * Validate and parse service filters
   */
  parseFilters: (data: unknown): ServiceFiltersInput => {
    return serviceFiltersSchema.parse(data);
  },

  /**
   * Validate and parse bulk operation
   */
  parseBulkOperation: (data: unknown): BulkServiceOperationInput => {
    return bulkServiceOperationSchema.parse(data);
  },

  /**
   * Validate and parse location search
   */
  parseLocationSearch: (data: unknown): LocationSearchInput => {
    return locationSearchSchema.parse(data);
  },

  /**
   * Safe parse with error handling
   */
  safeParseCreateService: (data: unknown) => {
    return createServiceSchema.safeParse(data);
  },

  /**
   * Safe parse update with error handling
   */
  safeParseUpdateService: (data: unknown) => {
    return updateServiceSchema.safeParse(data);
  }
};
