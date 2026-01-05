// Model Comparison Types
import type { AIModel } from './model';

export interface ModelComparison {
  models: AIModel[];
  metrics: string[];
  comparisonData: Record<string, any>[];
}

