// Dataset Related Types
import type { BaseEntity } from './common';

export interface Dataset extends BaseEntity {
  name: string;
  samples: number;
  size: string;
  type: DatasetType;
  lastUpdated: string;
  accuracy: number;
  description?: string;
  tags: string[];
  metadata: DatasetMetadata;
  validation: DatasetValidation;
}

export type DatasetType = 
  | 'Q&A' 
  | 'Conversation' 
  | 'Instructions' 
  | 'Classification' 
  | 'Completion' 
  | 'Translation' 
  | 'Summarization';

export interface DatasetMetadata {
  format: 'json' | 'csv' | 'txt' | 'parquet';
  encoding: string;
  language: string;
  domain: string;
  source: string;
  license?: string;
  version: string;
}

export interface DatasetValidation {
  isValid: boolean;
  errors: ValidationError[];
  warnings: ValidationWarning[];
  statistics: DatasetStatistics;
}

export interface ValidationError {
  type: string;
  message: string;
  line?: number;
  column?: string;
  severity: 'error' | 'warning';
}

export interface ValidationWarning {
  type: string;
  message: string;
  suggestion?: string;
}

export interface DatasetStatistics {
  totalSamples: number;
  averageLength: number;
  minLength: number;
  maxLength: number;
  uniqueTokens: number;
  duplicates: number;
  emptyEntries: number;
  languageDistribution: Record<string, number>;
}

export interface DatasetSplit {
  train: number;
  validation: number;
  test: number;
}

export interface DatasetPreprocessing {
  tokenization: boolean;
  normalization: boolean;
  filtering: {
    minLength?: number;
    maxLength?: number;
    removeEmpty: boolean;
    removeDuplicates: boolean;
  };
  augmentation?: {
    enabled: boolean;
    techniques: string[];
    multiplier: number;
  };
}

export interface DatasetUpload {
  file: File;
  name: string;
  type: DatasetType;
  description?: string;
  preprocessing: DatasetPreprocessing;
  split: DatasetSplit;
}