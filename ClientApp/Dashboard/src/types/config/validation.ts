// Configuration Validation Types

export interface ConfigValidation {
  isValid: boolean;
  errors: ConfigError[];
  warnings: ConfigWarning[];
}

export interface ConfigError {
  field: string;
  message: string;
  value: any;
  expectedType: string;
}

export interface ConfigWarning {
  field: string;
  message: string;
  suggestion: string;
}
