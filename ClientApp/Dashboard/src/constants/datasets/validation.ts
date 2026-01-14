// Dataset Validation Constants

export const VALIDATION_ERROR_TYPES = [
  'missing_field',
  'invalid_format',
  'empty_content',
  'duplicate_entry',
  'encoding_error',
  'size_limit_exceeded',
  'invalid_language',
  'malformed_json'
] as const;

export const DEFAULT_DATASET_SPLIT = {
  train: 0.8,
  validation: 0.1,
  test: 0.1
} as const;

export const DATASET_SIZE_LIMITS = {
  maxFileSize: 100 * 1024 * 1024, // 100MB
  maxSamples: 1000000,
  maxFieldLength: 10000
} as const;







