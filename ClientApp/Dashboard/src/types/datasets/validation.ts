// Dataset Validation Types

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
