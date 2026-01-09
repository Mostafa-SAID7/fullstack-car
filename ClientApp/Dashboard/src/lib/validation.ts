import { z } from 'zod';

// Base validation schemas
export const emailSchema = z.string().email('Please enter a valid email address');
export const passwordSchema = z.string().min(8, 'Password must be at least 8 characters');
export const requiredStringSchema = z.string().min(1, 'This field is required');
export const urlSchema = z.string().url('Please enter a valid URL');
export const phoneSchema = z.string().regex(/^\+?[\d\s\-\(\)]+$/, 'Please enter a valid phone number');

// File validation schemas
export const imageFileSchema = z.object({
  file: z.instanceof(File),
  type: z.string().refine(
    (type) => ['image/jpeg', 'image/png', 'image/webp', 'image/gif'].includes(type),
    'Only JPEG, PNG, WebP, and GIF images are allowed'
  ),
  size: z.number().max(5 * 1024 * 1024, 'File size must be less than 5MB')
});

export const videoFileSchema = z.object({
  file: z.instanceof(File),
  type: z.string().refine(
    (type) => ['video/mp4', 'video/avi', 'video/mov', 'video/webm'].includes(type),
    'Only MP4, AVI, MOV, and WebM videos are allowed'
  ),
  size: z.number().max(2 * 1024 * 1024 * 1024, 'File size must be less than 2GB')
});

export const audioFileSchema = z.object({
  file: z.instanceof(File),
  type: z.string().refine(
    (type) => ['audio/mp3', 'audio/wav', 'audio/aac', 'audio/flac'].includes(type),
    'Only MP3, WAV, AAC, and FLAC audio files are allowed'
  ),
  size: z.number().max(500 * 1024 * 1024, 'File size must be less than 500MB')
});

// Form validation utilities
export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}

export interface FieldValidation {
  value: any;
  schema: z.ZodSchema;
  required?: boolean;
}

export class FormValidator {
  private fields: Record<string, FieldValidation> = {};
  private errors: Record<string, string> = {};

  addField(name: string, validation: FieldValidation): FormValidator {
    this.fields[name] = validation;
    return this;
  }

  validate(): ValidationResult {
    this.errors = {};

    for (const [fieldName, validation] of Object.entries(this.fields)) {
      try {
        // Check if field is required and empty
        if (validation.required && (!validation.value || validation.value === '')) {
          this.errors[fieldName] = 'This field is required';
          continue;
        }

        // Skip validation if field is not required and empty
        if (!validation.required && (!validation.value || validation.value === '')) {
          continue;
        }

        // Validate with schema
        validation.schema.parse(validation.value);
      } catch (error) {
        if (error instanceof z.ZodError) {
          this.errors[fieldName] = error.issues[0]?.message || 'Invalid value';
        }
      }
    }

    return {
      isValid: Object.keys(this.errors).length === 0,
      errors: this.errors
    };
  }

  getErrors(): Record<string, string> {
    return this.errors;
  }

  hasError(fieldName: string): boolean {
    return fieldName in this.errors;
  }

  getError(fieldName: string): string | undefined {
    return this.errors[fieldName];
  }

  reset(): void {
    this.fields = {};
    this.errors = {};
  }
}

// Validation hooks for React
export const useFormValidation = () => {
  const validator = new FormValidator();

  const validateField = (_fieldName: string, value: any, schema: z.ZodSchema, required = false): string | undefined => {
    try {
      if (required && (!value || value === '')) {
        return 'This field is required';
      }

      if (!required && (!value || value === '')) {
        return undefined;
      }

      schema.parse(value);
      return undefined;
    } catch (error) {
      if (error instanceof z.ZodError) {
        return error.issues[0]?.message || 'Invalid value';
      }
      return 'Invalid value';
    }
  };

  const validateForm = (formData: Record<string, any>, schema: z.ZodSchema): ValidationResult => {
    try {
      schema.parse(formData);
      return { isValid: true, errors: {} };
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errors: Record<string, string> = {};
        error.issues.forEach((issue) => {
          const path = issue.path.join('.');
          errors[path] = issue.message;
        });
        return { isValid: false, errors };
      }
      return { isValid: false, errors: { general: 'Validation failed' } };
    }
  };

  return {
    validator,
    validateField,
    validateForm
  };
};

// Common validation schemas for media platform
export const mediaValidationSchemas = {
  // Video upload validation
  videoUpload: z.object({
    title: z.string().min(1, 'Title is required').max(255, 'Title must be less than 255 characters'),
    description: z.string().max(2000, 'Description must be less than 2000 characters').optional(),
    tags: z.array(z.string()).max(10, 'Maximum 10 tags allowed').optional(),
    quality: z.enum(['HD', 'FHD', '4K']),
    isPublic: z.boolean(),
    allowComments: z.boolean(),
    scheduledPublishAt: z.date().optional()
  }),

  // Podcast upload validation
  podcastUpload: z.object({
    title: z.string().min(1, 'Title is required').max(255, 'Title must be less than 255 characters'),
    description: z.string().max(2000, 'Description must be less than 2000 characters').optional(),
    tags: z.array(z.string()).max(10, 'Maximum 10 tags allowed').optional(),
    isPublic: z.boolean(),
    allowComments: z.boolean(),
    allowDownload: z.boolean(),
    episodeNumber: z.number().int().positive().optional(),
    seasonNumber: z.number().int().positive().optional(),
    seriesId: z.string().uuid().optional(),
    transcript: z.string().optional(),
    scheduledPublishAt: z.date().optional()
  }),

  // User profile validation
  userProfile: z.object({
    firstName: z.string().min(1, 'First name is required').max(50, 'First name must be less than 50 characters'),
    lastName: z.string().min(1, 'Last name is required').max(50, 'Last name must be less than 50 characters'),
    email: emailSchema,
    phone: phoneSchema.optional(),
    bio: z.string().max(500, 'Bio must be less than 500 characters').optional(),
    website: urlSchema.optional()
  }),

  // Comment validation
  comment: z.object({
    content: z.string().min(1, 'Comment cannot be empty').max(1000, 'Comment must be less than 1000 characters'),
    parentCommentId: z.string().uuid().optional()
  }),

  // Search filters validation
  searchFilters: z.object({
    query: z.string().max(100, 'Search query must be less than 100 characters').optional(),
    category: z.string().optional(),
    tags: z.array(z.string()).optional(),
    dateFrom: z.date().optional(),
    dateTo: z.date().optional(),
    sortBy: z.enum(['newest', 'oldest', 'popular', 'trending']).optional(),
    mediaType: z.enum(['video', 'podcast', 'all']).optional()
  })
};

// File validation utilities
export const validateFile = (file: File, type: 'image' | 'video' | 'audio'): ValidationResult => {
  const fileData = {
    file,
    type: file.type,
    size: file.size
  };

  try {
    switch (type) {
      case 'image':
        imageFileSchema.parse(fileData);
        break;
      case 'video':
        videoFileSchema.parse(fileData);
        break;
      case 'audio':
        audioFileSchema.parse(fileData);
        break;
    }
    return { isValid: true, errors: {} };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors: Record<string, string> = {};
      error.issues.forEach((issue) => {
        errors.file = issue.message;
      });
      return { isValid: false, errors };
    }
    return { isValid: false, errors: { file: 'File validation failed' } };
  }
};

// Async validation utilities
export const asyncValidation = {
  // Check if email is available
  checkEmailAvailability: async (email: string): Promise<boolean> => {
    // This would typically make an API call
    // For now, simulate with a delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return !email.includes('taken'); // Simple simulation
  },

  // Check if username is available
  checkUsernameAvailability: async (username: string): Promise<boolean> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return !username.includes('taken');
  },

  // Validate file upload
  validateFileUpload: async (file: File): Promise<ValidationResult> => {
    // Simulate virus scanning or other async validation
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (file.name.includes('virus')) {
      return { isValid: false, errors: { file: 'File failed security scan' } };
    }
    
    return { isValid: true, errors: {} };
  }
};