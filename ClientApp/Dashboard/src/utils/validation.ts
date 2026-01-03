// Validation Utilities

export interface ValidationRule {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  custom?: (value: any) => string | null;
}

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

export class Validator {
  static validateField(value: any, rules: ValidationRule): ValidationResult {
    const errors: string[] = [];

    // Required validation
    if (rules.required && (value === null || value === undefined || value === '')) {
      errors.push('This field is required');
    }

    // Skip other validations if value is empty and not required
    if (!rules.required && (value === null || value === undefined || value === '')) {
      return { isValid: true, errors: [] };
    }

    // String validations
    if (typeof value === 'string') {
      if (rules.minLength && value.length < rules.minLength) {
        errors.push(`Minimum length is ${rules.minLength} characters`);
      }

      if (rules.maxLength && value.length > rules.maxLength) {
        errors.push(`Maximum length is ${rules.maxLength} characters`);
      }

      if (rules.pattern && !rules.pattern.test(value)) {
        errors.push('Invalid format');
      }
    }

    // Custom validation
    if (rules.custom) {
      const customError = rules.custom(value);
      if (customError) {
        errors.push(customError);
      }
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  static validateForm(data: Record<string, any>, rules: Record<string, ValidationRule>): ValidationResult {
    const allErrors: string[] = [];
    let isValid = true;

    for (const field in rules) {
      const fieldResult = this.validateField(data[field], rules[field]);
      if (!fieldResult.isValid) {
        isValid = false;
        allErrors.push(...fieldResult.errors.map(error => `${field}: ${error}`));
      }
    }

    return {
      isValid,
      errors: allErrors
    };
  }
}

// Common validation patterns
export const ValidationPatterns = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE: /^\+?[\d\s\-\(\)]{10,}$/,
  URL: /^https?:\/\/.+/,
  PASSWORD_STRONG: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
  ALPHANUMERIC: /^[a-zA-Z0-9]+$/,
  NUMERIC: /^\d+$/,
  DECIMAL: /^\d+(\.\d+)?$/,
  HEX_COLOR: /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/,
  IPV4: /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/,
  SLUG: /^[a-z0-9]+(?:-[a-z0-9]+)*$/
};

// Pre-defined validation rules
export const CommonValidationRules = {
  email: {
    required: true,
    pattern: ValidationPatterns.EMAIL,
    maxLength: 254
  },
  password: {
    required: true,
    minLength: 8,
    pattern: ValidationPatterns.PASSWORD_STRONG
  },
  confirmPassword: (originalPassword: string) => ({
    required: true,
    custom: (value: string) => {
      if (value !== originalPassword) {
        return 'Passwords do not match';
      }
      return null;
    }
  }),
  name: {
    required: true,
    minLength: 2,
    maxLength: 50
  },
  phone: {
    pattern: ValidationPatterns.PHONE
  },
  url: {
    pattern: ValidationPatterns.URL
  },
  required: {
    required: true
  }
};

// Specific validators
export const EmailValidator = {
  validate: (email: string): ValidationResult => {
    return Validator.validateField(email, CommonValidationRules.email);
  },
  isValid: (email: string): boolean => {
    return ValidationPatterns.EMAIL.test(email);
  }
};

export const PasswordValidator = {
  validate: (password: string): ValidationResult => {
    return Validator.validateField(password, CommonValidationRules.password);
  },
  getStrength: (password: string): 'weak' | 'medium' | 'strong' => {
    if (password.length < 6) return 'weak';
    
    let score = 0;
    if (password.length >= 8) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/\d/.test(password)) score++;
    if (/[@$!%*?&]/.test(password)) score++;
    
    if (score < 3) return 'weak';
    if (score < 5) return 'medium';
    return 'strong';
  }
};

export const FileValidator = {
  validateSize: (file: File, maxSizeInBytes: number): ValidationResult => {
    if (file.size > maxSizeInBytes) {
      return {
        isValid: false,
        errors: [`File size must be less than ${(maxSizeInBytes / 1024 / 1024).toFixed(1)}MB`]
      };
    }
    return { isValid: true, errors: [] };
  },
  
  validateType: (file: File, allowedTypes: string[]): ValidationResult => {
    const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
    if (!allowedTypes.includes(fileExtension)) {
      return {
        isValid: false,
        errors: [`File type must be one of: ${allowedTypes.join(', ')}`]
      };
    }
    return { isValid: true, errors: [] };
  },
  
  validateFile: (file: File, maxSize: number, allowedTypes: string[]): ValidationResult => {
    const sizeResult = FileValidator.validateSize(file, maxSize);
    const typeResult = FileValidator.validateType(file, allowedTypes);
    
    return {
      isValid: sizeResult.isValid && typeResult.isValid,
      errors: [...sizeResult.errors, ...typeResult.errors]
    };
  }
};

// Form validation helpers
export const createFormValidator = (rules: Record<string, ValidationRule>) => {
  return (data: Record<string, any>) => {
    return Validator.validateForm(data, rules);
  };
};

export const createFieldValidator = (rules: ValidationRule) => {
  return (value: any) => {
    return Validator.validateField(value, rules);
  };
};