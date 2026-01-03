// Dataset Constants

export const DATASET_TYPES = [
  { value: 'Q&A', label: 'Question & Answer' },
  { value: 'Conversation', label: 'Conversation' },
  { value: 'Instructions', label: 'Instructions' },
  { value: 'Classification', label: 'Classification' },
  { value: 'Completion', label: 'Completion' },
  { value: 'Translation', label: 'Translation' },
  { value: 'Summarization', label: 'Summarization' }
] as const;

export const DATASET_FORMATS = [
  { value: 'json', label: 'JSON', extension: '.json' },
  { value: 'csv', label: 'CSV', extension: '.csv' },
  { value: 'txt', label: 'Text', extension: '.txt' },
  { value: 'parquet', label: 'Parquet', extension: '.parquet' }
] as const;

export const DATASET_LANGUAGES = [
  { value: 'en', label: 'English' },
  { value: 'ar', label: 'Arabic' },
  { value: 'es', label: 'Spanish' },
  { value: 'fr', label: 'French' },
  { value: 'de', label: 'German' },
  { value: 'zh', label: 'Chinese' },
  { value: 'ja', label: 'Japanese' },
  { value: 'multi', label: 'Multi-language' }
] as const;

export const DATASET_DOMAINS = [
  'Automotive',
  'Technology',
  'Healthcare',
  'Finance',
  'Education',
  'Entertainment',
  'Sports',
  'News',
  'General',
  'Custom'
] as const;

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

export const PREPROCESSING_TECHNIQUES = [
  { value: 'tokenization', label: 'Tokenization' },
  { value: 'normalization', label: 'Text Normalization' },
  { value: 'lowercase', label: 'Lowercase Conversion' },
  { value: 'remove_punctuation', label: 'Remove Punctuation' },
  { value: 'remove_stopwords', label: 'Remove Stop Words' },
  { value: 'stemming', label: 'Stemming' },
  { value: 'lemmatization', label: 'Lemmatization' }
] as const;

export const AUGMENTATION_TECHNIQUES = [
  { value: 'paraphrasing', label: 'Paraphrasing' },
  { value: 'back_translation', label: 'Back Translation' },
  { value: 'synonym_replacement', label: 'Synonym Replacement' },
  { value: 'random_insertion', label: 'Random Insertion' },
  { value: 'random_deletion', label: 'Random Deletion' },
  { value: 'random_swap', label: 'Random Swap' }
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